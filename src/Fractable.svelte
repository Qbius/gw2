<script>
    import {all, tier_from_scale} from './fractals';

    export let dailies;
    let daily_fractals = dailies.names;
    let recommended_fractals = dailies.scales;

    let selected = []
    const reset = () => selected = [...Array(100).keys()].map(_ => false);
    reset();
    recommended_fractals.forEach(s => selected[s - 1] = true);

    function select_by_name(name) {
        [...Array(4).keys()].forEach(i => selected[all[name].find(s => s > i * 25 && s <= (i + 1) * 25) - 1] = true);
    }
    daily_fractals.forEach(select_by_name);

    const fractal_names = Object.keys(all);
</script>

<div class="component">
    {#each fractal_names as fractal_name}
        <div class="fractable-row">
            <div class="fractable-header" style="width: 165px;">
                <span>{fractal_name}</span>
                {#if daily_fractals.indexOf(fractal_name) !== -1}
                    <img style="position: absolute; left: 2px; bottom: 6px; width: 15px;" alt="daily" src="/daily.png">
                {/if}
            </div>
            {#each [...Array(4).keys()] as tier}
                <div class="fractable-cell">
                    {#each all[fractal_name].filter(s => tier_from_scale(s) === (tier + 1)) as scale}
                        <div class="fractable-scale" style={'flex: 1;' + (selected[scale - 1] ? ' opacity: 0.85;' : '')}>
                            <b style="flex: 1; height: 14px;">{scale}</b>
                            <div>
                                {#if recommended_fractals.indexOf(scale) !== -1}
                                    <img style="flex: 1; width: 12px; height: 12px;" alt="daily" src="/daily.png">
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>

.component {
    display: flex;
    flex-direction: column;
}

.fractable-header {
    color: rgb(44, 43, 43);
    background-color: rgb(134, 153, 155);
    font-size: 12px;
    position: relative;
    
    display: flex;
    justify-content: center;
    align-items: center;
}

.fractable-row {
    display: flex;
    height: 30px;
    margin-top: 1px;
}

.fractable-cell {
    width: 50px;
    display: flex;
}

.fractable-scale {
    background-color: #396991;
    color: white;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    border: 2px solid #003438;
    margin-left: 1px;
    border-radius: 3px;
    font-size: 12px;
    opacity: 0.25;
    display: flex;
    flex-direction: column;
}

.sel {

}

</style>