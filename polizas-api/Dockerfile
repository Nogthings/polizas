FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copiar archivos de Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Dar permisos de ejecución y descargar dependencias
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente
COPY src src

# Construir la aplicación
RUN ./mvnw package -DskipTests -Pproduction

# Imagen final
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar el JAR construido
COPY --from=build /app/target/*.jar app.jar

# Definir variables de entorno para Flyway
ENV SPRING_PROFILES_ACTIVE=azure

# Definir punto de entrada
ENTRYPOINT ["java", "-jar", "app.jar"]
