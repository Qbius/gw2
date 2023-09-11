<script>
    import Daily_list from './Daily_list.svelte';
    import {dailies, daily} from './fractals';
    
    export let dailies_offset;

    function modulo(number, offset) {
        const res = number % offset;
        return (res < 0) ? res + offset : res;
    }

    $: proper_dailies = dailies(dailies_offset);
    $: previous_dailies = dailies(modulo(dailies_offset - 1, daily.length));
    $: next_dailies = dailies(modulo(dailies_offset + 1, daily.length));

</script>

<div class="component">
    <Daily_list dailies={proper_dailies} link/>
    <div style="height: 30px; display: flex; align-items: center; justify-content: center;">    
        {#if dailies_offset < 0}
            <span class="daychange-text">{-dailies_offset} day{(dailies_offset < -1) ? 's' : ''} ago</span>
            <button class="reset-button" on:click={() => dailies_offset = 0}>RESET</button>
            {:else if dailies_offset > 0}
            <span class="daychange-text">In {dailies_offset} day{(dailies_offset > 1) ? 's' : ''}</span>
            <button class="reset-button" on:click={() => dailies_offset = 0}>RESET</button>
        {/if}
    </div>
    <div style="margin-top: 10px; display: flex; justify-content: space-evenly;">
        <div on:mousedown={() => dailies_offset -= 1} class="daychange">
            <span class="daychange-text">Previous day</span>
            <div class="daychange-list"><Daily_list dailies={previous_dailies} size_coeff={0.4}/></div>
        </div>
        <div on:mousedown={() => dailies_offset += 1} class="daychange">
            <span class="daychange-text">Next day</span>
            <div class="daychange-list"><Daily_list dailies={next_dailies} size_coeff={0.4}/></div>
        </div>
    </div>
</div>

<style>
    .component {
        width: 320px;

        margin: auto;
        display: flex;
        flex-direction: column;
    }

    .daychange-text {
        font-size: 18px;
        color: white;
        text-shadow: 0px 0px 3px black, 0 0 1em black, 0 0 0.2em black;
        margin-bottom: 3px;
    }

    .daychange {
        display: flex;
        flex-direction: column;
    }

    .daychange-list:hover {
        opacity: 0.8;
    }

    .reset-button {
        margin-left: 8px;
        border-radius: 5px;
        font-size: 10px;
    }
</style>