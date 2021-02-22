<script>
	import {all, dailies, breakdown, rewards, shortname, name_by_scale} from './fractals.js';

	const range = i => [...Array(i).keys()];
	const from_units = (twenties, fives) => 1 + fives + twenties * 5;
	let scale_selected = range(100).map(_ => false);
	const switch_scale = scale => {
		console.log(scale);
		scale_selected[scale - 1] = !scale_selected[scale - 1];
	}
	const names = Object.keys(all);
	let names_selected = names.map(_ => false);
	const switch_name = name => {
		const index = names.indexOf(name);
		if (index !== -1) names_selected[index] = !names_selected[index];
	}

	const reset = () => {
		scale_selected = range(100).map(_ => false);
		names_selected = names.map(_ => false);
	}

	const[ds, rs] = dailies();
	ds.forEach(name => switch_name(name));
	rs.forEach(scale => switch_scale(scale));

	$: parsed_names = names.filter((_, index) => names_selected[index]);
	$: parsed_scales = range(100).filter(i => scale_selected[i]).map(i => i + 1);
	$: selected = [...parsed_names, ...parsed_scales];
	
	$: bkdwn = breakdown(selected, ds, rs);
	$: allrews = bkdwn.map(([_, set]) => set.map(([ff, fl]) => rewards(ff, fl)).reduce((a, b) => [...Array(Math.min(a.length, b.length)).keys()].map(i => Number(a[i]) + Number(b[i])), [0, 0, 0, 0, 0, 0]));

</script>

<main>
	<div class="bg-wrap"></div>
	<div style="margin: auto; display: flex; flex-direction: column; align-items: flex-start; min-width: 413px; max-width: 413px;">
		<div style="display: flex;">
			{#if (parsed_names.length + parsed_scales.length) > 0}
				<span class="cellka text-cellka header-cellka">AR</span>
			{/if}
			{#each selected as sel}
				<span class="cellka text-cellka header-cellka" title={(typeof sel === 'string' ? sel : name_by_scale(sel))} style="font-size: 6px; word-wrap: break-word; width: 30px;">{sel}</span>
			{/each}
			<div class="reward-bar"></div>
		</div>
		{#each bkdwn as [ar, set], m_index}
			<div style="display: flex;">
				<span class="cellka text-cellka" style="background-color: #BDB76B"><b>{ar}</b></span>
				{#each set as [scale, flag], index}
					<div class={'cellka text-cellka ' + ((scale === 'X') ? 'nono' : 'yesyes')}>
						<div class={(scale === 'X' || typeof selected[index] !== 'string') ? '' : 'scale-text-container'}>
							<span class="scale-text">{(scale === 'X') ? '✗' : (typeof selected[index] === 'string') ? `T${Math.floor((scale - 1) / 25) + 1}` : '✓'}</span>
							{#if typeof selected[index] === 'string'}
								<span style="font-size: 10px;">{scale}</span>
							{/if}
						</div>
					</div>
				{/each}
				<div class="cellka reward-bar" style="background-color: #39918c;">
					<div class="reward-count"><span class="reward-text"><b>{allrews[m_index][0]}</b></span></div><img class="reward-icon" alt="relics" src="/relic.png">
					<div class="reward-count"><span class="reward-text"><b>{allrews[m_index][1]}</b></span></div><img class="reward-icon" alt="pristine" src="/pristine.png">
					<div class="reward-count"><span class="reward-text"><b>{allrews[m_index][2]}</b></span></div><img class="reward-icon" alt="encryptions" src="/encryption.png">
					<div class="reward-count"><span class="reward-text"><b>{allrews[m_index][3]}</b></span></div><img class="reward-icon" alt="keys" src="/key.png">
				</div>
			</div>
		{/each}
	</div>

	<div style="margin: auto; display: flex; flex-direction: column; align-items: center;">
		<div style="display: flex; justify-content: center;">
			<div style="margin: auto; display: flex; flex-direction: column;">
				{#each range(20) as twenties}
					<div style="display: flex;">
						{#each range(5) as fives}
							<button 
								style="flex: 1; width: 30px; height: 21px;" 
								class={'cellektor' + (scale_selected[from_units(twenties, fives) - 1] ? ' scaleon' : '')} 
								on:click={_ => switch_scale(from_units(twenties, fives))}
								title={name_by_scale(from_units(twenties, fives))}
							>
								<div style="display: flex; justify-content: flex-end"><b style="margin-right: 2px;">{from_units(twenties, fives)}</b></div>
								<div style="position: relative;">
									{#if rs.indexOf(from_units(twenties, fives)) !== -1}
										<img style="position: absolute; left: 14px; bottom: -3px; width: 10px; height: 10px;" alt="daily" src="/daily.png">
									{/if}
								</div>
							</button>
						{/each}
					</div>
				{/each}
			</div>

			<div style="margin: auto; display: flex; flex-direction: column;">
				{#each names as name, name_index}
					<button 
						style="position: relative; width: 200px; height: 20px;"
						class={'cellektor' + (names_selected[name_index] ? ' scaleon' : '')}
						on:click={_ => switch_name(name)}	
					>
						<b style="margin: auto;">{name}</b>
						{#if ds.indexOf(name) !== -1}
							<img style="position: absolute; left: 0px;" alt="daily" src="/daily.png">
						{/if}
					</button>
				{/each}
			</div>
		</div>
		<button style="background-color: #39918c; margin-top: 10px; width: 100px; height: 40px;" on:click={reset}>RESET</button>
	</div>
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

	.cellka {
		width: 30px;
		height: 35px;
		opacity: 0.85;
		border: 2px solid #003438;
		margin: 1px;
	}

	.cellektor {
		margin: 1px;
		border: 1px solid black;
		background-color: #39918c;
		opacity: 0.85;
		border-radius: 2px;
		font-size: 12px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.scaleon {
		background-color: #0fcfc6;
	}

	.text-cellka {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.header-cellka {
		background-color: rgb(134, 153, 155);
		color: rgb(44, 43, 43);
	}

	.scale-text-container {
		background-color: #00bf46;
		border: 1px solid black;
		display: flex;
		flex-direction: column;
		width: 20px;
	}

	.scale-text {
		font-size: 12px;
	}

	.reward-count {
		width: 30px;
		font-size: 12px;
		display: flex;
		justify-content: flex-end;
	}

	.reward-bar {
		display: flex;
		align-items: center;
		width: 150px;
		padding-right: 5px;
		border-radius: 5px;
	}

	.reward-text {
		margin-bottom: 2px; 
		margin-right: 2px;
	}
	
	.yesyes {
		font-weight: 900;
		background-color: 	#008d33;
		font-family: 'Jura', sans-serif;
	}
	
	.nono {
		text-shadow: -1px 0 crimson, 0 1px crimson, 1px 0 crimson, 0 -1px crimson;
		background-color: #E9967A;
		font-family: 'Jura', sans-serif;
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

	.bg-wrap-color {
		position: absolute;
		opacity: 0.5;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
		object-fit: cover;
		background-color: #00a590;
	}

	.reward-icon {
		width: 15px;
		height: 15px;
		border-radius: 5px;
		border: 1px solid rgb(65, 101, 104);
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>