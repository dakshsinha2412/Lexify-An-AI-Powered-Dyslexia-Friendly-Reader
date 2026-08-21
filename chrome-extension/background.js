// ── Configuration ─────────────────────────────────────────────────────────
// Change this to your Render production URL when deploying, e.g:
// const BASE_URL = "https://your-app.onrender.com";
const BASE_URL = "http://localhost:5000";
// ──────────────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "simplifyWithLexify",
        title: "Simplify with Lexify",
        contexts: ["selection"]
    });
});

// Central fetcher in background script to bypass PNA/CORS restrictions in popup/content scripts
async function fetchSimplification(text, mode = 'simplified') {
    try {
        const resp = await fetch(`${BASE_URL}/api/simplify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, mode })
        });
        
        let data;
        try {
            data = await resp.json();
        } catch(e) {
            throw new Error("Invalid response from server. Is the backend running on port 5000?");
        }
        
        if (!resp.ok) throw new Error(data.error || "Server error");
        return data;
    } catch (err) {
        console.error("Fetch error:", err);
        throw err;
    }
}

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "FETCH_SIMPLIFY") {
        fetchSimplification(request.text, request.mode)
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true; // Keep message channel open for async response
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "simplifyWithLexify") {
        const selectedText = info.selectionText;
        
        // Use background fetcher then inject results
        fetchSimplification(selectedText)
            .then(data => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: (result) => {
                        const overlay = document.createElement("div");
                        overlay.style.position = "fixed";
                        overlay.style.top = "10%";
                        overlay.style.left = "50%";
                        overlay.style.transform = "translate(-50%, 0)";
                        overlay.style.width = "400px";
                        overlay.style.maxHeight = "50vh";
                        overlay.style.overflowY = "auto";
                        overlay.style.backgroundColor = "#0f172a";
                        overlay.style.color = "#f1f5f9";
                        overlay.style.padding = "20px";
                        overlay.style.borderRadius = "12px";
                        overlay.style.zIndex = "999999";
                        overlay.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.5)";
                        overlay.style.border = "1px solid #334155";

                        const fontUrl = "https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/opendyslexic.css";
                        if (!document.querySelector(`link[href="${fontUrl}"]`)) {
                            const link = document.createElement("link");
                            link.href = fontUrl;
                            link.rel = "stylesheet";
                            document.head.appendChild(link);
                        }
                        overlay.style.fontFamily = "'OpenDyslexic', sans-serif";
                        overlay.style.fontSize = "16px";
                        overlay.style.lineHeight = "1.5";

                        const closeBtn = document.createElement("button");
                        closeBtn.innerText = "×";
                        closeBtn.style.position = "absolute";
                        closeBtn.style.top = "10px";
                        closeBtn.style.right = "10px";
                        closeBtn.style.background = "transparent";
                        closeBtn.style.color = "#94a3b8";
                        closeBtn.style.border = "none";
                        closeBtn.style.fontSize = "20px";
                        closeBtn.style.cursor = "pointer";
                        closeBtn.onclick = () => overlay.remove();

                        const textNode = document.createElement("div");
                        textNode.innerText = result;
                        textNode.style.marginTop = "10px";
                        textNode.style.whiteSpace = "pre-wrap";

                        overlay.appendChild(closeBtn);
                        overlay.appendChild(textNode);
                        document.body.appendChild(overlay);
                    },
                    args: [data.result]
                });
            })
            .catch(err => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: (msg) => alert("Lexify Error: " + msg),
                    args: [err.message]
                });
            });
    }
});
