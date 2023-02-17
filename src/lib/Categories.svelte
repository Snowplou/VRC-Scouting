<script>
    import { categories, updateDb } from "../database";
    export let showCategories = false
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

        {#key $categories}
        {#if $categories}
        {#each Object.keys($categories) as category}
            <div class="edit">
                {category}
                <select value={$categories[category].type}>
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
        margin: 2%;
        background-color: rgb(84, 121, 215);
        font-size: 125%;
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
        transform: translate(10%, 5%);
        background-color: gray;
        width: 80vw;
        height: 85vh;
        opacity: 90%;
        border-radius: 10px;
    }
</style>