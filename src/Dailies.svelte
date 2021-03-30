<script>
    import Day_spread from './Day_spread.svelte';
    import {daily, recommended} from './fractals';
    
    export let dailies;
    export let dailies_offset;

    function modulo(number, offset) {
        const res = number % offset;
        return (res < 0) ? res + offset : res;
    }

    $: found_index = daily.findIndex(day => day.sort().every((fractal, index) => fractal === dailies.names.sort()[index]));

</script>

<div class="component">
    {#each [...Array(daily.length).keys()] as daily_index}
    <div style={ (daily_index === modulo(found_index + dailies_offset, daily.length)) ? '' : 'display: none;'}>
        <Day_spread {daily_index} bind:dailies_offset={dailies_offset}/>
    </div>
    {/each}
</div>

<style>
    .component {
        width: 320px;

        position: relative;
    }
</style>