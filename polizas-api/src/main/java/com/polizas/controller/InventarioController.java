package com.polizas.controller;

import com.polizas.dto.ResponseDto;
import com.polizas.model.Inventario;
import com.polizas.repository.InventarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/inventario")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Inventario", description = "API para la gestión de inventario")
public class InventarioController {

    private final InventarioRepository inventarioRepository;

    @GetMapping
    @Operation(summary = "Obtener todo el inventario", description = "Devuelve la lista de todos los artículos en inventario")
    public ResponseEntity<ResponseDto<List<Inventario>>> obtenerTodos() {
        try {
            List<Inventario> inventario = inventarioRepository.findAll();
            return ResponseEntity.ok(ResponseDto.success(inventario));
        } catch (Exception e) {
            log.error("Error al obtener la lista de inventario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al consultar el inventario"));
        }
    }

    @GetMapping("/{sku}")
    @Operation(summary = "Obtener artículo por SKU", description = "Devuelve un artículo por su SKU")
    public ResponseEntity<ResponseDto<Inventario>> obtenerPorSku(@PathVariable Long sku) {
        try {
            return inventarioRepository.findBySku(sku)
                    .map(articulo -> ResponseEntity.ok(ResponseDto.success(articulo)))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ResponseDto.failure("Artículo no encontrado con SKU: " + sku)));
        } catch (Exception e) {
            log.error("Error al obtener artículo con SKU: {}", sku, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al consultar el artículo"));
        }
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo artículo", description = "Agrega un nuevo artículo al inventario")
    public ResponseEntity<ResponseDto<Inventario>> crear(@Valid @RequestBody Inventario articulo) {
        try {
            Inventario nuevoArticulo = inventarioRepository.save(articulo);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ResponseDto.success(nuevoArticulo));
        } catch (Exception e) {
            log.error("Error al crear artículo", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al crear el artículo"));
        }
    }

    @PutMapping("/{sku}")
    @Operation(summary = "Actualizar un artículo", description = "Actualiza los datos de un artículo existente")
    public ResponseEntity<ResponseDto<Inventario>> actualizar(
            @PathVariable Long sku,
            @Valid @RequestBody Inventario articulo) {
        try {
            return inventarioRepository.findBySku(sku)
                    .map(articuloExistente -> {
                        articulo.setSku(sku);
                        Inventario articuloActualizado = inventarioRepository.save(articulo);
                        return ResponseEntity.ok(ResponseDto.success(articuloActualizado));
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ResponseDto.failure("Artículo no encontrado con SKU: " + sku)));
        } catch (Exception e) {
            log.error("Error al actualizar artículo con SKU: {}", sku, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al actualizar el artículo"));
        }
    }

    @DeleteMapping("/{sku}")
    @Operation(summary = "Eliminar un artículo", description = "Elimina un artículo existente del inventario")
    public ResponseEntity<ResponseDto<Map<String, String>>> eliminar(@PathVariable Long sku) {
        try {
            return inventarioRepository.findBySku(sku)
                    .map(articulo -> {
                        inventarioRepository.delete(articulo);
                        Map<String, String> response = new HashMap<>();
                        response.put("mensaje", "Artículo eliminado correctamente");
                        return ResponseEntity.ok(ResponseDto.success(response));
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ResponseDto.failure("Artículo no encontrado con SKU: " + sku)));
        } catch (Exception e) {
            log.error("Error al eliminar artículo con SKU: {}", sku, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al eliminar el artículo"));
        }
    }
}
