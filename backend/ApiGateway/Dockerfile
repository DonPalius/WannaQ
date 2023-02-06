FROM openjdk:17-alpine
RUN addgroup -S spring && adduser -S spring -G spring
VOLUME /tmp
EXPOSE 8080
ADD target/api_gateway.jar api_gateway.jar
ENTRYPOINT ["java", "-jar", "/api_gateway.jar"]