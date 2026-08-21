import { Settings, Type, AlignLeft, Palette } from 'lucide-react';

export default function SettingsBar({
    useDyslexicFont, setUseDyslexicFont,
    wordSpacing, setWordSpacing,
    lineHeight, setLineHeight,
    fontSize, setFontSize,
    theme, setTheme
}) {
    return (
        <div className="bg-[#F5F5F7]/90 backdrop-blur-xl border-b border-[#E5E5E7] py-2.5 px-8 flex flex-wrap gap-5 items-center text-xs font-medium text-[#1D1D1F]">
            <div className="flex items-center space-x-2 text-[#1D1D1F] font-semibold">
                <Settings size={15} className="text-[#86868B]" />
                <span>Reading Controls</span>
            </div>

            <div className="h-4 w-px bg-[#E5E5E7] hidden md:block"></div>

            {/* Theme Tint Selector */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-full border border-[#E5E5E7]">
                <Palette size={13} className="text-[#86868B] ml-2 mr-1" />
                <button
                    onClick={() => setTheme('default')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${theme === 'default' ? 'bg-[#1D1D1F] text-white' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                >
                    Default
                </button>
                <button
                    onClick={() => setTheme('parchment')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${theme === 'parchment' ? 'bg-[#D97706] text-white' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                >
                    Cream
                </button>
                <button
                    onClick={() => setTheme('blue')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${theme === 'blue' ? 'bg-[#0071E3] text-white' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                >
                    Blue Tint
                </button>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-full border border-[#E5E5E7] hover:border-[#0071E3] transition-all">
                <input
                    type="checkbox"
                    checked={useDyslexicFont}
                    onChange={(e) => setUseDyslexicFont(e.target.checked)}
                    className="rounded border-[#D2D2D7] text-[#0071E3] focus:ring-[#0071E3] w-3.5 h-3.5 cursor-pointer accent-[#0071E3]"
                />
                <span className="text-xs font-medium text-[#1D1D1F]">SF Pro Font</span>
            </label>

            <div className="flex items-center space-x-2.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E5E5E7]">
                <Type size={14} className="text-[#86868B]" />
                <span className="text-xs text-[#86868B]">Size</span>
                <span className="font-semibold text-[#1D1D1F] min-w-[28px]">{fontSize}px</span>
                <input
                    type="range" min="14" max="28" step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-20 accent-[#0071E3] cursor-pointer h-1 bg-[#E5E5E7] rounded-lg appearance-none"
                />
            </div>

            <div className="flex items-center space-x-2.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E5E5E7]">
                <AlignLeft size={14} className="text-[#86868B]" />
                <span className="text-xs text-[#86868B]">Spacing</span>
                <input
                    type="range" min="0" max="3" step="0.5"
                    value={wordSpacing}
                    onChange={(e) => setWordSpacing(Number(e.target.value))}
                    className="w-20 accent-[#0071E3] cursor-pointer h-1 bg-[#E5E5E7] rounded-lg appearance-none"
                    title={`Word Spacing: ${wordSpacing}rem`}
                />
            </div>

            <div className="flex items-center space-x-2.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E5E5E7]">
                <span className="text-xs text-[#86868B]">↕ Lines</span>
                <input
                    type="range" min="1.5" max="3" step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-20 accent-[#0071E3] cursor-pointer h-1 bg-[#E5E5E7] rounded-lg appearance-none"
                    title={`Line Height: ${lineHeight}`}
                />
            </div>
        </div>
    );
}
