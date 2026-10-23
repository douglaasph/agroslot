package io.github.douglaasph.agroslot.controller;

import io.github.douglaasph.agroslot.dto.CreatePlantationRequest;
import io.github.douglaasph.agroslot.dto.PlantationResponse;
import io.github.douglaasph.agroslot.model.Plantation;
import io.github.douglaasph.agroslot.service.PlantationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController()
@RequestMapping("/plantation")
public class PlantationController {
    private final PlantationService plantationService;

    public PlantationController(PlantationService plantationService) {
        this.plantationService = plantationService;
    }

    @PostMapping
    public ResponseEntity<PlantationResponse> create(
            @RequestBody @Valid CreatePlantationRequest req,
            Authentication authentication
    ) {
        Plantation created = plantationService.create(
                req.getNome(), req.getCapacidade(), req.getColunas(), req.getLinhas(), authentication.getName());

        URI location = URI.create("/plantation/" + created.getId());
        return ResponseEntity.created(location).body(PlantationResponse.from(created));
    }

    @GetMapping
    public ResponseEntity<List<PlantationResponse>> list(Authentication authentication) {
        String userId = authentication.getName();

        List<PlantationResponse> response = plantationService.findAllByUser(userId)
                .stream()
                .map(PlantationResponse::from)
                .toList();

        return ResponseEntity.ok(response);
    }
}
