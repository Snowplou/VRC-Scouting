<script>
    import { division, getDivisionsFromDb, disableDivisionSelect } from "../database"
    let divisions = {};

    (async () => {
        let info = await getDivisionsFromDb()
        for (let div of Object.keys(info)) {
            divisions[info[div]] = div;
        }
    })();

    function updateDiv(elm) {
        division.set(elm.target.value)
        localStorage.setItem("division", $division)
    }

    division.set("all")
</script>


<div id="division">
    Division: <select value="all" on:change={(elm) => updateDiv(elm)} disabled={$disableDivisionSelect}>
        {#each Object.keys(divisions) as div}
            <option value={div}>{divisions[div]}</option>
        {/each}
        <option value="all">All Divisions</option>
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