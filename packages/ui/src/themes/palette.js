/**
 * Color intention that you want to used in your theme.
 * Primary, status, text, and background read @internetmatt/design-tokens
 * (packages/ui/src/themes/internetmatt-tokens.css). MUI stays.
 * @param {JsonObject} theme Theme customization object
 */

export default function themePalette(theme) {
    return {
        mode: theme?.customization?.navType,
        transparent: theme.colors?.transparent,
        common: {
            black: theme.colors?.darkPaper,
            dark: theme.colors?.darkPrimaryMain
        },
        primary: {
            light: 'var(--colors-info-light)',
            main: 'var(--theme-colors-primary)',
            dark: 'var(--colors-primary-active)',
            200: theme.customization.isDarkMode ? theme.colors?.darkPrimary200 : theme.colors?.primary200,
            800: theme.customization.isDarkMode ? theme.colors?.darkPrimary800 : theme.colors?.primary800
        },
        secondary: {
            light: theme.customization.isDarkMode ? theme.colors?.darkSecondaryLight : theme.colors?.secondaryLight,
            main: 'var(--theme-colors-secondary)',
            dark: theme.customization.isDarkMode ? theme.colors?.darkSecondaryDark : theme.colors?.secondaryDark,
            200: theme.colors?.secondary200,
            800: theme.colors?.secondary800
        },
        error: {
            light: 'var(--colors-danger-background)',
            main: 'var(--colors-danger-default)',
            dark: 'var(--colors-danger-dark)'
        },
        orange: {
            light: theme.colors?.orangeLight,
            main: theme.colors?.orangeMain,
            dark: theme.colors?.orangeDark
        },
        teal: {
            light: theme.colors?.tealLight,
            main: theme.colors?.tealMain,
            dark: theme.colors?.tealDark
        },
        warning: {
            light: 'var(--colors-warning-background)',
            main: 'var(--colors-warning-default)',
            dark: 'var(--colors-warning-dark)'
        },
        success: {
            light: 'var(--colors-success-light)',
            200: 'var(--colors-success-light)',
            main: 'var(--colors-success-default)',
            dark: 'var(--colors-success-dark)'
        },
        grey: {
            50: theme.colors?.grey50,
            100: theme.colors?.grey100,
            200: theme.colors?.grey200,
            300: theme.colors?.grey300,
            500: theme.darkTextSecondary,
            600: theme.heading,
            700: theme.darkTextPrimary,
            900: theme.textDark
        },
        dark: {
            light: theme.colors?.darkTextPrimary,
            main: theme.colors?.darkLevel1,
            dark: theme.colors?.darkLevel2,
            800: theme.colors?.darkBackground,
            900: theme.colors?.darkPaper
        },
        text: {
            primary: 'var(--theme-colors-text)',
            secondary: 'var(--theme-colors-text-secondary)',
            dark: 'var(--theme-colors-text)',
            hint: 'var(--theme-colors-text-disabled)'
        },
        divider: 'var(--theme-colors-border)',
        background: {
            paper: 'var(--theme-colors-background)',
            default: 'var(--theme-colors-background-secondary)'
        },
        textBackground: {
            main: theme.customization.isDarkMode ? theme.colors?.darkPrimary800 : theme.colors?.grey50,
            border: theme.customization.isDarkMode ? theme.colors?.transparent : theme.colors?.grey400
        },
        card: {
            main: theme.customization.isDarkMode ? theme.colors?.darkPrimaryMain : theme.colors?.paper,
            light: theme.customization.isDarkMode ? theme.colors?.darkPrimary200 : theme.colors?.paper,
            hover: theme.customization.isDarkMode ? theme.colors?.darkPrimary800 : theme.colors?.paper
        },
        asyncSelect: {
            main: theme.customization.isDarkMode ? theme.colors?.darkPrimary800 : theme.colors?.grey50
        },
        timeMessage: {
            main: theme.customization.isDarkMode ? theme.colors?.darkLevel2 : theme.colors?.grey200
        },
        canvasHeader: {
            deployLight: theme.colors?.primaryLight,
            deployDark: theme.colors?.primaryDark,
            saveLight: theme.colors?.secondaryLight,
            saveDark: theme.colors?.secondaryDark,
            settingsLight: theme.colors?.grey300,
            settingsDark: theme.colors?.grey700
        },
        codeEditor: {
            main: theme.customization.isDarkMode ? theme.colors?.darkPrimary800 : theme.colors?.primaryLight
        },
        nodeToolTip: {
            background: theme.customization.isDarkMode ? theme.colors?.darkPrimary800 : theme.colors?.paper,
            color: theme.customization.isDarkMode ? theme.colors?.paper : 'rgba(0, 0, 0, 0.87)'
        }
    }
}
