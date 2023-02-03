<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import moment from 'moment';
	import range from 'lodash/range';
	import times from 'lodash/times';

	import { formatDate, formatDateTimeForAPI } from '$lib/utils/dateTime';

	import Icon from '$lib/components/Icon.svelte';

	export let withTime = true;
	export let value: string;

	const emit = createEventDispatcher();
	const currentYear = moment().year();
	let selectedMonth = moment(value).startOf('month');
	let monthDays: moment.Moment[];
	let fillerDaysBeforeMonthStart: number[];
	let fillerDaysAfterMonthEnd: number[];

	const years: { label: string; value: string }[] = [
		{ label: 'Year', value: '' },
		...times(50, (i) => ({ label: `${i + currentYear - 10}`, value: `${i + currentYear - 10}` }))
	];

	const dayNames: string[] = moment.weekdaysMin(true);

	$: monthDays = times(selectedMonth.daysInMonth()).map((i) =>
		moment(selectedMonth).add(i, 'days')
	);
	$: {
		const count = selectedMonth.diff(moment(selectedMonth).startOf('week'), 'days');
		fillerDaysBeforeMonthStart = range(count);
	}
	$: {
		const selectedMonthEnd = moment(selectedMonth).endOf('month');
		const weekEnd = moment(selectedMonthEnd).endOf('week');
		const count = weekEnd.diff(selectedMonthEnd, 'days');
		fillerDaysAfterMonthEnd = range(count);
	}

	function handleYearChange(
		event: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) {
		selectedMonth = moment(selectedMonth).set({
			year: Number((event.currentTarget as HTMLSelectElement).value)
		});
	}

	function handleMonthChange(addOrSubtract: 'add' | 'subtract') {
		selectedMonth = moment(selectedMonth)[addOrSubtract](1, 'month');
	}

	function handleDayChange(newDate: moment.Moment) {
		const existingHour = value ? moment(value).hour() : 0;
		const existingMinute = value ? moment(value).minute() : 0;

		const newDateWithExistingTime = newDate.set({
			hour: existingHour,
			minute: existingMinute
		});

		emit('change', formatDateTimeForAPI(newDateWithExistingTime));

		if (!withTime) {
			emit('toggle-dropdown', false);
		}
	}
</script>

<div class="date-section">
	<div class="selected-month-year">{formatDate(selectedMonth, 'MMM YYYY')}</div>

	<select class="year-select" on:change={handleYearChange}>
		{#each years as year (year.value)}
			<option value={year.value}>
				{year.label}
			</option>
		{/each}
	</select>

	<div class="prev-next-icon">
		<button class="icon-button" on:click={() => handleMonthChange('subtract')}>
			<Icon type="arrow-left" />
		</button>
		<button class="icon-button" on:click={() => handleMonthChange('add')}>
			<Icon type="arrow-right" />
		</button>
	</div>

	<div class="grid">
		{#each dayNames as name (name)}
			<div class="day-name">{name}</div>
		{/each}
		{#each fillerDaysBeforeMonthStart as day (day)}
			<div class="day filler" />
		{/each}
		{#each monthDays as date (date)}
			<button
				class={`day ${moment().isSame(date, 'day') ? 'today' : ''} ${
					moment(value).isSame(date, 'day') ? 'selected' : 'F'
				}`}
				on:click={() => handleDayChange(date)}
			>
				{formatDate(date, 'D')}
			</button>
		{/each}
		{#each fillerDaysAfterMonthEnd as day (day)}
			<div class="day filler" />
		{/each}
	</div>
</div>

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles//mixins';

	.date-section {
		padding: 20px;
		position: relative;

		.selected-month-year {
			display: inline-block;
			padding-left: 7px;

			@include font-size(16);
			@include font-family-bold;
		}

		.year-select {
			height: 22px;
			margin-left: 5px;
			width: 60px;

			@include font-size(13);
		}

		.prev-next-icon {
			position: absolute;
			right: 19px;
			top: 12px;

			:global(i) {
				color: $textLight;
				font-size: 22px;
				padding: 7px 5px 4px;

				@include clickable;

				&:hover {
					color: $textDarkest;
				}
			}
		}

		.grid {
			display: flex;
			flex-wrap: wrap;
			padding-top: 15px;
			text-align: center;

			.day-name {
				color: $textLight;
				height: 30px;
				line-height: 30px;
				width: 14.28%;

				@include font-size(13);
			}

			.day {
				border-radius: 3px;
				height: 30px;
				line-height: 30px;
				width: 14.28%;

				@include font-size(15);

				&:not(.filler) {
					@include clickable;

					&:hover {
						background: $backgroundMedium;
					}
				}

				&.today {
					@include font-family-bold;
				}

				&.selected {
					color: #fff;

					&:hover,
					& {
						background: $primary;
					}
				}
			}
		}
	}
</style>
