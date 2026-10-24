package io.github.douglaasph.agroslot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.github.douglaasph.agroslot.model.Plantation;

public interface PlantationRepository extends JpaRepository<Plantation, Integer> {

    List<Plantation> findByUsuarioId(Integer userId);

    Optional<Plantation> findByIdAndUsuarioId(Integer id, Integer userId);
}
