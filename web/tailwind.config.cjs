/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/@mriqbox/ui-kit/dist/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                // Fora do glass isto e exatamente hsl(var(--border)) — --ui-*
                // caem nos fallbacks. Sob [data-theme="glass"] (so embedded)
                // viram o filete claro do ox_lib.
                border: 'hsl(var(--ui-border-hsl, var(--border)) / calc(var(--ui-border-alpha, 1) * <alpha-value>))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background) / calc(var(--ui-surface-alpha, 1) * <alpha-value>))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card) / calc(var(--ui-surface-alpha-card, 1) * <alpha-value>))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
            },
            // Escala inteira derivada de --radius. Com o default bate com o
            // Tailwind stock, entao a aparencia so muda com o /uiconfig.
            // `full` fica nativo (circulos).
            borderRadius: {
                DEFAULT: 'calc(var(--radius) - 4px)',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) * 1.5)',
                '2xl': 'calc(var(--radius) * 2)',
                '3xl': 'calc(var(--radius) * 3)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}
