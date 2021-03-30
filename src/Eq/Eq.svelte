<script>
    import Eq_slot from './Eq_slot.svelte';
    import Scoreboard from './Scoreboard.svelte';
    export let account_info;

    const left_split = ['Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots'];
    const right_split = ['Backpack', 'Amulet', 'Accessory1', 'Accessory2', 'Ring1', 'Ring2'];

    let stat_aggregator = account_info ? Object.fromEntries(Object.keys(account_info).map(name => [name, {}])) : undefined;

    $: precision_base = (account_info !== undefined) ? Object.fromEntries(Object.entries(account_info).map(([name, info]) => [name, Object.values(info).filter(piece => 'info' in piece && piece.info.slot !== 'HelmAquatic' && piece.info.slot.slice(0, 6) !== 'Weapon').reduce((acc, piece) => acc + (('Precision' in piece.stats) ? piece.stats.Precision : 0), 0)])) : undefined;
    let selected_character = (account_info !== undefined) ? Object.keys(account_info)[0] : undefined;
</script>

<div class="component">
    <div id="bg-wrap"/>
    <div id="header">
        <select bind:value={selected_character}>
            {#each Object.keys(account_info).sort() as name}
                <option value={name}>
                    {name}
                </option>
            {/each}
        </select>
    </div>
    <div style="position: relative; width: 320px; height: 600px;">
        {#each Object.keys(account_info) as name}
        <div style={(name !== selected_character) ? 'display: none;' : ''} id="split">
            <div class="eq-segment">
                {#each left_split as item_slot}
                    <Eq_slot style="align-self: flex-end;" direction="left" {item_slot} bind:stat_aggregator={stat_aggregator[name]} character_info={account_info[name]}/>
                {/each}
                <Eq_slot style="align-self: flex-start;" direction="right" item_slot="WeaponA1" bind:stat_aggregator={stat_aggregator[name]} character_info={account_info[name]}/>
                <Eq_slot style="align-self: flex-start;" direction="right" item_slot="WeaponA2" bind:stat_aggregator={stat_aggregator[name]} character_info={account_info[name]}/>
                <Scoreboard slots={[...left_split, ...right_split, 'WeaponA1', 'WeaponA2']} stat_aggregator={stat_aggregator[name]} character_info={account_info[name]}/>
            </div>
            <div class="eq-segment">
                {#each right_split as item_slot}
                <Eq_slot is_trinket style="align-self: flex-start;" direction="right" {item_slot} bind:stat_aggregator={stat_aggregator[name]} character_info={account_info[name]}/>
                {/each}
                <Eq_slot style="align-self: flex-end;" direction="left" item_slot="WeaponB1" bind:stat_aggregator={stat_aggregator[name]} character_info={account_info[name]}/>
                <Eq_slot style="align-self: flex-end;" direction="left" item_slot="WeaponB2" bind:stat_aggregator={stat_aggregator[name]} character_info={account_info[name]}/>
                <Scoreboard slots={[...left_split, ...right_split, 'WeaponB1', 'WeaponB2']} stat_aggregator={stat_aggregator[name]} character_info={account_info[name]}/>
            </div>
        </div>
        {/each}
    </div>
    <div id="footer">

    </div>
</div>

<style>
    .component {
        width: 320px;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    #bg-wrap {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
        background-color: rgb(202, 198, 198);
        opacity: 0.8;
        border-radius: 12px;
    }

    #header {
        margin-top: 8px;
        margin-bottom: 8px;
    }

    #split {
        width: 100%;
        position: absolute;
        display: flex;
    }

    .eq-segment {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
</style>