<script>
	import {dailies, breakdown, rewards} from './fractals.js';

	const[ds, rs] = dailies();
	let selected = [...ds, ...rs];

	function set_to_rewards(set) {
		return set.map(([ff, fl]) => rewards(ff, fl)).reduce(([o1, t1, th1, f1, fi1, s1], [o2, t2, th2, f2, fi2, s2]) => {
			let rews = [Number(o1) + Number(o2), t1 + t2, th1 + th2, f1 + f2, fi1 + fi2, s1 + s2];
			return `${rews[0]}Relics ${rews[1]}Pristine ${rews[2]}Encryptions ${rews[3]}Keys ${rews[4]}agony ${rews[5]}Silvers`;
		}, [0, 0, 0, 0, 0, 0]);
	}
</script>

<main>
	<div style="margin: auto; display: flex; flex-direction: column; align-items: center; width: 1200px;">
		<div style="display: flex;">
			<span class="cellka">AR</span>
			{#each selected as sel}
				<span class="cellka" style="font-size: 10px;">{sel}</span>
			{/each}
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