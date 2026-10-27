package io.github.douglaasph.agroslot.dto;

import io.github.douglaasph.agroslot.model.Plantation;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlantationResponse {
    private final Integer id;
    private final String nome;
    private final Integer capacidade;
    private final Integer colunas;
    private final Integer linhas;
    private final String usuarioId;

    public static PlantationResponse from(Plantation p) {
        return new PlantationResponse(
                p.getId(),
                p.getNome(),
                p.getCapacidade(),
                p.getColunas(),
                p.getLinhas(),
                String.valueOf(p.getUsuario().getId())
        );
    }
}