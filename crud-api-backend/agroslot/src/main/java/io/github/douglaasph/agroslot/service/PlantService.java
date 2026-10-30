package io.github.douglaasph.agroslot.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.github.douglaasph.agroslot.model.EspeciePlanta;
import io.github.douglaasph.agroslot.model.Plant;
import io.github.douglaasph.agroslot.model.Plantation;
import io.github.douglaasph.agroslot.repository.PlantRepository;
import io.github.douglaasph.agroslot.repository.PlantationRepository;

@Service
public class PlantService {

    private final PlantRepository plantRepository;
    private final PlantationRepository plantationRepository;

    public PlantService(
            PlantRepository plantRepository,
            PlantationRepository plantationRepository) {
        this.plantRepository = plantRepository;
        this.plantationRepository = plantationRepository;
    }

    @Transactional
    public Plant create(
            Integer plantacaoId,
            String userId,
            EspeciePlanta especie,
            String nome,
            Integer posicaoX,
            Integer posicaoY) {

        Plantation plantation = findOwnedPlantation(plantacaoId, userId);

        if (especie == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A espécie da planta é obrigatória.");
        }

        if (nome == null || nome.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nome da planta é obrigatório.");
        }

        if (posicaoX == null || posicaoY == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "As posições X e Y são obrigatórias.");
        }

        validatePosition(plantacaoId, posicaoX, posicaoY, null);

        Plant plant = new Plant();
        plant.setPlantacao(plantation);
        plant.setEspecie(especie);
        plant.setNome(nome.trim());
        plant.setPosicaoX(posicaoX);
        plant.setPosicaoY(posicaoY);

        return saveWithPositionConflictHandling(plant);
    }

    @Transactional(readOnly = true)
    public List<Plant> findAllByPlantation(
            Integer plantacaoId,
            String userId) {

        findOwnedPlantation(plantacaoId, userId);

        return plantRepository.findByPlantacaoId(plantacaoId);
    }

    @Transactional
    public Plant update(
            Integer plantId,
            String userId,
            EspeciePlanta especie,
            String nome,
            Integer posicaoX,
            Integer posicaoY) {

        Integer numericUserId = parseUserId(userId);

        Plant plant = plantRepository
                .findByIdAndPlantacao_Usuario_Id(plantId, numericUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Planta não encontrada."));

        Integer novaPosicaoX = posicaoX != null
                ? posicaoX : plant.getPosicaoX();

        Integer novaPosicaoY = posicaoY != null
                ? posicaoY : plant.getPosicaoY();

        validatePosition(
                plant.getPlantacao().getId(),
                novaPosicaoX,
                novaPosicaoY,
                plantId);

        if (especie != null) {
            plant.setEspecie(especie);
        }

        if (nome != null) {
            if (nome.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "O nome da planta não pode ser vazio.");
            }

            plant.setNome(nome.trim());
        }

        plant.setPosicaoX(novaPosicaoX);
        plant.setPosicaoY(novaPosicaoY);

        return saveWithPositionConflictHandling(plant);
    }

    @Transactional
    public void delete(Integer plantId, String userId) {
        Integer numericUserId = parseUserId(userId);

        Plant plant = plantRepository
                .findByIdAndPlantacao_Usuario_Id(plantId, numericUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Planta não encontrada."));

        plantRepository.delete(plant);
    }

    private Plantation findOwnedPlantation(
            Integer plantacaoId,
            String userId) {

        Integer numericUserId = parseUserId(userId);

        return plantationRepository
                .findByIdAndUsuarioId(plantacaoId, numericUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Plantação não encontrada."));
    }

    private Integer parseUserId(String userId) {
        try {
            return Integer.parseInt(userId);
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identidade do usuário autenticado inválida.");
        }
    }

    private void validatePosition(
            Integer plantacaoId,
            Integer posicaoX,
            Integer posicaoY,
            Integer plantId) {

        boolean occupied;

        if (plantId == null) {
            occupied = plantRepository
                    .existsByPlantacaoIdAndPosicaoXAndPosicaoY(
                            plantacaoId, posicaoX, posicaoY);
        } else {
            occupied = plantRepository
                    .existsByPlantacaoIdAndPosicaoXAndPosicaoYAndIdNot(
                            plantacaoId, posicaoX, posicaoY, plantId);
        }

        if (occupied) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma planta nessa posição da plantação.");
        }
    }

    private Plant saveWithPositionConflictHandling(Plant plant) {
        try {
            return plantRepository.save(plant);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não foi possível salvar a planta: a posição já está ocupada.",
                    exception);
        }
    }
}
