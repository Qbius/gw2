<script>
	const from_units = (twenties, fives) => 1 + fives + twenties * 5;
</script>

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

    <style>

    </style>