// js/tailwind.config.js

tailwind.config = {
    theme: {
        extend: {
            colors: {
                black: '#0a0a0a',
                white: '#ffffff',
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    800: '#1f2937',
                    900: '#111827',
                }
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Roboto', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
                'grid-pattern-light': "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
            },
            backgroundSize: {
                'grid': '40px 40px',
            },
            animation: {
                'marquee': 'marquee 20s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        }
    }
}
