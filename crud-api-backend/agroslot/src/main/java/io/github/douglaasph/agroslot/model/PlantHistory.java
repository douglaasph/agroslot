package io.github.douglaasph.agroslot.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "historico_planta")
@Getter 
@Setter 
@NoArgsConstructor
public class PlantHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "planta_id", nullable = false)
    private Plant planta;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @CreationTimestamp
    @Column(name = "upload_date", nullable = false, updatable = false)
    private LocalDateTime uploadDate;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "predicao")
    private Doencas predicao;

    @Column(name = "nivel_saude_predicao")
    private Float nivelSaudePredicao;
}
