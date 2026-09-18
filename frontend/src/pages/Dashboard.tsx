import React, { useState, useMemo } from 'react';
import type { UserSession } from '../types/auth';
import type { InstrumentType } from '../types/calculator';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { TickerBar } from '../components/layout/TickerBar';
import { InstrumentSelector } from '../components/calculator/InstrumentSelector';
import { TradeAnalysisChart } from '../components/charts/TradeAnalysisChart';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { ResultSummary } from '../components/calculator/ResultSummary';
import { InstrumentInfo } from '../components/calculator/InstrumentInfo';
import { calculateTrade, getDefaultInputs, validateInputs } from '../services/calculator/calculatorEngine';
import type { ActiveCalculatorInputs } from '../utils/instrumentDisplay';

export interface DashboardProps {
  session: UserSession;
  onSignOut: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  session,
  onSignOut,
  theme,
  onToggleTheme,
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('forex');
  const sessionBalance = session.balance || 10000;

  const [inputs, setInputs] = useState<ActiveCalculatorInputs>(() =>
    getDefaultInputs('forex', sessionBalance) as ActiveCalculatorInputs
  );

  const handleSelectInstrument = (type: InstrumentType) => {
    if (type !== 'forex' && type !== 'gold') return;
    setSelectedInstrument(type);
    setInputs(getDefaultInputs(type, sessionBalance) as ActiveCalculatorInputs);
  };

  const validationErrors = useMemo(() => {
    return validateInputs(inputs);
  }, [inputs]);

  const calculationResult = useMemo(() => {
    return calculateTrade(inputs);
  }, [inputs]);

  const handleReset = () => {
    setInputs(getDefaultInputs(selectedInstrument, sessionBalance) as ActiveCalculatorInputs);
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative pb-8">
      <DashboardHeader
        session={session}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSignOut={onSignOut}
      />

      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
        <TickerBar />

        <InstrumentSelector
          selected={selectedInstrument}
          onSelect={handleSelectInstrument}
        />

        {/* 2. TOP-SIDE: Trade Analysis Chart & Outcome Overview (As requested) */}
        <section aria-label="Trade Outcome Analysis">
          <TradeAnalysisChart result={calculationResult} inputs={inputs} />
        </section>

        {/* 3. Calculator Form & Detailed Summary Side-by-Side or Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Primary: Calculator Form (7 cols on lg) */}
          <div className="lg:col-span-7">
            <CalculatorForm
              inputs={inputs}
              errors={validationErrors}
              onChange={setInputs}
              onReset={handleReset}
            />
          </div>

          {/* Right: Detailed Result Summary (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <ResultSummary result={calculationResult} inputs={inputs} />
          </div>
        </div>

        {/* 4. Educational Guide & Formula Documentation */}
        <InstrumentInfo inputs={inputs} />
      </div>
    </div>
  );
};

export default Dashboard;
