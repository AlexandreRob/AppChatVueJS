# InnoTech

Ceci est un POC de chat en temps réelle avec ExpressJS, VueJS et les WebSocket avec SocketIO

---

## ⚙️ Installation and Environment Setup

### 1. Requirements

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (for local development without Docker)
- [Git](https://git-scm.com/)

### 2. Clone the Project

```bash
git clone https://github.com/AlexandreRob/AppChatVueJS.git
cd AppChatVueJS
```

### 3. Configure .env Files

Frontend : frontappchat/.env

```text
VITE_BACKEND_URL=http://localhost:3000
```

## 🐳 Running the Docker Containers

### Build and Start

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173

- Backend: http://localhost:3000

### Stop Containers

```bash
docker-compose down
```

## 💻 Local Development

### Backend

```bash
cd backappchat
npm install
npm run dev
```

### Frontend

```bash
cd frontappchat
npm install
node server.js
```
