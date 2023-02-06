FROM openjdk:17-alpine
RUN addgroup -S spring && adduser -S spring -G spring
VOLUME /tmp
EXPOSE 8080
ADD target/apex_service.jar apex_service.jar
ENTRYPOINT ["java", "-jar", "/apex_service.jar"]