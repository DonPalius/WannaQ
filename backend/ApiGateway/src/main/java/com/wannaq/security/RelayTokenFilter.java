/*
package com.wannaq.security;

import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

import java.nio.file.AccessDeniedException;

public class RelayTokenFilter implements GlobalFilter {
    final Logger LOG = LoggerFactory.getLogger(RelayTokenFilter.class);
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        LOG.debug("--- NEW REQUEST ---");
        LOG.debug("--- PRINTING HEADERS ---");
        exchange.getRequest().getHeaders().forEach(
                (key,value)->LOG.debug(String.format("Header '%s' = %s", key, value))
        );
        exchange.getResponse().getHeaders().add("Access-Control-Allow-Origin", "*");
        return ReactiveSecurityContextHolder.getContext()
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
//                    LOG.info(jwt.getDetails().toString());

                    ServerHttpRequest request = exchange.getRequest().mutate()
                            .header("x-user", user).build();
                    return chain.filter(exchange.mutate().request(request).build());
                });
    }
}
*/
