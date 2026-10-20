package io.github.douglaasph.agroslot.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Locale;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.github.douglaasph.agroslot.dto.auth.LoginRequest;
import io.github.douglaasph.agroslot.dto.auth.LoginResponse;
import io.github.douglaasph.agroslot.dto.auth.RegisterRequest;
import io.github.douglaasph.agroslot.dto.auth.RegisterResponse;
import io.github.douglaasph.agroslot.model.User;
import io.github.douglaasph.agroslot.repository.UserRepository;

@Service
public class AuthService {
    private static final String PURPOSE = "password-reset";
    private static final String INVALID_LINK_MESSAGE = "Link inválido ou expirado.";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SmtpEmailSender smtpEmailSender;
    private final Algorithm resetAlgorithm;
    private final String frontendUrl;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            SmtpEmailSender smtpEmailSender,
            @Value("${app.password-reset.secret}") String resetSecret,
            @Value("${app.frontend-url}") String frontendUrl
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.smtpEmailSender = smtpEmailSender;
        this.resetAlgorithm = Algorithm.HMAC256(resetSecret);
        this.frontendUrl = frontendUrl;
    }

    public RegisterResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Um usuario com esse email já foi cadastrado."
            );
        }

        User user = new User();
        user.setNome(request.getNome());
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        smtpEmailSender.sendWelcome(
                savedUser.getEmail(),
                savedUser.getNome()
        );

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getNome(),
                savedUser.getEmail()
        );
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha inválidos."
                ));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha inválidos."
                );
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(token, "Bearer");
        }

    public void requestPasswordReset(String email) {
        userRepository.findByEmail(normalize(email)).ifPresent(user -> {
            String token = JWT.create()
                    .withSubject(user.getEmail())
                    .withClaim("purpose", PURPOSE)
                    .withClaim("fp", fingerprint(user.getPassword()))
                    .withExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                    .sign(resetAlgorithm);

            String link = frontendUrl + "/redefinir-senha?token=" + token;
            smtpEmailSender.sendPasswordReset(user.getEmail(), user.getNome(), link);
        });
    }
    @Transactional
    public void resetPassword(String token, String newPassword) {
        DecodedJWT jwt;
        try {
            jwt = JWT.require(resetAlgorithm)
                    .withClaim("purpose", PURPOSE)
                    .build()
                    .verify(token); // valida assinatura e expiração
        } catch (JWTVerificationException e) {
            throw invalidLink();
        }

        User user = userRepository.findByEmail(jwt.getSubject())
                .orElseThrow(this::invalidLink);

        if (!fingerprint(user.getPassword()).equals(jwt.getClaim("fp").asString())) {
            throw invalidLink();
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private ResponseStatusException invalidLink() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_LINK_MESSAGE);
    }

    private String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String fingerprint(String passwordHash) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(passwordHash.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest).substring(0, 16);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

}
