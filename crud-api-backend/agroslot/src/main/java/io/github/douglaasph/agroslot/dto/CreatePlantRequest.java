package io.github.douglaasph.agroslot.dto;

import io.github.douglaasph.agroslot.model.EspeciePlanta;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class CreatePlantRequest {

    @NotNull 
    private Integer plantacaoId;

    @NotNull 
    private EspeciePlanta especie;

    @NotNull 
    private String nome;

    @NotNull
    private Integer posicaoX;

    @NotNull
    private Integer posicaoY;

    
}
