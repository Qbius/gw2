<script>
    import Day_spread from './Day_spread.svelte';
    import {daily, daily_index} from './fractals';
    
    export let dailies_offset;

    function modulo(number, offset) {
        const res = number % offset;
        return (res < 0) ? res + offset : res;;
    }
</script>

<div class="component">
    {#each [...Array(daily.length).keys()] as day_index}
    <div style={(day_index === modulo(daily_index + dailies_offset, daily.length)) ? '' : 'display: none;'}>
        <Day_spread {day_index} bind:dailies_offset={dailies_offset}/>
    </div>
    {/each}
</div>

<style>
    .component {
        width: 320px;

        position: relative;
    }
</style>