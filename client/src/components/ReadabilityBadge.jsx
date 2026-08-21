export default function ReadabilityBadge({ before, after }) {
    if (before === null || after === null) return null;

    const getColor = (score) => {
        if (score > 12) return 'bg-[#FCE8E8] text-[#D0021B] border border-[#F5A8A8]';
        if (score >= 8) return 'bg-[#FEF0D8] text-[#F5A623] border border-[#FBE0A6]';
        return 'bg-[#EAF5E6] text-[#417505] border border-[#C6DFB3]';
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex flex-col text-xs font-semibold text-[#555555]">
                <span>Readability</span>
                <span>Grade Level</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${getColor(before)}`}>
                Before: {before}
            </div>
            <div className="text-[#888888]">→</div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${getColor(after)} animate-fade-in`}>
                After: {after}
            </div>
        </div>
    );
}
