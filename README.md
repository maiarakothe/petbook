# 🐾 PETBOOK

O **PetBook** é uma rede social voltada para animais de estimação, inspirada em plataformas como o Instagram. A proposta é permitir que os usuários criem perfis para seus pets, compartilhem publicações, interajam com outros usuários e encontrem animais para adoção, animais perdidos e eventos.

## 📋 Requisitos / marcado como concluida porque foi realizada no front, falta o backend

### 🔐 Autenticação e usuários

- [x] Cadastro de usuário
  - [x] Nome
  - [x] E-mail
  - [x] Senha
- [x] Login utilizando e-mail e senha.
- [ ] Apenas usuários cadastrados podem realizar publicações, curtidas, comentários e seguir outros perfis.

### 🐶 Perfil do pet

Cada usuário poderá cadastrar um ou mais animais de estimação, contendo:

- [ ] Cadastrar um ou mais pets
- [ ] Nome
- [ ] Foto
- [ ] Raça
- [ ] Tipo de animal
- [ ] Idade
- [ ] Localização
- [x] Exibir informações do usuário responsável
- [x] Exibir os pets cadastrados pelo usuário
- [x] Permitir alternar entre os pets

### 📸 Publicações

Usuários autenticados poderão criar publicações contendo:

- [ ] Criar publicação
- [x] Foto
- [x] Legenda
- [x] Emojis
- [x] Identificação do tipo de publicação:
  - [x] Publicação comum
  - [x] Animal perdido
  - [x] Animal para adoção
- [ ] Publicação vinculada ao pet que realizou a publicação

### ❤️ Interações

Os usuários poderão interagir com as publicações e perfis:

- [ ] Curtir publicações
- [ ] Comentar publicações
- [ ] Seguir outros perfis **- sem prioridade**
- [ ] Visualizar os perfis que seguem e que são seguidos pelo usuário **- sem prioridade**

### 🏠 Adoção de animais

Será disponibilizada uma área específica para animais disponíveis para adoção.

- [ ] Criar publicação de adoção
- [ ] Aba com o tipo de postagem "adoção"
- [ ] Exibir animais disponíveis para adoção
- [ ] Filtros **- sem prioridade**

### 🔎 Animais perdidos

Será disponibilizada uma área para auxiliar na divulgação de animais perdidos.

- [ ] Criar publicação de animal perdido
- [ ] Aba com o tipo de postagem "animal perdido"
- [ ] Exibir animais perdidos
- [ ] Filtros **- sem prioridade**

### 📅 Encontros de animais **- sem prioridade**

Os usuários poderão divulgar e encontrar eventos relacionados a animais.

Exemplo: _"Encontro de Golden Retrievers no domingo, no Shopping X."_

- [ ] Criar publicação de encontro/evento
- [ ] Informar data
- [ ] Informar horário
- [ ] Informar local
- [ ] Adicionar descrição do evento
- [ ] Visualizar encontros publicados
- [ ] Confirmar presença no encontro
- [ ] Visualizar quantidade de pessoas confirmadas

---

## 🚀 Tecnologias

### Frontend

Next.js

### Backend

NestJS

### Banco de dados

PostgreSQL ou MySQL

---

## 📱 Interface

- [ ] Layout responsivo
- [x] Tela de login
- [x] Tela de cadastro
- [x] Página inicial
- [x] Perfil do usuário
- [x] Perfil dos pets
- [ ] Área de adoção
- [ ] Área de animais perdidos
- [x] Área de publicações
- [x] Menu de navegação
- [ ] 
