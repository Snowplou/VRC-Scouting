<script>
    import { event } from "../database";
    export let showMatches = false;
    function GoToMatches(){
        showMatches = true;
    }
</script>

<button on:click={() => GoToMatches()} on:keypress={() => GoToMatches()}>Go To Matches</button>

<style>
    button {
        display: block;
        margin-left: auto;
        margin-right: auto;
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