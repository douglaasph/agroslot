
package io.github.douglaasph.agroslot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import io.github.douglaasph.agroslot.repository.UserRepository;
import io.github.douglaasph.agroslot.security.JwtAuthenticationFilter;
import io.github.douglaasph.agroslot.service.JwtService;
import jakarta.servlet.DispatcherType;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtService jwtService,
            UserRepository userRepository
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            // Não mantém sessão HTTP p authenticacao
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            //Define as permissões das rotas
            .authorizeHttpRequests(auth -> auth
            // Permite que o Spring processe erros da aplicação
            .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()

            // Rotas públicas de autenticação
            .requestMatchers(
                HttpMethod.POST,
                "/auth/register",
                "/auth/login",
                "/auth/forgot-password"
            ).permitAll()

            // Demais requisições exigem autenticaçãoj
            .anyRequest().authenticated()
        )

            //desativar os mecanismos de login padrão
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())
            .addFilterBefore(
                new JwtAuthenticationFilter(jwtService, userRepository),
                UsernamePasswordAuthenticationFilter.class
);

        return http.build();
    }
}
