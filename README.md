# OptimusSim 🤖

**A beautiful, intuitive web interface for TinyTroupe multiagent simulations**

OptimusSim makes it effortless to create AI-powered persona simulations, run realistic interactions, and gain valuable insights—all through an elegant web interface inspired by Steve Jobs' philosophy of simplicity and power.

---

## ✨ Features

- **Intuitive Agent Creation**: Build detailed AI personas with personalities, backgrounds, and goals
- **Visual Simulation Setup**: Configure and run multiagent simulations with just a few clicks
- **Real-time Monitoring**: Watch your agents interact in real-time
- **Beautiful UX**: Clean, minimal design that focuses on what matters
- **Flexible Deployment**: Run locally, in Docker, or deploy to the cloud
- **Powered by TinyTroupe**: Built on Microsoft's LLM-powered multiagent simulation library

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** (for backend)
- **Node.js 18+** (for frontend)
- **OpenAI API key** or **Azure OpenAI credentials**

### Option 1: Local Development (Fastest)

1. **Clone and setup**:
```bash
cd OptimusSim

# Copy environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key
```

2. **Start the backend**:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

3. **Start the frontend** (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

4. **Open your browser** to `http://localhost:3000`

### Option 2: Docker (Easiest)

1. **Setup environment**:
```bash
cd OptimusSim
cp .env.example .env
# Edit .env and add your OpenAI API key
```

2. **Start everything**:
```bash
docker-compose up
```

3. **Open your browser** to `http://localhost:3000`

---

## 📖 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# API Configuration
API_TYPE=openai                        # "openai" or "azure"
OPENAI_API_KEY=your-key-here          # Your OpenAI API key

# For Azure OpenAI (if using)
# AZURE_OPENAI_KEY=your-azure-key
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com

# Model Configuration
TINYTROUPE_MODEL=gpt-4.1-mini         # Model to use
TINYTROUPE_TEMPERATURE=1.5             # Temperature (0-2)
TINYTROUPE_CACHE_API_CALLS=False      # Enable caching to reduce costs
```

---

## 🎯 Usage

### Creating Your First Agent

1. **Navigate to Agent Library**: Click "Agents" in the top navigation
2. **Click "Create Agent"**: Choose your creation method:
   - **Quick Generate**: Describe your agent in natural language (AI generates the details)
   - **Load Template**: Start with pre-built personas (Lisa, Oscar, etc.)
   - **Upload JSON**: Import an existing TinyPerson specification
   - **Build from Scratch**: Manual creation with full control

3. **Configure the Persona**:
   - Basic Info (name, age, occupation)
   - Personality traits (Big Five model)
   - Skills and interests
   - Beliefs and behaviors
   - Routines and relationships

4. **Save**: Your agent is now ready to use!

### Running a Simulation

1. **Go to Dashboard**: Click "Dashboard" in the navigation
2. **Select Agents**: Choose 2 or more agents to participate
3. **Configure Simulation**:
   - Choose environment type (Chat Room, Focus Group, Interview)
   - Set initial prompt/scenario
   - Configure number of steps
4. **Run**: Watch the simulation unfold in real-time
5. **Analyze**: Export results or extract insights

### Example Use Cases

- **Product Testing**: Simulate focus groups to test product ideas
- **Advertisement Evaluation**: Test ads with simulated audiences before spending money
- **Market Research**: Generate synthetic consumer feedback
- **Training Data**: Create realistic conversation data for ML models
- **Brainstorming**: Run creative brainstorming sessions with diverse personas

---

## 🏗️ Project Structure

```
OptimusSim/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── agents.py   # Agent endpoints
│   │   │   └── simulations.py  # Simulation endpoints
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic & TinyTroupe integration
│   │   ├── core/           # Configuration
│   │   └── main.py         # FastAPI app
│   └── requirements.txt
│
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities
│   └── package.json
│
├── TinyTroupe/              # Microsoft TinyTroupe library (cloned)
│
├── docker-compose.yml       # Docker orchestration
└── .env.example            # Environment template
```

---

## 🔌 API Documentation

Once the backend is running, visit:
- **Interactive API docs**: `http://localhost:8000/docs`
- **OpenAPI spec**: `http://localhost:8000/openapi.json`

### Key Endpoints

**Agents:**
- `POST /api/agents` - Create agent
- `GET /api/agents` - List all agents
- `GET /api/agents/{id}` - Get agent details
- `PUT /api/agents/{id}` - Update agent
- `DELETE /api/agents/{id}` - Delete agent
- `POST /api/agents/generate` - AI-generate agent
- `POST /api/agents/upload` - Upload agent JSON

**Simulations:**
- `POST /api/simulations` - Create simulation
- `GET /api/simulations` - List all simulations
- `GET /api/simulations/{id}` - Get simulation details
- `POST /api/simulations/{id}/start` - Start simulation
- `GET /api/simulations/{id}/status` - Get status
- `GET /api/simulations/{id}/results` - Get results

---

## 🐳 Docker Deployment

### Production Build

```bash
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment-specific Configs

For different environments (dev, staging, prod), create separate `.env` files:
- `.env.development`
- `.env.staging`
- `.env.production`

Then specify the env file:
```bash
docker-compose --env-file .env.production up
```

---

## ☁️ Cloud Deployment

### Deploy to Vercel (Frontend)

```bash
cd frontend
vercel
```

Add environment variables in Vercel dashboard:
- `VITE_API_URL=https://your-backend-url.com`

### Deploy to Railway/Render (Backend)

1. Connect your GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables from `.env.example`

---

## 🧪 Development

### Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app.main:app --reload --port 8000

# Run tests
pytest
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Query (data fetching)
- React Router (navigation)
- Zustand (state management)
- Framer Motion (animations)

**Backend:**
- FastAPI (Python web framework)
- Pydantic (data validation)
- TinyTroupe (simulation engine)
- Uvicorn (ASGI server)

**Deployment:**
- Docker & Docker Compose
- Nginx (production frontend server)

---

## 📚 Learn More

- **TinyTroupe Documentation**: [GitHub](https://github.com/microsoft/TinyTroupe)
- **TinyTroupe Paper**: [arXiv](https://arxiv.org/abs/2507.09788)
- **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **React Docs**: [react.dev](https://react.dev)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## ⚖️ Legal & Responsible AI

**Important**: OptimusSim and TinyTroupe are for research and simulation purposes only.

- You are fully responsible for any use of generated outputs
- Not intended for sensitive scenarios (violent, sexual, etc.)
- Outputs must not be used to deceive, mislead, or harm people
- Review the [TinyTroupe Responsible AI FAQ](./TinyTroupe/RESPONSIBLE_AI_FAQ.md)

---

## 📜 License

This project follows the MIT license.

TinyTroupe is licensed under the MIT License by Microsoft.

---

## 🙏 Acknowledgments

- **Microsoft** for creating TinyTroupe
- **TinyTroupe Team**: Paulo Salem, Robert Sim, Christopher Olsen, and contributors
- Built with inspiration from Apple's design philosophy

---

**Made with ❤️ for better human-AI collaboration**
