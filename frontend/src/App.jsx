import { Routes, Route } from 'react-router-dom';

// Import Layout & Page Components
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AssistantPage from './pages/AssistantPage';

function App() {
  return (
    <Routes>
      {/* This is the main layout that includes the Header and Footer */}
      <Route path="/" element={<Layout />}>
        {/* The index route will be the default page shown inside the Layout */}
        <Route index element={<HomePage />} />
        
        {/* Other pages that will also use the same Layout */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="assistant" element={<AssistantPage />} />

        {/* Add other routes like "/find-doctor" here later */}
      </Route>
    </Routes>
  );
}

export default App;
