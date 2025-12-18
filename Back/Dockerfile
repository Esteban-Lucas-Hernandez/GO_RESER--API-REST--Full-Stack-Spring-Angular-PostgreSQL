# Etapa 1: Build (Usamos Maven 3.9.5 que es la más estable en Docker para Java 21)
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos archivos de configuración
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código y compilamos
COPY src ./src
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Etapa 2: Runtime (Java 21 corregido)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copiamos el JAR generado
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# IMPORTANTE: Limitamos la memoria a 300MB para que no falle en el plan gratuito de Render
ENTRYPOINT ["java", "-Xmx300m", "-Xms300m", "-jar", "app.jar"]