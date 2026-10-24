package io.github.douglaasph.agroslot.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class UpdatePlantationRequest {

    @Size(min = 1, message = "O nome não pode ser vazio")
    private String nome;

    @Positive(message = "A capacidade deve ser maior que zero")
    private Integer capacidade;

    @Positive(message = "A quantidade de colunas deve ser maior que zero")
    private Integer colunas;

    @Positive(message = "A quantidade de linhas deve ser maior que zero")
    private Integer linhas;

    @JsonIgnore
    @AssertTrue(message = "Envie ao menos um campo para atualizar")
    public boolean isAtLeastOneFieldPresent() {
        return (nome != null && !nome.isBlank())
                || capacidade != null
                || colunas != null
                || linhas != null;
    }
}
