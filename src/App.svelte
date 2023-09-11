<script>
	import Dailies from './Dailies.svelte';
	import Breakdown from './Breakdown.svelte';

	let dailies_offset = 0;
	
</script>

<main>
	<div class="bg-wrap"></div>
	<div class="main-app" style="flex: 1; display: flex;">
		<div class="separator">
			<Dailies bind:dailies_offset={dailies_offset}/>
		</div>
		<div id="breakdown-div" class="separator">
			<Breakdown bind:dailies_offset={dailies_offset}/>
		</div>
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