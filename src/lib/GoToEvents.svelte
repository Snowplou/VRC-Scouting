<script>
    export let event = ""
    function GoToEvents(){
        localStorage.removeItem("event")
        event = ""
        location.reload()
    }
</script>

<button on:click={() => GoToEvents()} on:keypress={() => GoToEvents()}>Event Selector</button>

<style>
    button {
        display: flex;
        align-items: center;
        justify-content: center;
        float: left;
        background-color: rgb(84, 121, 215);
        color: white;
        border-radius: 10px;
        border: none;
        font-family: "Outfit", sans-serif;
        font-weight: 400;
        height: 4vh;
        cursor: pointer;
    }
</style>