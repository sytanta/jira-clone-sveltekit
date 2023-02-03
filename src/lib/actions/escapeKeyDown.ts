import { KEY_CODES } from '$lib/constants/keyCode';

export default function (node: HTMLElement, onEscapeKeyDown: () => void) {
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === KEY_CODES.ESCAPE) {
			onEscapeKeyDown();
		}
	};

	document.addEventListener('keydown', handleKeyDown);

	return {
		destroy() {
			document.removeEventListener('keydown', handleKeyDown);
		}
	};
}
