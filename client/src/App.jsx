import { useState } from 'react';
import Header from './components/Header';
import SettingsBar from './components/SettingsBar';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import LandingPage from './components/LandingPage';
import LoadingPage from './components/LoadingPage';
import { Loader2 } from 'lucide-react';

function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('simplified'); // simplified, bullets, plain
  const [showLanding, setShowLanding] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  // Output and stats
  const [outputCache, setOutputCache] = useState({}); // { [inputTextHash_mode]: { result, readabilityBefore, readabilityAfter, glossary } }
  const [currentResult, setCurrentResult] = useState(null);
  const [readabilityBefore, setReadabilityBefore] = useState(null);
  const [readabilityAfter, setReadabilityAfter] = useState(null);
  const [glossary, setGlossary] = useState([]);

  // Styling settings
  const [useDyslexicFont, setUseDyslexicFont] = useState(false);
  const [wordSpacing, setWordSpacing] = useState(0); // rem
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontSize, setFontSize] = useState(18); // px
  const [theme, setTheme] = useState('default'); // default, parchment, blue

  const themeClasses = {
    default: 'bg-[#F5F5F7]',
    parchment: 'bg-[#FAF6EE]',
    blue: 'bg-[#EEF4FB]'
  };

  const handleSimplify = async (textToProcess = inputText, targetMode = mode) => {
    if (!textToProcess.trim()) {
      setError('Please provide some text to simplify.');
      return;
    }

    setLoading(true);
    setError(null);
    setInputText(textToProcess);
    setMode(targetMode);

    // Simple cache key based on length + first 20 chars + last 20 chars + mode
    const textHash = textToProcess.length + '_' + textToProcess.substring(0, 20) + textToProcess.substring(textToProcess.length - 20);
    const cacheKey = `${textHash}_${targetMode}`;

    if (outputCache[cacheKey]) {
      const cached = outputCache[cacheKey];
      setCurrentResult(cached.result);
      setReadabilityBefore(cached.readabilityBefore);
      setReadabilityAfter(cached.readabilityAfter);
      setGlossary(cached.glossary || []);
      setLoading(false);
      return;
    }

    try {
      const apiHost = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiHost}/api/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess, mode: targetMode }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Server returned an invalid response. Ensure the backend is running.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to simplify text.');
      }

      setCurrentResult(data.result);
      setReadabilityBefore(data.readabilityBefore);
      setReadabilityAfter(data.readabilityAfter);
      setGlossary(data.glossary || []);

      // Save to cache
      setOutputCache(prev => ({
        ...prev,
        [cacheKey]: {
          result: data.result,
          readabilityBefore: data.readabilityBefore,
          readabilityAfter: data.readabilityAfter,
          glossary: data.glossary
        }
      }));

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    if (newMode === mode) return;
    if (inputText.trim() && currentResult) {
      handleSimplify(inputText, newMode);
    } else {
      setMode(newMode);
    }
  };

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${themeClasses[theme] || 'bg-[#F5F5F7]'} ${focusMode ? 'pt-0' : 'pt-16'}`}>
      {!focusMode && (
        <Header
          onToggleFocus={() => setFocusMode(true)}
          onGoHome={() => setShowLanding(true)}
        />
      )}

      {!focusMode && (
        <SettingsBar
          useDyslexicFont={useDyslexicFont} setUseDyslexicFont={setUseDyslexicFont}
          wordSpacing={wordSpacing} setWordSpacing={setWordSpacing}
          lineHeight={lineHeight} setLineHeight={setLineHeight}
          fontSize={fontSize} setFontSize={setFontSize}
          theme={theme} setTheme={setTheme}
        />
      )}

      <main className={`flex-1 container mx-auto px-4 py-8 transition-all duration-500 ${focusMode ? 'max-w-4xl' : 'grid grid-cols-1 lg:grid-cols-2 gap-8'}`}>
        {(!focusMode || !currentResult) && (
          <div className={`flex flex-col h-[700px] ${focusMode ? 'hidden' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 text-[#4A90E2] flex items-center">
              <span className="w-2 h-6 bg-[#4A90E2] rounded-full mr-2"></span>
              Input source
            </h2>
            <InputPanel
              inputText={inputText}
              setInputText={setInputText}
              onSimplify={() => handleSimplify(inputText, mode)}
              loading={loading}
            />
          </div>
        )}

        <div className={`flex flex-col h-[700px] transition-all duration-500 ${focusMode ? 'w-full h-[85vh]' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#4A90E2] flex items-center">
              <span className="w-2 h-6 bg-[#14B8A6] rounded-full mr-2"></span>
              Lexified result
            </h2>
            {focusMode && (
              <button
                onClick={() => setFocusMode(false)}
                className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#555555] hover:text-[#4A90E2] transition-all shadow-sm"
              >
                Exit Focus Mode
              </button>
            )}
          </div>
          <OutputPanel
            currentResult={currentResult}
            loading={loading}
            mode={mode}
            onModeChange={handleModeChange}
            readabilityBefore={readabilityBefore}
            readabilityAfter={readabilityAfter}
            useDyslexicFont={useDyslexicFont}
            wordSpacing={wordSpacing}
            lineHeight={lineHeight}
            fontSize={fontSize}
            glossary={glossary}
            focusMode={focusMode}
            onToggleFocus={() => setFocusMode(!focusMode)}
          />
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center shadow-red-500/20 z-50">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-4 font-bold hover:text-red-200">×</button>
        </div>
      )}

      {loading && <LoadingPage message="Simplifying your text..." />}
    </div>
  );
}

export default App;
