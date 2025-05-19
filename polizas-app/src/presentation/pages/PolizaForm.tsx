import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MainLayout from '@presentation/layouts/MainLayout';
import Button from '@presentation/components/Button';
import Input from '@presentation/components/Input';
import Select from '@presentation/components/Select';
import { polizaUseCases, empleadoUseCases, inventarioUseCases } from '@core/application/useCases';
import { PolizaRequest } from '@core/domain/entities';

const PolizaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = id !== 'nueva';
  
  // Consultas para obtener datos necesarios
  const { data: poliza, isLoading: isLoadingPoliza } = useQuery({
    queryKey: ['poliza', id],
    queryFn: () => polizaUseCases.getPolizaById(Number(id)),
    enabled: isEditing,
  });
  
  const { data: empleados, isLoading: isLoadingEmpleados } = useQuery({
    queryKey: ['empleados'],
    queryFn: empleadoUseCases.getAllEmpleados,
  });
  
  const { data: inventario, isLoading: isLoadingInventario } = useQuery({
    queryKey: ['inventario'],
    queryFn: inventarioUseCases.getAllInventario,
  });
  
  // Mutaciones para crear o actualizar póliza
  const createPolizaMutation = useMutation({
    mutationFn: (poliza: PolizaRequest) => polizaUseCases.createPoliza(poliza),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polizas'] });
      navigate('/polizas');
    },
  });
  
  const updatePolizaMutation = useMutation({
    mutationFn: ({ id, poliza }: { id: number; poliza: PolizaRequest }) => 
      polizaUseCases.updatePoliza(id, poliza),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polizas'] });
      navigate('/polizas');
    },
  });
  
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    idPoliza: Yup.number()
      .required('El ID de la póliza es requerido')
      .positive('El ID debe ser un número positivo'),
    empleadoGenero: Yup.number()
      .required('El empleado es requerido')
      .positive('Debe seleccionar un empleado'),
    sku: Yup.number()
      .required('El artículo es requerido')
      .positive('Debe seleccionar un artículo'),
    cantidad: Yup.number()
      .required('La cantidad es requerida')
      .positive('La cantidad debe ser un número positivo')
      .test(
        'cantidad-disponible',
        'La cantidad excede el inventario disponible',
        function(value) {
          // Solo validamos stock en creación, no en edición
          if (isEditing) return true;
          
          const sku = this.parent.sku;
          const articulo = inventario?.find(item => item.sku === Number(sku));
          return articulo ? value <= articulo.cantidad : true;
        }
      ),
  });
  
  // Configuración del formulario con Formik
  const formik = useFormik({
    initialValues: {
      idPoliza: '',
      empleadoGenero: '',
      sku: '',
      cantidad: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const polizaData: PolizaRequest = {
        idPoliza: Number(values.idPoliza),
        empleadoGenero: Number(values.empleadoGenero),
        sku: Number(values.sku),
        cantidad: Number(values.cantidad),
      };
      
      if (isEditing) {
        updatePolizaMutation.mutate({
          id: Number(id),
          poliza: polizaData,
        });
      } else {
        createPolizaMutation.mutate(polizaData);
      }
    },
  });
  
  // Efecto para cargar datos iniciales en edición
  useEffect(() => {
    if (isEditing && poliza) {
      formik.setValues({
        idPoliza: poliza.poliza.idPoliza.toString(),
        empleadoGenero: poliza.empleado ? poliza.empleado.nombre : '',
        sku: poliza.detalleArticulo ? poliza.detalleArticulo.sku.toString() : '',
        cantidad: poliza.poliza.cantidad.toString(),
      });
    }
  }, [isEditing, poliza]);
  
  // Renderizado del formulario
  const isLoading = isLoadingPoliza || isLoadingEmpleados || isLoadingInventario;
  const isSaving = createPolizaMutation.isPending || updatePolizaMutation.isPending;
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isEditing ? 'Editar Póliza' : 'Crear Nueva Póliza'}
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="bg-white shadow rounded-lg p-6">
            <Input
              label="ID de Póliza"
              type="number"
              id="idPoliza"
              name="idPoliza"
              value={formik.values.idPoliza}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.idPoliza && formik.errors.idPoliza ? formik.errors.idPoliza : ''}
              disabled={isEditing}
            />
            
            <Select
              label="Empleado"
              id="empleadoGenero"
              name="empleadoGenero"
              value={formik.values.empleadoGenero}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.empleadoGenero && formik.errors.empleadoGenero ? formik.errors.empleadoGenero : ''}
              options={
                empleados
                  ? empleados.map(emp => ({
                      value: emp.idEmpleado,
                      label: `${emp.nombre} ${emp.apellido} - ${emp.puesto}`
                    }))
                  : []
              }
            />
            
            <Select
              label="Artículo"
              id="sku"
              name="sku"
              value={formik.values.sku}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.sku && formik.errors.sku ? formik.errors.sku : ''}
              options={
                inventario
                  ? inventario.map(item => ({
                      value: item.sku,
                      label: `${item.nombre} - Stock: ${item.cantidad}`
                    }))
                  : []
              }
              disabled={isEditing}
            />
            
            <Input
              label="Cantidad"
              type="number"
              id="cantidad"
              name="cantidad"
              value={formik.values.cantidad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cantidad && formik.errors.cantidad ? formik.errors.cantidad : ''}
              disabled={isEditing}
            />
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/polizas')}
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                isLoading={isSaving}
                disabled={!formik.isValid || isSaving}
              >
                {isEditing ? 'Actualizar' : 'Crear'} Póliza
              </Button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default PolizaForm;
