<script>
    import { teams, categories, updateDb } from "../database";
    export let showCategories = false;

    function addCategory(elm){
        console.log(elm)
    }

    function updateType(category, elm) {
        updateDb(`categories/${category}/type`, elm.target.value);
    }

    function updateName(category, elm) {
        let newCategory = elm.target.value;
        if (!newCategory || $categories[newCategory]) {
            elm.target.value = category;
            return;
        }

        let categoryInfo = { ...$categories[category] };
        updateDb(`categories/${category}`, null);
        updateDb(`categories/${newCategory}`, categoryInfo);

        for (let team in $teams) {
            if (
                $teams[team][category] != undefined ||
                $teams[team][category] != null
            ) {
                updateDb(
                    `teams/${team}/${newCategory}`,
                    $teams[team][category]
                );
                updateDb(`teams/${team}/${category}`, null);
            }
        }
    }
</script>

{#if showCategories}
    <div id="flexCategory">
        <div id="topCategory">
            <p id="titleCategory"><b>Category Editor</b></p>
            <img
                src="redX.png"
                alt="Close Editor"
                on:click={() => (showCategories = false)}
                on:keypress={() => (showCategories = false)}
            />
        </div>

        <div id="addCategory">
            Add Category:
            <input type="text" style="width: 25%" />
            <button id="add" on:click={(elm) => addCategory(elm)} on:keypress={(elm) => addCategory(elm)}>Add Category</button>
        </div>

        {#key $categories}
            {#if $categories}
                {#each Object.keys($categories) as category}
                    <div class="edit">
                        <input
                            class="rename"
                            type="text"
                            value={category}
                            on:change={(elm) => updateName(category, elm)}
                        />
                        <select
                            class="type"
                            value={$categories[category].type}
                            on:change={(elm) => updateType(category, elm)}
                        >
                            <option value="Number">Number</option>
                            <option value="String">String</option>
                            <option value="Boolean">Boolean</option>
                            <option value="Dropdown">Dropdown</option>
                        </select>
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
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 2%;
        background-color: rgb(84, 121, 215);
        font-size: 125%;
        height: 5%;
    }

    #add {
        background-color: rgb(181, 190, 214);
        border: none;
        border-radius: 10px;
        cursor: pointer;
    }

    .rename {
        height: 50%;
        margin: 1%;
    }

    .type {
        height: 75%;
    }

    #addCategory {
        display: flex;
        align-content: center;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin: 2%;
        background-color: rgb(84, 121, 215);
        font-size: 125%;
    }

    .remove {
        width: 5%;
        margin-bottom: 1%;
    }

    img {
        margin: 2%;
        cursor: pointer;
        width: 15%;
    }

    #titleCategory {
        margin-left: 28%;
    }

    #topCategory {
        display: flex;
        justify-content: space-between;
    }

    #flexCategory {
        position: absolute;
        left: 0%;
        top: 0%;
        transform: translate(10%, 10%);
        background-color: gray;
        width: 80vw;
        height: 80vh;
        opacity: 90%;
        border-radius: 10px;
    }
</style>
