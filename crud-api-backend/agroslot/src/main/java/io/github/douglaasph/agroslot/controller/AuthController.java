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
import io.github.douglaasph.agroslot.service.AuthService;


@RestController 
@RequestMapping("/auth")

//classe responspavel por receber as requisitções http de autenticação e orientar elas pro caminho correto
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    //define a rota de cadastro 
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            //requestbody permite o string oconverter o json em objeto
            @RequestBody RegisterRequest request
    ) {
        RegisterResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    //definicao da rota d elogin
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    //endopoint para recuperar senha
    //a ideia é pegar o email do user e enviar um email para ele com o link pra rec
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {
        ForgotPasswordResponse response =
                authService.forgotPassword(request);

        return ResponseEntity.ok(response);
    }


}
