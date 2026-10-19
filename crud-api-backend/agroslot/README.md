# Guia de inicialização

## 1. Visão geral

| Item | Valor |
|---|---|
| Linguagem / JVM | Java 21 |
| Framework | Spring Boot 4.1.1 (Web MVC, Data JPA, Security, Validation, Mail, Thymeleaf) |
| Build | Maven |
| Banco de dados | PostgreSQL 16 |
| Armazenamento de imagens | MinIO (S3 compatível) |
| Autenticação | JWT (stateless) |
| Porta padrão | `8080` |

Serviços de apoio ficam em `infra/` (Docker Compose): `infra/database` (Postgres) e `infra/bucket` (MinIO).

## 3. Pré-requisitos

- Git
- JDK 21
- Docker e Docker Compose
- Uma conta de e-mail com SMTP para testar cadastro e recuperação de senha (por exemplo, Gmail com senha de app). Opcional: sem SMTP a API sobe e funciona, apenas os e-mails falham.

## 4. Passo a passo

### 4.1 Clonar

```bash
git clone https://github.com/douglaasph/agroslot.git
cd agroslot
```

### 4.2 Subir o PostgreSQL

```bash
cd infra/database
docker compose up -d
```

Isso cria o banco com estas credenciais de desenvolvimento:

| Campo | Valor |
|---|---|
| Banco | `agroslot_db` |
| Usuário | `agroslot_user` |
| Senha | `agroslot_pass_dev` |
| Porta | `5432` |

O `schema.sql` é executado **apenas na primeira criação** do volume. A aplicação usa `spring.jpa.hibernate.ddl-auto=validate`, ou seja, o Hibernate não cria tabelas, só confere se o schema bate com as entidades. Para recriar o banco do zero:

```bash
docker compose down -v && docker compose up -d
```

### 4.3 Subir o MinIO e criar o bucket

```bash
cd ../bucket
docker compose up -d
```

| Campo | Valor |
|---|---|
| API | http://localhost:9000 |
| Console web | http://localhost:9001 |
| Usuário | `minioadmin` |
| Senha | `minioadmin123` |

**A aplicação não cria o bucket sozinha.** Abra o console, entre com as credenciais acima e crie um bucket chamado `agroslot.images` (ou o nome que você definir em `MINIO_BUCKET_NAME`). Sem ele, o upload de imagens falha.

Os dados do MinIO ficam em `infra/bucket/docs` (ignorado pelo git).

### 4.4 Configurar o `.env`

```bash
cd ../../crud-api-backend/agroslot
cp .env.example .env
```

A aplicação lê o arquivo `.env` **do diretório em que o comando de execução roda** (`spring.config.import=optional:file:.env[.properties]`). Por isso, rode sempre a partir de `crud-api-backend/agroslot`.

Valores sugeridos para desenvolvimento local, combinando com os containers acima:

```properties
DB_URL=jdbc:postgresql://localhost:5432/agroslot_db
DB_USER=agroslot_user
DB_PASSWORD=agroslot_pass_dev

MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=agroslot.images

APP_JWT_SECRET=<saída de: openssl rand -base64 48>
APP_JWT_EXPIRATION_MS=86400000

PASSWORD_RESET_SECRET=<saída de: openssl rand -base64 48>

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app
MAIL_FROM=nao-responda@ecoa.com

FRONTEND_URL=http://localhost:3000
JPA_SHOW_SQL=true
```

### 4.5 Executar a API

```bash
./mvnw spring-boot:run          # Linux / macOS
mvnw.cmd spring-boot:run        # Windows
```

A API estará em `http://localhost:8080`. Para gerar o JAR:

```bash
./mvnw clean package
java -jar target/agroslot-0.0.1-SNAPSHOT.jar   # rode da pasta que contém o .env
```

### 4.6 Conferir que subiu

```bash
curl -i -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Usuario de Teste","email":"teste@exemplo.com","password":"senha12345"}'
```

Resposta esperada: `201 Created` com `id`, `nome` e `email`. Se o SMTP estiver configurado, chega também o e-mail de boas-vindas.

## 5. Variáveis de ambiente

Sem valor padrão, a aplicação **não sobe** se faltar alguma destas:

| Variável | Para que serve |
|---|---|
| `DB_USER` | Usuário do Postgres |
| `DB_PASSWORD` | Senha do Postgres |
| `MINIO_ACCESS_KEY` | Access key do MinIO |
| `MINIO_SECRET_KEY` | Secret key do MinIO |
| `APP_JWT_SECRET` | Segredo de assinatura dos tokens de login (**Base64**, mínimo 32 bytes decodificados) |
| `PASSWORD_RESET_SECRET` | Segredo (HMAC-SHA256) do token do link de redefinição de senha |

Com valor padrão:

| Variável | Padrão | Observação |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/agroslot_db` | |
| `MINIO_URL` | `http://localhost:9000` | |
| `MINIO_BUCKET_NAME` | `agroslot.images` | Bucket precisa existir |
| `APP_JWT_EXPIRATION_MS` | `86400000` (24 h) | |
| `MAIL_HOST` / `MAIL_PORT` | `localhost` / `1025` | A aplicação força `auth` e `STARTTLS` no SMTP |
| `MAIL_USER` / `MAIL_PASSWORD` | vazio | |
| `MAIL_FROM` | `nao-responda@ecoa.com` | |
| `FRONTEND_URL` | `http://localhost:3000` | Única origem liberada no CORS e base do link de redefinição (`<FRONTEND_URL>/redefinir-senha?token=...`) |
| `JPA_SHOW_SQL` | `true` | |

## 6. Estrutura do código

```
crud-api-backend/agroslot/src/main/java/io/github/douglaasph/agroslot/
├── bucket/       upload e URL assinada (12 h) no MinIO; aceita apenas JPEG e PNG
├── config/       Security, CORS, MinIO, executor assíncrono de e-mail
├── controller/   AuthController (+ UserController na develop-task-13)
├── dto/          objetos de requisição/resposta
├── model/        User, Plantation, Plant, PlantHistory, EspeciePlanta
├── repository/   repositórios JPA
├── security/     JwtAuthenticationFilter
└── service/      AuthService, JwtService, SmtpEmailSender (+ UserService na develop-task-13)
```
