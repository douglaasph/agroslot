package io.github.douglaasph.agroslot.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients(basePackages = "io.github.douglaasph.agroslot.client")
public class ClientConfig {
}
