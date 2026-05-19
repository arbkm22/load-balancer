import { useState } from 'react';
import { balanceHammers } from './utils/balancer';
import type { Hammer, BalanceResult } from './utils/balancer';
import './App.css';

const INITIAL_HAMMERS: Hammer[] = [
  { serial: 1, weight: 41.01 }, { serial: 2, weight: 40.84 }, { serial: 3, weight: 41.48 }, { serial: 4, weight: 41.71 },
  { serial: 5, weight: 41.32 }, { serial: 6, weight: 40.81 }, { serial: 7, weight: 41.37 }, { serial: 8, weight: 41.40 },
  { serial: 9, weight: 41.84 }, { serial: 10, weight: 41.06 }, { serial: 11, weight: 41.42 }, { serial: 12, weight: 41.58 },
  { serial: 13, weight: 41.50 }, { serial: 14, weight: 41.12 }, { serial: 15, weight: 41.59 }, { serial: 16, weight: 41.48 },
  { serial: 17, weight: 41.16 }, { serial: 18, weight: 41.46 }, { serial: 19, weight: 41.29 }, { serial: 20, weight: 41.36 },
  { serial: 21, weight: 40.85 }, { serial: 22, weight: 41.70 }, { serial: 23, weight: 42.06 }, { serial: 24, weight: 40.90 }
];

type View = 'calculator' | 'results' | 'configurations';

