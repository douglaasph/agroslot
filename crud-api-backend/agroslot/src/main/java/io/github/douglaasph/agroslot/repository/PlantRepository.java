package io.github.douglaasph.agroslot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.github.douglaasph.agroslot.model.Plant;

public interface PlantRepository extends JpaRepository<Plant, Integer> {

    List<Plant> findByPlantacaoId(Integer plantacaoId);

    boolean existsByPlantacaoIdAndPosicaoXAndPosicaoY(
        Integer plantacaoId,
        Integer posicaoX,
        Integer posicaoY
    );

    boolean existsByPlantacaoIdAndPosicaoXAndPosicaoYAndIdNot(
        Integer plantacaoId,
        Integer posicaoX,
        Integer posicaoY,
        Integer id
    );

    Optional<Plant> findByIdAndPlantacao_Usuario_Id(
        Integer id,
        Integer userId
    );

}
