package com.edustream.api.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.edustream.api.domain.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class TokenService {
    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(User user){
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            Instant dataExpiracao = Instant.now().plus(Duration.ofHours(2));

            return JWT.create()
                    .withIssuer("edustream-api")
                    .withSubject(user.getEmail())
                    .withExpiresAt(dataExpiracao)
                    .sign(algoritmo);
        }catch(JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar o token de autenticação: ",exception);
        }
    }

    public String validateToken(String token){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT jwt = JWT.require(algorithm).withIssuer("edustream-api").build().verify(token);
            return jwt.getSubject();

        } catch (JWTVerificationException e) {
            return null;
        }

    }
}
