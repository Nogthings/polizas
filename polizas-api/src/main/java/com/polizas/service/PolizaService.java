package com.polizas.service;

import com.polizas.dto.MensajeResponseDto;
import com.polizas.dto.PolizaRequestDto;
import com.polizas.dto.PolizaResponseDto;
import com.polizas.exception.ResourceNotFoundException;
import com.polizas.model.Empleado;
import com.polizas.model.Inventario;
import com.polizas.model.Poliza;
import com.polizas.repository.EmpleadoRepository;
import com.polizas.repository.InventarioRepository;
import com.polizas.repository.PolizaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PolizaService {

        private final PolizaRepository polizaRepository;
        private final EmpleadoRepository empleadoRepository;
        private final InventarioRepository inventarioRepository;

        /**
         * Obtener todas las pólizas
         */
        @Transactional(readOnly = true)
        public List<PolizaResponseDto> obtenerTodasPolizas() {
                log.info("Obteniendo todas las pólizas");

                List<Poliza> polizas = polizaRepository.findAll();
                List<PolizaResponseDto> result = new ArrayList<>();

                for (Poliza poliza : polizas) {
                        Empleado empleado = empleadoRepository.findByIdEmpleado(poliza.getEmpleadoGenero())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Empleado no encontrado con ID: "
                                                                        + poliza.getEmpleadoGenero()));

                        Inventario inventario = inventarioRepository.findBySku(poliza.getSku())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Artículo no encontrado con SKU: " + poliza.getSku()));

                        result.add(buildPolizaResponse(poliza, empleado, inventario));
                }

                return result;
        }

        /**
         * Crear una nueva póliza
         */
        @Transactional
        public PolizaResponseDto crearPoliza(PolizaRequestDto polizaRequestDto) {
                log.info("Creando póliza: {}", polizaRequestDto);

                // Verificar si existe el empleado
                Empleado empleado = empleadoRepository.findByIdEmpleado(polizaRequestDto.getEmpleadoGenero())
                                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: "
                                                + polizaRequestDto.getEmpleadoGenero()));

                // Verificar si existe el artículo en inventario
                Inventario inventario = inventarioRepository.findBySku(polizaRequestDto.getSku())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Artículo no encontrado con SKU: " + polizaRequestDto.getSku()));

                // Verificar que haya suficiente cantidad en inventario
                if (inventario.getCantidad() < polizaRequestDto.getCantidad()) {
                        throw new IllegalStateException(
                                        "No hay suficiente cantidad en inventario para el artículo con SKU: "
                                                        + polizaRequestDto.getSku());
                }

                // Actualizar inventario (restar cantidad)
                inventario.setCantidad(inventario.getCantidad() - polizaRequestDto.getCantidad());
                inventarioRepository.save(inventario);

                // Crear póliza
                Poliza poliza = Poliza.builder()
                                .idPoliza(polizaRequestDto.getIdPoliza())
                                .empleadoGenero(polizaRequestDto.getEmpleadoGenero())
                                .sku(polizaRequestDto.getSku())
                                .cantidad(polizaRequestDto.getCantidad())
                                .fecha(LocalDateTime.now())
                                .build();

                polizaRepository.save(poliza);

                log.info("Póliza creada correctamente: {}", poliza);

                // Construir respuesta
                return buildPolizaResponse(poliza, empleado, inventario);
        }

        /**
         * Obtener una póliza por ID
         */
        @Transactional(readOnly = true)
        public PolizaResponseDto obtenerPolizaPorId(Long idPoliza) {
                log.info("Obteniendo póliza con ID: {}", idPoliza);

                Poliza poliza = polizaRepository.findByIdPoliza(idPoliza)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Póliza no encontrada con ID: " + idPoliza));

                Empleado empleado = empleadoRepository.findByIdEmpleado(poliza.getEmpleadoGenero())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Empleado no encontrado con ID: " + poliza.getEmpleadoGenero()));

                Inventario inventario = inventarioRepository.findBySku(poliza.getSku())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Artículo no encontrado con SKU: " + poliza.getSku()));

                return buildPolizaResponse(poliza, empleado, inventario);
        }

        /**
         * Actualizar una póliza existente
         */
        @Transactional
        public MensajeResponseDto actualizarPoliza(Long idPoliza, PolizaRequestDto polizaRequestDto) {
                log.info("Actualizando póliza con ID: {}, nuevos datos: {}", idPoliza, polizaRequestDto);

                Poliza polizaExistente = polizaRepository.findByIdPoliza(idPoliza)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Póliza no encontrada con ID: " + idPoliza));

                // Verificar si existe el empleado
                empleadoRepository.findByIdEmpleado(polizaRequestDto.getEmpleadoGenero())
                                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: "
                                                + polizaRequestDto.getEmpleadoGenero()));

                // Si se está actualizando el empleado, solo actualizar ese dato
                polizaExistente.setEmpleadoGenero(polizaRequestDto.getEmpleadoGenero());

                polizaRepository.save(polizaExistente);

                log.info("Póliza actualizada correctamente: {}", polizaExistente);

                // Construir mensaje de respuesta
                return MensajeResponseDto.builder()
                                .mensaje(MensajeResponseDto.MensajeIdDto.builder()
                                                .idMensaje("Se actualizó correctamente la poliza " + idPoliza)
                                                .build())
                                .build();
        }

        /**
         * Eliminar una póliza
         */
        @Transactional
        public MensajeResponseDto eliminarPoliza(Long idPoliza) {
                log.info("Eliminando póliza con ID: {}", idPoliza);

                Poliza poliza = polizaRepository.findByIdPoliza(idPoliza)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Póliza no encontrada con ID: " + idPoliza));

                // Devolver la cantidad al inventario
                Inventario inventario = inventarioRepository.findBySku(poliza.getSku())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Artículo no encontrado con SKU: " + poliza.getSku()));

                inventario.setCantidad(inventario.getCantidad() + poliza.getCantidad());
                inventarioRepository.save(inventario);

                // Eliminar la póliza
                polizaRepository.delete(poliza);

                log.info("Póliza eliminada correctamente con ID: {}", idPoliza);

                // Construir mensaje de respuesta
                return MensajeResponseDto.builder()
                                .mensaje(MensajeResponseDto.MensajeIdDto.builder()
                                                .idMensaje("Se eliminó correctamente la poliza " + idPoliza)
                                                .build())
                                .build();
        }

        /**
         * Método auxiliar para construir la respuesta de póliza
         */
        private PolizaResponseDto buildPolizaResponse(Poliza poliza, Empleado empleado, Inventario inventario) {
                return PolizaResponseDto.builder()
                                .poliza(PolizaResponseDto.PolizaDto.builder()
                                                .idPoliza(poliza.getIdPoliza())
                                                .cantidad(poliza.getCantidad())
                                                .build())
                                .empleado(PolizaResponseDto.EmpleadoDto.builder()
                                                .nombre(empleado.getNombre())
                                                .apellido(empleado.getApellido())
                                                .build())
                                .detalleArticulo(PolizaResponseDto.DetalleArticuloDto.builder()
                                                .sku(inventario.getSku())
                                                .nombre(inventario.getNombre())
                                                .build())
                                .build();
        }
}
