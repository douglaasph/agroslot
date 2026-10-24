package io.github.douglaasph.agroslot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlantationRequest {
    @NotBlank(message = "O nome é Obrigatório")
    private String nome;

    @NotNull(message = "A capacidade é Obrigatório")
    private Integer capacidade;

    @NotNull(message = "A quantidade de colunas é Obrigatório")
    private Integer colunas;

    @NotNull(message = "A quantidade de linhas é Obrigatório")
    private Integer linhas;
}
