<script>
    import * as skins from './examples/skins.json';
    import {wait_for_account_info} from './stores.js';

    export let token;

    const left_split = ['Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots'];
    const right_split = ['Backpack', 'Amulet', 'Accessory1', 'Accessory2', 'Ring1', 'Ring2'];

    function slot_img_url(slot, info) {
        if (!(slot in info)) return '';
        
        const skin_id = ('skin' in info[slot]['info']) ? info[slot]['info']['skin'] : info[slot]['info']['id'];
        const url = `https://render.guildwars2.com/file/${skins.default[skin_id.toString()]}`;
        console.log(skin_id);
        return url;
    }

</script>

<div class="component">
    {#await wait_for_account_info(token)}
        <h1>Loading...</h1>
    {:then account_info}
        <div id="header">

        </div>
        <div id="split">
            <div>
                {#each left_split as slot}
                    <div class="eq-slot">
                        <img alt={slot} src={slot_img_url(slot, account_info['characters']['Glazes'])}>
                    </div>
                {/each}
            </div>
            <div>
                {#each right_split as slot}
                    <div class="eq-slot">
                        <img alt={slot} src={slot_img_url(slot, account_info['characters']['Glazes'])}>
                    </div>
                {/each}
            </div>
        </div>
        <div id="footer">

        </div>
    {/await}
</div>

<style>
    .component {
        background-color: white;
        width: 320px;
        display: flex;
        flex-direction: column;
    }

    #header {

    }

    #split {
        display: flex;
    }

    .eq-slot {
        display: flex;
        align-items: center;
    }
</style>