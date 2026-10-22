CREATE TYPE especie_planta AS ENUM ('SOJA');

CREATE TABLE usuarios (
    id                       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome                     VARCHAR(255) NOT NULL,
    email                    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE plantacao (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome       VARCHAR(255) NOT NULL,
    capacidade INT NOT NULL CHECK (capacidade >= 0),
    user_id    INT NOT NULL,
    colunas    INT NOT NULL CHECK (colunas > 0),
    linhas     INT NOT NULL CHECK (linhas > 0),
    CONSTRAINT fk_plantacao_usuario
        FOREIGN KEY (user_id) REFERENCES usuarios (id)
        ON DELETE CASCADE
);

CREATE TABLE plantas (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    especie      especie_planta NOT NULL DEFAULT 'SOJA',
    nome         VARCHAR(255) NOT NULL,
    posicao_x    INT NOT NULL,
    posicao_y    INT NOT NULL,
    plantacao_id INT NOT NULL,
    CONSTRAINT fk_plantas_plantacao
        FOREIGN KEY (plantacao_id) REFERENCES plantacao (id)
        ON DELETE CASCADE,
    CONSTRAINT uq_plantas_posicao UNIQUE (plantacao_id, posicao_x, posicao_y)
);

CREATE TABLE historico_planta (
    id                   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    planta_id            INT NOT NULL,
    foto                 VARCHAR(500),
    upload_date          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    predicao             VARCHAR(255),
    nivel_saude_predicao REAL,
    CONSTRAINT fk_historico_planta
        FOREIGN KEY (planta_id) REFERENCES plantas (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_plantacao_user_id      ON plantacao (user_id);
CREATE INDEX idx_historico_planta_id    ON historico_planta (planta_id);
