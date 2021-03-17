<script>
	import {wait_for_dailies, wait_for_fractal_info, wait_for_account_info} from './stores.js';
	import Dailies from './Dailies.svelte';
	import Breakdown from './Breakdown.svelte';
	import Eq from './Eq/Eq.svelte';

	let token = '';
</script>

<main>
	<div class="bg-wrap"></div>
	{#await wait_for_dailies()}
		<h1>Loading...</h1>
	{:then dailies}
		<div class="separator">
			{#await wait_for_fractal_info(token)}
				<Dailies {dailies}/>
			{:then fractal_info}
				<span style="margin-top: 5px; margin-left: 5px; text-shadow: 0px 0px 3px black, 0 0 1em black, 0 0 0.2em black; font-size: 32px; color: white; align-self: flex-start; justify-self: flex-start;">Fractal level {fractal_info.level}</span>
				<Dailies {dailies} {fractal_info}/>
			{:catch}
				<Dailies {dailies}/>	
			{/await}
		</div>
		<div class="separator">
			<input bind:value={token} style="width: 400px; justify-self: flex-start;">
			<Breakdown {dailies}/>
		</div>
		<div class="separator">
			{#await wait_for_account_info(token)}
				<Eq/>
			{:then account_info}
				<Eq {account_info}/>
			{:catch}	
				<Eq/>
			{/await}
		</div>
	{/await}
</main>

<style>
	main {
		text-align: center;
		width: 100%;
		height: 100%;
		margin: 0 auto;

		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.separator {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.bg-wrap {
		position: absolute;
		z-index: -100;
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

	@media only screen and (max-width: 760px) {

	}
</style>