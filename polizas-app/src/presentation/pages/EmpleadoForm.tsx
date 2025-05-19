import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MainLayout from '@presentation/layouts/MainLayout';
import Button from '@presentation/components/Button';
import Input from '@presentation/components/Input';
import { empleadoUseCases } from '@core/application/useCases';
import { Empleado } from '@core/domain/entities';

const EmpleadoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = id !== undefined && id !== 'nuevo';
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Consulta para obtener los datos del empleado en caso de edición
  const { data: empleado, isLoading: isLoadingEmpleado } = useQuery({
    queryKey: ['empleado', id],
    queryFn: () => empleadoUseCases.getEmpleadoById(Number(id)),
    enabled: isEditMode,
  });
  
  // Mutaciones para crear o actualizar empleado
  const createEmpleadoMutation = useMutation({
    mutationFn: (empleado: Empleado) => empleadoUseCases.createEmpleado(empleado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
      navigate('/empleados');
    },
  });
  
  const updateEmpleadoMutation = useMutation({
    mutationFn: ({ id, empleado }: { id: number; empleado: Empleado }) => 
      empleadoUseCases.updateEmpleado(id, empleado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
      navigate('/empleados');
    },
  });
  
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .required('El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no debe exceder los 50 caracteres'),
    apellido: Yup.string()
      .required('El apellido es requerido')
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(50, 'El apellido no debe exceder los 50 caracteres'),
    puesto: Yup.string()
      .required('El puesto es requerido')
      .min(2, 'El puesto debe tener al menos 2 caracteres')
      .max(100, 'El puesto no debe exceder los 100 caracteres'),
  });
  
  // Valores iniciales para el formulario
  const initialValues = {
    nombre: '',
    apellido: '',
    puesto: '',
  };
  
  // Configuración del formulario con Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isEditMode && empleado) {
        // En modo edición, incluimos el ID existente
        const empleadoData: Empleado = {
          idEmpleado: empleado.idEmpleado,
          nombre: values.nombre,
          apellido: values.apellido,
          puesto: values.puesto,
        };
        
        updateEmpleadoMutation.mutate({
          id: Number(id),
          empleado: empleadoData,
        });
      } else {
        // En modo creación, el ID será generado automáticamente
        const empleadoData: Empleado = {
          idEmpleado: 0, // Será ignorado por el backend
          nombre: values.nombre,
          apellido: values.apellido,
          puesto: values.puesto,
        };
        
        createEmpleadoMutation.mutate(empleadoData);
      }
    },
  });
  
  // Efecto para cargar datos iniciales en edición
  useEffect(() => {
    if (isEditMode && empleado) {
      setLoadingDetails(true);
      formik.setValues({
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        puesto: empleado.puesto,
      });
      setLoadingDetails(false);
    }
  }, [isEditMode, empleado]);
  
  // Renderizado del formulario
  const isLoading = isLoadingEmpleado || loadingDetails;
  const isSaving = createEmpleadoMutation.isPending || updateEmpleadoMutation.isPending;
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isEditMode ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="bg-white shadow rounded-lg p-6">
            {isEditMode && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">ID del Empleado: <span className="font-bold">{empleado?.idEmpleado}</span></p>
              </div>
            )}
            
            <Input
              label="Nombre"
              type="text"
              id="nombre"
              name="nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nombre && formik.errors.nombre ? formik.errors.nombre : ''}
            />
            
            <Input
              label="Apellido"
              type="text"
              id="apellido"
              name="apellido"
              value={formik.values.apellido}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.apellido && formik.errors.apellido ? formik.errors.apellido : ''}
            />
            
            <Input
              label="Puesto"
              type="text"
              id="puesto"
              name="puesto"
              value={formik.values.puesto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.puesto && formik.errors.puesto ? formik.errors.puesto : ''}
            />
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/empleados')}
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                isLoading={isSaving}
                disabled={!formik.isValid || isSaving}
              >
                {isEditMode ? 'Actualizar' : 'Crear'} Empleado
              </Button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default EmpleadoForm;