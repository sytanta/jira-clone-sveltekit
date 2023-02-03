type OutsideClickArguments = [() => void, HTMLElement[]] | (() => void);

export default function (element: HTMLElement, arg: OutsideClickArguments) {
	const onOutsideClick = Array.isArray(arg) ? arg[0] : arg;
	const abortedElements = Array.isArray(arg) ? [...arg[1], element] : [element];

	let mouseDownTargetElm: EventTarget | null = null;

	const handleMouseDown = (event: Event) => {
		mouseDownTargetElm = event.target;
	};

	const handleMouseUp = (event: Event) => {
		const elementIsAncestorOfEventTarget = abortedElements.some(
			(element) =>
				element.contains(mouseDownTargetElm as HTMLElement) ||
				element.contains(event.target as HTMLElement)
		);

		if (!elementIsAncestorOfEventTarget) {
			onOutsideClick();
		}
	};

	document.addEventListener('mousedown', handleMouseDown);
	document.addEventListener('mouseup', handleMouseUp);

	return {
		destroy() {
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mouseup', handleMouseUp);
		}
	};
}
