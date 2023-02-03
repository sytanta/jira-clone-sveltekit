<script lang="ts">
	export let height: string = '100%';
	export let width: string = '100%';
	export let interval: number = 0.25;
	export let rtl: boolean = false;
	export let speed: number = 1.2;
	export let title: string = 'Loading...';
	export let beforeMask: boolean = false;
	export let animate: boolean = true;
	export let animateBegin: string = '0s';

	export let baseUrl: string = '';
	export let backgroundColor: string = '#f5f6f7';
	export let backgroundOpacity: number = 1;
	export let foregroundColor: string = '#eee';
	export let foregroundOpacity: number = 1;
	export let gradientRatio: number = 2;
	export let gradientDirection: string = 'left-right';

	const fixedId = Math.random().toString(36).substring(6);
	const idClip = `${fixedId}-diff`;
	const idGradient = `${fixedId}-animated-diff`;
	const idAria = `${fixedId}-aria`;

	const keyTimes = `0; ${interval}; 1`;
	const dur = `${speed}s`;
	const gradientTransform = gradientDirection === 'top-bottom' ? 'rotate(90)' : undefined;

	const svgStyles = rtl ? `{ transform: scaleX(-1); }` : '';
	const rectStyles = `
		clip-path: url(${baseUrl}#${idClip});
		fill: url(${baseUrl}#${idGradient});
	`;
</script>

<div class="container">
	<svg aria-labelledby={idAria} role="img" style={svgStyles} {width} {height}>
		{#if title}<title id={idAria}>{title}</title>{/if}
		{#if beforeMask}{beforeMask}{/if}

		<rect role="presentation" x="0" y="0" width="100%" height="100%" style={rectStyles} />

		<defs>
			<clipPath id={idClip}
				><rect x="0" y="0" rx="3" ry="3" width="627" height="24" />
				<rect x="0" y="29" rx="3" ry="3" width="506" height="24" />
				<rect x="0" y="77" rx="3" ry="3" width="590" height="16" />
				<rect x="0" y="100" rx="3" ry="3" width="627" height="16" />
				<rect x="0" y="123" rx="3" ry="3" width="480" height="16" />
				<rect x="0" y="187" rx="3" ry="3" width="370" height="16" />
				<circle cx="18" cy="239" r="18" />
				<rect x="46" y="217" rx="3" ry="3" width="548" height="42" />
				<rect x="683" y="3" rx="3" ry="3" width="135" height="14" />
				<rect x="683" y="33" rx="3" ry="3" width="251" height="24" />
				<rect x="683" y="90" rx="3" ry="3" width="135" height="14" />
				<rect x="683" y="120" rx="3" ry="3" width="251" height="24" />
				<rect x="683" y="177" rx="3" ry="3" width="135" height="14" />
				<rect x="683" y="207" rx="3" ry="3" width="251" height="24" />
			</clipPath>

			<linearGradient id={idGradient} {gradientTransform}>
				<stop offset="0%" stop-color={backgroundColor} stop-opacity={backgroundOpacity}>
					{#if animate}
						<animate
							attributeName="offset"
							values={`${-gradientRatio}; ${-gradientRatio}; 1`}
							{keyTimes}
							{dur}
							repeatCount="indefinite"
							begin={animateBegin}
						/>
					{/if}
				</stop>

				<stop offset="50%" stop-color={foregroundColor} stop-opacity={foregroundOpacity}>
					{#if animate}
						<animate
							attributeName="offset"
							values={`${-gradientRatio / 2}; ${-gradientRatio / 2}; ${1 + gradientRatio / 2}`}
							{keyTimes}
							{dur}
							repeatCount="indefinite"
							begin={animateBegin}
						/>
					{/if}
				</stop>

				<stop offset="100%" stop-color={backgroundColor} stop-opacity={backgroundOpacity}>
					{#if animate}
						<animate
							attributeName="offset"
							values={`0; 0; ${1 + gradientRatio}`}
							{keyTimes}
							{dur}
							repeatCount="indefinite"
							begin={animateBegin}
						/>
					{/if}
				</stop>
			</linearGradient>
		</defs>
	</svg>
</div>

<style lang="scss">
	.container {
		padding: 40px;
	}
</style>
