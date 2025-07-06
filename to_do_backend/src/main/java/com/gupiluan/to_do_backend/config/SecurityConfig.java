package com.gupiluan.to_do_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security configuration for the ToDo application.
 * Implements basic security measures including CORS, security headers, and CSRF
 * protection.
 * 
 * @author gupiluan
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures the security filter chain with appropriate security measures.
     * Currently allows all requests but adds security headers for protection.
     * 
     * @param http the HttpSecurity configuration
     * @return configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for API endpoints (stateless)
                .csrf(csrf -> csrf.disable())

                // Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configure session management (stateless for API)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configure authorization (currently permissive for development)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/todos-doc/**", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        .requestMatchers("/todos/**").permitAll()
                        .anyRequest().authenticated())

                // Add security headers
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.deny())
                        .contentTypeOptions(contentTypeOptions -> {
                        })
                        .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                                .maxAgeInSeconds(31536000)
                                .includeSubDomains(true))
                        .referrerPolicy(referrerPolicy -> referrerPolicy
                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)));

        return http.build();
    }

    /**
     * Configures CORS settings for cross-origin requests.
     * Restricts allowed origins, methods, and headers for security.
     * 
     * @return CorsConfigurationSource with security-focused CORS settings
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow specific origins (should be configured per environment)
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000", // React development server
                "http://localhost:8080", // Alternative frontend port
                "http://127.0.0.1:*" // Local development
        ));

        // Allow specific HTTP methods
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Allow specific headers
        configuration.setAllowedHeaders(List.of(
                "Authorization", "Content-Type", "X-Requested-With"));

        // Allow credentials if needed for authentication
        configuration.setAllowCredentials(true);

        // Cache preflight response
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
