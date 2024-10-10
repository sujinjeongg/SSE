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
        http
                .authorizeRequests()
                .anyRequest().permitAll()  // 모든 요청에 대해 인증 없이 허용
                .and()
                .csrf().disable();          // CSRF 보호 비활성화 (필요한 경우)
        return http.build();
    }
}
