package io.github.douglaasph.agroslot.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor  
public class RegisterRequest {

    @NotBlank(message = "O nome é Obrigatório")
    @Size(max = 255,min = 10, message = "O nome deve ter no máximo 255 caracteres")
    private String nome;

    @NotBlank (message = "O email é Obrigatório")
    @Email(message = "O email deve ser Válido")
    @Size(max = 255, message = "O email deve ter no máximo 255 caracteres")
    private String email;

    @NotBlank (message = "A senha é Obrigatória")
    @Size(max = 6, min = 12, message = "A senha deve ter no máximo 255 caracteres")
    private String password;
    
}
