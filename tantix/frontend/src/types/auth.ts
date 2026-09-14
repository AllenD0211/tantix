export interface UserSession {
  email: string;
  server: string;
  isDemo: boolean;
  balance: number;
  equity: number;
  freeMargin?: number;
  marginLevel?: number;
  activeRiskPercent?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  server: string;
  rememberMe?: boolean;
}
