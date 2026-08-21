import { useState, useEffect } from 'react';
import { Copy, Download, MessageSquare, List, Sparkles, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import ReadabilityBadge from './ReadabilityBadge';
import TTSControls from './TTSControls';

export default function OutputPanel({
    currentResult, loading, mode, onModeChange,
    readabilityBefore, readabilityAfter,
    useDyslexicFont, wordSpacing, lineHeight, fontSize,
    glossary = [], focusMode, onToggleFocus
}) {
    const [copied, setCopied] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const handleCopy = () => {
        if (!currentResult) return;
        navigator.clipboard.writeText(currentResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!currentResult) return;
        const blob = new Blob([currentResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lexify-${mode}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const tabs = [
        { id: 'simplified', icon: <MessageSquare size={14} />, label: 'Simplified' },
        { id: 'bullets', icon: <List size={14} />, label: 'Bullets' },
        { id: 'plain', icon: <Sparkles size={14} />, label: 'Plain' },
    ];

    const getSentences = (text) => {
        if (!text) return [];
        const allSentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const segments = [];
        for (let i = 0; i < allSentences.length; i += 2) {
            segments.push(allSentences.slice(i, i + 2).join(' ').trim());
        }
        return segments;
    };

    const sentences = getSentences(currentResult);

    useEffect(() => {
        setCurrentCardIndex(0);
    }, [currentResult]);

    const renderComplexText = (text) => {
        if (!text || !glossary || glossary.length === 0) return text;

        let parts = [text];
        
        glossary.forEach(({ word, definition }) => {
            const newParts = [];
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            
            parts.forEach(part => {
                if (typeof part !== 'string') {
                    newParts.push(part);
                    return;
                }
                
                const split = part.split(regex);
                split.forEach((subPart, i) => {
                    if (subPart.toLowerCase() === word.toLowerCase()) {
                        newParts.push(
                            <span 
                                key={`${word}-${i}`}
                                className="border-b-2 border-dashed border-[#0071E3] text-[#0071E3] font-medium cursor-help relative group inline-block px-0.5 rounded-xs"
                            >
                                {subPart}
                                <span className={`
                                    absolute bottom-full mb-3 px-4 py-3 bg-[#1D1D1F]/90 backdrop-blur-xl border border-white/20
                                    text-white text-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-all 
                                    pointer-events-none z-50 w-64 shadow-[0_12px_30px_rgba(0,0,0,0.3)] 
                                    text-center leading-relaxed transform translate-y-1 group-hover:translate-y-0
                                    left-1/2 -translate-x-1/2 
                                    before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-6 before:border-transparent before:border-t-[#1D1D1F]
                                `}>
                                    <span className="font-semibold block mb-1 text-[#0071E3] uppercase tracking-wider text-[10px]">
                                        Vocabulary
                                    </span>
                                    <span className="font-bold text-sm block mb-1 text-white">{word}</span>
                                    <span className="text-[#86868B] text-xs leading-normal">{definition}</span>
                                </span>
                            </span>
                        );
                    } else if (subPart !== '') {
                        newParts.push(subPart);
                    }
                });
            });
            parts = newParts;
        });

        return parts;
    };

    return (
        <div className={`flex flex-col flex-1 bg-white rounded-3xl border border-[#E5E5E7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative transition-all duration-500 overflow-hidden ${focusMode ? 'h-full shadow-2xl border-[#0071E3]/40' : 'h-full'}`}>
            
            {/* Apple Mode Tabs */}
            {!focusMode && (
                <div className="p-3 bg-[#F5F5F7]/80 border-b border-[#E5E5E7] flex justify-between items-center">
                    <div className="bg-[#E8E8ED] p-1 rounded-2xl flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onModeChange(tab.id)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${mode === tab.id
                                        ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                        : 'text-[#86868B] hover:text-[#1D1D1F]'
                                    }`}
                            >
                                {tab.icon} <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2">
                        {currentResult && <TTSControls text={focusMode ? sentences[currentCardIndex] : currentResult} />}
                        <button
                            onClick={handleCopy}
                            disabled={!currentResult}
                            className="p-2 text-[#86868B] hover:text-[#1D1D1F] hover:bg-white rounded-xl transition-all disabled:opacity-30 cursor-pointer border border-transparent hover:border-[#E5E5E7]"
                            title="Copy to clipboard"
                        >
                            <Copy size={16} className={copied ? "text-green-600" : ""} />
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={!currentResult}
                            className="p-2 text-[#86868B] hover:text-[#1D1D1F] hover:bg-white rounded-xl transition-all disabled:opacity-30 cursor-pointer border border-transparent hover:border-[#E5E5E7]"
                            title="Download .txt"
                        >
                            <Download size={16} />
                        </button>
                        <button
                            onClick={onToggleFocus}
                            className="p-2 text-[#86868B] hover:text-[#0071E3] hover:bg-white rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#E5E5E7]"
                            title={focusMode ? "Minimize" : "Focus Mode"}
                        >
                            {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Readability Indicator Bar */}
            <div className="px-6 py-2 bg-[#F5F5F7]/30 border-b border-[#E5E5E7]/50 flex justify-between items-center">
                <ReadabilityBadge before={readabilityBefore} after={readabilityAfter} />
            </div>

            {/* Content Display Area */}
            <div className={`flex-1 relative transition-all duration-500 p-8 overflow-y-auto ${focusMode ? 'flex items-center justify-center bg-white' : 'bg-white'}`}>
                {loading ? (
                    <div className="p-6 w-full animate-pulse space-y-4">
                        <div className="h-4 bg-[#E5E5E7] rounded-full w-3/4"></div>
                        <div className="h-4 bg-[#E5E5E7] rounded-full"></div>
                        <div className="h-4 bg-[#E5E5E7] rounded-full w-5/6"></div>
                        <div className="h-4 bg-[#E5E5E7] rounded-full w-1/2"></div>
                    </div>
                ) : currentResult ? (
                    focusMode ? (
                        <div className="w-full max-w-2xl px-6 flex flex-col items-center">
                            <div className="min-h-[220px] flex items-center justify-center text-center p-10 bg-[#F5F5F7] border border-[#E5E5E7] rounded-[32px] shadow-lg animate-scale-in">
                                <div
                                    className={`text-[#1D1D1F] leading-relaxed transition-all duration-300 ${useDyslexicFont ? 'font-lexy' : 'font-sans'}`}
                                    style={{
                                        fontSize: `${fontSize + 10}px`,
                                        wordSpacing: `${wordSpacing + 0.2}rem`
                                    }}
                                >
                                    {renderComplexText(sentences[currentCardIndex])}
                                </div>
                            </div>
                            
                            <div className="mt-8 flex items-center space-x-6">
                                <button 
                                    onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentCardIndex === 0}
                                    className="p-3 bg-white border border-[#E5E5E7] rounded-full shadow-xs hover:bg-[#F5F5F7] hover:text-[#0071E3] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                
                                <div className="text-[#86868B] font-semibold text-xs tracking-widest">
                                    {currentCardIndex + 1} <span className="opacity-40">/</span> {sentences.length}
                                </div>

                                <button 
                                    onClick={() => setCurrentCardIndex(prev => Math.min(sentences.length - 1, prev + 1))}
                                    disabled={currentCardIndex === sentences.length - 1}
                                    className="p-3 bg-white border border-[#E5E5E7] rounded-full shadow-xs hover:bg-[#F5F5F7] hover:text-[#0071E3] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`whitespace-pre-wrap animate-fade-in text-[#1D1D1F] selection:bg-[#0071E3]/20 relative ${useDyslexicFont ? 'font-lexy' : 'font-sans'}`}
                            style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: lineHeight,
                                wordSpacing: `${wordSpacing}rem`
                            }}
                        >
                            {renderComplexText(currentResult)}
                        </div>
                    )
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#86868B] font-normal text-sm space-y-2">
                        <Sparkles size={28} className="text-[#0071E3]/40 mb-1" />
                        <span>Your simplified text will appear here</span>
                    </div>
                )}
            </div>
            
            {focusMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#86868B] text-[10px] font-semibold uppercase tracking-widest bg-[#F5F5F7] px-3 py-1 rounded-full border border-[#E5E5E7] z-50">
                    Focus Mode
                </div>
            )}
        </div>
    );
}
