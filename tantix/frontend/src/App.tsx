import { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Footer } from './components/layout/Footer';
import type { UserSession } from './types/auth';
import './App.css';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('tantix_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tantix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--neu-bg)] text-[var(--neu-text-primary)] forex-bg-grid transition-colors duration-200">
      {!session ? (
        <Login
          onLoginSuccess={setSession}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <Dashboard
          session={session}
          onSignOut={() => setSession(null)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Institutional Legal & Risk Disclaimer */}
      <Footer />
    </div>
  );
}

export default App;
