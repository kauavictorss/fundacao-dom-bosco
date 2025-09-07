# Imagem base com Java 21
FROM eclipse-temurin:21-jdk

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia o JAR gerado para dentro do container
COPY target/*.jar app.jar

# Porta que o Render vai usar
EXPOSE 8081

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
