package io.github.douglaasph.agroslot.dto;
import io.github.douglaasph.agroslot.model.EspeciePlanta;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class UpdatePlantRequest {
    
    private EspeciePlanta especie;

    private String nome;

    private Integer posicaoX;

    private Integer posicaoY;

}
