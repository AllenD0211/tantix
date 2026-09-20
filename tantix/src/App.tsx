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
    const root = document.documentElement;

    if (event) {
      root.style.setProperty('--theme-x', `${event.clientX}px`);
      root.style.setProperty('--theme-y', `${event.clientY}px`);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startViewTransition = document.startViewTransition?.bind(document);
    const durationMs = next === 'dark' ? 900 : 700;

    root.classList.remove('theme-to-dark', 'theme-to-light');
    root.classList.add(next === 'dark' ? 'theme-to-dark' : 'theme-to-light');

    const finish = () => {
      window.setTimeout(() => {
        root.classList.remove('theme-to-dark', 'theme-to-light', 'theme-animating');
      }, durationMs);
    };

    if (reduceMotion || !startViewTransition) {
      root.classList.add('theme-animating');
      applyTheme(next);
      finish();
      return;
    }

    const transition = startViewTransition(() => {
      applyTheme(next);
    });

    transition.finished.finally(finish);
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
