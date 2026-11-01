package io.github.douglaasph.agroslot.service;

import io.github.douglaasph.agroslot.bucket.BucketFile;
import io.github.douglaasph.agroslot.bucket.BucketService;
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

    public PlantHistoryService(
            PlantHistoryRepository plantHistoryRepository,
            PlantRepository plantRepository,
            BucketService bucketService
    ) {
        this.plantHistoryRepository = plantHistoryRepository;
        this.plantRepository = plantRepository;
        this.bucketService = bucketService;
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
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new EntityNotFoundException("Planta não encontrada: " + plantId));

        MediaType type = resolveType(file);
        String s3Key = UUID.randomUUID() + extensionFor(type);

        try (InputStream is = file.getInputStream()) {
            bucketService.upload(new BucketFile(s3Key, is, type, file.getSize()));
        } catch (IOException e) {
            throw new UncheckedIOException("Erro ao ler o arquivo enviado", e);
        }

        PlantHistory history = new PlantHistory();
        history.setPlanta(plant);
        history.setFotoUrl(s3Key);
        return plantHistoryRepository.save(history);
    }

    private MediaType resolveType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            throw new IllegalArgumentException("Content-Type do arquivo não informado");
        }
        return MediaType.parseMediaType(contentType);
    }

    private String extensionFor(MediaType type) {
        return MediaType.IMAGE_PNG.equals(type) ? ".png" : ".jpg";
    }
}
