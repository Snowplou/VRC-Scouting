<script>
    export let teamSelected = "";
    import { teams, removedTeams, categories, updateDb, dbUpdated, team, event } from "../database";

    let categoryList = []
    dbUpdated(() => {
        if($categories) categoryList = ["Rating", ...Object.keys($categories), "Notes"]
        else categoryList = ["Rating", "Notes"]
    })

    function type(category) {
        let type;
        if (category == "Rating") type = "Number";
        else if (category == "Notes") type = "String";
        else type = $categories[category].type;

        return type;
    }

    function value(category) {
        let val = $teams[teamSelected][category];
        if (!val) val = "";

        return val;
    }

    function update(category, elm){
        updateDb(`accounts/${$team}/events/${$event}/teams/${teamSelected}/${category}`, elm.target.value)
    }

    function remove(elm){
        let value = elm.target.checked
        let temp = []
        if($removedTeams) temp = [...$removedTeams]
        if(value) temp.push(teamSelected)
        else temp.splice(temp.indexOf(teamSelected), 1)
        updateDb(`accounts/${$team}/events/${$event}/removedTeams`, temp)
    }

</script>

{#if teamSelected != ""}
    <div id="flexEditor">
        <div id="topEditor">
            <p id="titleEditor"><b>Team Editor</b><br />Team {teamSelected}</p>
            <img
                src="redX.png"
                alt="Close Editor"
                on:click={() => (teamSelected = "")}
                on:keypress={() => (teamSelected = "")}
            />
        </div>

        {#key $teams}
        {#key $categories}
        {#each categoryList as info}
            <div class="edit" style="{info == "Notes" ? "padding-top: 5px; padding-bottom: 5px;" : ""}">
                {info}:
                {#if type(info) == "String"}
                    {#if info != "Notes"}
                    <input type="text" value={value(info)} on:change={(element) => update(info, element)} style="width: 80%; margin-left: 1%;"/>
                    {:else}
                    <textarea value={value(info)} on:change={(element) => update(info, element)} style="width: 80%; margin-left: 1%; resize: none; height: 8vh;"></textarea>
                    {/if}
                {/if}
                {#if type(info) == "Number"}
                    <input type="number" value={value(info)} on:change={(element) => update(info, element)} style="margin-left: 1%;"/>
                {/if}
                {#if type(info) == "Dropdown"}
                    <select value={value(info)} on:change={(element) => update(info, element)}>
                        <option value="" />
                        {#if $categories[info].Options}
                            {#each Object.keys($categories[info].Options) as option}
                                <option value={option}>{option}</option>
                            {/each}
                        {/if}
                    </select>
                {/if}
                {#if type(info) == "Boolean"}
                    <select value={value(info)} on:change={(element) => update(info, element)}>
                        <option value="" />
                        <option value="true">✅</option>
                        <option value="false">❌</option>
                    </select>
                {/if}
            </div>
        {/each}
        {/key}
        {/key}
        <div class="edit">
            Remove: <input type="checkbox" on:change={(elm) => remove(elm)} checked={$removedTeams ? $removedTeams.includes(teamSelected) : false} style="cursor: pointer; scale: 1.25;">
        </div>
    </div>
{/if}


<style>
    .edit {
        margin: 2%;
        background-color: rgb(84, 121, 215);
    }

    img {
        margin: 2%;
        cursor: pointer;
        width: 15%;
    }

    #titleEditor {
        margin-left: 28%;
    }

    #topEditor {
        display: flex;
        justify-content: space-between;
    }

    #flexEditor {
        position: absolute;
        left: 0%;
        top: 0%;
        transform: translate(10%, 10%);
        background-color: rgba(128, 128, 128, 90%);
        width: 80vw;
        height: 85vh;
        border-radius: 10px;
    }
</style>
