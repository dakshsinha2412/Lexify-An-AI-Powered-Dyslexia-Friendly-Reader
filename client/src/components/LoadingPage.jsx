import { useState, useEffect } from 'react';

const DYSLEXIA_FACTS = [
    "Did you know? Dyslexia affects approximately 1 in 5 people, making it the most common learning difference.",
    "Did you know? Many brilliant minds like Albert Einstein, Leonardo da Vinci, and Steve Jobs were believed to be dyslexic.",
    "Did you know? Dyslexia is not related to intelligence. People with dyslexia often have average or above-average intelligence.",
    "Did you know? Dyslexia can make it harder to recognize words, spell, or decode text rapidly.",
    "Did you know? Using larger fonts and increased line spacing can significantly improve reading ease for dyslexic individuals.",
    "Did you know? Dyslexia is highly hereditary. If a parent has it, their children are more likely to have it too.",
    "Did you know? Dyslexic brains show different wiring, often activating the right hemisphere more when reading."
];

export default function LoadingPage({ message = "Extracting text..." }) {
    const [factIndex, setFactIndex] = useState(0);

    // Give it a random fact on mount
    useEffect(() => {
        setFactIndex(Math.floor(Math.random() * DYSLEXIA_FACTS.length));
        
        // Change fact every 5 seconds if loading takes long
        const interval = setInterval(() => {
            setFactIndex((prev) => (prev + 1) % DYSLEXIA_FACTS.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const fact = DYSLEXIA_FACTS[factIndex];

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FDFBF7]/80 backdrop-blur-md overflow-hidden text-[#333333]">
            {/* Background book element (abstract representation) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                <div className="w-[120%] h-[120%] bg-linear-to-b from-[#4A90E2]/20 via-[#FDFBF7] to-[#4A90E2]/20 transform rotate-12 blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg mb-12 flex items-center justify-center h-64">
                {/* Stacked Cards */}
                <div className="absolute transform -rotate-6 translate-y-4 translate-x-4 bg-[#EADCC8] w-72 h-48 rounded-xl shadow-lg border border-[#D5CAA8]"></div>
                <div className="absolute transform rotate-3 translate-y-2 translate-x-2 bg-[#F5EAD4] w-72 h-48 rounded-xl shadow-lg border border-[#E1D6BA]"></div>
                
                <div className="absolute bg-[#FFF8CC] w-72 h-48 rounded-xl shadow-2xl border border-[#F6EEB4] flex flex-col items-center justify-center p-6 text-center animate-[float_4s_ease-in-out_infinite]">
                    <h3 className="font-bold text-[#5A4C08] tracking-widest text-sm mb-3">DID YOU KNOW?</h3>
                    <p className="font-lexy text-[#5A4C08] text-base leading-relaxed">{fact}</p>
                </div>
            </div>

            <div className="relative z-10 text-center mt-8">
                <p className="text-xl font-medium text-[#555555] mb-6">Let's learn while you wait</p>
                <h2 className="text-2xl font-bold tracking-[0.2em] text-[#333333] mb-4 uppercase">{message}</h2>
                
                <div className="w-64 h-2 bg-[#E2E8F0] rounded-full overflow-hidden mx-auto shadow-inner">
                    <div className="h-full bg-[#4A90E2] w-full rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
                </div>
            </div>

            <style>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
