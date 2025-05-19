package com.polizas.repository;

import com.polizas.model.Poliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolizaRepository extends JpaRepository<Poliza, Long> {
    Optional<Poliza> findByIdPoliza(Long idPoliza);

    List<Poliza> findByEmpleadoGenero(Long empleadoGenero);

    List<Poliza> findBySku(Long sku);

    @Query(value = "SELECT * FROM polizas p WHERE p.empleado_genero = :empleadoGenero AND p.sku = :sku", nativeQuery = true)
    List<Poliza> findByEmpleadoGeneroAndSku(@Param("empleadoGenero") Long empleadoGenero, @Param("sku") Long sku);
}