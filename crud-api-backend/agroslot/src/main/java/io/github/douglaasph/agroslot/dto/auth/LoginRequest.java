package io.github.douglaasph.agroslot.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
public class LoginRequest {

    @NotBlank(message = "O email é Obrigatório")
    @Email(message = "Informe um email Válido")
    private String email;

    @NotBlank(message = "A senha é Obrigatória")
    private String password;

}
