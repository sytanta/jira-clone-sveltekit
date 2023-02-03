<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import moment from 'moment';
	import { range } from 'lodash';

	import { formatDate, formatDateTimeForAPI } from '$lib/utils/dateTime';

	export let value: string;

	const emit = createEventDispatcher();
	let sectionRef: HTMLDivElement | null = null;
	let times: string[];

	$: times = range(48).map((i) => {
		const hour = `${Math.floor(i / 2)}`;
		const paddedHour = hour.length < 2 ? `0${hour}` : hour;
		const minute = i % 2 === 0 ? '00' : '30';
		return `${paddedHour}:${minute}`;
	});

	onMount(() => {
		if (!sectionRef) return;

		const selectedTimeElm = sectionRef.querySelector(`[data-time="${formatTime(value)}"]`);
		if (!selectedTimeElm) return;

		selectedTimeElm.scrollTop = (selectedTimeElm as HTMLDivElement).offsetTop - 80;
	});

	function handleTimeChange(newTime: string) {
		const [newHour, newMinute] = newTime.split(':');

		const existingDateWithNewTime = moment(value).set({
			hour: Number(newHour),
			minute: Number(newMinute)
		});

		emit('change', formatDateTimeForAPI(existingDateWithNewTime));
		emit('toggle-dropdown', false);
	}

	function formatTime(value: string) {
		return formatDate(value, 'HH:mm');
	}
</script>

<div class="time-section" bind:this={sectionRef}>
	{#each times as time (time)}
		<button
			class={`time ${time === formatTime(value) ? 'selected' : ''}`}
			data-time={time}
			on:click={() => handleTimeChange(time)}
		>
			{time}
		</button>
	{/each}
</div>

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles/mixins';

	.time-section {
		border-left: 1px solid $borderLight;
		height: 100%;
		padding: 5px 0;
		position: absolute;
		right: 0;
		top: 0;
		width: 90px;

		@include scrollableY;

		.time {
			padding: 5px 0 5px 20px;

			@include font-size(14);

			&.selected {
				color: #fff;

				&:hover,
				& {
					background: $primary;
				}
			}
		}
	}
</style>
