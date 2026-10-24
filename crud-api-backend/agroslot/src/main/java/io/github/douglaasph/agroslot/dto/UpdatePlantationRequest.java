package io.github.douglaasph.agroslot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class UpdatePlantationRequest {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotNull(message = "A capacidade é obrigatória")
    @Positive(message = "A capacidade deve ser maior que zero")
    private Integer capacidade;

    @NotNull(message = "A quantidade de colunas é obrigatória")
    @Positive(message = "A quantidade de colunas deve ser maior que zero")
    private Integer colunas;

    @NotNull(message = "A quantidade de linhas é obrigatória")
    @Positive(message = "A quantidade de linhas deve ser maior que zero")
    private Integer linhas;

    
}
