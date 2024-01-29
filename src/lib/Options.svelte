<script>
    import { teams, categories, updateDb, team, event } from "../database";
    export let selectedOption = "";

    function addOptionEnter(elm) {
        // If enter is not pressed, return
        if (elm.key != "Enter") return;
        addOption(elm);
    }

    function addOption(elm) {
        let name = elm.target.parentNode.children[0].value;
        if (!name) return;
        if ($categories[selectedOption].Options) {
            if ($categories[selectedOption].Options[name]) return;
        }
        updateDb(`accounts/${$team}/events/${$event}/categories/${selectedOption}/Options/${name}`, name);
        elm.target.parentNode.children[0].value = "";
    }

    function updateOption(option, elm) {
        let newOption = elm.target.value;
        if (!newOption || $categories[selectedOption].Options[newOption]) {
            elm.target.value = option;
            return;
        }

        updateDb(`accounts/${$team}/events/${$event}/categories/${selectedOption}/Options/${option}`, null);
        updateDb(
            `accounts/${$team}/events/${$event}/categories/${selectedOption}/Options/${newOption}`,
            newOption
        );

        for (let teamLoop in $teams) {
            if ($teams[teamLoop][selectedOption] == option) {
                updateDb(`accounts/${$team}/events/${$event}/teams/${teamLoop}/${selectedOption}`, newOption);
            }
        }
    }

    function removeOption(elm) {
        let name = elm.target.parentNode.children[0].value;
        if (
            confirm(
                `Are you sure you want to delete ${name}?\nAll of the data stored in ${name} will be deleted.`
            )
        ) {
            for (let teamRemove in $teams) {
                if ($teams[teamRemove][selectedOption] == name) {
                    updateDb(`accounts/${$team}/events/${$event}/teams/${teamRemove}/${selectedOption}`, null);
                }
            }

            updateDb(`accounts/${$team}/events/${$event}/categories/${selectedOption}/Options/${name}`, null);
        }
    }
</script>

{#if selectedOption != ""}
    <div id="flexCategory">
        <div id="topCategory">
            <p id="titleCategory"><b>Dropdown Editor</b></p>
            <img
                src="redX.png"
                alt="Close Editor"
                on:click={() => (selectedOption = "")}
                on:keypress={() => (selectedOption = "")}
            />
        </div>

        <div id="addCategory">
            <input
                type="text"
                id="addOption"
                style="text-align: center; width: 50%; height: 25px; margin: 2%;"
                on:keydown={(elm) => addOptionEnter(elm)}
            />
            <button
                id="add"
                on:click={(elm) => addOption(elm)}
                on:keypress={(elm) => addOption(elm)}>Add</button
            >
        </div>

        {#key $categories[selectedOption].Options}
            {#if $categories[selectedOption].Options}
                <div class="scrollOptions">
                    {#each Object.keys($categories[selectedOption].Options) as option}
                        <div class="edit">
                            <input
                                class="rename"
                                type="text"
                                value={option}
                                on:change={(elm) => updateOption(option, elm)}
                            />
                            <img
                                class="remove"
                                src="redX.png"
                                on:click={(elm) => removeOption(elm)}
                                on:keypress={(elm) => removeOption(elm)}
                                alt="delete category"
                            />
                        </div>
                    {/each}
                </div>
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
        text-align: center;
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
        transform: translate(10%, 10%);
        background-color: rgba(128, 128, 128, 90%);
        width: 80vw;
        height: 85vh;
        border-radius: 10px;
        z-index: 3;
        overflow-y: auto;
    }
</style>
