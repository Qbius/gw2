<script>
    import {minimum_ar, all, name_by_scale, tier_from_scale, combined_rewards} from './fractals'

    export let dailies;
    
    $: names = dailies.names;
    $: scales = dailies.scales;
    $: selected = [...names, ...scales];
    $: breakpoints = Array.from(new Set(selected.map(f => (typeof f === 'string') ? all[f] : f).flat().map(minimum_ar))).sort((a, b) => a - b);
    $: breakdown = breakpoints.map(breakpoint => [breakpoint, selected.map(f => (typeof f === 'string') ? JSON.parse(JSON.stringify(all[f])).reverse().find(s => minimum_ar(s) <= breakpoint) : ((minimum_ar(f) <= breakpoint) ? f : undefined))]);
    $: heavy_breakpoints = [...Array(4).keys()].map(i => Math.max(...[...names.map(n => minimum_ar(all[n].find(s => tier_from_scale(s) === (i + 1)))), ...scales.filter(s => tier_from_scale(s) <= (i + 1)).map(minimum_ar)]));
    $: allrews = breakdown.map(([_, scales]) => combined_rewards(scales, dailies));

</script>

<div class="component">
    <div style="display: flex; align-items: flex-end;">
        {#if (names.length + scales.length) > 0}
            <span style="height: 25px;" class="cellka text-cellka header-cellka"><b>AR</b></span>
        {/if}
        {#each selected as sel}
            {#if typeof sel === 'string'}
                <span style="height: 180px;" class="vertical-text cellka text-cellka header-cellka" title={name_by_scale(sel)}><b style="margin-bottom: 10px;">{sel}</b></span>
            {:else}
                <div style="height: 180px;" class="cellka text-cellka header-cellka" title={sel}>
                    <b style="margin-bottom: 10px;">{sel}</b>
                    <b class="vertical-text" style="flex: 1; margin-bottom: 10px;">{name_by_scale(sel)}</b>
                </div>
            {/if}
        {/each}
        <div class="reward-bar"></div>
    </div>
    {#each breakdown as [ar, set], m_index}
        <div style="display: flex;" class={(heavy_breakpoints.indexOf(ar) !== -1) ? 'tier-jump': ''}>
            <span class="cellka text-cellka" style={(heavy_breakpoints.indexOf(ar) !== -1) ? 'background-color: black; color: #BDB76B; border: 2px solid black;' : 'background-color: #BDB76B;'}><b>{ar}</b></span>
            {#each set as scale, index}
                <div class={'cellka text-cellka ' + (!scale ? 'nono' : 'yesyes')}>
                    <div class={(!scale || typeof selected[index] !== 'string') ? '' : 'scale-text-container'}>
                        <span class="scale-text">{!scale ? '✗' : (typeof selected[index] === 'string') ? `T${tier_from_scale(scale)}` : '✓'}</span>
                        {#if typeof selected[index] === 'string' && scale}
                            <span style="font-size: 10px;">{scale}</span>
                        {/if}
                    </div>
                </div>
            {/each}
            <div class="cellka reward-bar" style={(heavy_breakpoints.indexOf(ar) !== -1) ? 'background-color: #4da39f;': 'background-color: #39918c;'}>
                <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center;">
                        <div class="reward-count"><span class="reward-text"><b>{allrews[m_index][0]}</b></span></div><img class="reward-icon" alt="relics" src="/relic.png">
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div class="reward-count"><span class="reward-text"><b>{allrews[m_index][1]}</b></span></div><img class="reward-icon" alt="pristine" src="/pristine.png">
                    </div>
                </div>
                <div style="display: flex; flex-direction: column;">    
                    <div style="display: flex; align-items: center;">
                        <div class="reward-count"><span class="reward-text"><b>{allrews[m_index][2]}</b></span></div><img class="reward-icon" alt="encryptions" src="/encryption.png">
                    </div>                  
                    <div style="display: flex; align-items: center;">
                        <div class="reward-count"><span class="reward-text"><b>{allrews[m_index][3]}</b></span></div><img class="reward-icon" alt="keys" src="/key.png">
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>

<style>

.component {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 413px;
    max-width: 413px;
}

.tier-jump {
    background-color: black;
}
	
.cellka {
    width: 30px;
    height: 35px;
    opacity: 0.85;
    border: 2px solid #003438;
    margin: 1px;
}

.vertical-text {
    writing-mode: vertical-lr;
    text-orientation: upright;
    letter-spacing: -5px;
    line-height: 99%;
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
    height: fit-content;
    font-size: 12px;
    width: 30px;
    word-wrap: break-word;
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

.reward-bar {
    display: flex;
    align-items: center;
    width: 65px;
    padding-right: 5px;
    border-radius: 5px;
}

.reward-count {
    width: 20px;
    display: flex;
    justify-content: flex-end;
}

.reward-text {
    margin-bottom: 2px; 
    margin-right: 2px;
    font-size: 12px;
}

.reward-icon {
    width: 12px;
    height: 12px;
    border-radius: 5px;
    border: 1px solid rgb(65, 101, 104);
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

</style>