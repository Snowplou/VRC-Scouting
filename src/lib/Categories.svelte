<script>
    import { teams, categories, updateDb } from "../database";
    export let showCategories = false;

    async function invalid(elm) {
        elm.innerHTML = "Invalid";
        setTimeout(() => (elm.innerHTML = "Add"), 1000);
    }

    function addCategory(elm) {
        let name = elm.target.parentNode.children[0].value;
        if (!name || $categories[name]) {
            invalid(elm.target);
            return;
        }

        let categoryInfo = {
            filter: {
                type: "None",
            },
            type: "String",
        };
        updateDb(`categories/${name}`, categoryInfo);
        elm.target.parentNode.children[0].value = "";
    }

    function removeCategory(elm) {
        let name = elm.target.parentNode.children[0].value;

        if (
            confirm(
                `Are you sure you want to delete ${name}?\nAll of the data stored in ${name} will be deleted.`
            )
        ) {
            for (let team in $teams) {
                if (
                    $teams[team][name] != undefined ||
                    $teams[team][name] != null
                ) {
                    updateDb(`teams/${team}/${name}`, null);
                }
            }

            updateDb(`categories/${name}`, null);
        }
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
            <input type="text" style="width: 50%; height: 25px; margin: 2%" />
            <button
                id="add"
                on:click={(elm) => addCategory(elm)}
                on:keypress={(elm) => addCategory(elm)}>Add</button
            >
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
                        <img
                            class="remove"
                            src="redX.png"
                            on:click={(elm) => removeCategory(elm)}
                            on:keypress={(elm) => removeCategory(elm)}
                            alt="delete category"
                        />
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
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 2%;
        background-color: rgb(84, 121, 215);
        font-size: 125%;
        height: 8%;
    }

    #add {
        background-color: rgb(181, 190, 214);
        height: 30px;
        width: 45px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        text-align: center;
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
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: wrap;
        margin: 2%;
        background-color: rgb(84, 121, 215);
        font-size: 100%;
    }

    .remove {
        width: 9%;
        margin: 1%;
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
