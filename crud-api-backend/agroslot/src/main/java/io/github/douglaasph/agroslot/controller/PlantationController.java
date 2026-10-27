package io.github.douglaasph.agroslot.controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.github.douglaasph.agroslot.dto.CreatePlantationRequest;
import io.github.douglaasph.agroslot.dto.PlantationResponse;
import io.github.douglaasph.agroslot.dto.UpdatePlantationRequest;
import io.github.douglaasph.agroslot.model.Plantation;
import io.github.douglaasph.agroslot.service.PlantationService;
import jakarta.validation.Valid;

@RestController()
@RequestMapping({ "/plantation" })
public class PlantationController {
    private final PlantationService plantationService;

    public PlantationController(PlantationService plantationService) {
        this.plantationService = plantationService;
    }

    @PostMapping
    public ResponseEntity<PlantationResponse> create(
            @RequestBody @Valid CreatePlantationRequest req,
            Authentication authentication) {
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

    @GetMapping("/{id}")
    public ResponseEntity<PlantationResponse> getById(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();

        PlantationResponse response = plantationService
                .findByIdAndUser(id, userId)
                .map(PlantationResponse::from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Plantation not found"));

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantationResponse> update(
            @PathVariable Integer id,
            @RequestBody @Valid UpdatePlantationRequest req,
            Authentication authentication) {
        Plantation updated = plantationService.update(
                id,
                authentication.getName(),
                req.getNome(),
                req.getCapacidade(),
                req.getColunas(),
                req.getLinhas());

        return ResponseEntity.ok(PlantationResponse.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            Authentication authentication) {
        plantationService.delete(id, authentication.getName());

        return ResponseEntity.noContent().build();
    }
}
