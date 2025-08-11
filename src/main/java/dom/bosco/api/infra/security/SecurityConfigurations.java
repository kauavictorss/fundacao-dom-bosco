package dom.bosco.api.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Use BCrypt para armazenar/verificar senhas
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Como você controla sessão manualmente, pode liberar tudo por enquanto:
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/", "/login", "/logout",
                                "/css/**", "/js/**", "/img/**", "/style.css", "/webjars/**"
                        ).permitAll()
                        .anyRequest().permitAll() // ou .authenticated() se quiser proteger e integrar
                )
                // Desabilita form login padrão do Spring Security (você já possui a sua tela/fluxo)
                .formLogin(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable) // Se você usa apenas POST simples no mesmo domínio, pode manter desabilitado
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}