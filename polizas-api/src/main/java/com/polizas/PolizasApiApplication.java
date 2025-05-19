package com.polizas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@EnableJpaRepositories
@OpenAPIDefinition(info = @Info(title = "API de Polizas de Faltantes", version = "1.0", description = "API RESTful para la gestion de polizas de faltantes de inventario"))
public class PolizasApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PolizasApiApplication.class, args);
	}

}
