# Sistema de Gestión de Pólizas de Faltantes

Este proyecto es una aplicación web completa para la gestión de pólizas de faltantes en inventario. Permite registrar pólizas que restan unidades del inventario y las asignan a empleados específicos, facilitando el control y seguimiento de faltantes en el inventario.

## Arquitectura de la Solución

El sistema está construido siguiendo una arquitectura de microservicios, con tres componentes principales:

1. **Backend (polizas-api)**: API RESTful desarrollada con Spring Boot y Java 21
2. **Frontend (polizas-app)**: Interfaz de usuario desarrollada con React, TypeScript y Tailwind CSS
3. **Base de Datos (polizas-db)**: PostgreSQL 15 como motor de base de datos relacional

### Diagrama Arquitectónico

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│                │     │                │     │                │
│   Cliente      │━━━━▶│   polizas-app  │━━━━▶│   polizas-api  │━━━━▶┌────────────┐
│   (Navegador)  │     │   (Frontend)   │     │   (Backend)    │     │            │
│                │◀━━━━│   React + TS   │◀━━━━│   Spring Boot  │◀━━━━│ PostgreSQL │
│                │     │                │     │                │     │            │
└────────────────┘     └────────────────┘     └────────────────┘     └────────────┘
```

## Características Principales

- CRUD completo de pólizas, inventario y empleados
- Validación de datos en frontend y backend
- Manejo automático de inventario al crear o eliminar pólizas
- Paginación y ordenamiento de resultados
- Filtrado de datos
- Arquitectura Clean Architecture en el frontend
- Arquitectura en capas en el backend
- Contenerización con Docker
- Migraciones automáticas de base de datos con Flyway
- Documentación de API con OpenAPI (Swagger)

## Tecnologías Utilizadas

### Backend

- **Java 21**
- **Spring Boot 3.2.0**
- **Spring Data JPA** para acceso a datos
- **PostgreSQL** como base de datos
- **Flyway** para migraciones de base de datos
- **Lombok** para reducción de código boilerplate
- **OpenAPI/Swagger** para documentación de API

### Frontend

- **React 18** con **TypeScript**
- **Vite** como bundler y herramienta de desarrollo
- **React Router** para navegación
- **TanStack Query** (React Query) para gestión de estado y peticiones
- **Formik** y **Yup** para formularios y validación
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- **Zustand** para gestión de estado global

### Infraestructura

- **Docker** y **Docker Compose** para contenedores
- **Nginx** como servidor web para el frontend
- **GitHub** para control de versiones

## Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

### 1. polizas-api (Backend)

```
polizas-api/
├── src/
│   ├── main/
│   │   ├── java/com/polizas/
│   │   │   ├── config/         # Configuraciones de la aplicación
│   │   │   ├── controller/     # Controladores REST
│   │   │   ├── dto/            # Objetos de transferencia de datos
│   │   │   ├── exception/      # Manejo de excepciones
│   │   │   ├── model/          # Entidades JPA
│   │   │   ├── repository/     # Repositorios JPA
│   │   │   ├── service/        # Servicios de negocio
│   │   │   └── PolizasApiApplication.java  # Punto de entrada
│   │   └── resources/
│   │       ├── db/migration/   # Scripts de migración Flyway
│   │       ├── application.properties  # Configuración general
│   │       └── application-docker.properties  # Configuración para Docker
│   └── test/                   # Tests automatizados
├── Dockerfile                  # Configuración de Docker
├── pom.xml                     # Configuración Maven
└── mvnw                        # Maven wrapper
```

### 2. polizas-app (Frontend)

```
polizas-app/
├── src/
│   ├── assets/                 # Recursos estáticos
│   ├── core/
│   │   ├── application/        # Casos de uso
│   │   ├── domain/             # Entidades y modelos
│   │   └── infrastructure/     # Implementaciones técnicas
│   │       ├── api/            # Cliente HTTP y repositorios
│   │       └── toast/          # Sistema de notificaciones
│   ├── presentation/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── layouts/            # Estructuras de página
│   │   ├── pages/              # Páginas de la aplicación
│   │   ├── providers/          # Proveedores de contexto
│   │   └── router/             # Configuración de rutas
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Punto de entrada
├── Dockerfile                  # Configuración de Docker
├── index.html                  # HTML principal
├── tailwind.config.js          # Configuración de Tailwind
├── vite.config.ts              # Configuración de Vite
└── package.json                # Dependencias NPM
```

## Instalación y Ejecución

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo)
- Java 21 (para desarrollo)
- Maven (para desarrollo)

### Pasos para Ejecutar con Docker

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tuusuario/polizas-system.git
   cd polizas-system
   ```

