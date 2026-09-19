import React from 'react';
import { Login } from './Login';
import type { UserSession } from '../types/auth';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = Login;

