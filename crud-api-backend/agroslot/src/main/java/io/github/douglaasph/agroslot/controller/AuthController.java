package io.github.douglaasph.agroslot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.douglaasph.agroslot.dto.auth.ForgotPasswordRequest;
import io.github.douglaasph.agroslot.dto.auth.ForgotPasswordResponse;
import io.github.douglaasph.agroslot.dto.auth.LoginRequest;
import io.github.douglaasph.agroslot.dto.auth.LoginResponse;
import io.github.douglaasph.agroslot.dto.auth.RegisterRequest;
import io.github.douglaasph.agroslot.dto.auth.RegisterResponse;
import io.github.douglaasph.agroslot.dto.auth.ResetPasswordRequest;
import io.github.douglaasph.agroslot.service.AuthService;
import io.github.douglaasph.agroslot.service.PasswordResetService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(
            AuthService authService,
            PasswordResetService passwordResetService
    ) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody RegisterRequest request
    ) {
        RegisterResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        ForgotPasswordResponse response =
                passwordResetService.requestPasswordReset(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        passwordResetService.resetPassword(request);

        return ResponseEntity.ok().build();
    }
}