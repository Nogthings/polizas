package com.polizas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolizaResponseDto {
    private PolizaDto poliza;
    private EmpleadoDto empleado;
    private DetalleArticuloDto detalleArticulo;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PolizaDto {
        private Long idPoliza;
        private Integer cantidad;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmpleadoDto {
        private String nombre;
        private String apellido;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetalleArticuloDto {
        private Long sku;
        private String nombre;
    }
}