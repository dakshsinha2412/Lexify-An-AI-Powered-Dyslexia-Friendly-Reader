import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Settings2 } from 'lucide-react';

export default function TTSControls({ text }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
    const [speed, setSpeed] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    // Initialize voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                if (!selectedVoiceURI) {
                    const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
                    setSelectedVoiceURI(defaultVoice.voiceURI);
                }
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    // Sync state with synthesizer
    useEffect(() => {
        const handleEnd = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        const interval = setInterval(() => {
            if (!window.speechSynthesis.speaking && isPlaying && !isPaused) {
                handleEnd();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, isPaused]);

    // Stop when text changes
    useEffect(() => {
        stop();
    }, [text]);

    const speak = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            return;
        }

        if (isPlaying) return;

        // BUGFIX for Chrome: cancel() followed immediately by speak() fails silently.
        window.speechSynthesis.cancel(); 

        setTimeout(() => {
            // Split long text into chunks if not in focus mode to prevent the 15-second cutoff bug
            const matchResult = text.match(/[^.!?]+[.!?]+|\s*$/g) || [];
            const chunks = matchResult.filter(c => c.trim().length > 0);
            if (chunks.length === 0) chunks.push(text);

            let chunksCompleted = 0;

            chunks.forEach((chunkText, index) => {
                const utterance = new SpeechSynthesisUtterance(chunkText);

                if (selectedVoiceURI) {
                    const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
                    if (voice) utterance.voice = voice;
                }

                utterance.rate = speed;

                if (index === chunks.length - 1) {
                    utterance.onend = () => {
                        setIsPlaying(false);
                        setIsPaused(false);
                    };
                }
                
                utterance.onerror = (e) => {
                    console.error('TTS Error:', e);
                    setIsPlaying(false);
                    setIsPaused(false);
                };

                window.speechSynthesis.speak(utterance);
            });

            setIsPlaying(true);
            setIsPaused(false);
        }, 50);
    };

    const pause = () => {
        if (isPlaying && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    return (
        <div className="relative flex items-center space-x-2 bg-[#F1F5F9] p-1.5 rounded-lg border border-[#E2E8F0] mr-4">

            {!isPlaying || isPaused ? (
                <button onClick={speak} className="p-1.5 bg-[#4A90E2] hover:bg-[#357ABD] text-white rounded-md transition-colors shadow-sm" title="Play">
                    <Play size={16} fill="currentColor" />
                </button>
            ) : (
                <button onClick={pause} className="p-1.5 bg-[#F5A623] hover:bg-[#D08B1E] text-white rounded-md transition-colors shadow-sm" title="Pause">
                    <Pause size={16} fill="currentColor" />
                </button>
            )}

            <button onClick={stop} disabled={!isPlaying && !isPaused} className="p-1.5 text-[#555555] hover:text-[#D0021B] hover:bg-[#E2E8F0] rounded-md transition-colors disabled:opacity-50" title="Stop">
                <Square size={16} fill="currentColor" />
            </button>

            <div className="h-5 w-px bg-[#CBD5E1] mx-1"></div>

            <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded-md transition-colors ${showSettings ? 'bg-[#E2E8F0] text-[#4A90E2]' : 'text-[#555555] hover:text-[#4A90E2] hover:bg-[#E2E8F0]'}`} title="Voice Settings">
                <Settings2 size={16} />
            </button>

            {/* TTS Settings Popover */}
            {showSettings && (
                <div className="absolute top-12 right-0 bg-white border border-[#E2E8F0] shadow-xl rounded-lg p-4 w-64 z-50">
                    <h4 className="text-sm font-semibold mb-3 text-[#333333]">Voice Settings</h4>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-[#555555] mb-1">Speed: {speed}x</label>
                        <input
                            type="range" min="0.5" max="2" step="0.1"
                            value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-full accent-[#4A90E2] cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#555555] mb-1">Voice</label>
                        <select
                            value={selectedVoiceURI}
                            onChange={(e) => setSelectedVoiceURI(e.target.value)}
                            className="w-full text-sm bg-[#FDFBF7] border border-[#E2E8F0] rounded-md p-2 text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#4A90E2] cursor-pointer"
                        >
                            {voices.map(v => (
                                <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
