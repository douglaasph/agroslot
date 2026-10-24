package io.github.douglaasph.agroslot.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.github.douglaasph.agroslot.model.Plantation;
import io.github.douglaasph.agroslot.repository.PlantationRepository;

@Service
public class PlantationService {
    private final PlantationRepository plantationRepository;
    private final UserService userService;

    public PlantationService(
            PlantationRepository plantationRepository,
            UserService userService
    ) {
        this.plantationRepository = plantationRepository;
        this.userService = userService;
    }

    public Plantation create(String nome, Integer capacidade, Integer colunas, Integer linhas, String userId){
        Plantation plantation = new Plantation();
        plantation.setNome(nome);
        plantation.setCapacidade(capacidade);
        plantation.setColunas(colunas);
        plantation.setLinhas(linhas);
        plantation.setUsuario(
                userService.findUser(userId)
        );

        return plantationRepository.save(plantation);
    }

    public List<Plantation> findAllByUser(String userId){
        return plantationRepository.findByUsuarioId(Integer.parseInt(userId));
    }

    @Transactional
public Plantation update(
        Integer plantationId,
        String userId,
        String nome,
        Integer capacidade,
        Integer colunas,
        Integer linhas
) {
    Plantation plantation = findOwnedPlantation(plantationId, userId);

    plantation.setNome(nome.trim());
    plantation.setCapacidade(capacidade);
    plantation.setColunas(colunas);
    plantation.setLinhas(linhas);

    return plantationRepository.save(plantation);
}

    @Transactional
    public void delete(Integer plantationId, String userId) {
        Plantation plantation = findOwnedPlantation(plantationId, userId);
        plantationRepository.delete(plantation);
    }

    private Plantation findOwnedPlantation(Integer plantationId, String userId) {
        final Integer numericUserId;

        try {
            numericUserId = Integer.parseInt(userId);
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identidade do usuário autenticado inválida."
            );
        }

        return plantationRepository
                .findByIdAndUsuarioId(plantationId, numericUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Plantação não encontrada."
                ));
    }
}
