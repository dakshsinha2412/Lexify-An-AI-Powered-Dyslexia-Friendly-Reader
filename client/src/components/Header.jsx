import { Brain, Maximize2 } from 'lucide-react';

export default function Header({ onToggleFocus, onGoHome }) {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#F5F5F7]/90 backdrop-blur-xl border-b border-[#E5E5E7] flex items-center justify-between px-8 z-50 transition-all">
            <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onGoHome}
            >
                <img src="/logo.png" alt="Lexify Logo" className="h-10 w-auto rounded-lg object-contain shadow-xs" />
                <div className="flex items-baseline space-x-2">
                    <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] m-0">Lexify</h1>
                    <span className="text-sm text-[#86868B] hidden sm:inline-block font-medium">Reader</span>
                </div>
            </div>

            <button 
                onClick={onToggleFocus}
                className="flex items-center space-x-2 px-5 py-2 bg-white border border-[#E5E5E7] hover:border-[#0071E3] hover:text-[#0071E3] rounded-full text-sm font-semibold text-[#1D1D1F] transition-all shadow-xs active:scale-95 cursor-pointer"
            >
                <Maximize2 size={16} />
                <span>Focus Mode</span>
            </button>
        </header>
    );
}
