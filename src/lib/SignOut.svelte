<script>
    export let team = ""
    function logOut(){
        team = ""
        localStorage.removeItem("accountNumber")
    }
</script>

<button on:click={() => logOut()} on:keypress={() => logOut()}>Sign Out</button>

<style>
    button {
        display: flex;
        align-items: center;
        justify-content: center;
        float: right;
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