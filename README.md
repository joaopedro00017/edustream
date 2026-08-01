# EduStream

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-brightgreen)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Plataforma de streaming de cursos em vídeo, no estilo Netflix/Masterclass — instrutores publicam cursos organizados em módulos e aulas, alunos se matriculam, assistem no seu ritmo e recebem um certificado com validação pública ao concluir.

![Home da EduStream](snapshots/01-home.png)

## Sobre o projeto

Projeto full-stack construído do zero, ponta a ponta: autenticação, autorização, modelagem de dados, integridade referencial, interface e observabilidade básica de uso. Não é um CRUD de exemplo — o sistema já passou por uma rodada de correção de bugs reais (não só estéticos) e uma auditoria de segurança dedicada, ambas descritas mais abaixo.

## Sumário
- [Como este projeto foi construído](#como-este-projeto-foi-construído)
- [Competências técnicas demonstradas](#competências-técnicas-demonstradas)
- [Funcionalidades](#funcionalidades)
- [Capturas de tela](#capturas-de-tela)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Rodando localmente](#rodando-localmente)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Licença](#licença)

## Como este projeto foi construído

Transparência sobre o processo, porque acho que isso também é parte do currículo:

- **O backend (Spring Boot) foi escrito por mim**, do zero — modelagem, autenticação JWT, autorização, regras de negócio.
- **O frontend (Next.js) foi construído com o Claude Code**, como forma de acelerar a entrega mantendo o padrão de qualidade — eu direcionei arquitetura, revisei cada tela e testei o fluxo real (não só aceitei o que foi gerado).
- **Depois de "pronto", o projeto inteiro passou por uma auditoria dedicada** (também com Claude Code, mas comandada e revisada por mim) caçando falha de segurança e bug funcional — não só formatação de código. Alguns achados reais dessa rodada, pra deixar concreto:
  - Certificado sendo **emitido em duplicidade** toda vez que um aluno reabria uma aula já concluída (bug de lógica, não de segurança).
  - **Nenhum endpoint de escrita tinha validação de entrada** no backend — dava pra cadastrar com senha de 1 caractere ou e-mail sem `@` direto pela API, ignorando as checagens do formulário.
  - Uma exceção crua vazando como erro 500 genérico quando o usuário de um token JWT válido já tinha sido removido do banco.
  - Dependências do frontend com CVEs conhecidas publicadas (corrigido antes de qualquer deploy).
  - Até uma métrica exibindo **"6000%"** no dashboard do instrutor — bug de unidade (percentual sendo multiplicado por 100 duas vezes), achado literalmente ao tirar os prints pra este README.

A lição prática por trás disso: usar IA pra ganhar velocidade não substitui revisar o que foi gerado — o valor apareceu em ter, depois, uma segunda passada dedicada só a achar o que passou batido.

## Competências técnicas demonstradas

**Backend**
- Autenticação JWT stateless implementada do zero (`HMAC256`, expiração, verificação de assinatura e issuer) — papéis resolvidos do banco a cada requisição, nunca confiados no conteúdo do token
- RBAC em duas camadas: `@PreAuthorize` por papel **e** checagem de dono do recurso na camada de serviço (um instrutor não edita curso de outro instrutor)
- Modelagem JPA/Hibernate com relacionamentos reais (`Course` → `Module` → `Lesson` → `LessonProgress`) e tratamento explícito dos limites do `CascadeType.ALL` (progresso de aluno não é apagado em cascata — é bloqueado com 409 antes de virar violação de FK crua)
- Bean Validation em todos os DTOs de entrada, com handler centralizado (`@RestControllerAdvice`) traduzindo cada tipo de erro pro status HTTP certo
- Paginação nativa com Spring Data (`Page`/`Pageable`)

**Frontend**
- App Router do Next.js com RBAC aplicado por `layout.tsx` (guarda de rota centralizada, não espalhada por página)
- Gerenciamento de sessão via `useSyncExternalStore` (sincroniza logout entre abas de graça, sem lib externa)
- Consumo de API com debounce e proteção contra race condition — o preview de vídeo (ver captura 12) dispara requisição 500ms após parar de digitar e descarta qualquer resposta que não seja mais a mais recente
- Data visualization com Recharts, dado real agregado no client (não mockado)

**Transversal**
- Mentalidade de segurança: auditoria cobrindo autorização, validação de entrada, CORS, exposição de segredo, dependências desatualizadas — resumida na seção acima
- Capacidade de achar e corrigir bug de produção real (não só "código que compila")

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

## Capturas de tela

### Jornada do aluno

| Catálogo | Currículo do curso |
|---|---|
| ![Catálogo de cursos](snapshots/04-catalogo.png) | ![Currículo do curso](snapshots/05-curriculo.png) |

| Player de aula | Certificados |
|---|---|
| ![Player de aula](snapshots/06-player.png) | ![Certificados do aluno](snapshots/07-certificados.png) |

**Validação pública do certificado** (rota sem autenticação, por hash):

![Validação pública de certificado](snapshots/08-certificado-validacao.png)

### Jornada do instrutor

**Dashboard**, com gráfico de alunos matriculados por curso:

![Dashboard do instrutor](snapshots/09-dashboard-instrutor.png)

| Meus cursos | Detalhe do curso (alunos matriculados) |
|---|---|
| ![Meus cursos](snapshots/10-meus-cursos.png) | ![Detalhe do curso](snapshots/11-detalhe-curso.png) |

**Preview automático da thumbnail do YouTube** ao cadastrar uma aula — feito com debounce + oEmbed, sem chave de API:

![Preview do YouTube ao cadastrar aula](snapshots/12-preview-youtube.png)

### Autenticação

| Login | Cadastro |
|---|---|
| ![Login](snapshots/02-login.png) | ![Cadastro](snapshots/03-registro.png) |

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
snapshots/  Capturas de tela usadas neste README
```

## Licença

Distribuído sob a licença MIT — veja [LICENSE](LICENSE).
