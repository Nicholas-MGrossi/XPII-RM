import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Activity, 
  Zap, 
  Database, 
  Lock, 
  RefreshCw,
  ChevronRight,
  Download,
  History,
  AlertTriangle,
  Fingerprint,
  BarChart3,
  Layers
} from 'lucide-react';
import { QuantumLattice } from './components/QuantumLattice';
import { generateProtocol, ProtocolResult, fastAIResponse } from './services/geminiService';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [synthesisProgress, setSynthesisProgress] = useState(0);
  const [synthesisStatus, setSynthesisStatus] = useState('');
  const [history, setHistory] = useState<ProtocolResult[]>([]);
  const [currentProtocol, setCurrentProtocol] = useState<ProtocolResult | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>(['SYSTEM_INIT: Axiomatic Refractor Online', 'READY: Awaiting genesis parameters...']);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authStep, setAuthStep] = useState<'idle' | 'scanning' | 'verifying' | 'granted'>('idle');
  
  // Chatbot state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fast query state
  const [fastQueryInput, setFastQueryInput] = useState('');
  const [fastQueryResult, setFastQueryResult] = useState('');
  const [isFastQueryLoading, setIsFastQueryLoading] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemLogs]);

  const handleAuth = () => {
    setAuthStep('scanning');
    addLog('AUTH_SCAN: Initiating biometric/axiomatic verification...');
    setTimeout(() => {
      setAuthStep('verifying');
      addLog('AUTH_VERIFY: Cross-referencing Sovereign Identity Protocol...');
      setTimeout(() => {
        setAuthStep('granted');
        setIsAuthorized(true);
        addLog('AUTH_SUCCESS: Access granted to AXIOMHIVE Core.');
      }, 1500);
    }, 1500);
  };

  const handleGenesis = async () => {
    if (!input.trim() || isGenerating || !isAuthorized) return;

    setIsGenerating(true);
    setSynthesisProgress(0);
    setSynthesisStatus('INITIALIZING_HAMILTONIAN_DESCENT');
    addLog(`GENESIS_INIT: H(M) -> H0 convergence initiated for "${input.substring(0, 20)}..."`);
    
    const steps = [
      { p: 15, s: 'AXIOMATIC_GROUNDING', l: 'GROUNDING: Establishing core truth parameters...' },
      { p: 35, s: 'SEMANTIC_QUANTIZATION', l: 'QUANTIZING: Deconstructing variables into linear logic...' },
      { p: 55, s: 'CAUSAL_LATTICE_SYNTHESIS', l: 'SYNTHESIZING: Integrating Hyperledger Indy & NetworkX...' },
      { p: 75, s: 'ML_GRAPH_PRUNING', l: 'PRUNING: ML-enhanced anomaly detection active...' },
      { p: 90, s: 'DETERMINISTIC_VALIDATION', l: 'VALIDATING: Verifying cryptographic proofs...' },
    ];

    try {
      // Simulate progress for visual feedback
      for (const step of steps) {
        setSynthesisProgress(step.p);
        setSynthesisStatus(step.s);
        addLog(step.l);
        await new Promise(r => setTimeout(r, 600));
      }

      const result = await generateProtocol(input);
      setSynthesisProgress(100);
      setSynthesisStatus('COMPLETED');
      setCurrentProtocol(result);
      setHistory(prev => [result, ...prev]);
      addLog(`SUCCESS: Protocol synthesized. Entropy: ${result.metrics.entropy} nats.`);
      setInput('');
    } catch (error) {
      addLog(`CRITICAL_ERROR: Synthesis failed. System entropy spike detected.`);
      setSynthesisStatus('ERROR');
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setSynthesisProgress(0);
        setSynthesisStatus('');
      }, 2000);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);
    
    try {
      const history = chatMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const { chatWithGemini } = await import('./services/geminiService');
      const response = await chatWithGemini(chatInput, history);
      setChatMessages(prev => [...prev, { role: 'model', text: response || 'No response.' }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: 'Error connecting to AXIOMHIVE Core.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFastQuery = async () => {
    if (!fastQueryInput.trim() || isFastQueryLoading) return;
    
    setIsFastQueryLoading(true);
    setFastQueryResult('CONSULTING_LITE_CORE...');
    addLog(`FAST_QUERY: "${fastQueryInput.substring(0, 20)}..."`);
    
    try {
      const response = await fastAIResponse(fastQueryInput);
      setFastQueryResult(response || 'No response.');
      addLog('FAST_QUERY: Response received.');
    } catch (error) {
      setFastQueryResult('Error connecting to Lite Core.');
    } finally {
      setIsFastQueryLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-black">
        <QuantumLattice />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 bg-black/80 border border-cyan-500/30 p-12 rounded-3xl backdrop-blur-xl text-center max-w-md w-full shadow-[0_0_50px_rgba(0,255,255,0.1)]"
        >
          <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center mx-auto mb-8 relative">
            <Shield className={cn("w-12 h-12 transition-all", authStep === 'granted' ? "text-emerald-400" : "text-cyan-400")} />
            {authStep === 'scanning' && (
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,1)]"
              />
            )}
          </div>
          
          <h1 className="font-orbitron text-2xl font-bold tracking-widest text-cyan-400 mb-2">AXIOMHIVE</h1>
          <p className="text-cyan-500/60 text-xs font-mono mb-8 uppercase tracking-tighter">Sovereign Identity Protocol v4.3</p>
          
          <div className="space-y-4">
            {authStep === 'idle' && (
              <button 
                onClick={handleAuth}
                className="w-full py-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-orbitron text-sm hover:bg-cyan-500/40 transition-all flex items-center justify-center gap-3"
              >
                <Fingerprint className="w-5 h-5" />
                INITIATE ACCESS
              </button>
            )}
            {authStep !== 'idle' && authStep !== 'granted' && (
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-cyan-400 font-mono text-xs animate-pulse">
                  {authStep === 'scanning' ? 'SCANNING_BIOMETRICS...' : 'VERIFYING_AXIOMS...'}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center p-4 md:p-8 overflow-hidden bg-[#050505]">
      <QuantumLattice />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center border-b border-cyan-500/20 bg-black/60 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center">
            <Shield className="text-cyan-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="font-orbitron text-lg md:text-xl font-bold tracking-widest text-cyan-400 text-glow-cyan">
              AXIOMATIC REFRACTOR
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] text-cyan-500/60 font-mono uppercase tracking-tighter">
                Sovereign Ascension Protocol v4.3.0 // ELITE_STATUS
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-mono text-cyan-500/40">
          <div className="flex flex-col items-end">
            <span className="text-cyan-400/80">H(M) CONVERGENCE</span>
            <span className="text-cyan-400 font-bold">0.001 nats</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-cyan-400/80">LATENCY (P99)</span>
            <span className="text-cyan-400 font-bold">&lt;30ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-yellow-500/80">SOVEREIGN_MODE</span>
            <span className="text-yellow-500 font-bold">ACTIVE</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 pb-20">
        
        {/* Left Column: Input & Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Input Panel */}
          <section className="bg-black/60 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-orbitron text-cyan-400 uppercase tracking-wider">Genesis Input</h2>
              </div>
              <span className="text-[9px] font-mono text-cyan-500/40">v4.3_TRACE</span>
            </div>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe conceptual system design..."
                className="w-full bg-black/40 border border-cyan-500/10 rounded-xl p-4 text-sm text-cyan-100 placeholder:text-cyan-900 focus:outline-none focus:border-cyan-500/40 transition-all min-h-[160px] resize-none font-mono"
              />
              <button
                onClick={handleGenesis}
                disabled={isGenerating || !input.trim()}
                className={cn(
                  "absolute bottom-4 right-4 px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-orbitron text-[10px] tracking-widest",
                  isGenerating || !input.trim() 
                    ? "bg-cyan-900/20 text-cyan-900 cursor-not-allowed" 
                    : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 hover:scale-105 active:scale-95 border border-cyan-500/30"
                )}
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isGenerating ? 'SYNTHESIZING...' : 'INITIATE'}
              </button>
            </div>

            {/* Progress Indicator */}
            <AnimatePresence>
              {(isGenerating || synthesisProgress > 0) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-cyan-500/10"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-orbitron text-cyan-400 animate-pulse">
                      {synthesisStatus}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-500/60">{synthesisProgress}%</span>
                  </div>
                  <div className="w-full h-1 bg-cyan-900/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${synthesisProgress}%` }}
                      className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Telemetry Panel */}
          <section className="bg-black/60 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-orbitron text-cyan-400 uppercase tracking-wider">Telemetry</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl">
                <span className="text-[9px] text-cyan-500/40 block mb-1">PRUNING_RATE</span>
                <span className="text-lg font-orbitron text-cyan-400">98.2%</span>
              </div>
              <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl">
                <span className="text-[9px] text-cyan-500/40 block mb-1">ML_INFERENCE</span>
                <span className="text-lg font-orbitron text-cyan-400">3.2x</span>
              </div>
              <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl">
                <span className="text-[9px] text-cyan-500/40 block mb-1">CAUSAL_NODES</span>
                <span className="text-lg font-orbitron text-cyan-400">14.8k</span>
              </div>
              <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl">
                <span className="text-[9px] text-cyan-500/40 block mb-1">UPTIME</span>
                <span className="text-lg font-orbitron text-cyan-400">99.99%</span>
              </div>
            </div>

            {/* Fast Query */}
            <div className="mt-6 pt-6 border-t border-cyan-500/10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span className="text-[9px] font-orbitron text-cyan-400 uppercase tracking-widest">Fast Query (Lite)</span>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  value={fastQueryInput}
                  onChange={(e) => setFastQueryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFastQuery()}
                  placeholder="Ask Lite Core..."
                  className="w-full bg-black/40 border border-cyan-500/10 rounded-lg py-2 px-3 text-[10px] text-cyan-100 placeholder:text-cyan-900 focus:outline-none focus:border-cyan-500/40 transition-all font-mono"
                />
                <button 
                  onClick={handleFastQuery}
                  disabled={isFastQueryLoading || !fastQueryInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-500/40 hover:text-cyan-400 disabled:opacity-50"
                >
                  {isFastQueryLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              </div>
              {fastQueryResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg text-[9px] font-mono text-cyan-100/80 leading-relaxed"
                >
                  {fastQueryResult}
                </motion.div>
              )}
            </div>
          </section>

          {/* System Logs */}
          <section className="bg-black/60 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-md flex-1 flex flex-col min-h-[200px]">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-orbitron text-cyan-400 uppercase tracking-wider">System Logs</h2>
            </div>
            <div className="flex-1 font-mono text-[9px] text-cyan-500/60 overflow-y-auto max-h-[250px] space-y-1 custom-scrollbar">
              {systemLogs.map((log, i) => (
                <div key={i} className="border-l border-cyan-500/20 pl-2 py-0.5">
                  <span className="text-cyan-700 mr-2">{log.split(']')[0]}]</span>
                  <span className={cn(
                    log.includes('SUCCESS') ? 'text-emerald-400/80' : 
                    log.includes('ERROR') ? 'text-red-400/80' : 
                    'text-cyan-400/80'
                  )}>
                    {log.split(']')[1]}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </section>
        </div>

        {/* Center/Right Column: Protocol Display */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {currentProtocol ? (
              <motion.div
                key={currentProtocol.timestamp}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-black/90 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-2xl relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
              >
                {/* Decorative Grid Background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-all duration-700">
                  <Layers className="w-48 h-48 text-cyan-400" />
                </div>
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[8px] font-bold tracking-widest uppercase">Verified Synthesis</span>
                      <span className="text-[9px] text-cyan-500/40 font-mono uppercase tracking-[0.2em]">v4.3.0_TRACE</span>
                    </div>
                    <h3 className="font-orbitron text-3xl font-bold text-cyan-400 text-glow-cyan">GENESIS_RESULT</h3>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 rounded-xl border border-cyan-500/20 text-cyan-500/40 hover:text-cyan-400 hover:border-cyan-400 transition-all bg-black/40">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-10 relative z-10">
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <h4 className="text-[10px] font-orbitron text-yellow-400 uppercase tracking-[0.3em]">Axiomatic Grounding</h4>
                    </div>
                    <div className="bg-yellow-400/5 border border-yellow-400/20 p-5 rounded-2xl">
                      <p className="text-yellow-100/90 leading-relaxed font-mono text-sm italic">
                        "{currentProtocol.axiom}"
                      </p>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <RefreshCw className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-[10px] font-orbitron text-cyan-400 uppercase tracking-[0.3em]">Protocol Synthesis</h4>
                    </div>
                    <div className="text-cyan-100/90 leading-relaxed text-sm font-sans space-y-4">
                      {currentProtocol.synthesis.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="text-emerald-400 w-4 h-4" />
                        <h4 className="text-[10px] font-orbitron text-emerald-400 uppercase tracking-[0.3em]">Validation Proof</h4>
                      </div>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                        <p className="text-emerald-100/80 text-xs font-mono">
                          {currentProtocol.validation}
                        </p>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="text-cyan-400 w-4 h-4" />
                        <h4 className="text-[10px] font-orbitron text-cyan-400 uppercase tracking-[0.3em]">Synthesis Metrics</h4>
                      </div>
                      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[8px] text-cyan-500/40 block">ENTROPY</span>
                          <span className="text-xs font-mono text-cyan-400">{currentProtocol.metrics.entropy} nats</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-cyan-500/40 block">VALUATION</span>
                          <span className="text-xs font-mono text-cyan-400">{currentProtocol.metrics.valuation}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-cyan-500/40 block">LATENCY</span>
                          <span className="text-xs font-mono text-cyan-400">{currentProtocol.metrics.latency}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-cyan-500/40 block">PRUNING</span>
                          <span className="text-xs font-mono text-cyan-400">{currentProtocol.metrics.pruningRate}</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-cyan-500/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-cyan-500/40 relative z-10">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      SIG: {currentProtocol.signature}
                    </span>
                    <span>TIMESTAMP: {new Date(currentProtocol.timestamp).toISOString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded border border-cyan-500/20">DETERMINISTIC_FIDELITY_VERIFIED</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-cyan-500/10 rounded-3xl bg-cyan-500/5 backdrop-blur-sm">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border border-cyan-500/20 flex items-center justify-center mb-8 relative"
                >
                  <Cpu className="w-12 h-12 text-cyan-500/40" />
                  <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-pulse" />
                </motion.div>
                <h3 className="font-orbitron text-cyan-400 text-xl mb-4 tracking-widest">AWAITING GENESIS PARAMETERS</h3>
                <p className="text-cyan-500/40 text-sm max-w-md font-mono leading-relaxed">
                  The AXIOMATIC REFRACTOR is primed. Input your conceptual framework to initiate Hamiltonian descent-inspired convergence.
                </p>
                <div className="mt-8 flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-[8px] text-cyan-500/60 font-mono">
                    <Activity className="w-2 h-2" />
                    LATTICE_READY
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-[8px] text-cyan-500/60 font-mono">
                    <Database className="w-2 h-2" />
                    SIP_LOADED
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* History / Recent Protocols */}
          <section className="bg-black/60 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-orbitron text-cyan-400 uppercase tracking-wider">Activation Trace History</h2>
              </div>
              <span className="text-[9px] font-mono text-cyan-500/40">{history.length} TRACES_STORED</span>
            </div>
            
            <div className="relative timeline-container pl-10 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
              {history.length > 0 ? history.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "timeline-item relative cursor-pointer group transition-all",
                    currentProtocol?.timestamp === item.timestamp ? "selected scale-[1.02]" : "hover:scale-[1.01]"
                  )}
                  onClick={() => setCurrentProtocol(item)}
                >
                  <div className={cn(
                    "bg-cyan-500/5 border p-4 rounded-xl transition-all duration-300",
                    currentProtocol?.timestamp === item.timestamp ? "border-cyan-500/50 bg-cyan-500/10" : "border-cyan-500/10 group-hover:border-cyan-500/30"
                  )}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-orbitron text-cyan-400 tracking-widest">
                        {item.signature.split('-').pop()}
                      </span>
                      <span className="text-[8px] text-cyan-500/40 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[10px] text-cyan-100/80 font-mono line-clamp-1 italic">"{item.axiom}"</p>
                    <div className="mt-2 flex gap-3">
                      <span className="text-[8px] text-cyan-500/40 font-mono">H(M): {item.metrics.entropy}</span>
                      <span className="text-[8px] text-cyan-500/40 font-mono">VAL: {item.metrics.valuation}</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="w-8 h-8 text-cyan-500/20 mb-4" />
                  <p className="text-cyan-500/20 text-[10px] font-mono uppercase tracking-widest">No traces recorded in current session.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="fixed bottom-0 left-0 w-full p-4 flex justify-between items-center pointer-events-none z-50 bg-black/40 backdrop-blur-sm border-t border-cyan-500/10">
        <div className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-[0.5em] hidden md:block">
          Deterministic Genesis Engine // Verifiable Reality // AXIOMHIVE_SIP_v4.3
        </div>
        <div className="flex gap-6 text-[8px] font-mono text-cyan-500/40 uppercase tracking-widest ml-auto">
          <span>MEM_LOAD: 14%</span>
          <span>CPU_SYNC: 0.001ms</span>
          <span>LATTICE: STABLE</span>
        </div>
      </footer>

      {/* Chatbot Toggle */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-20 right-8 w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/40 transition-all z-[60] shadow-[0_0_20px_rgba(0,255,255,0.2)]"
      >
        <Activity className={cn("w-6 h-6", isChatLoading && "animate-pulse")} />
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-36 right-8 w-80 md:w-96 h-[500px] bg-black/90 border border-cyan-500/30 rounded-2xl backdrop-blur-xl z-[60] flex flex-col overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center bg-cyan-500/5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-orbitron text-cyan-400 tracking-widest">AXIOMHIVE_ASSISTANT</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-cyan-500/40 hover:text-cyan-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatMessages.length === 0 && (
                <div className="text-center py-10">
                  <Cpu className="w-10 h-10 text-cyan-500/20 mx-auto mb-4" />
                  <p className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-widest">Awaiting query...</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <span className="text-[8px] font-mono text-cyan-500/40 mb-1 uppercase">{msg.role}</span>
                  <div className={cn(
                    "p-3 rounded-xl text-xs font-mono leading-relaxed markdown-body",
                    msg.role === 'user' 
                      ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30" 
                      : "bg-black/40 text-cyan-400/90 border border-cyan-500/10"
                  )}>
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex flex-col max-w-[85%] mr-auto items-start">
                  <span className="text-[8px] font-mono text-cyan-500/40 mb-1 uppercase">model</span>
                  <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/10 flex gap-1">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-cyan-500/20 bg-black/40">
              <div className="relative">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Ask about the protocol..."
                  className="w-full bg-black/40 border border-cyan-500/20 rounded-lg py-2 px-3 text-xs text-cyan-100 placeholder:text-cyan-900 focus:outline-none focus:border-cyan-500/40 transition-all font-mono"
                />
                <button 
                  onClick={handleChat}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-500/40 hover:text-cyan-400 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
