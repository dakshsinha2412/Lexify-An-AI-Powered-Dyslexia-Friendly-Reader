function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

function calculateFleschKincaid(text) {
    if (!text || text.trim().length === 0) return 0;

    // Count sentences: simple split by [.!?] followed by space or end
    const sentences = text.split(/[.!?]+(?:[\s]|$)/).filter(s => s.trim().length > 0).length || 1;

    // Count words: split by non-word chars
    const wordsArray = text.split(/[\s,]+/).filter(w => w.trim().length > 0);
    const words = wordsArray.length || 1;

    // Count syllables
    const syllables = wordsArray.reduce((acc, word) => acc + countSyllables(word), 0);

    // Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    const score = (0.39 * (words / sentences)) + (11.8 * (syllables / words)) - 15.59;

    return Math.max(0, parseFloat(score.toFixed(1)));
}

module.exports = { calculateFleschKincaid, countSyllables };
