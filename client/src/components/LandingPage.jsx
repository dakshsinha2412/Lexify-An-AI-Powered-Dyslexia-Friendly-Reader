import { BookOpen, Headphones, Type, ArrowRight, Sparkles, Brain, FileText, Settings, Heart, HelpCircle, Layers } from 'lucide-react';

export default function LandingPage({ onStart }) {

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden relative selection:bg-[#0071E3]/20">
            {/* Apple Navigation Bar */}
            <nav className="z-50 flex items-center justify-between px-8 py-4.5 max-w-6xl mx-auto backdrop-blur-xl bg-[#F5F5F7]/90 sticky top-0 border-b border-[#E5E5E7] transition-all">
                <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={(e) => scrollToSection(e, 'hero')}
                >
                    <img src="/logo.png" alt="Lexify Logo" className="h-10 w-auto rounded-lg object-contain shadow-xs" />
                    <span className="text-xl font-bold tracking-tight text-[#1D1D1F]">Lexify</span>
                </div>
                
                <div className="hidden md:flex items-center space-x-10 text-sm font-semibold text-[#555555]">
                    <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-[#0071E3] transition-colors">Features</a>
                    <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-[#0071E3] transition-colors">How it works</a>
                    <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-[#0071E3] transition-colors">About</a>
                </div>

                <div className="flex items-center space-x-3">
                    <a 
                        href="/lexify-extension.zip" 
                        download
                        className="hidden sm:inline-flex items-center px-4 py-2.5 bg-white border border-[#E5E5E7] hover:border-[#0071E3] hover:text-[#0071E3] text-[#1D1D1F] text-xs font-semibold rounded-full shadow-xs transition-all"
                        title="Download Chrome Extension"
                    >
                        <Layers size={14} className="mr-1.5" /> Extension
                    </a>
                    <button 
                        onClick={onStart}
                        className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-semibold rounded-full shadow-[0_2px_10px_rgba(0,113,227,0.3)] transition-all transform active:scale-95 cursor-pointer">
                        Open Reader
                    </button>
                </div>
            </nav>

            {/* Apple Hero Section */}
            <main id="hero" className="relative flex flex-col items-center justify-center pt-20 pb-24 px-6 text-center">
                
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white border border-[#E5E5E7] rounded-full shadow-xs mb-8">
                    <Sparkles size={14} className="text-[#0071E3]" />
                    <span className="text-xs font-semibold text-[#1D1D1F]">AI-Powered Reading Assistant</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1D1D1F] max-w-4xl leading-[1.08] mb-6">
                    Reading, simplified.<br />
                    <span className="text-[#86868B] font-medium">For everyone.</span>
                </h1>

                <p className="text-lg md:text-xl text-[#86868B] max-w-2xl font-normal leading-relaxed mb-10">
                    Effortlessly transform dense jargon and complex documents into crystal-clear text with customizable typography and AI vocabulary tools.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={onStart}
                        className="px-8 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white text-base font-semibold rounded-full shadow-[0_4px_14px_rgba(0,113,227,0.35)] transition-all transform hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2 group"
                    >
                        Start Reading Free
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Showcase Mockup Card */}
                <div className="mt-16 w-full max-w-5xl bg-white rounded-[32px] border border-[#E5E5E7] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-6 md:p-10 transition-all">
                    <div className="flex flex-col md:flex-row gap-6 text-left items-stretch">
                        <div className="flex-1 bg-[#F5F5F7] rounded-2xl p-6 border border-[#E5E5E7]/60">
                            <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block mb-3">Original Jargon</span>
                            <p className="text-sm text-[#1D1D1F] leading-relaxed font-normal">
                                "The ubiquitous nature of quantum mechanics presents profound conceptual difficulties for classical intuition."
                            </p>
                        </div>

                        <div className="flex items-center justify-center text-[#86868B]">
                            <ArrowRight size={24} className="rotate-90 md:rotate-0" />
                        </div>

                        <div className="flex-1 bg-[#F5F5F7] rounded-2xl p-6 border border-[#0071E3]/30 shadow-xs">
                            <span className="text-[11px] font-bold text-[#0071E3] uppercase tracking-wider block mb-3">Lexified Output</span>
                            <p className="text-sm text-[#1D1D1F] leading-relaxed font-medium">
                                "The common presence of quantum physics presents big challenges to understand for traditional thinking."
                            </p>
                            <div className="mt-4 pt-3 border-t border-[#E5E5E7] flex items-center justify-between text-xs text-[#86868B]">
                                <span>Grade Level: 13.4 → 9.2</span>
                                <span className="text-[#0071E3] font-semibold">Improved by 31%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Apple Feature Grid */}
            <section id="features" className="py-24 px-6 max-w-6xl mx-auto border-t border-[#E5E5E7]">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-4">Crafted for Clarity</h2>
                    <p className="text-base text-[#86868B]">Intelligent reading tools built to support diverse learning styles.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-[28px] p-8 border border-[#E5E5E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all">
                        <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-[#0071E3] mb-6 border border-[#E5E5E7]">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">AI Simplification</h3>
                        <p className="text-sm text-[#86868B] leading-relaxed">
                            Convert dense articles, paragraphs, and academic jargon into straightforward, accessible English in one click.
                        </p>
                    </div>

                    <div className="bg-white rounded-[28px] p-8 border border-[#E5E5E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all">
                        <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-[#0071E3] mb-6 border border-[#E5E5E7]">
                            <Type size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">SF Pro Styling</h3>
                        <p className="text-sm text-[#86868B] leading-relaxed">
                            Fine-tune font size, letter spacing, line height, and text focus modes to create your personalized reading view.
                        </p>
                    </div>

                    <div className="bg-white rounded-[28px] p-8 border border-[#E5E5E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all">
                        <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-[#0071E3] mb-6 border border-[#E5E5E7]">
                            <Headphones size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Text-to-Speech</h3>
                        <p className="text-sm text-[#86868B] leading-relaxed">
                            Listen to highlighted text read aloud with natural voice synthesis and adjustable speech speed controls.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto border-t border-[#E5E5E7]">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#E5E5E7] rounded-full text-xs font-semibold text-[#0071E3] mb-3">
                        <HelpCircle size={14} />
                        <span>Simple Workflow</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-4">How Lexify Works</h2>
                    <p className="text-base text-[#86868B]">Three effortless steps to transform any complex content into clear, digestible reading.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-[28px] p-8 border border-[#E5E5E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left relative overflow-hidden">
                        <span className="text-5xl font-extrabold text-[#F5F5F7] absolute top-4 right-6 pointer-events-none select-none">01</span>
                        <div className="w-10 h-10 bg-[#0071E3]/10 text-[#0071E3] rounded-xl flex items-center justify-center mb-6 font-bold text-sm">
                            <FileText size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">1. Provide Content</h3>
                        <p className="text-xs text-[#86868B] leading-relaxed">
                            Paste text directly, upload a document (PDF, TXT, or Image), or paste a webpage URL to extract main article text.
                        </p>
                    </div>

                    <div className="bg-white rounded-[28px] p-8 border border-[#E5E5E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left relative overflow-hidden">
                        <span className="text-5xl font-extrabold text-[#F5F5F7] absolute top-4 right-6 pointer-events-none select-none">02</span>
                        <div className="w-10 h-10 bg-[#0071E3]/10 text-[#0071E3] rounded-xl flex items-center justify-center mb-6 font-bold text-sm">
                            <Sparkles size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">2. Intelligent Processing</h3>
                        <p className="text-xs text-[#86868B] leading-relaxed">
                            Our AI engine rewrites complex phrasing into concise sentences, extracts vocabulary definitions, and calculates readability scores.
                        </p>
                    </div>

                    <div className="bg-white rounded-[28px] p-8 border border-[#E5E5E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left relative overflow-hidden">
                        <span className="text-5xl font-extrabold text-[#F5F5F7] absolute top-4 right-6 pointer-events-none select-none">03</span>
                        <div className="w-10 h-10 bg-[#0071E3]/10 text-[#0071E3] rounded-xl flex items-center justify-center mb-6 font-bold text-sm">
                            <Settings size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">3. Read & Listen</h3>
                        <p className="text-xs text-[#86868B] leading-relaxed">
                            Customize typography controls, view interactive vocabulary tooltips, enter Focus Mode, or listen with Text-to-Speech audio.
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-6 max-w-6xl mx-auto border-t border-[#E5E5E7]">
                <div className="bg-white rounded-[32px] p-10 md:p-14 border border-[#E5E5E7] shadow-[0_12px_40px_rgba(0,0,0,0.04)] text-left flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#F5F5F7] border border-[#E5E5E7] rounded-full text-xs font-semibold text-[#1D1D1F]">
                            <Heart size={14} className="text-red-500 fill-red-500" />
                            <span>Our Mission</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] leading-tight">
                            Empowering Every Reader to Learn Without Limits
                        </h2>
                        <p className="text-sm text-[#86868B] leading-relaxed">
                            Lexify was created to break down reading barriers for individuals with dyslexia, ADHD, or English language learners. By combining artificial intelligence with specialized accessibility typography, we make digital text intuitive, approachable, and easy to absorb.
                        </p>
                        <div className="flex items-center gap-6 pt-2">
                            <div>
                                <span className="text-2xl font-bold text-[#0071E3] block">100% Free</span>
                                <span className="text-xs text-[#86868B]">Accessible Web Reader</span>
                            </div>
                            <div className="h-8 w-px bg-[#E5E5E7]"></div>
                            <div>
                                <span className="text-2xl font-bold text-[#1D1D1F] block">SF Pro</span>
                                <span className="text-xs text-[#86868B]">Clarity Typography</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-80 bg-[#F5F5F7] rounded-2xl p-6 border border-[#E5E5E7] text-center space-y-4">
                        <img src="/logo.png" alt="Lexify Logo" className="w-20 h-20 mx-auto object-contain drop-shadow-xs" />
                        <h3 className="font-bold text-base text-[#1D1D1F]">Ready to get started?</h3>
                        <p className="text-xs text-[#86868B]">Try Lexify right now in your browser with zero setup required.</p>
                        <button
                            onClick={onStart}
                            className="w-full py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full shadow-xs transition-all cursor-pointer"
                        >
                            Open Reader Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Apple Minimal Footer */}
            <footer className="py-12 border-t border-[#E5E5E7] text-center text-xs text-[#86868B]">
                <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p>© 2026 Lexify Inc. Designed for effortless reading.</p>
                    <div className="flex space-x-6">
                        <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-[#1D1D1F]">Features</a>
                        <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-[#1D1D1F]">How it works</a>
                        <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-[#1D1D1F]">About</a>
                        <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="hover:text-[#1D1D1F]">Back to top</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
