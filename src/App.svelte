<script>
	import {dailies, breakdown, rewards} from './fractals.js';

	const[ds, rs] = dailies();
	let selected = [...ds, ...rs];

	function set_to_rewards(set) {
		let rews = set.map(([ff, fl]) => rewards(ff, fl)).reduce((a, b) => [...Array(Math.min(a.length, b.length)).keys()].map(i => Number(a[i]) + Number(b[i])), [0, 0, 0, 0, 0, 0]);
		return `${rews[0]}Relics ${rews[1]}Pristine ${rews[2]}Encryptions ${rews[3]}Keys ${rews[4]}agony ${rews[5]}Silvers`;
	}
</script>

<main>
	<div style="margin: auto; display: flex; flex-direction: column; align-items: center; width: 1200px;">
		<div style="display: flex;">
			<span class="cellka">AR</span>
			{#each selected as sel}
				<span class="cellka" style="font-size: 10px;">{sel}</span>
			{/each}
			<div style="width: 500px"></div>
		</div>
		{#each breakdown([...ds, ...rs], ds, rs) as [ar, set]}
			<div style="display: flex;">
				<span class="cellka" style="background-color: yellow">{ar}</span>
				{#each set as [scale, flag], index}
					<div class="cellka" style={`background-color: ${(scale === 'X') ? '#E9967A' : '#ADFF2F'}`}>
						<span>{(scale === 'X') ? 'X' : (typeof selected[index] === 'string') ? `T${Math.floor((scale - 1) / 25) + 1}` : 'O'}</span>
						{#if scale !== 'X'}
							<span style="font-size: 12px;">{scale}</span>
						{/if}
					</div>
				{/each}
				<div class="cellka" style="width: 500px">{set_to_rewards(set)}</div>
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;

		display: flex;
		justify-content: center;
	}

	.cellka {
		width: 50px;
		height: 50px;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>