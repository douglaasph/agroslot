package io.github.douglaasph.agroslot.service;

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
    public void resetPassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Não existe um usuário com este email cadastrado."
        ));

        if (user.getPassword().equals(currentPassword)) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        };
    }
}
