// Design Tokens - Global styling controls
// These tokens are applied to all generated components

export interface DesignTokens {
  // Spacing
  sectionPadding: number // px - vertical padding for sections
  componentGap: number // px - gap between components
  buttonScale: number // 0.8 - 1.4, multiplier for button padding

  // Typography
  headingSizeMultiplier: number // 0.8 - 1.5, multiplier for heading sizes
  bodySizeMultiplier: number // 0.8 - 1.2, multiplier for body text
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'

  // Icons
  iconScale: number // 0.5 - 1.5, multiplier for icon sizes

  // Borders
  borderRadius: number // px - global border radius
  borderWidth: number // px - border thickness

  // Effects
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong'
}

export const defaultTokens: DesignTokens = {
  sectionPadding: 80,
  componentGap: 24,
  buttonScale: 1,
  headingSizeMultiplier: 1,
  bodySizeMultiplier: 1,
  fontWeight: 'medium',
  iconScale: 1,
  borderRadius: 12,
  borderWidth: 1,
  shadowIntensity: 'subtle',
}

// Convert tokens to Tailwind-compatible CSS variables
export function tokensToCSS(tokens: DesignTokens): string {
  const shadowMap = {
    none: 'none',
    subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    strong: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  }

  // Button padding scales from 8px 16px (0.8) to 20px 40px (1.4)
  const btnPadY = Math.round(12 * tokens.buttonScale)
  const btnPadX = Math.round(24 * tokens.buttonScale)

  return `
    --section-padding: ${tokens.sectionPadding}px;
    --component-gap: ${tokens.componentGap}px;
    --button-padding: ${btnPadY}px ${btnPadX}px;
    --button-scale: ${tokens.buttonScale};
    --heading-multiplier: ${tokens.headingSizeMultiplier};
    --body-multiplier: ${tokens.bodySizeMultiplier};
    --icon-scale: ${tokens.iconScale};
    --font-weight: ${tokens.fontWeight === 'normal' ? 400 : tokens.fontWeight === 'medium' ? 500 : tokens.fontWeight === 'semibold' ? 600 : 700};
    --border-radius: ${tokens.borderRadius}px;
    --border-width: ${tokens.borderWidth}px;
    --shadow: ${shadowMap[tokens.shadowIntensity]};
  `.trim()
}

// Token presets for quick selection
export const tokenPresets: Record<string, Partial<DesignTokens>> = {
  minimal: {
    sectionPadding: 64,
    componentGap: 16,
    borderRadius: 4,
    shadowIntensity: 'none',
    fontWeight: 'normal',
    buttonScale: 0.85,
    iconScale: 0.85,
  },
  modern: {
    sectionPadding: 80,
    componentGap: 24,
    borderRadius: 12,
    shadowIntensity: 'subtle',
    fontWeight: 'medium',
    buttonScale: 1,
    iconScale: 1,
  },
  bold: {
    sectionPadding: 96,
    componentGap: 32,
    borderRadius: 16,
    shadowIntensity: 'medium',
    fontWeight: 'bold',
    headingSizeMultiplier: 1.2,
    buttonScale: 1.15,
    iconScale: 1.2,
  },
  soft: {
    sectionPadding: 80,
    componentGap: 24,
    borderRadius: 24,
    shadowIntensity: 'subtle',
    fontWeight: 'normal',
    borderWidth: 0,
    buttonScale: 1,
    iconScale: 0.9,
  },
}
