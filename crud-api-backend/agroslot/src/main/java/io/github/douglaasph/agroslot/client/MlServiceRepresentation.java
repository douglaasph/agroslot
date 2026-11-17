package io.github.douglaasph.agroslot.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.douglaasph.agroslot.model.Doencas;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MlServiceRepresentation {

    @JsonProperty("class")
    private Doencas predictedClass;

    private Float confidence;

    @JsonProperty("confidence_percentage")
    private Float confidencePercentage;

    private Map<String, Double> classes;
}
