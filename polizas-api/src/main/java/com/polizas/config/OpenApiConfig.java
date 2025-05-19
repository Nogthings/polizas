package com.polizas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

        @Bean
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("API de Pólizas de Faltantes")
                                                .version("1.0")
                                                .description("API RESTful para la gestión de pólizas de faltantes de inventario")
                                                .contact(new Contact()
                                                                .name("Equipo de Desarrollo")
                                                                .email("desarrollo@example.com"))
                                                .license(new License().name("Apache 2.0")));
        }
}
