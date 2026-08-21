chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_SELECTED_TEXT") {
        const selected = window.getSelection().toString().trim();
        sendResponse({ text: selected });
        return true;
    }

    if (request.action === "GET_PAGE_TEXT") {
        const selectors = [
            'article', 'main', '[role="main"]',
            'h1', 'h2', 'h3', 'h4',
            'p', 'li', 'blockquote', 'td'
        ];
        const seen = new Set();
        const lines = [];

        document.querySelectorAll(selectors.join(',')).forEach(el => {
            const t = el.textContent.trim();
            if (t.length > 30 && !seen.has(t)) {
                seen.add(t);
                lines.push(t);
            }
        });

        sendResponse({ text: lines.join('\n\n') });
        return true;
    }

    if (request.action === "SIMPLIFY_PAGE") {
        const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent);
        const fullText = paragraphs.join('\n\n');

        if (!fullText.trim()) {
            alert("No text found on this page to simplify.");
            return;
        }

        chrome.runtime.sendMessage({ 
            action: "FETCH_SIMPLIFY", 
            text: fullText.substring(0, 3000), 
            mode: 'simplified' 
        }, (response) => {
            if (response && response.success) {
                const data = response.data;
                
                // Create Apple Glassmorphic Overlay
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '10%';
                overlay.style.left = '50%';
                overlay.style.transform = 'translate(-50%, 0)';
                overlay.style.width = '640px';
                overlay.style.maxWidth = '90vw';
                overlay.style.maxHeight = '80vh';
                overlay.style.overflowY = 'auto';
                overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                overlay.style.backdropFilter = 'blur(20px)';
                overlay.style.webkitBackdropFilter = 'blur(20px)';
                overlay.style.color = '#1D1D1F';
                overlay.style.padding = '32px';
                overlay.style.borderRadius = '28px';
                overlay.style.zIndex = '9999999';
                overlay.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
                overlay.style.border = '1px solid #E5E5E7';

                const fontUrl = 'https://fonts.cdnfonts.com/css/sf-pro-display';
                if (!document.querySelector(`link[href="${fontUrl}"]`)) {
                    const link = document.createElement('link');
                    link.href = fontUrl;
                    link.rel = 'stylesheet';
                    document.head.appendChild(link);
                }

                overlay.style.fontFamily = "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";
                overlay.style.fontSize = '16px';
                overlay.style.lineHeight = '1.6';

                const headerRow = document.createElement('div');
                headerRow.style.display = 'flex';
                headerRow.style.alignItems = 'center';
                headerRow.style.justifyContent = 'space-between';
                headerRow.style.marginBottom = '20px';
                headerRow.style.paddingBottom = '12px';
                headerRow.style.borderBottom = '1px solid #E5E5E7';

                const title = document.createElement('div');
                title.innerText = 'Lexify Simplified View';
                title.style.fontWeight = '700';
                title.style.fontSize = '18px';
                title.style.color = '#0071E3';

                const closeBtn = document.createElement('button');
                closeBtn.innerText = 'Done';
                closeBtn.style.background = '#0071E3';
                closeBtn.style.color = 'white';
                closeBtn.style.border = 'none';
                closeBtn.style.padding = '6px 16px';
                closeBtn.style.borderRadius = '980px';
                closeBtn.style.fontWeight = '600';
                closeBtn.style.fontSize = '13px';
                closeBtn.style.cursor = 'pointer';
                closeBtn.onclick = () => overlay.remove();

                headerRow.appendChild(title);
                headerRow.appendChild(closeBtn);

                const textNode = document.createElement('div');
                textNode.innerText = data.result;
                textNode.style.whiteSpace = 'pre-wrap';
                textNode.style.color = '#1D1D1F';

                overlay.appendChild(headerRow);
                overlay.appendChild(textNode);
                document.body.appendChild(overlay);
            } else {
                alert("Lexify Error: " + (response ? response.error : "Communication failed"));
            }
        });
    }
});
