# 🐾 PETBOOK

O **PetBook** é uma rede social voltada para animais de estimação, inspirada em plataformas como o Instagram. A proposta é permitir que os usuários criem perfis para seus pets, compartilhem publicações, interajam com outros usuários e encontrem animais para adoção, animais perdidos e eventos.

## 📋 Requisitos

### 🔐 Autenticação e usuários

- Cadastro de usuário utilizando:
  - Nome
  - E-mail
  - Senha
- Login utilizando e-mail e senha.
- Apenas usuários cadastrados podem realizar publicações, curtidas, comentários e seguir outros perfis.

### 🐶 Perfil do pet

Cada usuário poderá cadastrar um ou mais animais de estimação, contendo:

- Nome
- Foto
- Raça
- Tipo de animal
- Idade
- Localização

### 📸 Publicações

Usuários autenticados poderão criar publicações contendo:

- Foto
- Legenda
- Emojis **- sem prioridade**
- Identificação do tipo de publicação:
  - Publicação comum
  - Animal perdido
  - Animal para adoção

### ❤️ Interações

Os usuários poderão interagir com as publicações e perfis:

- Curtir publicações.
- Comentar publicações.
- Seguir outros perfis. **- sem prioridade**
- Visualizar os perfis que seguem e que são seguidos pelo usuário. **- sem prioridade**

### 🏠 Adoção de animais

Será disponibilizada uma área específica para animais disponíveis para adoção.

- Aba com o tipo de postagem - adoção
- Filtros **- sem prioridade**

### 🔎 Animais perdidos

Será disponibilizada uma área para auxiliar na divulgação de animais perdidos.

- Aba com o tipo de postagem - animal perdido
- Filtros **- sem prioridade**

### 📅 Encontros de animais **- sem prioridade**

Os usuários poderão divulgar e encontrar eventos relacionados a animais.

Exemplo: _"Encontro de Golden Retrievers no domingo, no Shopping X."_

- Criar publicação de encontro/evento.
- Informar data, horário e local.
- Adicionar descrição do evento.
- Visualizar encontros publicados.
- Confirmar presença no encontro.
- Visualizar a quantidade de pessoas confirmadas.

---

## 🚀 Tecnologias

### Frontend

- Next.js

### Backend

- NestJS
