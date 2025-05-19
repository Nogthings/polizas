import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MainLayout from '@presentation/layouts/MainLayout';
import Button from '@presentation/components/Button';
import Input from '@presentation/components/Input';
import { inventarioUseCases } from '@core/application/useCases';
import { Inventario } from '@core/domain/entities';

const InventarioForm: React.FC = () => {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = sku !== undefined && sku !== 'nuevo';
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Consulta para obtener los datos del artículo en caso de edición
  const { data: articulo, isLoading: isLoadingArticulo } = useQuery({
    queryKey: ['inventario', sku],
    queryFn: () => inventarioUseCases.getInventarioItem(Number(sku)),
    enabled: isEditMode,
  });
  
  // Mutaciones para crear o actualizar artículos de inventario
  const createInventarioMutation = useMutation({
    mutationFn: (inventario: Inventario) => inventarioUseCases.createInventarioItem(inventario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
      navigate('/inventario');
    },
  });
  
  const updateInventarioMutation = useMutation({
    mutationFn: ({ sku, inventario }: { sku: number; inventario: Inventario }) => 
      inventarioUseCases.updateInventarioItem(sku, inventario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
      navigate('/inventario');
    },
  });
  
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    sku: Yup.number()
      .required('El SKU es requerido')
      .positive('El SKU debe ser un número positivo')
      .integer('El SKU debe ser un número entero'),
    nombre: Yup.string()
      .required('El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no debe exceder los 100 caracteres'),
    cantidad: Yup.number()
      .required('La cantidad es requerida')
      .min(0, 'La cantidad no puede ser negativa')
      .integer('La cantidad debe ser un número entero'),
  });
  
  // Valores iniciales para el formulario
  const initialValues = {
    sku: '',
    nombre: '',
    cantidad: '',
  };
  
  // Configuración del formulario con Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const inventarioData: Inventario = {
        sku: Number(values.sku),
        nombre: values.nombre,
        cantidad: Number(values.cantidad),
      };
      
      if (isEditMode) {
        updateInventarioMutation.mutate({
          sku: Number(sku),
          inventario: inventarioData,
        });
      } else {
        createInventarioMutation.mutate(inventarioData);
      }
    },
  });
  
  // Efecto para cargar datos iniciales en edición
  useEffect(() => {
    if (isEditMode && articulo) {
      setLoadingDetails(true);
      formik.setValues({
        sku: articulo.sku.toString(),
        nombre: articulo.nombre,
        cantidad: articulo.cantidad.toString(),
      });
      setLoadingDetails(false);
    }
  }, [isEditMode, articulo]);
  
  // Renderizado del formulario
  const isLoading = isLoadingArticulo || loadingDetails;
  const isSaving = createInventarioMutation.isPending || updateInventarioMutation.isPending;
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isEditMode ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="bg-white shadow rounded-lg p-6">
            <Input
              label="SKU"
              type="number"
              id="sku"
              name="sku"
              value={formik.values.sku}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.sku && formik.errors.sku ? formik.errors.sku : ''}
              disabled={isEditMode}
              helperText={isEditMode ? "El SKU no se puede modificar" : "Ingrese un SKU único para el artículo"}
            />
            
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
              label="Cantidad"
              type="number"
              id="cantidad"
              name="cantidad"
              value={formik.values.cantidad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cantidad && formik.errors.cantidad ? formik.errors.cantidad : ''}
            />
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/inventario')}
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                isLoading={isSaving}
                disabled={!formik.isValid || isSaving}
              >
                {isEditMode ? 'Actualizar' : 'Crear'} Artículo
              </Button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default InventarioForm;