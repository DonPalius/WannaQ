FROM openjdk:17-alpine
RUN addgroup -S spring && adduser -S spring -G spring
VOLUME /tmp
EXPOSE 8080
ADD target/league_service.jar league_service.jar
ENTRYPOINT ["java", "-jar", "/league_service.jar"]