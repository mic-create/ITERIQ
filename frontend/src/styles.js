export function initGlobalStyles() {
    if (document.getElementById('iteriq-global-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'iteriq-global-styles';
    styleEl.textContent = `
        :root {
            --color-primary: #1b4d3e;
            --color-primary-dark: #123328;
            --color-primary-light: #2c7a63;
            --color-ivory: #fcfbf9;
            --color-ivory-card: #f5f3ee;
            --color-bronze: #8c6d46;
            --color-accent: #c05621;
            --color-text: #2d3748;
            --color-text-muted: #718096;
            --color-border: #e2e8f0;
            --color-error: #e53e3e;
            --color-success: #38a169;
            --font-serif: "Cormorant Garamond", "Playfair Display", Georgia, serif;
            --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --shadow-subtle: 0 4px 6px -1px rgba(27, 77, 62, 0.05), 0 2px 4px -1px rgba(27, 77, 62, 0.03);
            --shadow-card: 0 10px 15px -3px rgba(27, 77, 62, 0.08), 0 4px 6px -2px rgba(27, 77, 62, 0.04);
            --radius-smooth: 12px;
            --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: var(--font-sans);
            background-color: var(--color-ivory);
            color: var(--color-text);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
        }

        input, select, button {
            font-family: inherit;
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
    `;
    document.head.appendChild(styleEl);
}