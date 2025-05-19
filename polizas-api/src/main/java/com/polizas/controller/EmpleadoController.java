package com.polizas.controller;

import com.polizas.dto.ResponseDto;
import com.polizas.model.Empleado;
import com.polizas.repository.EmpleadoRepository;
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
@RequestMapping("/empleados")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Empleados", description = "API para la gestión de empleados")
public class EmpleadoController {

    private final EmpleadoRepository empleadoRepository;

    @GetMapping
    @Operation(summary = "Obtener todos los empleados", description = "Devuelve la lista de todos los empleados")
    public ResponseEntity<ResponseDto<List<Empleado>>> obtenerTodos() {
        try {
            List<Empleado> empleados = empleadoRepository.findAll();
            return ResponseEntity.ok(ResponseDto.success(empleados));
        } catch (Exception e) {
            log.error("Error al obtener la lista de empleados", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al consultar los empleados"));
        }
    }

    @GetMapping("/{idEmpleado}")
    @Operation(summary = "Obtener empleado por ID", description = "Devuelve un empleado por su ID")
    public ResponseEntity<ResponseDto<Empleado>> obtenerPorId(@PathVariable Long idEmpleado) {
        try {
            return empleadoRepository.findByIdEmpleado(idEmpleado)
                    .map(empleado -> ResponseEntity.ok(ResponseDto.success(empleado)))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ResponseDto.failure("Empleado no encontrado con ID: " + idEmpleado)));
        } catch (Exception e) {
            log.error("Error al obtener empleado con ID: {}", idEmpleado, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al consultar el empleado"));
        }
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo empleado", description = "Crea un nuevo empleado en la base de datos")
    public ResponseEntity<ResponseDto<Empleado>> crear(@Valid @RequestBody Empleado empleado) {
        try {
            Empleado nuevoEmpleado = empleadoRepository.save(empleado);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ResponseDto.success(nuevoEmpleado));
        } catch (Exception e) {
            log.error("Error al crear empleado", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al crear el empleado"));
        }
    }

    @PutMapping("/{idEmpleado}")
    @Operation(summary = "Actualizar un empleado", description = "Actualiza los datos de un empleado existente")
    public ResponseEntity<ResponseDto<Empleado>> actualizar(
            @PathVariable Long idEmpleado,
            @Valid @RequestBody Empleado empleado) {
        try {
            return empleadoRepository.findByIdEmpleado(idEmpleado)
                    .map(empleadoExistente -> {
                        empleado.setIdEmpleado(idEmpleado);
                        Empleado empleadoActualizado = empleadoRepository.save(empleado);
                        return ResponseEntity.ok(ResponseDto.success(empleadoActualizado));
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ResponseDto.failure("Empleado no encontrado con ID: " + idEmpleado)));
        } catch (Exception e) {
            log.error("Error al actualizar empleado con ID: {}", idEmpleado, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al actualizar el empleado"));
        }
    }

    @DeleteMapping("/{idEmpleado}")
    @Operation(summary = "Eliminar un empleado", description = "Elimina un empleado existente")
    public ResponseEntity<ResponseDto<Map<String, String>>> eliminar(@PathVariable Long idEmpleado) {
        try {
            return empleadoRepository.findByIdEmpleado(idEmpleado)
                    .map(empleado -> {
                        empleadoRepository.delete(empleado);
                        Map<String, String> response = new HashMap<>();
                        response.put("mensaje", "Empleado eliminado correctamente");
                        return ResponseEntity.ok(ResponseDto.success(response));
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ResponseDto.failure("Empleado no encontrado con ID: " + idEmpleado)));
        } catch (Exception e) {
            log.error("Error al eliminar empleado con ID: {}", idEmpleado, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Error al eliminar el empleado"));
        }
    }
}
