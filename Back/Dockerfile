# Etapa 1: Build
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Ahora que el Root Directory es Back/Back, el archivo está en la raíz actual
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Etapa 2: Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
# Límites de memoria para evitar que Render mate el proceso
ENTRYPOINT ["java", "-Xmx300m", "-Xms300m", "-jar", "app.jar"]