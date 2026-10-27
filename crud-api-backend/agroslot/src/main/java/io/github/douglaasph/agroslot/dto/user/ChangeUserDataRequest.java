package io.github.douglaasph.agroslot.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeUserDataRequest {
    @Size(max = 255,min = 0, message = "O nome deve ter no máximo 255 caracteres")
    private String nome;

    @Email(message = "O email deve ser Válido")
    @Size(max = 255, message = "O email deve ter no máximo 255 caracteres")
    private String email;
}
