export type TextareaProps = keyof HTMLTextAreaElement & {
	style: { minHeight: number; maxHeight: number };
};

export type TextAreaStyle = Omit<NonNullable<TextareaProps['style']>, 'maxHeight' | 'minHeight'> & {
	height?: number;
};

export type TextareaHeightChangeMeta = {
	rowHeight: number;
};

export interface TextareaAutosizeProps extends Omit<TextareaProps, 'style'> {
	maxRows?: number;
	minRows?: number;
	cacheMeasurements?: boolean;
	style?: TextAreaStyle;
}
