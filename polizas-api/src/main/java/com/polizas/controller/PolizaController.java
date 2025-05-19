package com.polizas.controller;

import com.polizas.dto.MensajeResponseDto;
import com.polizas.dto.PolizaRequestDto;
import com.polizas.dto.PolizaResponseDto;
import com.polizas.dto.ResponseDto;
import com.polizas.service.PolizaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/polizas")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Pólizas", description = "API para la gestión de pólizas de faltantes")
public class PolizaController {

    private final PolizaService polizaService;

    @GetMapping
    @Operation(summary = "Obtener todas las pólizas", description = "Obtiene la lista de todas las pólizas registradas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de pólizas obtenida correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<ResponseDto<List<PolizaResponseDto>>> obtenerTodas() {
        try {
            List<PolizaResponseDto> polizas = polizaService.obtenerTodasPolizas();
            return ResponseEntity.ok(ResponseDto.success(polizas));
        } catch (Exception e) {
            log.error("Error al obtener todas las pólizas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Ha ocurrido un error al consultar las pólizas."));
        }
    }

    @PostMapping
    @Operation(summary = "Crear una nueva póliza", description = "Crea una nueva póliza y actualiza el inventario")
    public ResponseEntity<ResponseDto<PolizaResponseDto>> crearPoliza(
            @Valid @RequestBody PolizaRequestDto polizaRequestDto) {
        try {
            PolizaResponseDto response = polizaService.crearPoliza(polizaRequestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(ResponseDto.success(response));
        } catch (Exception e) {
            log.error("Error al crear póliza", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Ha ocurrido un error en los grabados de póliza."));
        }
    }

    @GetMapping("/{idPoliza}")
    @Operation(summary = "Obtener póliza por ID", description = "Obtiene los detalles de una póliza por su ID")
    public ResponseEntity<ResponseDto<PolizaResponseDto>> obtenerPoliza(@PathVariable Long idPoliza) {
        try {
            PolizaResponseDto response = polizaService.obtenerPolizaPorId(idPoliza);
            return ResponseEntity.ok(ResponseDto.success(response));
        } catch (Exception e) {
            log.error("Error al consultar póliza", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Ha ocurrido un error al consultar la póliza."));
        }
    }

    @PutMapping("/{idPoliza}")
    @Operation(summary = "Actualizar póliza", description = "Actualiza los datos de una póliza existente")
    public ResponseEntity<ResponseDto<MensajeResponseDto>> actualizarPoliza(
            @PathVariable Long idPoliza,
            @Valid @RequestBody PolizaRequestDto polizaRequestDto) {
        try {
            MensajeResponseDto response = polizaService.actualizarPoliza(idPoliza, polizaRequestDto);
            return ResponseEntity.ok(ResponseDto.success(response));
        } catch (Exception e) {
            log.error("Error al actualizar póliza", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Ha ocurrido un error al intentar actualizar la póliza."));
        }
    }

    @DeleteMapping("/{idPoliza}")
    @Operation(summary = "Eliminar póliza", description = "Elimina una póliza existente y actualiza el inventario")
    public ResponseEntity<ResponseDto<MensajeResponseDto>> eliminarPoliza(@PathVariable Long idPoliza) {
        try {
            MensajeResponseDto response = polizaService.eliminarPoliza(idPoliza);
            return ResponseEntity.ok(ResponseDto.success(response));
        } catch (Exception e) {
            log.error("Error al eliminar póliza", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.failure("Ha ocurrido un error al intentar eliminar la póliza."));
        }
    }
}
