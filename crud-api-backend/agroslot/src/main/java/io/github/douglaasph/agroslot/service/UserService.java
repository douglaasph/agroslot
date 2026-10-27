package io.github.douglaasph.agroslot.service;

import io.github.douglaasph.agroslot.dto.user.ChangeUserDataResponse;
import io.github.douglaasph.agroslot.dto.user.GetMeResponse;
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

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void resetPassword(String userId, String currentPassword, String newPassword) {
        User user = findUser(userId);

        if (passwordEncoder.matches(currentPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha atual incorreta.");
        }
        ;
    }

    @Transactional
    public ChangeUserDataResponse changeData(String userId, String newEmail, String nome) {
        User user = findUser(userId);

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

        userRepository.save(user);
        return new ChangeUserDataResponse(user.getNome(), user.getEmail());
    }

    public GetMeResponse findMe(String userId) {
        User meComplete = this.findUser(userId);
        return new GetMeResponse(meComplete.getNome(), meComplete.getEmail());
    }

    public User findUserById(String userId) {
        return findUser(userId);
    }

    private User findUser(String userId) {
        return userRepository.findById(Integer.parseInt(userId)).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Não existe um usuário com este email cadastrado."));
    }
}
