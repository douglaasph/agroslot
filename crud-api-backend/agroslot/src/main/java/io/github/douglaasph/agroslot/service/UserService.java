package io.github.douglaasph.agroslot.service;

import io.github.douglaasph.agroslot.dto.user.ChangeUserDataResponse;
import io.github.douglaasph.agroslot.model.User;
import io.github.douglaasph.agroslot.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public void resetPassword(String email, String currentPassword, String newPassword) {
        User user = findUser(email);

        if (user.getPassword().equals(currentPassword)) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        };
    }

    @Transactional
    public ChangeUserDataResponse changeData(String currentEmail, String newEmail, String nome) {
        User user = findUser(currentEmail);

        if (newEmail != null && !newEmail.isBlank()) {
            String normalized = newEmail.trim().toLowerCase();
            if (!normalized.equals(user.getEmail()) && userRepository.existsByEmail(normalized)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Este email já está em uso.");
            }
            user.setEmail(normalized);
        }
        if (nome != null && !nome.isBlank()) {
            user.setNome(nome.trim());
        }

        String token = jwtService.generateToken(user.getEmail());

        return new ChangeUserDataResponse(user.getNome(), user.getEmail(), token, "Bearer");
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Não existe um usuário com este email cadastrado."
        ));
    }
}
