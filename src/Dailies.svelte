<script>
    import {name_by_scale} from './fractals';
    export let dailies;

    function filename(name) {
        return `/fractals/${name.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')}.png`;
    }

    function discretize_url(name) {
        const exceptions = {
            "Chaos": "Chaos Isles",
            "Urban Battleground": "Urban Battlegrounds",
        }
        const proper_name = (name in exceptions) ? exceptions[name] : name;
        return `https://discretize.eu/fractals/${proper_name.toLowerCase().replaceAll(' ', '-')}`;
    }

    $: names = dailies.names;
    $: scales = dailies.scales;

</script>

<div class="component">
    {#each names as name}
    <a href={discretize_url(name)} target="_blank">
        <div class="daily-fractal" style={`display: flex; justify-content: center; background-image: url(${filename(name)});`}>
            <span style="margin: auto;">{name}</span>
        </div>
    </a>
    {/each}
    {#each scales as scale}
    <a href={discretize_url(name_by_scale(scale))} target="_blank">
        <div class="daily-fractal" style={`display: flex; justify-content: center; background-image: url(${filename(name_by_scale(scale))});`}>
            <span style="margin: auto;">Scale {scale} - {name_by_scale(scale)}</span>
        </div>
    </a>
    {/each}
</div>

<style>
    .component {
        width: 320px;

        margin: auto;
        display: flex;
        flex-direction: column;
    }

    .daily-fractal {
        border: 1px solid black;
        margin: 1px;
        height: 50px;

        font-size: 22px;
        color: white;
        text-shadow: 0px 0px 3px black, 0 0 1em black, 0 0 0.2em black;
    }
</style>