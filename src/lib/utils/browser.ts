const INPUTS = ['TEXTAREA', 'INPUT'];

export const getTextContentsFromHtmlString = (html: string | null | undefined): string => {
	const el = document.createElement('div');
	el.innerHTML = html || '';

	return el.textContent || '';
};

export const copyToClipboard = async (value: string) => {
	await navigator.clipboard.writeText(value);
};

export const isFocusedElementEditable = () =>
	!!document.activeElement?.getAttribute('contenteditable') ||
	INPUTS.includes(document.activeElement?.tagName!);
