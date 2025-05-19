package com.polizas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolizaRequestDto {
    private Long idPoliza;
    private Long empleadoGenero;
    private Long sku;
    private Integer cantidad;
}