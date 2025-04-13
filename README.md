# D'Lav - Soluções em Higienização

![D'Lav Logo](public/assets/images/logo.webp)

D'Lav é uma aplicação web moderna e responsiva desenvolvida para gerenciar e otimizar todo o processo de lavagem e higienização. O sistema utiliza QR Codes para controlar e monitorar todas as etapas do processo de lavagem, proporcionando uma gestão eficiente e transparente.

## 🚀 Tecnologias Principais

- **Next.js 14** - Framework React para desenvolvimento web
- **TypeScript** - Tipagem estática para maior segurança e manutenibilidade
- **NextUI** - Biblioteca de componentes UI moderna e acessível
- **React Query** - Gerenciamento de estado e cache de dados
- **TailwindCSS** - Framework CSS utilitário
- **PWA (Progressive Web App)** - Funcionalidade offline e instalação como app nativo
- **GraphQL** - API para consultas eficientes
- **React Hook Form** - Gerenciamento de formulários
- **Zustand** - Gerenciamento de estado global
- **React Beautiful DnD** - Drag and drop para interfaces interativas

## ✨ Funcionalidades

- **Gerenciamento de Processos de Lavagem**
  - Controle completo de todas as etapas do processo
  - Geração e leitura de QR Codes
  - Monitoramento em tempo real

- **Interface Responsiva**
  - Design adaptável para todos os dispositivos
  - Modo claro/escuro
  - Componentes acessíveis

- **Funcionalidades Offline**
  - Sincronização automática quando online
  - Armazenamento local de dados
  - Notificações push

- **Dashboard e Relatórios**
  - Visualização de métricas e KPIs
  - Exportação de dados
  - Filtros e buscas avançadas

## 🛠️ Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```
Preencha as variáveis necessárias no arquivo `.env.local`

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:3003`

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento na porta 3003
- `npm run build` - Gera a versão de produção
- `npm run start` - Inicia o servidor de produção na porta 3004
- `npm run lint` - Executa a verificação de código

## 🔒 Variáveis de Ambiente

- `NEXT_PUBLIC_API_URL` - URL da API
- `NEXT_VAPID_PUBLIC_KEY` - Chave pública para notificações push
- `NEXT_VERSION` - Versão do aplicativo
- `NEXT_GOOGLE_API_KEY` - Chave da API do Google
- `NEXT_FRONT_URL` - URL do frontend

## 📱 PWA (Progressive Web App)

O D'Lav é um PWA, permitindo:
- Instalação como aplicativo nativo
- Funcionalidade offline
- Notificações push
- Atualizações automáticas

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o arquivo CONTRIBUTING.md para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE.md para detalhes.

## 📞 Suporte

Para suporte, entre em contato através de [EMAIL/CONTATO]
