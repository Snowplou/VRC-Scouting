<script>
    import { event } from "../database";
    export let showMatches = false;
    function GoToTeams(){
        showMatches = false;
        location.reload()
    }
</script>

<button on:click={() => GoToTeams()} on:keypress={() => GoToTeams()}>Go To Teams</button>

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