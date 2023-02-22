<script>
    import { teams, team, event, division, getDivisions } from "../database"
    let divisions = {};

    (async () => {
        let info = (await getDivisions($event)).divisions;
        for (let div of info) {
            divisions[div.id] = div.name;
        }
        division.set(Object.keys(divisions)[0])
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