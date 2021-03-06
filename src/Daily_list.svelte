<script>
    import {all, name_by_scale, tier_from_scale} from './fractals.js';
    export let dailies;
    export let fractal_info = undefined;
    export let link = false;

    export let size_coeff = 1;

    function ensure_name(fractal) {
        return (typeof fractal === 'string') ? fractal : name_by_scale(fractal);
    }

    function filename(name) {
        return `/fractals/${name.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')}.png`;
    }

    function discretize_url(name) {
        const exceptions = {
            "Chaos": "Chaos Isles",
            "Urban Battleground": "Urban Battlegrounds",
        }
        const proper_name = (name in exceptions) ? exceptions[name] : name;
        return `https://discretize.eu/fractals/${proper_name.toLowerCase().replaceAll(' ', '-').replaceAll("'", '')}`;
    }

    function gather_missing(fractal, info) {
        if (!info) return;

        const scales = (typeof fractal === 'number') ? [fractal] : all[fractal];
        return scales.filter(scale => info.missing.indexOf(scale) !== -1);
    }

    $: fractals = [...dailies.names, ...dailies.scales];
    $: all_missing = fractals.map(fractal => gather_missing(fractal, fractal_info));

</script>

<div class="component" style="width: {320 * size_coeff}px;">
    {#each fractals as fractal, index}
    {#if fractal_info && all_missing[index] && all_missing[index].length > 0}
        <div style="display: flex;">
            <span>Missing</span>
            {#if typeof fractal === 'string'}
            {#each all_missing[index] as missing}
            <span>T{tier_from_scale(missing)}: {missing}</span>
            {/each}
            {/if}
        </div>
    {/if}
    {#if link}
    <a href={discretize_url(ensure_name(fractal))} target="_blank">
        <div class="daily-fractal" style="height: {50 * size_coeff}px; font-size: {21 * size_coeff}px; display: flex; justify-content: center; background-image: url({filename(ensure_name(fractal))}); background-size: {320 * size_coeff}px {50 * size_coeff}px;">
            <span style="margin: auto;">
                {#if (typeof fractal === 'number')}
                    Scale {fractal} - 
                {/if}
                {ensure_name(fractal)}
            </span>
        </div>
    </a>
    {:else}
    <div class="daily-fractal" style="height: {50 * size_coeff}px; font-size: {21 * size_coeff}px; display: flex; justify-content: center; background-image: url({filename(ensure_name(fractal))}); background-size: {320 * size_coeff}px {50 * size_coeff}px;">
        <span style="margin: auto;">
            {#if (typeof fractal === 'number')}
                Scale {fractal} - 
            {/if}
            {ensure_name(fractal)}
        </span>
    </div>
    {/if}
    {/each}
</div>

<style>
    .component {
        margin: auto;
        display: flex;
        flex-direction: column;
    }

    .daily-fractal {
        border: 1px solid black;
        margin: 1px;
        color: white;
        text-shadow: 0px 0px 3px black, 0 0 1em black, 0 0 0.2em black;
    }
</style>