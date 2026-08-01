# EduStream

Plataforma de streaming de cursos em vídeo, no estilo Netflix/Masterclass — instrutores publicam cursos organizados em módulos e aulas, alunos se matriculam, assistem no seu ritmo e recebem um certificado com validação pública ao concluir.

Projeto full-stack construído do zero: backend em Spring Boot (autenticação JWT stateless, RBAC, paginação, integridade referencial) e frontend em Next.js/TypeScript (App Router, shadcn/ui, gráficos com Recharts).

## Funcionalidades

**Aluno**
- Catálogo de cursos paginado, com matrícula em um clique
- Currículo do curso (módulos → aulas) com acompanhamento de progresso
- Player de aula com embed do YouTube
- Certificado emitido automaticamente ao concluir 100% do curso, com página pública de validação por hash

**Instrutor**
- Dashboard com métricas (total de alunos, taxa de conclusão média, cursos publicados) e gráfico de alunos matriculados por curso
- CRUD completo de cursos, módulos e aulas
- Pré-visualização automática da thumbnail do vídeo ao colar a URL (via oEmbed do YouTube), antes de salvar a aula
- Visão dos alunos matriculados em cada curso, com progresso individual

**Plataforma**
- Autenticação JWT 100% stateless — nenhuma sessão guardada no servidor, papéis (aluno/instrutor) resolvidos a cada requisição
- RBAC reforçado em duas camadas: `@PreAuthorize` + checagem de dono do recurso no backend, e guarda de rota por papel no frontend
- Validação de entrada em todos os endpoints de escrita (Bean Validation)
- Integridade referencial: exclusão de curso/módulo/aula é bloqueada (409, não erro de banco) se já existir progresso de aluno associado

## Stack

| Camada | Tecnologias |
|---|---|
| Backend | Java 17, Spring Boot 4, Spring Security 7, Spring Data JPA (Hibernate 7), PostgreSQL, JWT (`auth0/java-jwt`) |
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), Recharts, axios |

## Arquitetura

```
frontend (Next.js, porta 3000)  ──HTTP/JWT──▶  backend (Spring Boot, porta 8080)  ──JDBC──▶  PostgreSQL
```

- O backend não emite cookie de sessão; o token JWT é devolvido no login e enviado pelo client no header `Authorization: Bearer <token>` em toda requisição autenticada.
- O JWT carrega só `sub`/`iss`/`exp` — os papéis do usuário (`ROLE_STUDENT`/`ROLE_INSTRUCTOR`) são resolvidos do banco a cada requisição, nunca confiados cegamente no conteúdo do token.
- Autorização de "dono do recurso" (ex.: só o instrutor dono de um curso pode editá-lo) é verificada na camada de serviço, não só pelo papel — um instrutor não gerencia curso de outro instrutor.

## Rodando localmente

### Pré-requisitos
- Java 17+ e PostgreSQL rodando localmente
- Node.js 20+

### Backend

```bash
cd backend
```

Crie `src/main/resources/application-local.properties` a partir do `application-local.properties.example` (mesma pasta) e preencha com as credenciais do seu Postgres local e um valor qualquer para `jwt.secret` (qualquer string longa serve em dev).

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

A API sobe em `http://localhost:8080`.

### Frontend

```bash
cd frontend
cp .env.example .env.local   # já aponta pra http://localhost:8080/api por padrão
npm install
npm run dev
```

A aplicação sobe em `http://localhost:3000`.

## Estrutura do repositório

```
backend/    API REST (Spring Boot) — controllers, services, repositories, entidades JPA
frontend/   Next.js App Router — rotas em app/, camada de serviços em lib/, tipos em types/
```

## Licença

Distribuído sob a licença MIT — veja [LICENSE](LICENSE).
