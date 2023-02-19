<script>
    import { teams, categories, updateDb } from "../database";
    export let selectedFilter = "";

    function updateValue(elm, type){
        updateDb(`categories/${selectedFilter}/filters/${type}/val`, elm.target.parentNode.children[1].value)
    }

    function updateEnabled(elm, type){
        updateDb(`categories/${selectedFilter}/filters/${type}/enabled`, elm.target.parentNode.children[2].checked)
    }

</script>

{#if selectedFilter != ""}
    <div id="flexFilter">
        <div id="topFilter">
            <p id="titleFilter"><b>Filter Editor</b><br />{selectedFilter}</p>
            <img
                src="redX.png"
                alt="Close Editor"
                on:click={() => (selectedFilter = "")}
                on:keypress={() => (selectedFilter = "")}
            />
        </div>

        {#key $categories[selectedFilter].filters}
            {#if $categories[selectedFilter].filters}
                {#each Object.values($categories[selectedFilter].filters) as filter, i}
                    <div class="edit">
                        <div class="filterType">
                            {filter.type}:
                        </div>
                        <input class="filterInput" value={$categories[selectedFilter].filters[i].val} on:change={(elm) => updateValue(elm, i)} type="text">
                        <input class="filterEnable" checked={$categories[selectedFilter].filters[i].enabled} on:change={(elm) => updateEnabled(elm, i)} type="checkbox">
                    </div>
                {/each}
            {/if}
        {/key}
    </div>
{/if}

<style>
    .edit {
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: space-evenly;
        flex-wrap: nowrap;
        margin: 2%;
        background-color: rgb(84, 121, 215);
        font-size: 125%;
        height: 8%;
    }

    input {
        text-align: center;
    }

    .filterType {
        margin: 2%;
        font-size: 70%;
        width: 80%;
        margin-right: 1%;
    }

    .filterEnable {
        margin: 2%;
        transform: scale(1.5);
    }

    img {
        margin: 2%;
        cursor: pointer;
        width: 10vh;
    }

    #titleFilter {
        margin-left: 28%;
    }

    #topFilter {
        display: flex;
        justify-content: space-between;
    }

    #flexFilter {
        position: absolute;
        left: 0%;
        top: 0%;
        transform: translate(10%, 10%);
        background-color: rgba(128, 128, 128, 90%);
        width: 80vw;
        height: 80vh;
        border-radius: 10px;
    }
</style>
