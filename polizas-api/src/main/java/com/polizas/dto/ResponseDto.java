package com.polizas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto<T> {
    private MetaDto meta;
    private T data;

    public static <T> ResponseDto<T> success(T data) {
        return ResponseDto.<T>builder()
                .meta(MetaDto.builder().status("OK").build())
                .data(data)
                .build();
    }

    public static <T> ResponseDto<T> failure(String mensaje) {
        return ResponseDto.<T>builder()
                .meta(MetaDto.builder().status("FAILURE").build())
                .data((T) MensajeDto.builder().mensaje(mensaje).build())
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetaDto {
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MensajeDto {
        private String mensaje;
    }
}