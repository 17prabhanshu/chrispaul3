# DARKINT

> **Cross-Platform Illicit Market Intelligence Platform**

DARKINT is an explainable, cross-platform intelligence platform that combines NLP, entity resolution, graph analysis, behavioral anomaly detection, temporal intelligence, and blockchain signals to prioritize potential illicit drug-sale activity for human investigation.

## Core Flow
From isolated suspicious posts to connected intelligence.
1. **Data Ingestion**: Consume generic, synthetic or historical darknet datasets.
2. **NLP Classification**: Score texts and extract entities.
3. **Semantic Similarity**: Vector retrieval (FAISS + SentenceTransformers) to match similar listings.
4. **Graph Construction**: Automatically connect entities, aliases and products.
5. **Analyst Copilot**: Synthesize answers citing specific structured evidence.

## Getting Started

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
./venv/bin/uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Demo
Generate and replay the synthetic data:
```bash
cd backend/scripts
python generate_demo_data.py
python run_replay.py
```
Then visit `http://localhost:3000` to view the intelligence dashboard as it updates in real time.

## Research References
- **Maastricht University Law & Tech Lab**: Concept of Open-Set Vendor Linking.
- **BAAI / Qwen**: Open weight embedding and analyst models.
- **Meta AI Research**: FAISS for high performance vector retrieval.

*Disclaimer: This platform provides investigative leads only and does not establish criminal liability. Datasets included are synthetic for demonstration purposes.*
