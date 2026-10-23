package io.github.douglaasph.agroslot.service;

import io.github.douglaasph.agroslot.model.Plantation;
import io.github.douglaasph.agroslot.repository.PlantationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
