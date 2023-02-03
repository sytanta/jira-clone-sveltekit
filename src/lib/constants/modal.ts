export const MODAL_VARIANTS = ['center', 'aside'] as const;

export type ModalVariant = (typeof MODAL_VARIANTS)[number];
