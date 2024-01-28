<script>
    import { teams, categories, updateDb, team, event } from "../database";
    export let showCategories = false;
    export let selectedOption = "";
    export let selectedFilter = "";

    async function invalid(elm) {
        let button = elm.parentNode.children[1];
        button.innerHTML = "Invalid";
        setTimeout(() => (button.innerHTML = "Add"), 1000);
    }

    function optionPressed(category) {
        selectedOption = category;
        showCategories = false;
    }

    function filterPressed(category) {
        selectedFilter = category;
        showCategories = false;
    }

    function addCategoryEnter(elm){
        // If the enter key was not pressed, return
        if (elm.key != "Enter") return;

        // Run the addCategory function. It can pass in the input element because it has the same parent as the button
        addCategory(elm);
    }

    function addCategory(elm) {
        let name = elm.target.parentNode.children[0].value;
        if (!name) {
            invalid(elm.target);
            return;
        }
        if ($categories) {
            if ($categories[name]) {
                invalid(elm.target);
                return;
            }
        }

        let categoryInfo = {
            filters: [
                {type: "Equal To", val: "", enabled: false},
                {type: "Not Equal To", val: "", enabled: false},
                {type: "Greater Than", val: "", enabled: false},
                {type: "Less Than", val: "", enabled: false},
                {type: "Greater Than Or Equal To", val: "", enabled: false},
                {type: "Less Than Or Equal To", val: "", enabled: false},
            ],
            type: "String"
        };
        updateDb(`accounts/${$team}/events/${$event}/categories/${name}`, categoryInfo);
        elm.target.parentNode.children[0].value = "";
    }

    function removeCategory(elm) {
        let name = elm.target.parentNode.children[0].value;

        if (
            confirm(
                `Are you sure you want to delete ${name}?\nAll of the data stored in ${name} will be deleted.`
            )
        ) {
            for (let categoryTeam in $teams) {
                if (
                    $teams[categoryTeam][name] != undefined ||
                    $teams[categoryTeam][name] != null
                ) {
                    updateDb(`accounts/${$team}/events/${$event}/teams/${categoryTeam}/${name}`, null);
                }
            }

            updateDb(`accounts/${$team}/events/${$event}/categories/${name}`, null);
        }
    }

    function updateType(category, elm) {
        updateDb(`accounts/${$team}/events/${$event}/categories/${category}/type`, elm.target.value);
    }

    function updateName(category, elm) {
        let newCategory = elm.target.value;
        if (!newCategory || $categories[newCategory]) {
            elm.target.value = category;
            return;
        }

        let categoryInfo = { ...$categories[category] };
        updateDb(`accounts/${$team}/events/${$event}/categories/${category}`, null);
        updateDb(`accounts/${$team}/events/${$event}/categories/${newCategory}`, categoryInfo);

        for (let categoryTeam in $teams) {
            if ($teams[categoryTeam][category]) {
                updateDb(
                    `accounts/${$team}/events/${$event}/teams/${categoryTeam}/${newCategory}`,
                    $teams[categoryTeam][category]
                );
                updateDb(`accounts/${$team}/events/${$event}/teams/${categoryTeam}/${category}`, null);
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
            <input type="text" style="width: 50%; height: 25px; margin: 2%" on:keydown={(elm) => addCategoryEnter(elm)} />
            <button
                id="add"
                on:click={(elm) => addCategory(elm)}
                on:keypress={(elm) => addCategory(elm)}>Add</button
            >
        </div>

        <div class="scrollCategory">
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
                            <option value="String">Text</option>
                            <option value="Boolean">Yes/No</option>
                            <option value="Dropdown">Dropdown</option>
                        </select>
                            <button
                                class="options"
                                on:click={() => $categories[category].type == "Dropdown" ? optionPressed(category) : ""}
                                on:keypress={() => $categories[category].type == "Dropdown" ? optionPressed(category) : ""}
                                style="opacity:{$categories[category].type == "Dropdown" ? 1 : 0}"
                                >Options</button
                            >
                        <button
                                class="options"
                                on:click={() => filterPressed(category)}
                                on:keypress={() => filterPressed(category)}
                                >Filters</button
                            >
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
        height: 12%;
    }

    input {
        text-align: center;
    }

    .scrollCategory {
        /* overflow-y: scroll; */
        position: relative;
        bottom: 100px;
        height: 68vh;
        top: -1vh;
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

    .options {
        background-color: rgb(181, 190, 214);
        margin: 1%;
        height: 25px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
    }

    .rename {
        height: 35%;
        margin: 1%;
    }

    .type {
        height: 50%;
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
        width: 3vh;
        margin: 1%;
    }

    img {
        margin: 2%;
        cursor: pointer;
        width: 5vh;
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
        overflow-y: scroll;
        transform: translate(10%, 10%);
        background-color: rgba(128, 128, 128, 90%);
        width: 80vw;
        height: 85vh;
        border-radius: 10px;
        z-index: 3;
    }
</style>
