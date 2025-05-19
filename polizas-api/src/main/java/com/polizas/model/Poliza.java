package com.polizas.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "polizas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Poliza {

    @Id
    @Column(name = "id_poliza", nullable = false, unique = true)
    private Long idPoliza;

    @Column(name = "empleado_genero", nullable = false)
    private Long empleadoGenero;

    @Column(name = "sku", nullable = false)
    private Long sku;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

}
