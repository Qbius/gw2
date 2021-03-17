<script>
    export let character_info;
    export let stat_aggregator;
    export let slots;

    function get_attrs(aggr) {
        return slots.reduce((acc, slot) => {
            const entries = Object.entries((slot in aggr) ? aggr[slot] : (slot in character_info) ? character_info[slot].stats : {})
            return entries.reduce((inneracc, [attr, val]) => {
                return Object.assign(inneracc, {[attr]: val + (inneracc[attr] ? inneracc[attr] : 0)});
            }, acc);
        }, {});
    }

    const ar = character_info ? slots.filter(slot => slot in character_info).map(slot => character_info[slot].stats.ar).reduce((acc, e) => acc + e) : 0;
    $: all_attrs = character_info ? Object.assign(get_attrs(stat_aggregator), {ar: ar}) : [];
</script>

<div style="display: flex; flex-direction: column;">
    {#each Object.entries(all_attrs) as [name, value]}
    <span>{name}: {value}</span>
    {/each}
</div>