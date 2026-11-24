package io.github.douglaasph.agroslot.config;

import io.github.douglaasph.agroslot.config.props.MinioProps;
import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BucketConfig {
    @Autowired
    MinioProps props;

    @Bean("minioInternal")
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(props.getUrl())
                .credentials(props.getAccessKey(), props.getSecretKey())
                .build();
    }

    @Bean("minioPublic")
    public MinioClient minioPublic() {
        return MinioClient.builder()
                .endpoint(props.getPublicUrl())
                .credentials(props.getAccessKey(), props.getSecretKey())
                .build();
    }
}
