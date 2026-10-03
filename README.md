# 🐾 PetBook

O PetBook é uma aplicação full stack para conectar tutores de pets, compartilhar momentos, divulgar animais para adoção e acompanhar publicações relacionadas a pets perdidos, achados e rotina de convivência.

A proposta da plataforma é unir um feed social com um perfil de pet, permitindo que o usuário gerencie seus animais, publique conteúdos, interaja com o feed e acompanhe o engajamento com curtidas em publicações.

---

## ✨ Funcionalidades

### Autenticação e usuários

- Cadastro de usuário com nome, email e senha
- Login com autenticação JWT
- Recuperação do usuário autenticado no backend
- Atualização do perfil do usuário
- Senhas protegidas com hash antes da persistência

### Perfil do pet

- Cadastro de pets com nome, foto, raça, tipo, idade e localização
- Listagem de pets do usuário logado
- Edição e exclusão de pets
- Alternância entre pets no perfil e nas publicações

### Publicações

- Criação de publicações com foto e legenda
- Tipos de publicação:
  - COMUM
  - PERDIDO
  - ADOCAO
- Associação da publicação com um pet específico
- Listagem de publicações gerais e por usuário
- Upload de imagem para armazenamento em Cloudinary

### Interações

- Curtida em publicações
- Listagem das curtidas por publicação
- Feed de publicações com filtros por tipo

### Arquitetura e stack

- Frontend em Next.js + React + TypeScript
- Backend em NestJS + TypeScript
- ORM Prisma com PostgreSQL
- Upload de imagens via Cloudinary
- Autenticação JWT com guarda de rotas

---

## 🏗️ Arquitetura da aplicação

A aplicação está organizada em dois projetos independentes, mas conectados:

- Frontend: responsável pela interface, autenticação do usuário, feed, perfis e interações visuais
- Backend: responsável pela regra de negócio, autenticação, persistência, uploads e autorização

### Stack principal

#### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

#### Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Cloudinary

---

## 📁 Estrutura do projeto

```bash
petbook/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── auth/
│   │   ├── cloudinary/
│   │   ├── curtidas/
│   │   ├── database/
│   │   ├── pets/
│   │   ├── publicacao/
│   │   └── usuarios/
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── app/
│   ├── api/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env.local
├── README.md
└── package.json (se houver no nível raiz)
```

---

## 🧩 Modelo de dados

O banco principal é estruturado em torno de cinco entidades principais:

- Usuario
  - id
  - nome
  - email
  - senha

- Pet
  - id
  - nome
  - foto
  - raca
  - tipo_animal
  - idade
  - localizacao
  - usuarioId

- Publicacao
  - id
  - foto
  - legenda
  - tipo
  - usuarioId
  - petId

- Curtida
  - id
  - usuarioId
  - publicacaoId

- Comentario
  - id
  - texto
  - usuarioId
  - publicacaoId
  - criadoEm
  - atualizadoEm

Além disso, a enumeração `TipoPublicacao` define o tipo da publicação:

- COMUM
- PERDIDO
- ADOCAO

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- Node.js 22.12+ ou superior
- npm
- PostgreSQL 16+
- Git
- Conta no Cloudinary para upload de imagens

---

## 🚀 Configuração local

### 1. Clone o repositório

```bash
git clone https://github.com/maiarakothe/petbook.git
cd petbook
```

### 2. Instale as dependências do backend

```bash
cd backend
npm install
```

### 3. Configure as variáveis de ambiente do backend

Crie um arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Exemplo de conteúdo:

```env
DATABASE_URL="postgresql://postgres:senha_do_banco@localhost:5432/petbook"
FRONTEND_ORIGINS="http://localhost:3000"
PORT=3001
JWT_SECRET=petbook-secret
CORS_ORIGINS=http://localhost:3000
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

### 4. Configure o frontend

No diretório do frontend, crie ou ajuste o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🗄️ Banco de dados

No backend, gere o Prisma Client e aplique as migrações:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

Se o banco ainda não existir, ele será criado conforme a configuração do `DATABASE_URL`.

---

## ▶️ Como executar a aplicação

### Backend

```bash
cd backend
npm run start:dev
```

O backend fica disponível em:

```bash
http://localhost:3001
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend fica disponível em:

```bash
http://localhost:3000
```

---

## 📡 Endpoints principais

### Autenticação

- `POST /auth/register` — cadastro de usuário
- `POST /auth/login` — login do usuário
- `PATCH /auth/perfil` — atualização do perfil do usuário autenticado

### Pets

- `POST /pets` — cria um pet
- `GET /pets` — lista os pets do usuário autenticado
- `PATCH /pets/:id` — atualiza um pet
- `DELETE /pets/:id` — remove um pet

### Publicações

- `POST /publicacoes` — cria uma publicação
- `GET /publicacoes` — lista as publicações
- `GET /publicacoes/minhas` — lista as publicações do usuário autenticado
- `PATCH /publicacoes/:publicacaoId` — atualiza uma publicação
- `DELETE /publicacoes/:publicacaoId` — remove uma publicação

### Curtidas

- `POST /publicacoes/:publicacaoId/curtida` — curtir publicação
- `DELETE /publicacoes/:publicacaoId/curtida` — remover curtida
- `GET /publicacoes/:publicacaoId/curtida` — listar curtidas

### Comentários

- `GET /publicacoes/:publicacaoId/comentarios` — listar comentários da publicação
- `POST /publicacoes/:publicacaoId/comentarios` — criar comentário (`texto`, autenticado)
- `PATCH /publicacoes/:publicacaoId/comentarios/:comentarioId` — editar comentário próprio (`texto`, autenticado)
- `DELETE /publicacoes/:publicacaoId/comentarios/:comentarioId` — excluir comentário próprio (autenticado)

Comentários devem conter entre 1 e 1000 caracteres. A leitura é pública; criação, edição e exclusão exigem token JWT e somente o autor pode editar ou excluir seu comentário.

> As rotas de criação, edição e listagem de dados sensíveis ficam protegidas por `JwtAuthGuard`.

---

## 🔐 Segurança

- Senhas armazenadas com hash usando bcrypt
- Tokens JWT para autenticação do usuário
- Guarda de rotas no backend para proteger endpoints sensíveis
- Validação dos dados recebidos no backend
- Upload de mídia em serviço externo (Cloudinary)

---

## 👨‍💻 Desenvolvedores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/maiarakothe" style="text-decoration: none; color: inherit;">
        <img src="https://avatars.githubusercontent.com/u/160647563?v=4" width="120" alt="Maiara Braun Kothe"><br>
        <strong>Maiara Braun Kothe</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/MatheusBamberg" style="text-decoration: none; color: inherit;">
        <img src="https://avatars.githubusercontent.com/u/204625992?v=4" width="120" alt="Matheus Scherer Bamberg"><br>
        <strong>Matheus Scherer Bamberg</strong>
      </a>
    </td>
  </tr>
</table>
