<script>
	import {wait_for_dailies} from './stores.js';
	import Breakdown from './Breakdown.svelte';
</script>

<main>
	<div class="bg-wrap"></div>
	{#await wait_for_dailies()}
		<h1>Loading...</h1>
	{:then dailies}
		<Breakdown {dailies}/>
	{/await}
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		width: 100%;
		height: 100%;
		margin: 0 auto;

		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.bg-wrap {
		position: absolute;
		z-index: -2;
		filter: blur(5px);
		overflow: hidden;
		object-fit: cover;
		opacity: 0.8;
		width: 100%;
		height: 100%;
		background-image: url('/bg.png');
		background-size: cover;
		background-repeat: no-repeat;
		background-position: 50% 50%;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>