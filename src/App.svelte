<script>
	import {wait_for_dailies, wait_for_fractal_info, wait_for_account_info} from './stores.js';
	import Dailies from './Dailies.svelte';
	import Breakdown from './Breakdown.svelte';
	import Eq from './Eq/Eq.svelte';

	let token = '';
	let token_input = '';

	let dailies_offset = 0;
	
</script>

<main>
	<div class="bg-wrap"></div>
	<!-- Header for settings etc. disabled for now
	<div id="header">
		<img alt="" src="/bg.png" type="password" style="position: absolute; z-index: -1; width: 100%; height: 100%; filter: contrast(200%) hue-rotate(25deg);">
		{#await wait_for_fractal_info(token)}
			<div/>
		{:then fractal_info}
			<span style="justify-self: flex-start; margin-left: 8px; color: white; text-shadow: 0px 0px 3px black, 0 0 1em black, 0 0 0.2em black;">Fractal level {fractal_info.level}</span>
		{/await}
		<div style="display: flex;">
			<input bind:value={token_input} style="font-size: 8px; width: 400px; justify-self: flex-end;">
			<button style="border-radius: 5px; font-size: 10px;">SUBMIT</button>
		</div>
	</div>
	-->
	<div class="main-app" style="flex: 1; display: flex;">
		{#await wait_for_dailies()}
			<h1>Loading...</h1>
		{:then dailies}
			<div class="separator">
				<Dailies {dailies} bind:dailies_offset={dailies_offset}/>
			</div>
			<div id="breakdown-div" class="separator">
				<Breakdown {dailies} bind:dailies_offset={dailies_offset}/>
			</div>
			<!-- Equipment info, disabled for now
			<div class="separator">
				{#await wait_for_account_info(token)}
					<div/>
				{:then account_info}
					<Eq {account_info}/>
				{/await}
			</div>
			-->
		{/await}
	</div>
</main>

<style>
	main {
		text-align: center;
		width: 100%;
		height: 100%;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#header {
		width: 100%;
		height: 25px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
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
		.main-app {
			flex-direction: column;
		}

		#breakdown-div {
			display: none;
		}
	}
</style>