2. Iniciar la aplicación con Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Acceder a la aplicación:
   - Frontend: http://localhost:3000
   - API Swagger: http://localhost:8080/api/v1/swagger-ui.html

### Desarrollo Local

#### Backend

1. Navegar a la carpeta del backend:

   ```bash
   cd polizas-api
   ```

2. Ejecutar la aplicación:
   ```bash
   ./mvnw spring-boot:run
   ```

#### Frontend

1. Navegar a la carpeta del frontend:

   ```bash
   cd polizas-app
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura de la Base de Datos

El sistema utiliza tres tablas principales:

1. **Inventario**: Almacena los productos disponibles

   - `sku` (PK): Identificador único del producto
   - `nombre`: Nombre del producto
   - `cantidad`: Cantidad disponible en inventario

2. **Empleado**: Almacena información de los empleados

   - `id_empleado` (PK): Identificador único del empleado
   - `nombre`: Nombre del empleado
   - `apellido`: Apellido del empleado
   - `puesto`: Puesto que ocupa el empleado

3. **Polizas**: Registra las pólizas de faltantes
   - `id_poliza` (PK): Identificador único de la póliza
   - `empleado_genero` (FK): ID del empleado responsable
   - `sku` (FK): SKU del producto
   - `cantidad`: Cantidad faltante
   - `fecha`: Fecha y hora del registro

### Diagrama Entidad-Relación

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   Inventario  │      │    Polizas    │      │   Empleado    │
├───────────────┤      ├───────────────┤      ├───────────────┤
│ sku (PK)      │◀─────│ id_poliza (PK)│      │ id_empleado(PK)│
│ nombre        │      │ sku (FK)      │─────▶│ nombre        │
│ cantidad      │      │ empleado_genero(FK)  │ apellido      │
└───────────────┘      │ cantidad      │◀─────│ puesto        │
                       │ fecha         │      └───────────────┘
                       └───────────────┘
```

## Documentación de API

La API REST expone los siguientes endpoints principales:

### Pólizas

- `GET /polizas` - Obtener todas las pólizas
- `GET /polizas/paginated` - Obtener pólizas paginadas con filtros
- `GET /polizas/{id}` - Obtener una póliza por ID
- `POST /polizas` - Crear una nueva póliza
- `PUT /polizas/{id}` - Actualizar una póliza existente
- `DELETE /polizas/{id}` - Eliminar una póliza

### Inventario

- `GET /inventario` - Obtener todo el inventario
- `GET /inventario/paginated` - Obtener inventario paginado
- `GET /inventario/{sku}` - Obtener un artículo por SKU
- `POST /inventario` - Crear un nuevo artículo
- `PUT /inventario/{sku}` - Actualizar un artículo existente
- `DELETE /inventario/{sku}` - Eliminar un artículo

### Empleados

- `GET /empleados` - Obtener todos los empleados
- `GET /empleados/{id}` - Obtener un empleado por ID
- `POST /empleados` - Crear un nuevo empleado
- `PUT /empleados/{id}` - Actualizar un empleado existente
- `DELETE /empleados/{id}` - Eliminar un empleado

Para más detalles, consultar la documentación Swagger en http://localhost:8080/api/v1/swagger-ui.html cuando la aplicación esté en ejecución.

## Flujo de Funcionamiento

1. **Creación de Póliza**: Al crear una póliza, se resta automáticamente la cantidad especificada del inventario y se asigna al empleado seleccionado.

2. **Eliminación de Póliza**: Al eliminar una póliza, se devuelve la cantidad al inventario.

3. **Actualización de Póliza**: Solo se permite actualizar el empleado asignado, para mantener la integridad de los datos de inventario.

## Contribuir al Proyecto

1. Crear un fork del repositorio
2. Crear una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Hacer commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Hacer push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Contacto

Para preguntas o soporte, contactar a:

- Email: oscargalvez812@gmail.com
- GitHub: [Nogthings](https://github.com/Nogthings)
