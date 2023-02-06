package com.wannaq.security;

import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.nio.file.AccessDeniedException;
import java.util.Arrays;


@Configuration
@EnableWebFluxSecurity
public class ResourceServerConfig {
    final Logger LOG = LoggerFactory.getLogger(ResourceServerConfig.class);
    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http){
        http
                .cors().and()
                .addFilterBefore((exchange, chain) ->
                        ReactiveSecurityContextHolder.getContext()
                                .filter(c -> c.getAuthentication()!= null)
                                .flatMap(c -> {

                                    JwtAuthenticationToken jwt =
                                            (JwtAuthenticationToken) c.getAuthentication();

                                    String user = jwt.getName();


                                    if (Strings.isEmpty(user)){
                                        return Mono.error(new AccessDeniedException("Invalid Token."));
                                    }
                                    LOG.info(user);
                                    LOG.info(jwt.getAuthorities().toString());
                                    LOG.info(jwt.getCredentials().toString());
                                    ServerHttpRequest request = exchange.getRequest().mutate()
                                            .header("x-user", user).build();


                                    return chain.filter(exchange.mutate().request(request).build());
                                }), SecurityWebFiltersOrder.LAST)

                .authorizeExchange().anyExchange().authenticated()
                .and()
                .oauth2ResourceServer().jwt();
        return http.build();
    }


    @Bean
    public CorsWebFilter corsConfiguration(){
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.applyPermitDefaultValues();
        corsConfiguration.addAllowedMethod(HttpMethod.GET);
        corsConfiguration.addAllowedMethod(HttpMethod.PUT);
        corsConfiguration.addAllowedMethod(HttpMethod.DELETE);
        corsConfiguration.addAllowedMethod(HttpMethod.POST);
        corsConfiguration.addAllowedMethod(HttpMethod.OPTIONS);
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:3000/",
                "https://getpostman.com",
                "https://wannaq.me/",
                "http://wannaq.me/"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("DNT",
                "X-CustomHeader",
                "X-LANG,Keep-Alive",
                "User-Agent",
                "X-Requested-With",
                "If-Modified-Since",
                "Cache-Control",
                "Content-Type",
                "X-Api-Key",
                "X-Device-Id",
                "Access-Control-Allow-Origin"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsWebFilter(source);
    }
/*    @Bean
    public GlobalFilter relayToken(){
        return new RelayTokenFilter();
    }*/

}
