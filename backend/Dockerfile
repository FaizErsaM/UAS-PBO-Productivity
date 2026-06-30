# ================================
# Stage 1: Build
# ================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml dulu (cache dependencies)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code lalu build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ================================
# Stage 2: Run
# ================================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy JAR dari stage builder
COPY --from=builder /app/target/*.jar app.jar

# Port yang diekspos (sesuai server.port di application.properties)
EXPOSE 8081

# Jalankan aplikasi
ENTRYPOINT ["java", "-jar", "app.jar"]
