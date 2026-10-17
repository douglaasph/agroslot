package io.github.douglaasph.agroslot.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import io.github.douglaasph.agroslot.dto.auth.LoginRequest;
import io.github.douglaasph.agroslot.dto.auth.LoginResponse;
import io.github.douglaasph.agroslot.dto.auth.RegisterRequest;
import io.github.douglaasph.agroslot.dto.auth.RegisterResponse;
import io.github.douglaasph.agroslot.model.User;
import io.github.douglaasph.agroslot.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

     @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void deveCadastrarUsuarioComSenhaCriptografada() {

        RegisterRequest request = org.mockito.Mockito.mock(
                RegisterRequest.class
        );

        when(request.getNome()).thenReturn("Usuario Teste");
        when(request.getEmail()).thenReturn(" TESTE@AGROSLOT.COM ");
        when(request.getPassword()).thenReturn("Teste123!");

        when(userRepository.findByEmail("teste@agroslot.com"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("Teste123!"))
                .thenReturn("hash-bcrypt-simulado");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> {
                    User user = invocation.getArgument(0);
                    user.setId(1);
                    return user;
                });

        RegisterResponse response = authService.register(request);

        assertNotNull(response);

        ArgumentCaptor<User> captor =
                ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(captor.capture());

        User savedUser = captor.getValue();

        assertEquals("Usuario Teste", savedUser.getNome());
        assertEquals("teste@agroslot.com", savedUser.getEmail());
        assertEquals(
                "hash-bcrypt-simulado",
                savedUser.getPassword()
        );

        verify(passwordEncoder).encode("Teste123!");
    }

    @Test
    void deveRejeitarEmailJaCadastrado() {

        RegisterRequest request = org.mockito.Mockito.mock(
                RegisterRequest.class
        );

        when(request.getEmail())
                .thenReturn("duplicado@agroslot.com");

        when(userRepository.findByEmail("duplicado@agroslot.com"))
                .thenReturn(Optional.of(new User()));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register(request)
        );

        assertEquals(
                HttpStatus.CONFLICT.value(),
                exception.getStatusCode().value()
        );

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(
                org.mockito.ArgumentMatchers.anyString()
        );

    }

    @Test
        void deveRealizarLoginComCredenciaisValidas() {

        LoginRequest request = org.mockito.Mockito.mock(
                LoginRequest.class
        );

        when(request.getEmail()).thenReturn(" TESTE@AGROSLOT.COM ");
        when(request.getPassword()).thenReturn("Teste123!");

        User user = new User();
        user.setEmail("teste@agroslot.com");
        user.setPassword("hash-bcrypt-simulado");

        when(userRepository.findByEmail("teste@agroslot.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "Teste123!",
                "hash-bcrypt-simulado"
        )).thenReturn(true);

        when(jwtService.generateToken("teste@agroslot.com"))
                .thenReturn("jwt-teste");

        LoginResponse response = authService.login(request);

        assertEquals("jwt-teste", response.getAccessToken());
        assertEquals("Bearer", response.getTokenType());

        verify(jwtService).generateToken("teste@agroslot.com");
        }

        @Test
        void deveRejeitarSenhaIncorreta() {

        LoginRequest request = org.mockito.Mockito.mock(
                LoginRequest.class
        );

        when(request.getEmail()).thenReturn("teste@agroslot.com");
        when(request.getPassword()).thenReturn("SenhaErrada123!");

        User user = new User();
        user.setEmail("teste@agroslot.com");
        user.setPassword("hash-bcrypt-simulado");

        when(userRepository.findByEmail("teste@agroslot.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "SenhaErrada123!",
                "hash-bcrypt-simulado"
        )).thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(
                HttpStatus.UNAUTHORIZED.value(),
                exception.getStatusCode().value()
        );

        verify(jwtService, never())
                .generateToken("teste@agroslot.com");
        }
}
