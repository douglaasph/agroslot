package io.github.douglaasph.agroslot.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.github.douglaasph.agroslot.dto.auth.ForgotPasswordRequest;
import io.github.douglaasph.agroslot.dto.auth.ForgotPasswordResponse;
import io.github.douglaasph.agroslot.dto.auth.ResetPasswordRequest;
import io.github.douglaasph.agroslot.model.User;
import io.github.douglaasph.agroslot.repository.UserRepository;

@Service
public class PasswordResetService {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(PasswordResetService.class);

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private static final String GENERIC_MESSAGE =
        "Se o email estiver cadastrado, você receberá as instruções para recuperar sua senha";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private final String frontendUrl;
    private final String mailFrom;
    private final long tokenTtlMinutes;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            @Value("${app.frontend-url:http://localhost:5173}")
            String frontendUrl,
            @Value("${app.mail-from:no-reply@agroslot.local}")
            String mailFrom,
            @Value("${app.password-reset-token-ttl-minutes:15}")
            long tokenTtlMinutes
    ) {
        if (tokenTtlMinutes < 1) {
            throw new IllegalArgumentException(
                "O prazo do token deve ser de pelo menos um minuto"
            );
        }

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
        this.mailFrom = mailFrom;
        this.tokenTtlMinutes = tokenTtlMinutes;
    }

    @Transactional
    public ForgotPasswordResponse requestPasswordReset(
            ForgotPasswordRequest request
    ) {
        String email = request.getEmail()
            .trim()
            .toLowerCase(Locale.ROOT);

        userRepository.findByEmail(email).ifPresent(user -> {
            Instant now = Instant.now();
            String rawToken = generateToken();

            user.setResetTokenHash(hashToken(rawToken));
            user.setResetTokenExpiresAt(
                now.plus(Duration.ofMinutes(tokenTtlMinutes))
            );

            userRepository.save(user);

            String resetLink =
                frontendUrl + "/recuperar-senha?token=" + rawToken;

            sendResetEmail(user, resetLink);
        });

        return new ForgotPasswordResponse(GENERIC_MESSAGE);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String tokenHash = hashToken(request.getToken());

        User user = userRepository
            .findByResetTokenHashForUpdate(tokenHash)
            .orElseThrow(this::invalidTokenException);

        Instant now = Instant.now();
        Instant expiresAt = user.getResetTokenExpiresAt();

        if (expiresAt == null || !expiresAt.isAfter(now)) {
            throw invalidTokenException();
        }

        user.setPassword(
            passwordEncoder.encode(request.getNewPassword())
        );

        user.setResetTokenHash(null);
        user.setResetTokenExpiresAt(null);

        userRepository.save(user);
    }

    private void sendResetEmail(User user, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject("Redefinição de senha — AgroSlot");
        message.setText(
            "Olá, " + user.getNome() + "!\n\n"
            + "Recebemos uma solicitação para redefinir a senha "
            + "da sua conta AgroSlot.\n\n"
            + "Acesse o link abaixo para cadastrar uma nova senha. "
            + "O link expira em " + tokenTtlMinutes + " minutos "
            + "e pode ser utilizado uma única vez:\n\n"
            + resetLink + "\n\n"
            + "Se você não solicitou essa alteração, ignore este e-mail.\n\n"
            + "Equipe AgroSlot"
        );

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            LOGGER.error(
                "Falha no envio do e-mail de recuperação de senha",
                exception
            );
        }
    }

    private String generateToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(randomBytes);
    }

    private String hashToken(String token) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                .digest(token.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                "Não foi possível calcular o hash do token",
                exception
            );
        }
    }

    private ResponseStatusException invalidTokenException() {
        return new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Token de redefinição inválido ou expirado"
        );
    }
}