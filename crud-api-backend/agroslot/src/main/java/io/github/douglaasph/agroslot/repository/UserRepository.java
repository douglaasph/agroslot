package io.github.douglaasph.agroslot.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.github.douglaasph.agroslot.model.User;
import jakarta.persistence.LockModeType;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM User u WHERE u.resetTokenHash = :tokenHash")
    Optional<User> findByResetTokenHashForUpdate(
            @Param("tokenHash") String tokenHash
    );
}