package io.github.douglaasph.agroslot.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.signingKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );
        this.expirationMs = expirationMs;
    }

    // Gera um token JWT pro user
    public String generateToken(String email) {

        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    // Extrai o e-mail do suer partir do token
    public String extractSubject(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Verifica a assinatura, a validade e o user do token
    public boolean isTokenValid(String token, String email) {
        try {
            Claims claims = extractAllClaims(token);

            Date expiration = claims.getExpiration();

            return email.equals(claims.getSubject())
                    && expiration != null
                    && expiration.after(new Date());

        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }

    // Lê as informações de um token e analisa a assinatura 
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
