# Mileage Predictor AI

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

An ML-powered vehicle mileage prediction app using Random Forest regression trained on real Indian city traffic data. Input your vehicle parameters and get an accurate mileage estimate.

**Live:** [mileage-dashboard.vercel.app](https://mileage-dashboard.vercel.app)

## How It Works

1. User inputs vehicle specs (engine size, weight, fuel type, city, etc.)
2. React frontend sends data to FastAPI backend
3. Python ML model (Random Forest) generates prediction
4. Estimated mileage returned and displayed with confidence interval

## ML Model

- **Algorithm:** Random Forest Regressor (scikit-learn)
- **Dataset:** Real Indian city traffic and vehicle data
- **Features:** Engine displacement, vehicle weight, transmission type, fuel type, city driving conditions
- **Performance:** R² score on test set documented in `/backend/model_evaluation.py`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Python + FastAPI |
| ML Model | scikit-learn (Random Forest) |
| Data Processing | Pandas + NumPy |
| Deployment | Vercel (frontend) + Python backend |

## Project Structure

```
src/          # React frontend
backend/      # Python FastAPI + ML model
  api/        # API route handlers
  model/      # Trained Random Forest model (.pkl)
public/       # Static assets
```

## Getting Started

### Frontend

```bash
npm install
npm start
```

### Backend (Python)

```bash
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload
```

Frontend: `http://localhost:3000` | API: `http://localhost:8000`

## License

MIT — built by [Biju Damian](https://github.com/bijudamian)
