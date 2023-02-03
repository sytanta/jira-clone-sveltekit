export const BUTTON_VARIANTS = ['primary', 'success', 'danger', 'secondary', 'empty'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
