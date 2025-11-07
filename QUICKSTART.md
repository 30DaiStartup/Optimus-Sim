# OptimusSim Quick Start Guide

Get up and running with OptimusSim in 5 minutes!

## Step 1: Get Your API Key

You need an OpenAI API key to use TinyTroupe. Get one at:
- https://platform.openai.com/api-keys

Or use Azure OpenAI Service:
- https://azure.microsoft.com/en-us/products/ai-services/openai-service

## Step 2: Setup

```bash
# Navigate to the OptimusSim directory
cd OptimusSim

# Copy the environment template
cp .env.example .env

# Edit .env and add your API key
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

Add your key to `.env`:
```bash
OPENAI_API_KEY=sk-your-key-here
```

## Step 3: Choose Your Method

### Option A: Docker (Recommended)

**Requirements**: Docker Desktop installed

```bash
# Start everything with one command
docker-compose up

# Wait for services to start (1-2 minutes)
# Backend will be at: http://localhost:8000
# Frontend will be at: http://localhost:3000
```

### Option B: Local Development

**Requirements**: Python 3.10+, Node.js 18+

**Terminal 1 (Backend)**:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm install
npm run dev
```

## Step 4: Open OptimusSim

Open your browser and navigate to:
```
http://localhost:3000
```

## Step 5: Create Your First Agent

1. Click **"Agents"** in the top navigation
2. Click **"Create Agent"**
3. Choose **"Quick Generate"**
4. Describe your agent:
   ```
   A 35-year-old software engineer who loves coffee,
   coding in Python, and hiking on weekends.
   ```
5. Click **"Generate"**
6. Wait a few seconds for AI to create your agent
7. Click **"Save"**

## Step 6: Run Your First Simulation

1. Go to **Dashboard**
2. Click **"Run Simulation"**
3. Select 2 agents (create a second one if needed)
4. Choose environment: **"Chat Room"**
5. Set initial prompt:
   ```
   Discuss your favorite weekend activities
   ```
6. Set steps: **5**
7. Click **"Start Simulation"**
8. Watch the conversation unfold!

## Step 7: View Results

- See the full conversation in the simulation viewer
- Export results as JSON or text
- Extract insights from agent interactions

## Troubleshooting

### "API Configuration Issues"

Make sure your `.env` file has the correct API key:
```bash
API_TYPE=openai
OPENAI_API_KEY=sk-your-actual-key-here
```

### Docker Issues

```bash
# Stop and restart
docker-compose down
docker-compose up --build
```

### Port Already in Use

**Frontend (port 3000)**:
```bash
# Edit frontend/vite.config.ts and change port to 3001
server: {
  port: 3001,
  ...
}
```

**Backend (port 8000)**:
```bash
# Run with different port
uvicorn app.main:app --port 8001
```

### Python Dependencies Fail

```bash
# Upgrade pip first
pip install --upgrade pip

# Then retry
pip install -r requirements.txt
```

## What's Next?

- **Read the full [README.md](./README.md)** for detailed documentation
- **Explore TinyTroupe**: Check out the example agents in `TinyTroupe/examples/agents/`
- **Customize**: Modify agents, try different scenarios, experiment!
- **Learn more**: Read the [TinyTroupe paper](https://arxiv.org/abs/2507.09788)

## Getting Help

- Check the [TinyTroupe docs](https://github.com/microsoft/TinyTroupe)
- Review FastAPI docs at http://localhost:8000/docs
- Open an issue on GitHub

---

**Happy simulating! 🚀**
