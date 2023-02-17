<script>
    export let teamSelected = ""
    import { teams, categories } from "../database";

    function check(category){
        let type
        if(category == "Rating") type = "Number"
        else if(category == "Notes") type = "String"
        else type = $categories[category].type
        // let val = teams[teamSelected][category]
        // if(!val) val = "Unknown"

        return type
    }

</script>

{#if teamSelected != ""}
    
<div id="flexEditor">

    <div id="topEditor">
        <p id="titleEditor"><b>Team Editor</b><br>Team {teamSelected}</p>
        <img src="public\redX.png" alt="Close Editor" on:click={() => teamSelected = ""} on:keypress={() => teamSelected = ""}>
    </div>

    {#each ["Rating", ...Object.keys($categories), "Notes"] as info}
    <div class="edit">
        {info}:
        {#if check(info) == "String"}
            <input type="text" style="width: 85%; margin-left: 1%;">
        {/if}
        {#if check(info) == "Number"}
            <input type="number" style="margin-left: 1%;">
        {/if}
    </div>
    {/each}

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
        transform: translate(10%, 5%);
        background-color: gray;
        width: 80vw;
        height: 90vh;
        opacity: 90%;
        border-radius: 10px;
    }
</style>