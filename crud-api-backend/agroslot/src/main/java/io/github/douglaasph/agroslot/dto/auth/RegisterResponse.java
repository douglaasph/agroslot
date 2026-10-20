package io.github.douglaasph.agroslot.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter 
@AllArgsConstructor 
public class RegisterResponse {
    private Integer id;
    private String nome;
    private String email;
    
}
