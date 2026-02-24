import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import { Car, Fuel, Activity, MapPin, Search, BarChart3 } from 'lucide-react';
import './App.css';

ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const schema = z.object({
  Brand: z.string().min(1, 'Brand is required'),
  Model: z.string().min(1, 'Model is required'),
  City: z.string().min(1, 'City is required'),
  Total_km_driven: z.number().min(0, 'Must be positive'),
  Engine_cc: z.number().min(500, 'Must be > 500').max(10000, 'Must be < 10000'),
  Age_of_vehicle: z.number().min(0, 'Age must be >= 0'),
  Number_of_owners: z.number().min(1, 'Min 1 owner'),
  Fuel_type: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric']),
  Transmission: z.enum(['Manual', 'Automatic']),
});

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      Fuel_type: 'Petrol',
      Transmission: 'Manual',
    },
  });

  const { data: citiesData, isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const res = await axios.get('/api/cities');
      return res.data.cities;
    },
  });

  const { data: metricsData } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await axios.get('/api/metrics');
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post('/api/predict', data);
      return res.data;
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const barData = metricsData
    ? {
      labels: ['MAE', 'RMSE', 'Bias'],
      datasets: [
        {
          label: 'Error Metrics',
          data: [metricsData.MAE, metricsData.RMSE, metricsData.Bias],
          backgroundColor: [
            'rgba(56, 189, 248, 0.5)',
            'rgba(244, 63, 94, 0.5)',
            'rgba(16, 185, 129, 0.5)',
          ],
          borderColor: [
            'rgba(56, 189, 248, 1)',
            'rgba(244, 63, 94, 1)',
            'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
    : null;

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="layout">
      {/* Background elements */}
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>

      <div className="main-content">
        <header className="header">
          <div className="logo">
            <Car size={32} color="#38bdf8" />
            <h1>Mileage <span className="highlight">Predictor AI</span></h1>
          </div>
          <p className="subtitle">Enter your vehicle details to get an accurate real-world mileage estimate using our advanced Random Forest model.</p>
        </header>

        <div className="dashboard-grid">
          {/* Form Section */}
          <div className="panel form-panel glass">
            <h2 className="panel-title">
              <Activity size={20} />
              Vehicle Parameters
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="form-group">
                <label>Brand</label>
                <input {...register('Brand')} placeholder="e.g. Maruti" className={errors.Brand ? 'error-input' : ''} />
                {errors.Brand && <span className="error-text">{errors.Brand.message}</span>}
              </div>

              <div className="form-group">
                <label>Model</label>
                <input {...register('Model')} placeholder="e.g. Swift" className={errors.Model ? 'error-input' : ''} />
                {errors.Model && <span className="error-text">{errors.Model.message}</span>}
              </div>

              <div className="form-group">
                <label>Total KM Driven</label>
                <input type="number" {...register('Total_km_driven', { valueAsNumber: true })} placeholder="e.g. 50000" className={errors.Total_km_driven ? 'error-input' : ''} />
                {errors.Total_km_driven && <span className="error-text">{errors.Total_km_driven.message}</span>}
              </div>

              <div className="form-group">
                <label>Engine (CC)</label>
                <input type="number" {...register('Engine_cc', { valueAsNumber: true })} placeholder="e.g. 1197" className={errors.Engine_cc ? 'error-input' : ''} />
                {errors.Engine_cc && <span className="error-text">{errors.Engine_cc.message}</span>}
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select {...register('Fuel_type')}>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div className="form-group">
                <label>Transmission</label>
                <select {...register('Transmission')}>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>
                  <MapPin size={16} />
                  City (Traffic Adjusted)
                </label>
                <select {...register('City')} disabled={isLoadingCities} className={errors.City ? 'error-input' : ''}>
                  <option value="">{isLoadingCities ? 'Loading cities...' : 'Select a city'}</option>
                  {citiesData?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.City && <span className="error-text">{errors.City.message}</span>}
              </div>

              <div className="form-group">
                <label>Vehicle Age (Years)</label>
                <input type="number" {...register('Age_of_vehicle', { valueAsNumber: true })} placeholder="e.g. 5" className={errors.Age_of_vehicle ? 'error-input' : ''} />
                {errors.Age_of_vehicle && <span className="error-text">{errors.Age_of_vehicle.message}</span>}
              </div>

              <div className="form-group">
                <label>Number of Owners</label>
                <input type="number" {...register('Number_of_owners', { valueAsNumber: true })} placeholder="e.g. 1" className={errors.Number_of_owners ? 'error-input' : ''} />
                {errors.Number_of_owners && <span className="error-text">{errors.Number_of_owners.message}</span>}
              </div>

              <div className="full-width mt-4">
                <button type="submit" disabled={mutation.isPending} className="submit-btn primary-gradient">
                  {mutation.isPending ? 'Analyzing Data...' : 'Predict Mileage'}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="results-column">
            <div className="panel result-panel glass highlight-border">
              <h2 className="panel-title">
                <Fuel size={20} color="#38bdf8" />
                Prediction Result
              </h2>

              {!mutation.data && !mutation.isError && (
                <div className="empty-state">
                  <Search size={48} color="rgba(255,255,255,0.1)" />
                  <p>Fill out the parameters and click predict to see the estimated mileage.</p>
                </div>
              )}

              {mutation.isError && (
                <div className="error-state">
                  <p>Prediction failed. Please ensure the backend is running and reachable.</p>
                </div>
              )}

              {mutation.data && (
                <div className="result-display fade-in">
                  <div className="primary-result">
                    <span className="value">{mutation.data.predicted_mileage}</span>
                    <span className="unit">km/L</span>
                  </div>
                  <div className="range-box">
                    <p className="range-label">Expected Range</p>
                    <p className="range-value">
                      {mutation.data.range[0]} - {mutation.data.range[1]} km/L
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="panel chart-panel glass">
              <h2 className="panel-title">
                <BarChart3 size={20} color="#38bdf8" />
                Model Performance Metrics
              </h2>
              {metricsData && Object.keys(metricsData).length > 0 ? (
                <>
                  <div className="metrics-grid">
                    <div className="metric-box">
                      <span className="metric-title">Grade</span>
                      <span className={`metric-val ${metricsData.Grade === 'EXCELLENT' ? 'text-green' : 'text-blue'}`}>{metricsData.Grade}</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-title">Accuracy (&plusmn;1 km/L)</span>
                      <span className="metric-val">{metricsData.Within_1_km}%</span>
                    </div>
                  </div>
                  <div className="chart-container" style={{ aspectRatio: '16/9', marginTop: '20px' }}>
                    <Bar data={barData} options={barOptions} />
                  </div>
                </>
              ) : (
                <div className="chart-container" style={{ aspectRatio: '16/9' }}>
                  <p className="empty-chart-text">Loading metrics...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;