package io.github.douglaasph.agroslot.dto;

import io.github.douglaasph.agroslot.model.Plant;
import io.github.douglaasph.agroslot.model.EspeciePlanta;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class PlantResponse {
    
    private Integer id;
    private Integer plantacaoId;
    private EspeciePlanta especie;
    private String nome;
    private Integer posicaoX;
    private Integer posicaoY;

    public static PlantResponse from (Plant plant) {
        return new PlantResponse(
            plant.getId(),
            plant.getPlantacao().getId(),
            plant.getEspecie(),
            plant.getNome(),
            plant.getPosicaoX(),
            plant.getPosicaoY()
        );
    }
}
