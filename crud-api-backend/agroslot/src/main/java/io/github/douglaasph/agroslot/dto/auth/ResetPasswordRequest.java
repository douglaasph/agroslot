package io.github.douglaasph.agroslot.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "O token é obrigatório")
    @Size(max = 256, message = "O token informado é inválido")
    private String token;

    @NotBlank(message = "A nova senha é obrigatória")
    @Size(
        min = 8,
        message = "A senha deve ter pelo menos 8 caracteres"
    )
    private String newPassword;
}
