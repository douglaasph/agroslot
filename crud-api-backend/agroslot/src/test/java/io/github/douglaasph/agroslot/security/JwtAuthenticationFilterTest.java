
package io.github.douglaasph.agroslot.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import io.github.douglaasph.agroslot.model.User;
import io.github.douglaasph.agroslot.repository.UserRepository;
import io.github.douglaasph.agroslot.service.JwtService;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        filter = new JwtAuthenticationFilter(
                jwtService,
                userRepository
        );

        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

   @Test
void deveAutenticarRequisicaoComTokenValido() throws Exception {

    String token = "token-teste";
    String subject = "1";

    MockHttpServletRequest request =
            new MockHttpServletRequest();

    request.addHeader("Authorization", "Bearer " + token);

    MockHttpServletResponse response =
            new MockHttpServletResponse();

    MockFilterChain chain = new MockFilterChain();

    User user = new User();
    user.setId(1);
    user.setEmail("teste@agroslot.com");
    user.setPassword("hash-bcrypt-simulado");

    when(jwtService.extractSubject(token))
            .thenReturn(subject);

    when(userRepository.findById(1))
            .thenReturn(Optional.of(user));

    when(jwtService.isTokenValid(token, subject))
            .thenReturn(true);

    filter.doFilter(request, response, chain);

    Authentication authentication =
            SecurityContextHolder.getContext()
                    .getAuthentication();

    assertNotNull(authentication);
    assertEquals(subject, authentication.getName());

    verify(userRepository).findById(1);
}

    @Test
    void naoDeveAutenticarTokenInvalido() throws Exception {

        String token = "token-invalido";

        MockHttpServletRequest request =
                new MockHttpServletRequest();

        request.addHeader("Authorization", "Bearer " + token);

        MockHttpServletResponse response =
                new MockHttpServletResponse();

        MockFilterChain chain = new MockFilterChain();

        when(jwtService.extractSubject(token))
                .thenThrow(new IllegalArgumentException(
                        "Token inválido."
                ));

        filter.doFilter(request, response, chain);

        assertNull(
                SecurityContextHolder.getContext()
                        .getAuthentication()
        );

        verify(userRepository, never()).findById(1);
    }
}
