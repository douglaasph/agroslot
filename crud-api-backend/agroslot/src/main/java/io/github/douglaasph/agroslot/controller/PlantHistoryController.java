package io.github.douglaasph.agroslot.controller;

import io.github.douglaasph.agroslot.bucket.BucketService;
import io.github.douglaasph.agroslot.dto.plantationHistory.PlantHistoryResponse;
import io.github.douglaasph.agroslot.model.PlantHistory;
import io.github.douglaasph.agroslot.service.PlantHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/planthistory")
@RequiredArgsConstructor
public class PlantHistoryController {
    private final PlantHistoryService service;
    private final BucketService bucketService;

    @PostMapping(value = "/{plantId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PlantHistoryResponse> create(
            @PathVariable Integer plantId,
            @RequestParam("file") MultipartFile file
    ) {
        PlantHistory history = service.createHistoryWithImage(plantId, file);

        PlantHistoryResponse response = new PlantHistoryResponse();
        response.setId(history.getId());
        response.setFoto_url(bucketService.getUrl(history.getFotoUrl()));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping(value = "/{plantId}")
    public ResponseEntity<List<PlantHistoryResponse>> create(
            @PathVariable Integer plantId
    ) {
        return ResponseEntity.ok(
                service.getAllImages(plantId)
        );
    }
}
