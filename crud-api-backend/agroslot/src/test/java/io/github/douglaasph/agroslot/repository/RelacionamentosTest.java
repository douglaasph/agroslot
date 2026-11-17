package io.github.douglaasph.agroslot.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import io.github.douglaasph.agroslot.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RelacionamentosTest {

    @Autowired UserRepository usuarioRepo;
    @Autowired PlantationRepository plantacaoRepo;
    @Autowired PlantRepository plantaRepo;
    @Autowired PlantHistoryRepository historicoRepo;

    @PersistenceContext EntityManager em;

    private User criarUsuario() {
        User u = new User();
        u.setNome("Teste");
        u.setEmail(UUID.randomUUID() + "@teste.com");
        u.setPassword("123");
        return usuarioRepo.saveAndFlush(u);
    }

    private Plantation criarPlantacao(User u) {
        Plantation pl = new Plantation();
        pl.setNome("Lote 1");
        pl.setCapacidade(10);
        pl.setColunas(5);
        pl.setLinhas(2);
        pl.setUsuario(u);
        return plantacaoRepo.saveAndFlush(pl);
    }

    private Plant criarPlanta(Plantation pl, int x, int y) {
        Plant p = new Plant();
        p.setNome("Soja " + x + "-" + y);
        p.setPosicaoX(x);
        p.setPosicaoY(y);
        p.setPlantacao(pl);
        return plantaRepo.saveAndFlush(p);
    }

    private PlantHistory criarHistorico(Plant p) {
        PlantHistory h = new PlantHistory();
        h.setPlanta(p);
        h.setPredicao(Doencas.PLANTA_SAUDAVEL);
        h.setNivelSaudePredicao(0.95f);
        return historicoRepo.saveAndFlush(h);
    }

    @Test
    void deveSalvarELerACadeiaCompleta() {
        User u = criarUsuario();
        Plantation pl = criarPlantacao(u);
        Plant p = criarPlanta(pl, 0, 0);
        criarHistorico(p);

        Integer usuarioId = u.getId();
        Integer plantacaoId = pl.getId();
        Integer plantaId = p.getId();

        // Limpa o cache para forcar a leitura real do banco
        em.clear();

        assertEquals(1, plantacaoRepo.findByUsuarioId(usuarioId).size());

        var plantas = plantaRepo.findByPlantacaoId(plantacaoId);
        assertEquals(1, plantas.size());
        assertEquals(EspeciePlanta.SOJA, plantas.get(0).getEspecie());

        var historico = historicoRepo.findByPlantaIdOrderByUploadDateDesc(plantaId);
        assertEquals(1, historico.size());
        // upload_date e preenchido pelo DEFAULT do banco
        assertNotNull(historico.get(0).getUploadDate());
    }

    @Test
    void naoDevePermitirDuasPlantasNaMesmaPosicao() {
        Plantation pl = criarPlantacao(criarUsuario());
        criarPlanta(pl, 1, 1);

        assertThrows(DataIntegrityViolationException.class, () -> criarPlanta(pl, 1, 1));
    }

    @Test
    void bancoNaoDevePermitirPlantaComPlantacaoInexistente() {
        // SQL direto, para testar a FK do banco sem passar pelas regras do Java
        assertThrows(Exception.class, () ->
            em.createNativeQuery(
                "INSERT INTO plantas (nome, posicao_x, posicao_y, plantacao_id) "
              + "VALUES ('Orfa', 0, 0, -1)"
            ).executeUpdate()
        );
    }

    @Test
    void deveApagarEmCascataAoRemoverUsuario() {
        User u = criarUsuario();
        Plantation pl = criarPlantacao(u);
        Plant p = criarPlanta(pl, 0, 0);
        criarHistorico(p);

        Integer usuarioId = u.getId();
        Integer plantacaoId = pl.getId();
        Integer plantaId = p.getId();

        em.flush();
        em.createNativeQuery("DELETE FROM usuarios WHERE id = ?1")
          .setParameter(1, usuarioId)
          .executeUpdate();
        em.clear();

        assertTrue(plantacaoRepo.findByUsuarioId(usuarioId).isEmpty());
        assertTrue(plantaRepo.findByPlantacaoId(plantacaoId).isEmpty());
        assertTrue(historicoRepo.findByPlantaIdOrderByUploadDateDesc(plantaId).isEmpty());
    }
}
