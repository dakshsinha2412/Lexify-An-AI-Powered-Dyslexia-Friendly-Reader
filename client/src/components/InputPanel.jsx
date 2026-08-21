import { useState } from 'react';
import { Type, Upload, Link as LinkIcon, Download, Loader2, ArrowRight } from 'lucide-react';
import LoadingPage from './LoadingPage';

export default function InputPanel({ inputText, setInputText, onSimplify, loading }) {
    const [activeTab, setActiveTab] = useState('text'); // text, upload, url
    const [extracting, setExtracting] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [fileName, setFileName] = useState('');

    const fetchUrl = async () => {
        if (!urlInput.trim()) return;
        setExtracting(true);
        try {
            const apiHost = import.meta.env.VITE_API_URL || '';
            const resp = await fetch(`${apiHost}/api/fetch-url?url=${encodeURIComponent(urlInput)}`);
            let data;
            try {
                data = await resp.json();
            } catch (e) {
                throw new Error('Server returned an invalid response.');
            }
            if (!resp.ok) throw new Error(data.error);
            setInputText(data.text);
            setActiveTab('text');
        } catch (err) {
            alert(`Error fetching URL: ${err.message}`);
        } finally {
            setExtracting(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setFileName(file.name);
        setExtracting(true);

        if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
            try {
                const text = await file.text();
                setInputText(text);
                setActiveTab('text');
            } catch (err) {
                alert(`Error reading file: ${err.message}`);
            } finally {
                setExtracting(false);
            }
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const apiHost = import.meta.env.VITE_API_URL || '';
            let endpoint = '';
            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                endpoint = `${apiHost}/api/parse-pdf`;
            } else if (file.type.startsWith('image/')) {
                endpoint = `${apiHost}/api/ocr-image`;
            } else {
                alert('Unsupported file type. Please upload a PDF, image, or text file.');
                setExtracting(false);
                return;
            }

            const resp = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            let data;
            try {
                data = await resp.json();
            } catch (e) {
                throw new Error('Server returned an invalid response.');
            }

            if (!resp.ok) throw new Error(data.error || 'Extraction failed');
            setInputText(data.text);
            setActiveTab('text');
        } catch (err) {
            alert(`Extraction note: ${err.message}`);
        } finally {
            setExtracting(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    };

    return (
        <div className="flex flex-col flex-1 bg-white rounded-3xl border border-[#E5E5E7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden p-6">

            {/* Apple Segmented Control Bar */}
            <div className="bg-[#F5F5F7] p-1 rounded-2xl flex items-center mb-5 border border-[#E5E5E7]/50">
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${activeTab === 'text' ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                >
                    <Type size={14} /> <span>Paste Text</span>
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${activeTab === 'upload' ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                >
                    <Upload size={14} /> <span>Upload File</span>
                </button>
                <button
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${activeTab === 'url' ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                >
                    <LinkIcon size={14} /> <span>Enter URL</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col relative">
                {extracting && <LoadingPage message="Extracting text..." />}

                {activeTab === 'text' && (
                    <div className="flex flex-col flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Try Samples:</span>
                            <button
                                type="button"
                                onClick={() => setInputText("The ubiquitous nature of quantum mechanics presents profound conceptual difficulties for classical intuition.")}
                                className="px-2.5 py-1 bg-[#F5F5F7] hover:bg-[#E5E5E7] text-[#1D1D1F] text-xs rounded-full font-medium transition-all cursor-pointer border border-[#E5E5E7]"
                            >
                                🧪 Physics
                            </button>
                            <button
                                type="button"
                                onClick={() => setInputText("Notwithstanding anything contained herein to the contrary, the indemnifying party agrees to defend and hold harmless the client from all liability.")}
                                className="px-2.5 py-1 bg-[#F5F5F7] hover:bg-[#E5E5E7] text-[#1D1D1F] text-xs rounded-full font-medium transition-all cursor-pointer border border-[#E5E5E7]"
                            >
                                📜 Legal
                            </button>
                            <button
                                type="button"
                                onClick={() => setInputText("Deoxyribonucleic acid is a polymer composed of two polynucleotide chains that coil around each other forming a double helix carrying genetic instructions.")}
                                className="px-2.5 py-1 bg-[#F5F5F7] hover:bg-[#E5E5E7] text-[#1D1D1F] text-xs rounded-full font-medium transition-all cursor-pointer border border-[#E5E5E7]"
                            >
                                🧬 Biology
                            </button>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste or type any complex text here..."
                            className="w-full flex-1 p-5 bg-[#F5F5F7]/60 border border-[#E5E5E7] rounded-2xl text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:bg-white focus:border-[#0071E3] transition-all resize-none text-base leading-relaxed"
                        />
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#D2D2D7] rounded-2xl bg-[#F5F5F7]/40 hover:bg-[#F5F5F7] transition-all cursor-pointer p-8 text-center"
                        onClick={() => document.getElementById('fileUpload').click()}
                    >
                        <input
                            id="fileUpload"
                            type="file"
                            accept=".pdf, .txt, .md, image/png, image/jpeg, image/jpg"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                        />
                        <div className="w-14 h-14 bg-white border border-[#E5E5E7] rounded-2xl flex items-center justify-center mb-4 shadow-xs text-[#0071E3]">
                            <Download size={26} />
                        </div>
                        <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">Drag & Drop document</h3>
                        <p className="text-xs text-[#86868B]">Supports PDF, PNG, JPG, TXT</p>
                        {fileName && <p className="mt-3 text-xs text-[#0071E3] font-medium bg-[#0071E3]/10 px-3 py-1 rounded-full">Selected: {fileName}</p>}
                    </div>
                )}

                {activeTab === 'url' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F5F5F7]/40 border border-[#E5E5E7] rounded-2xl">
                        <div className="w-full max-w-sm">
                            <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">Webpage URL</label>
                            <div className="flex space-x-2">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/article"
                                    className="flex-1 px-4 py-2.5 bg-white border border-[#E5E5E7] rounded-xl text-[#1D1D1F] text-sm placeholder-[#86868B] focus:ring-2 focus:ring-[#0071E3]/40 focus:outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && fetchUrl()}
                                />
                                <button
                                    onClick={fetchUrl}
                                    disabled={!urlInput.trim() || extracting}
                                    className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-sm rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-xs"
                                >
                                    Extract
                                </button>
                            </div>
                            <p className="text-xs text-[#86868B] mt-3 text-center">Extracts clean article text, filtering out ads and menus.</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={onSimplify}
                    disabled={loading || !inputText.trim() || activeTab !== 'text'}
                    className="mt-5 w-full py-3.5 bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-[#E5E5E7] disabled:text-[#86868B] rounded-full text-white font-semibold text-base flex items-center justify-center shadow-[0_4px_14px_rgba(0,113,227,0.25)] disabled:shadow-none transition-all transform active:scale-[0.98] disabled:active:scale-100 disabled:cursor-not-allowed cursor-pointer group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Simplifying...
                        </>
                    ) : (
                        <>
                            Simplify Text
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
