<script>
	import {wait_for_dailies} from './stores.js';
	import Dailies from './Dailies.svelte';
	import Breakdown from './Breakdown.svelte';
	import Eq from './Eq.svelte';

	let token = '';
</script>

<main>
	<div class="bg-wrap"></div>
	{#await wait_for_dailies()}
		<h1>Loading...</h1>
	{:then dailies}
		<div class="separator">
			<Dailies {dailies}/>
		</div>
		<div class="separator">
			<!-- <input bind:value={token} style="width: 400px; justify-self: flex-start;"> -->
			<Breakdown {dailies}/>
		</div>
		<!-- <div class="separator">
			<Eq {token}/>
		</div> -->
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

	@media only screen and (max-width: 760px) {

	}
</style>