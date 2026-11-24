package io.github.douglaasph.agroslot.bucket;

import io.github.douglaasph.agroslot.config.props.MinioProps;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public class BucketService {
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png");

    private final MinioClient client;
    private final MinioClient publicClient;
    private final MinioProps props;

    public BucketService(
            @Qualifier("minioInternal") MinioClient internalClient,
            @Qualifier("minioPublic") MinioClient publicClient,
            MinioProps props) {
        this.client = internalClient;
        this.publicClient = publicClient;
        this.props = props;
    }

    public void upload(BucketFile file) {
        validateType(file);
        try {
            var object = PutObjectArgs
                    .builder()
                    .bucket(props.getBucketName())
                    .object(file.getName())
                    .stream(file.getIs(), file.getSize(), -1)
                    .contentType(file.getType().toString())
                    .build();
            client.putObject(object);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void validateType(BucketFile file) {
        String type = file.getType().toString().toLowerCase();
        if (!ALLOWED_TYPES.contains(type)) {
            throw new IllegalArgumentException(
                    "Tipo de arquivo não permitido: " + type + ". Apenas JPG, JPEG e PNG são aceitos.");
        }
    }

    public String getUrl(String fileName) {
        try {
            var object = GetPresignedObjectUrlArgs
                    .builder()
                    .method(Method.GET)
                    .bucket(props.getBucketName())
                    .object(fileName)
                    .expiry(12, TimeUnit.HOURS)
                    .build();

            return publicClient.getPresignedObjectUrl(object);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
