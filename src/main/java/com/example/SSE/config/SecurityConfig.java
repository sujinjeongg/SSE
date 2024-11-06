//첫 로그인 페이지 비활성화

package com.example.SSE.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable());

        // 권한 설정
        http
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/ws/**").permitAll()  // "/ws/**" 경로에 대해 인증 요구하지 않음
                        .anyRequest().authenticated()           // 그 외 경로는 인증 필요
                );

        return http.build();
    }
}