function App() {
  const [hammers, setHammers] = useState<Hammer[]>(INITIAL_HAMMERS);
  const [result, setResult] = useState<BalanceResult | null>(null);
  const [isBalancing, setIsBalancing] = useState(false);
  const [currentView, setCurrentView] = useState<View>('calculator');
  const [configCount, setConfigCount] = useState<number>(hammers.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleWeightChange = (serial: number, weight: string) => {
    const val = parseFloat(weight) || 0;
    setHammers(prev => prev.map(h => h.serial === serial ? { ...h, weight: val } : h));
  };

  const handleBalance = () => {
    setIsBalancing(true);
    setCurrentView('results');
    setTimeout(() => {
      const res = balanceHammers(hammers);
      setResult(res);
      setIsBalancing(false);
    }, 400);
  };
  
  const handleReset = () => {
    setHammers(prev => prev.map(h => ({ ...h, weight: 0 })));
    setResult(null);
  };

  const handleApplyConfig = () => {
    const newCount = Math.max(3, Math.min(100, configCount)); // Keep it reasonable
    setHammers(prev => {
      if (newCount === prev.length) return prev;
      if (newCount < prev.length) return prev.slice(0, newCount);
      const toAdd = newCount - prev.length;
      const newItems = Array.from({ length: toAdd }, (_, i) => ({
        serial: prev.length + i + 1,
        weight: 0
      }));
      return [...prev, ...newItems];
    });
    setResult(null); // Reset results when count changes
    setCurrentView('calculator');
  };

  const totalWeight = hammers.reduce((s, h) => s + h.weight, 0);

  const renderNavButton = (view: View, icon: string, label: string) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }} 
        className={`font-bold rounded-xl flex items-center gap-3 px-4 py-3 transition-opacity w-full text-left ${isActive ? 'bg-primary-container text-on-primary-container hover:opacity-80' : 'text-on-surface-variant hover:bg-surface-container-high hover:bg-surface-container-highest transition-all'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-on-surface/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <nav className={`bg-surface-container text-primary font-label-caps fixed md:static left-0 top-0 h-full w-64 shadow-sm flex flex-col p-md gap-4 p-4 border-r border-outline-variant flex-shrink-0 z-50 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-8 mt-2 px-4 flex justify-between items-center">
          <div>
            <h1 className="font-headline-sm text-headline-sm font-black text-primary tracking-tight">AeroBalance</h1>
            <p className="text-on-surface-variant text-xs mt-1">Precision Utility</p>
          </div>
          <button 
            className="md:hidden text-on-surface-variant p-2 rounded-full hover:bg-surface-container-high transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col gap-2 flex-grow">
          {renderNavButton('calculator', 'calculate', 'Calculator')}
          {renderNavButton('results', 'analytics', 'Results')}
          {renderNavButton('configurations', 'settings_suggest', 'Configurations')}
        </div>
        <div className="mt-auto border-t border-outline-variant pt-4 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          </div>
          <div>
            <p className="font-bold text-sm text-on-surface">User Profile</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TopAppBar */}
        <header className="bg-surface text-primary font-headline-sm text-headline-sm docked full-width top-0 border-b border-outline-variant flat no-shadow flex justify-between items-center w-full px-6 py-4 h-16 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-headline-md text-headline-md font-bold text-primary md:hidden">AeroBalance Pro</h2>
            <div className="hidden md:flex items-center h-full">
              <span className="text-on-surface font-semibold text-lg">
                {currentView === 'calculator' ? 'Weight Balancing Calculator' : 
                 currentView === 'results' ? 'Load Distribution Results' : 
                 'System Configurations'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-br from-primary-container/20 to-transparent -z-10 pointer-events-none rounded-bl-full"></div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* CALCULATOR VIEW */}
            {currentView === 'calculator' && (
              <div className="w-full max-w-container-max flex flex-col gap-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
                  <div>
                    <h2 className="font-display-lg text-display-lg text-on-background mb-xs">Weight Balancing</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Enter payload weights to calculate optimal distribution across sections.</p>
                  </div>
                  <div className="flex items-center gap-md w-full md:w-auto mt-4 md:mt-0">
                    <button 
                      onClick={handleReset}
                      className="flex-1 md:flex-none px-lg py-sm border border-outline text-on-surface-variant rounded font-headline-sm text-headline-sm hover:bg-surface-container-low transition-colors px-6 py-2"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleBalance}
                      className="flex-1 md:flex-none px-lg py-sm bg-primary text-on-primary rounded font-headline-sm text-headline-sm hover:opacity-90 transition-colors shadow-sm px-6 py-2"
                    >
                      Calculate Load
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">System Ready</span>
                  </div>
                  <div className="text-right">
                    <div className="font-data-mono-lg text-data-mono-lg text-on-surface font-medium text-lg">Total: {totalWeight.toFixed(2)} kg</div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant text-xs mt-1">{hammers.length} Items Configured</div>
                  </div>
                </div>

                <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-6">
                  <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Payload Registry</h3>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">filter_list</span>
                  </div>
                  <div className="p-6 bg-surface">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
                      {hammers.map(h => (
                        <div key={h.serial} className="flex flex-col gap-2">
                          <label className="font-label-caps text-label-caps text-on-surface-variant text-xs font-bold uppercase tracking-wider">Weight {h.serial}</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              step="0.01"
                              value={h.weight || ''} 
                              onChange={(e) => handleWeightChange(h.serial, e.target.value)}
                              placeholder="0.0" 
                              className={`w-full ${h.weight ? 'bg-surface-container-low' : 'bg-surface-container-lowest'} border border-outline-variant rounded px-3 py-2 pr-8 font-data-mono-md text-data-mono-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-2 transition-all`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-caps text-label-caps text-outline text-xs">kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS VIEW */}
            {currentView === 'results' && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-display font-bold text-3xl text-on-surface tracking-tight">Balance Computed</h2>
                    <p className="text-on-surface-variant mt-1">Flight ID: AB-77X-9201 • Target per group: {result?.target.toFixed(2) || '0.00'} kg</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => setCurrentView('calculator')} className="flex items-center gap-2 px-5 py-2.5 border border-outline text-on-surface font-medium rounded-full hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-xl">arrow_back</span>
                      Back to Calculator
                    </button>
                    {result && (
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-medium rounded-full shadow-sm hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-xl">download</span>
                        Export Report
                      </button>
                    )}
                  </div>
                </div>

                {!result && !isBalancing && (
                  <div className="card empty-state mt-8 bg-surface border border-outline-variant rounded-xl p-16 text-center shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">analytics</span>
                    <h3 className="font-headline-md text-on-surface mb-2">No Results Yet</h3>
                    <p className="text-on-surface-variant">Return to the Calculator and select "Review Distribution" to see the balance.</p>
                  </div>
                )}

                {isBalancing && (
                  <div className="card empty-state mt-8 bg-surface border border-outline-variant rounded-xl p-16 text-center shadow-sm">
                    <div className="w-12 h-12 border-4 border-surface-container-highest border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="font-headline-md text-on-surface mb-2">Searching for Optimization...</h3>
                    <p className="text-on-surface-variant">Processing payload combinations.</p>
                  </div>
                )}

                {result && !isBalancing && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-success-container text-on-success-container p-6 rounded-2xl flex flex-col justify-center items-start shadow-sm relative overflow-hidden border border-success/20">
                        <div className="absolute right-4 top-4 bg-success/10 p-3 rounded-full">
                          <span className="material-symbols-outlined text-success text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <span className="font-label-caps text-success font-bold mb-2 text-xs">STATUS</span>
                        <h3 className="text-2xl font-bold">Balance Successful</h3>
                        <p className="text-sm mt-1 opacity-80">Variance: {result.bestDiff.toFixed(3)} kg</p>
                      </div>
                      <div className="bg-surface-container p-6 rounded-2xl flex flex-col justify-center border border-outline-variant/50 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 opacity-5">
                          <span className="material-symbols-outlined text-[150px]">scale</span>
                        </div>
                        <span className="font-label-caps text-on-surface-variant font-bold mb-2 text-xs">TOTAL PAYLOAD COMPUTED</span>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-4xl font-black text-on-surface tracking-tighter">{totalWeight.toFixed(2)}</h3>
                          <span className="text-xl text-on-surface-variant font-medium">kg</span>
                        </div>
                        <div className="mt-4 flex gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-on-surface-variant">{hammers.length} Items processed</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">view_week</span>
                        Section Distribution Details
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {(['A', 'B', 'C'] as const).map(name => {
                          const groupItems = result.groups[name] || [];
                          const total = groupItems.reduce((s, h) => s + h.weight, 0);
                          const percent = totalWeight > 0 ? (total / totalWeight) * 100 : 0;
                          return (
                            <div key={name} className="bg-surface rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden flex flex-col hover:border-primary/40 transition-colors group">
                              <div className="p-5 border-b border-outline-variant/40 bg-surface-container-highest/30 flex justify-between items-center">
                                <h4 className="font-bold text-lg text-on-surface flex items-center gap-2">
                                  <div className="w-8 h-8 rounded bg-primary-container text-primary-container-on flex items-center justify-center font-bold font-mono text-sm">{name}</div>
                                  Section {name}
                                </h4>
                                <span className="bg-surface text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold border border-outline-variant/50">{groupItems.length} items</span>
                              </div>
                              <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-6">
                                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Allocated Mass</p>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-on-surface">{total.toFixed(2)}</span>
                                    <span className="text-sm font-medium text-on-surface-variant">kg</span>
                                  </div>
                                  <div className="w-full bg-surface-container-high h-2 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }}></div>
                                  </div>
                                </div>
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Item Breakdown</p>
                                <div className="grid grid-cols-2 gap-2 mt-auto max-h-48 overflow-y-auto">
                                  {groupItems.map(h => (
                                    <div key={h.serial} className="bg-surface-container px-3 py-2 rounded-lg text-sm flex justify-between border border-transparent group-hover:border-outline-variant/30 transition-colors">
                                      <span>H-{h.serial.toString().padStart(2, '0')}</span>
                                      <span className="font-mono font-medium">{h.weight.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* CONFIGURATIONS VIEW */}
            {currentView === 'configurations' && (
              <div className="w-full max-w-container-max flex flex-col gap-lg">
                <div>
                  <h2 className="font-display-lg text-display-lg text-on-background mb-xs">System Configurations</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Manage application settings and default parameters.</p>
                </div>

                <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-6 max-w-2xl">
                  <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Payload Registry Setup</h3>
                  </div>
                  <div className="p-6 bg-surface flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-headline-sm text-on-surface">Total Number of Items</label>
                      <p className="text-on-surface-variant text-sm mb-2">Adjust how many items can be entered in the calculator. Setting this will immediately update the payload registry grid.</p>
                      
                      <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          min="3" 
                          max="100"
                          value={configCount} 
                          onChange={(e) => setConfigCount(parseInt(e.target.value) || 3)}
                          className="w-32 bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-data-mono-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-2 transition-all"
                        />
                        <button 
                          onClick={handleApplyConfig}
                          disabled={configCount === hammers.length}
                          className={`px-6 py-2 rounded font-headline-sm font-semibold transition-colors ${configCount !== hammers.length ? 'bg-primary text-on-primary hover:opacity-90 shadow-sm' : 'bg-surface-container-highest text-outline-variant cursor-not-allowed'}`}
                        >
                          Apply Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pb-10"></div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
