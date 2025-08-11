package dom.bosco.api.infra.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Configurar página padrão para a raiz
        registry.addViewController("/").setViewName("redirect:/login.html");
        // Garantir que login.html seja servido corretamente
        registry.addViewController("/login").setViewName("redirect:/login.html");
    }
}
