package io.github.douglaasph.agroslot.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.github.douglaasph.agroslot.dto.CreatePlantRequest;
import io.github.douglaasph.agroslot.dto.PlantResponse;
import io.github.douglaasph.agroslot.dto.UpdatePlantRequest;
import io.github.douglaasph.agroslot.model.Plant;
import io.github.douglaasph.agroslot.service.PlantService;
import jakarta.validation.Valid;

@RestController 
public class PlantController {

    private final PlantService plantService;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    @PostMapping("/plants")
    public ResponseEntity<PlantResponse> create(
        @RequestBody @Valid CreatePlantRequest req,
        Authentication authentication) {
            
            Plant created = plantService.create(
                req.getPlantacaoId(),
                authentication.getName(),
                req.getEspecie(),
                req.getNome(),
                req.getPosicaoX(),
                req.getPosicaoY()); 

            URI location = URI.create("/plants/" + created.getId());

            return ResponseEntity
                .created(location)
                .body(PlantResponse.from(created));
        }

    @GetMapping("/plantations/{plantationId}/plants")
    public ResponseEntity<List<PlantResponse>> listByPlantation(
        @PathVariable("plantationId") Integer plantacaoId,
        Authentication authentication) {
            
            List<PlantResponse> response = plantService.
            findAllByPlantation
            (plantacaoId, 
            authentication.getName())
            .stream()
            .map(PlantResponse::from)
            .toList();

        return ResponseEntity.ok(response);
            
        }
    
    @PutMapping("/plants/{id}")
    public ResponseEntity<PlantResponse> update(
        @PathVariable Integer id,
        @RequestBody @Valid UpdatePlantRequest req, 
        Authentication authentication) {

            Plant updated = plantService.update(
                id,
                authentication.getName(),
                req.getEspecie(),
                req.getNome(),
                req.getPosicaoX(),
                req.getPosicaoY());

        return ResponseEntity.ok(PlantResponse.from(updated));
        }

    @DeleteMapping("plants/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Integer id, 
        Authentication authentication) {
            
            plantService.delete(id, authentication.getName());

            return ResponseEntity.noContent().build();
        }

}
