package io.github.douglaasph.agroslot.controller;

import io.github.douglaasph.agroslot.dto.user.ChangePasswordRequest;
import io.github.douglaasph.agroslot.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.resetPassword(
                authentication.getName(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        return ResponseEntity.noContent().build();
    }
}
