# 🐾 PETBOOK

O **PetBook** é uma rede social voltada para animais de estimação, inspirada em plataformas como o Instagram. A proposta é permitir que os usuários criem perfis para seus pets, compartilhem publicações, interajam com outros usuários e encontrem animais para adoção, animais perdidos e eventos.

## 📋 Requisitos / marcado como concluida porque foi realizada no front, falta o backend

### 🔐 Autenticação e usuários

- [x] Cadastro de usuário com nome, email e senha
- [x] Login utilizando e-mail e senha.
- [ ] ***Regra*** Apenas usuários cadastrados podem realizar publicações, curtidas, comentários e seguir outros perfis.

### 🐶 Perfil do pet

- [x] Cadastrar um ou mais pets com, Nome, Foto, Raça, Tipo de animal, Idade, Localização
- [x] Exibir informações do usuário responsável
- [x] Exibir os pets cadastrados pelo usuário
- [x] Permitir alternar entre os pets

### 📸 Publicações

- [X] Criar publicação com Foto, Legenda e Emojis
- [x] Identificação do tipo de publicação:
  - [x] Publicação comum
  - [x] Animal perdido
  - [x] Animal para adoção
- [ ] ***Fazer** Na publicação adicionar opção de poder escolher qual pet vai estar fazendo a publicação

### ❤️ Interações

- [ ] Curtir publicações
- [ ] Comentar publicações
- [ ] Seguir outros perfis **- sem prioridade**
- [ ] Visualizar os perfis que seguem e que são seguidos pelo usuário **- sem prioridade**

### 🏠 Adoção de animais

- [ ] Aba com o tipo de postagem "adoção", exibir animais disponíveis para adoção
- [ ] Filtros **- sem prioridade**

### 🔎 Animais perdidos

- [ ] Aba com o tipo de postagem "animal perdido", exibir animais perdidos
- [ ] Filtros **- sem prioridade**

### 📅 Encontros de animais **- sem prioridade**

Os usuários poderão divulgar e encontrar eventos relacionados a animais.

Exemplo: _"Encontro de Golden Retrievers no domingo, no Shopping X."_

- [ ] Criar publicação de encontro/evento
- [ ] Informar data, Informar horário, Informar local, Adicionar descrição do evento
- [ ] Visualizar encontros publicados
- [ ] Confirmar presença no encontro
- [ ] Visualizar quantidade de pessoas confirmadas

---

## 🚀 Tecnologias

### Frontend

Next.js

### Backend

NestJS

### ORM

Prisma

### Banco de dados

PostgreSQL

---
# ▶️ Como executar o Frontend

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- Git

## 1. Clonar o repositório

```bash
git clone https://github.com/maiarakothe/petbook.git
```

Depois, entre na pasta do projeto:
```bash
cd petbook
```
Entre na pasta do frontend
```bash
cd frontend
```
Instalar as dependências
```bash
npm install
```

Executar o projeto
```bash
npm run dev
```

## 👨‍💻 Desenvolvedores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/maiarakothe" style="text-decoration: none; color: inherit;">
        <img src="https://avatars.githubusercontent.com/u/160647563?v=4" width="115"><br>
        <strong>Maiara Braun Kothe</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/MatheusBamberg" style="text-decoration: none; color: inherit;">
        <img src="https://avatars.githubusercontent.com/u/204625992?v=4" width="115"><br>
        <strong>Matheus Scherer Bamberg</strong>
      </a>
    </td>
  </tr>
</table>
