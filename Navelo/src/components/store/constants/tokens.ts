/**
 * STORE_TOKENS: The central source of truth for the Store design system.
 * These tokens define the spacing, geometry, and typographic patterns used across
 * base, intermediary, and section layers.
 */

export const STORE_TOKENS = {
    PADDING: {
        /** 20px - Universal container padding and layout gap */
        CONTAINER: 'container' as const,
        /** 10px - Inner element spacing and small padding */
        ELEMENT: 'element' as const,
        /** 100px (PC) / 50px (Mobile) - Major section separation */
        SECTION: 'section' as const,
        /** 50px - Large padding for empty states or specialized sections */
        EMPTY_STATE: 'empty_state' as const,
        NONE: 'none' as const,
        /* Para ritmo vertical “hero” no `RegistryMain`, use `MAIN` no mobile — ver Design System §11–12.*/
        SAFE_AREA_INSET: 'safe_area' as const,
    },
    /** Spacing tokens for padding and gaps */
    SPACING: {
        /** 20px - Universal container padding and layout gap */
        CONTAINER: 'container' as const,
        /** 10px - Inner element spacing and small padding */
        ELEMENT: 'element' as const,
        /** 100px (PC) / 50px (Mobile) - Major section separation */
        SECTION: 'section' as const,
        /** 50px - Large padding for empty states or specialized sections */
        EMPTY_STATE: 'empty_state' as const,
        NONE: 'none' as const,
        /** 20px - Large padding for empty states or specialized sections */
        SECTION_MOBILE: 'container' as const,
        /** 50px Desktop / 30px Mobile - Spacing between section title and content */
        TITLE_CONTENT: 'title-content' as const,
    },

    /** Geometry and Border Radius tokens */
    RADIUS: {
        /** 5px - The standard system radius */
        SYSTEM: 'system' as const,
        /** 9999px - Perfect circle/pill radius */
        FULL: 'full' as const,
        NONE: 'none' as const
    },

    /** 
     * Color tokens mapping to system palette 
     * NOTE: O mostruário de cores (antigo Swatch) será reconstruído via Surface tokenizada na página /design-system
     */
    COLORS: {

    },

    TYPOGRAPHY: {

    }
} as const;
