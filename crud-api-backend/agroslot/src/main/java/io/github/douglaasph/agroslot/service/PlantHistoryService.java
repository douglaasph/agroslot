package io.github.douglaasph.agroslot.service;

import io.github.douglaasph.agroslot.bucket.BucketFile;
import io.github.douglaasph.agroslot.bucket.BucketService;
import io.github.douglaasph.agroslot.client.MlServiceClient;
import io.github.douglaasph.agroslot.client.MlServiceRepresentation;
import io.github.douglaasph.agroslot.dto.plantationHistory.PlantHistoryResponse;
import io.github.douglaasph.agroslot.model.Plant;
import io.github.douglaasph.agroslot.model.PlantHistory;
import io.github.douglaasph.agroslot.repository.PlantHistoryRepository;
import io.github.douglaasph.agroslot.repository.PlantRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.UUID;

@Service
public class PlantHistoryService {
    private final PlantHistoryRepository plantHistoryRepository;
    private final PlantRepository plantRepository;
    private final BucketService bucketService;
    private final MlServiceClient mlServiceClient;

    public PlantHistoryService(
            PlantHistoryRepository plantHistoryRepository,
            PlantRepository plantRepository,
            BucketService bucketService,
            MlServiceClient mlServiceClient
    ) {
        this.plantHistoryRepository = plantHistoryRepository;
        this.plantRepository = plantRepository;
        this.bucketService = bucketService;
        this.mlServiceClient = mlServiceClient;
    }

    public List<PlantHistoryResponse> getAllImages(Integer plantId) {
        return plantHistoryRepository.findByPlantaIdOrderByUploadDateDesc(plantId).stream()
                .map(h -> new PlantHistoryResponse(
                        h.getId(),
                        bucketService.getUrl(h.getFotoUrl()),
                        h.getPredicao(),
                        h.getNivelSaudePredicao(),
                        h.getUploadDate()
                ))
                .toList();    }

    @Transactional
    public PlantHistory createHistoryWithImage(Integer plantId, MultipartFile file) {
        MediaType mediaType = resolveType(file);

        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new EntityNotFoundException("Planta não encontrada: " + plantId));

        MlServiceRepresentation resultMlService;
        try {
            var responseEntity = mlServiceClient.getPredict(file);
            resultMlService = responseEntity != null ? responseEntity.getBody() : null;

            if (resultMlService == null) {
                throw new IllegalStateException("O serviço de Machine Learning retornou uma resposta vazia.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Falha ao comunicar com o microsserviço de Machine Learning: " + e.getMessage(), e);
        }

        String s3Key = uploadImageToStorage(file, mediaType);

        PlantHistory history = new PlantHistory();
        history.setPlanta(plant);
        history.setFotoUrl(s3Key);
        history.setNivelSaudePredicao(resultMlService.getConfidencePercentage());
        history.setPredicao(resultMlService.getPredictedClass());
        return plantHistoryRepository.save(history);
    }

    private MediaType resolveType(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo de imagem não pode estar vazio.");
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            throw new IllegalArgumentException("Content-Type do arquivo não informado");
        }

        MediaType mediaType = MediaType.parseMediaType(contentType);

        if (!MediaType.IMAGE_PNG.isCompatibleWith(mediaType) && !MediaType.IMAGE_JPEG.isCompatibleWith(mediaType)) {
            throw new IllegalArgumentException("Apenas arquivos de imagem nos formatos PNG ou JPEG são permitidos.");
        }

        return mediaType;
    }

    private String extensionFor(MediaType type) {
        return MediaType.IMAGE_PNG.equals(type) ? ".png" : ".jpg";
    }

    private String uploadImageToStorage(MultipartFile file, MediaType type) {
        String s3Key = UUID.randomUUID() + extensionFor(type);

        try (InputStream is = file.getInputStream()) {
            bucketService.upload(new BucketFile(s3Key, is, type, file.getSize()));
        } catch (IOException e) {
            throw new UncheckedIOException("Erro ao ler o arquivo enviado", e);
        }

        return s3Key;
    }
}
