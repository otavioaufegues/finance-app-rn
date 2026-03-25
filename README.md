# Finance App RN

Aplicativo mobile de controle financeiro desenvolvido com React Native e Expo. O projeto permite autenticacao de usuarios, cadastro de transacoes, organizacao por categorias, upload de comprovantes e visualizacao de indicadores financeiros com graficos.

## Visao Geral

O app foi construido para registrar entradas e saidas de dinheiro de forma simples, com persistencia em Firebase. Cada usuario possui seus proprios dados, incluindo perfil, categorias e historico de transacoes.

Principais recursos:

- cadastro e login com Firebase Authentication
- criacao, edicao e exclusao de transacoes
- classificacao por categoria
- filtros por tipo e categoria
- resumo financeiro com saldo, entradas e saidas
- graficos de evolucao do saldo e distribuicao por categoria
- upload de comprovantes com Firebase Storage
- carregamento paginado da lista de transacoes

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- Styled Components
- React Navigation
- Firebase Authentication
- Firebase Firestore
- Firebase Storage

## Estrutura Funcional

O fluxo principal do aplicativo e:

1. o usuario cria uma conta ou faz login
2. o perfil e criado no Firestore
3. categorias padrao sao geradas automaticamente para o usuario
4. o usuario cadastra transacoes de entrada ou saida
5. os dados sao exibidos em listas, resumos e graficos

Estrutura de dados usada no Firebase:

- `users/{uid}`: perfil do usuario
- `users/{uid}/categories`: categorias disponiveis
- `users/{uid}/transactions`: transacoes financeiras
- `receipts/{uid}/...`: comprovantes enviados ao Storage

## Pre-requisitos

Antes de rodar o projeto, voce precisa ter instalado:

- Node.js em versao LTS
- npm
- Expo Go no celular ou Android Studio / Xcode para emuladores
- um projeto Firebase configurado com Authentication, Firestore e Storage

## Configuracao do Firebase

O app depende de variaveis de ambiente publicas do Expo para conectar ao Firebase.

Crie um arquivo `.env` na raiz do projeto com o seguinte modelo:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Recursos minimos esperados no Firebase:

- Authentication com provedor Email/Senha habilitado
- Firestore Database ativo
- Firebase Storage ativo

## Como Rodar o Projeto

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o servidor do Expo:

```bash
npm start
```

3. Execute no ambiente desejado:

```bash
npm run android
```

```bash
npm run ios
```


Observacoes:

- `npm run ios` depende de macOS com Xcode
- no celular, voce pode abrir o projeto pelo Expo Go apos iniciar `npm start`
- se alterar o `.env`, reinicie o servidor do Expo

## Scripts Disponiveis

- `npm start`: inicia o Expo
- `npm run android`: abre no Android
- `npm run ios`: abre no iOS

## Telas Principais

- `Login`: autenticacao do usuario
- `Register`: criacao de conta
- `Home`: resumo financeiro e graficos
- `TransactionsList`: listagem, filtros e exclusao de transacoes
- `TransactionForm`: cadastro e edicao de transacoes com comprovante

## Diferenciais do Projeto

- separacao clara entre autenticacao, navegacao, hooks e servicos
- atualizacao em tempo real de dados com `onSnapshot`
- categorias padrao criadas automaticamente para novos usuarios
- suporte a recibos/imagens nas transacoes
- dashboard inicial com visualizacao resumida dos dados

## Possiveis Melhorias

- adicionar testes automatizados
- permitir criacao de categorias personalizadas
- incluir edicao de perfil
- mostrar comprovante na listagem de transacoes
- adicionar validacoes mais completas de formulario

## Autor

Projeto desenvolvido para fins academicos e de portfolio.
