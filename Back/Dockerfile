# Etapa 1: Compilación
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# NOTA: Al dejar el Root Directory vacío en Render, 
# tenemos que decirle a Docker la ruta completa desde la raíz del repo.
COPY Back/Back/pom.xml .
RUN mvn dependency:go-offline -B

COPY Back/Back/src ./src
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Etapa 2: Ejecución
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Límites de memoria para el plan gratuito
ENTRYPOINT ["java", "-Xmx300m", "-Xms300m", "-jar", "app.jar"]