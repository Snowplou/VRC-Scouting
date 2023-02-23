<script>
    import { teams, team, event, division, getDivisions, getDivisionsFromDb } from "../database"
    let divisions = {};

    (async () => {
        let info = await getDivisionsFromDb()
        for (let div of Object.keys(info)) {
            divisions[info[div]] = div;
        }
    })();

    function updateDiv(elm) {
        division.set(elm.target.value)
    }
</script>


<div id="division">
    Division: <select value="1" on:change={(elm) => updateDiv(elm)}>
        {#each Object.keys(divisions) as div}
            <option value={div}>{divisions[div]}</option>
        {/each}
    </select>
</div>


<style>
    #division {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1.5%;
        text-align: center;
    }
</style>