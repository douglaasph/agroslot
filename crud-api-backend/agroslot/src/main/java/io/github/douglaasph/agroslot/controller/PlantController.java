package io.github.douglaasph.agroslot.controller;

import java.net.URI;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.github.douglaasph.agroslot.dto.CreatePlantRequest;
import io.github.douglaasph.agroslot.dto.PlantResponse;
import io.github.douglaasph.agroslot.dto.UpdatePlantRequest;
import io.github.douglaasph.agroslot.model.Plant;
import io.github.douglaasph.agroslot.service.PlantService;
import jakarta.validation.Valid;

@RestController
@RequestMapping({ "/plant" })
@RequiredArgsConstructor
public class PlantController {

    private final PlantService plantService;

    @PostMapping()
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

    @GetMapping("/{plantationId}")
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
    
    @PutMapping("/{id}")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Integer id, 
        Authentication authentication) {
            
            plantService.delete(id, authentication.getName());

            return ResponseEntity.noContent().build();
        }

}
