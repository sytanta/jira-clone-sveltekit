export const calcPosition = (
	offset: TooltipOffset,
	placement: TooltipPlacement,
	tooltipElmRef: HTMLElement,
	tooltipLinkRef: HTMLElement
) => {
	const margin = 10;

	const tooltipRect = tooltipElmRef.getBoundingClientRect();
	const linkRect = tooltipLinkRef.getBoundingClientRect();

	const linkCenterY = linkRect.top + linkRect.height / 2;
	const linkCenterX = linkRect.left + linkRect.width / 2;

	const placements = {
		top: {
			top: linkRect.top - margin - tooltipRect.height,
			left: linkCenterX - tooltipRect.width / 2
		},
		right: {
			top: linkCenterY - tooltipRect.height / 2,
			left: linkRect.right + margin
		},
		bottom: {
			top: linkRect.bottom + margin,
			left: linkCenterX - tooltipRect.width / 2
		},
		left: {
			top: linkCenterY - tooltipRect.height / 2,
			left: linkRect.left - margin - tooltipRect.width
		}
	};

	return {
		top: placements[placement].top + offset.top,
		left: placements[placement].left + offset.left
	};
};

const placements = ['top', 'right', 'bottom', 'left'] as const;

export interface TooltipOffset {
	left: number;
	top: number;
}

export type TooltipOffsetLeftOrTop = keyof TooltipOffset;

export type TooltipPlacement = (typeof placements)[number];
