<script>
    import {name_by_scale} from './fractals';
    export let dailies;

    function filename(name) {
        return `/fractals/${name.toLowerCase().replace(' ', '_')}.png`;
    }

    $: names = dailies.names;
    $: scales = dailies.scales;


</script>

<div class="component">
    {#each names as name}
        <div class="daily-fractal" style={`display: flex; justify-content: center; background-image: url(${filename(name)});`}>
            <span style="margin: auto;">{name}</span>
        </div>
    {/each}
    {#each scales as scale}
        <div class="daily-fractal" style={`display: flex; justify-content: center; background-image: url(${filename(name_by_scale(scale))});`}>
            <span style="margin: auto;">Scale {scale} - {name_by_scale(scale)}</span>
        </div>
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

        font-size: 24px;
        color: white;
        text-shadow: 0px 0px 3px black, 0 0 1em black, 0 0 0.2em black;
    }
</style>