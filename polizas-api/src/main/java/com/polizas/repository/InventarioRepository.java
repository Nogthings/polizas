package com.polizas.repository;

import com.polizas.model.Inventario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {
    Optional<Inventario> findBySku(Long sku);

    // Método para buscar con paginación
    Page<Inventario> findAll(Pageable pageable);

    // Método para búsqueda por nombre con paginación (opcional)
    Page<Inventario> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
}