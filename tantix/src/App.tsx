import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import type { MouseEvent } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Footer } from './components/layout/Footer';
import type { UserSession } from './types/auth';
import './App.css';

type Theme = 'dark' | 'light';

export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('tantix_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tantix_theme', theme);
  }, [theme]);

  const applyTheme = (next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('tantix_theme', next);
    flushSync(() => setTheme(next));
  };

  const toggleTheme = (event?: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    if (event) {
      document.documentElement.style.setProperty('--theme-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--theme-y', `${event.clientY}px`);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startViewTransition = document.startViewTransition?.bind(document);

    if (reduceMotion || !startViewTransition) {
      document.documentElement.classList.add('theme-animating');
      applyTheme(next);
      window.setTimeout(() => {
        document.documentElement.classList.remove('theme-animating');
      }, 520);
      return;
    }

    startViewTransition(() => {
      applyTheme(next);
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--neu-bg)] text-[var(--neu-text-primary)] forex-bg-grid">
      <Dashboard
        session={session}
        onLoginSuccess={setSession}
        onSignOut={() => setSession(null)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <Footer />
    </div>
  );
}

export default App;
