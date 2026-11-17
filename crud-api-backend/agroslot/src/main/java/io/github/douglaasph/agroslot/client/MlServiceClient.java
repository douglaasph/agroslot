package io.github.douglaasph.agroslot.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "ml-service", url ="${ml-service.url}")
public interface MlServiceClient {
    @PostMapping(value = "/predict", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<MlServiceRepresentation> getPredict(@RequestPart("file") MultipartFile file);
}
