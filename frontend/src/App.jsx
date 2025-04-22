import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import DefaultPage from './default/DefaultPage';
import MainPage from './pages/MainPage';
import PetVsEnvironment from './pages/PetVsEnvironment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to LoginPage */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<MainPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/petvsenvironment' element={<PetVsEnvironment />} />
        {/* Catch-all route for unimplemented features */}
        <Route path="*" element={<DefaultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;