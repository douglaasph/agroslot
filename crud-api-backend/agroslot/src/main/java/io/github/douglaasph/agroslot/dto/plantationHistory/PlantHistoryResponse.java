package io.github.douglaasph.agroslot.dto.plantationHistory;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlantHistoryResponse {
    private Integer id;
    private String foto_url;
    private String predicao;
    private Float nivelSaudePredicao;
    private LocalDateTime uploadDate;
}
