package io.github.douglaasph.agroslot.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(length = 500)
    private String foto;

    @Column(name = "upload_date", nullable = false, insertable = false, updatable = false)
    private LocalDateTime uploadDate;

    private String predicao;

    @Column(name = "nivel_saude_predicao")
    private Float nivelSaudePredicao;
}
