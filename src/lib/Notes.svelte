<script>
    import { team, event, notes, updateDb } from "../database";

    let chosenNote = "";
    // if ($notes) chosenNote = Object.keys($notes)[0];

    function addNote() {
        let newNote = prompt("What do you want your note to be called?");
        if (!newNote) return;
        updateDb(`accounts/${$team}/events/${$event}/notes/${newNote}`, "");
        chosenNote = newNote;
    }

    function updateNote(value) {
        if (!chosenNote) return;
        updateDb(
            `accounts/${$team}/events/${$event}/notes/${chosenNote}`,
            value
        );
    }

    function removeNote(){
        if(!chosenNote) return
        let ask = confirm(`Are you sure that you want to delete ${chosenNote}?`)
        if(ask)
        updateDb(
            `accounts/${$team}/events/${$event}/notes/${chosenNote}`,
            null
        );
    }

    notes.subscribe(() => {
        if (chosenNote == "" && $notes) {
            chosenNote = Object.keys($notes)[0];
        }
    });
</script>

<div id="noteSelection">
    <button on:click={() => removeNote()} on:keypress={() => removeNote()}
        >Remove Note</button
    >
    Notes:
    <select
        id="selectElement"
        on:change={(elm) => (chosenNote = elm.target.value)}
        value={chosenNote}
    >
        {#if $notes}
            {#each Object.keys($notes) as note}
                <option value={note}>{note}</option>
            {/each}
        {/if}
    </select>
    <button on:click={() => addNote()} on:keypress={() => addNote()}
        >Add Notes</button
    >
</div>

<div id="notesCenter">
    <textarea
        id="notes"
        value={$notes ? ($notes[chosenNote] ? $notes[chosenNote] : "") : ""}
        on:change={(elm) => updateNote(elm.target.value)}
        style={$notes ? "opacity: 1;" : "opacity: 0;"}
    />
</div>

<style>
    #noteSelection {
        display: block;
        margin-top: 5vh;
        text-align: center;
    }

    button {
        cursor: pointer;
        margin: 1%;
    }

    #notesCenter {
        display: flex;
        justify-content: center;
    }

    #notes {
        width: 90%;
        height: 80vh;
        padding: 1%;
        margin-top: 5%;
        resize: vertical;
        font-size: 4vw;
        background-color: rgb(84, 121, 215);
        color: white;
        border-radius: 10px;
        border: none;
    }
</style>
