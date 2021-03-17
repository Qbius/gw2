<script>
    import * as skins from '../examples/skins.json';
    import * as itemstats from '../examples/itemstats.json';
import App from '../App.svelte';

    export let item_slot;
    export let direction = 'right';
    export let character_info;
    export let is_trinket = false;
    export let stat_aggregator;

    function slot_img_url(slot, info) {
        if (!(slot in info)) return '';
        
        const skin_url = ('skin' in info[slot]['info']) ? `https://render.guildwars2.com/file/${skins.default[info[slot]['info']['skin'].toString()]}` : info[slot]['icon'];
        return skin_url;
    }

    const sep_disabled = '──────────';
    const orig_spread = ((item_slot in character_info) && (character_info[item_slot].spread.toString() in itemstats.default)) ? itemstats.default[character_info[item_slot].spread.toString()].name : sep_disabled;
    let stat_spread = orig_spread;

    const spread_by_name = Object.values(itemstats.default).filter(({attributes: attributes}) => Object.keys(attributes).length >= 3 && is_trinket === Object.values(attributes).some(attr => attr[1] !== 0)).reduce((acc, {name: name, attributes: attributes}) => Object.assign(acc, {[name]: attributes}), {});
    const honorable_mentions = ["Berserker's", "Assassin's", "Diviner's"];
    const is_max_level_spread = Object.keys(spread_by_name).indexOf(stat_spread) !== -1;

    let mock_ascended = false;
    function switch_mock_ascended() {
        if (!(item_slot in character_info)) return;
        if (character_info[item_slot].rarity === 'Ascended') return;

        if (mock_ascended && !is_max_level_spread) {
            stat_spread = orig_spread;
        }
        else if (!mock_ascended && !is_max_level_spread) {
            stat_spread = "Berserker's";
        }
        mock_ascended = !mock_ascended;
        on_spread_change(stat_spread);
    }

    const ascended_adjustment = {
        Shoulders: 134.442,
        Gloves: 134.442,
        Boots: 134.442,
        Helm: 179.256,
        Leggings: 268.884,
        Coat: 403.326,
        Backpack: 89.628,
        Accessory1: 224.07,
        Accessory2: 224.07,
        Ring1: 268.884,
        Ring2: 268.884,
        Amulet: 358.512,
        WeaponA1: 358.512,
        WeaponA2: 358.512,
        WeaponB1: 358.512,
        WeaponB2: 358.512,
        Weapon2h: 717.024,
    };
    
    function on_spread_change(new_value) {
        if (!(item_slot in character_info) || !(new_value in spread_by_name)) return;

        const adj = (!mock_ascended || !(item_slot in ascended_adjustment)) ? character_info[item_slot].adj : ascended_adjustment[character_info[item_slot]['2h'] ? 'Weapon2h' : item_slot];
        stat_aggregator[item_slot] = Object.entries(spread_by_name[new_value]).reduce((acc, [name, [coeff, val]]) => Object.assign(acc, {[name]: Math.round(coeff * adj + val)}), {});
    }

    function reset_changes() {
        mock_ascended = false;
        stat_spread = orig_spread;
        delete stat_aggregator[item_slot];
        stat_aggregator = stat_aggregator;
    }
    
    $: spread_changed = item_slot in stat_aggregator;
    $: rarity_border = (item_slot in character_info) ? `border: 2px solid var(--${mock_ascended ? 'ascended' : character_info[item_slot].rarity.toLowerCase()}-color);` : 'border: 2px solid transparent;';
    $: rest_spreadnames = (is_max_level_spread || mock_ascended) ? Object.keys(spread_by_name).filter(name => honorable_mentions.indexOf(name) === -1).sort() : [stat_spread];
</script>

<div id="component" style={(direction === 'right') ? 'flex-direction: row;' : 'flex-direction: row-reverse;'}>
    <div on:click={switch_mock_ascended} class="eq-slot eq-icon" style={rarity_border}>
        <img class="eq-icon" alt="" src={slot_img_url(item_slot, character_info)}>
        {#if spread_changed}
            <div on:click|stopPropagation={reset_changes} style="display: flex; justify-content: center; background-color: black; color: white; border-radius: 5px; width: 20px; height: 20px; position: absolute; right: 2px; top: 2px;"><span style="margin: auto;">X</span></div>
        {/if}
    </div>
    <select on:input={e => on_spread_change(e.target.value)} bind:value={stat_spread} disabled={!is_max_level_spread && !mock_ascended} style={(!(item_slot in character_info)) ? 'display: none;' : ''} class="stat-dropdown">
        {#each honorable_mentions as name}
            <option value={name}>{name}</option>
        {/each}
        <option disabled>{sep_disabled}</option>
        {#each rest_spreadnames as name}
            <option value={name}>{name}</option>
        {/each}
    </select>
</div>
    
<style>

    #component {
        display: flex;
        align-items: center;
    }

    .stat-dropdown {
        font-size: 10px;
        text-align: center;
        text-align-last: center;
        width: 115px;
        position: relative;
    }

    .eq-slot {
        margin: 2px;
        display: flex;
        align-items: center;
        position: relative;
    }

    .eq-icon {
        width: 35px;
        height: 35px;
    }

    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';
    }

</style>