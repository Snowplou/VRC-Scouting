<script>
    export let team = "";
</script>

<p id="signInTitle">Enter Your Team Number And Password</p>
<div id="signIn">
    <div class="section">
        <p>Team:</p>
        <input type="text" />
    </div>
    <div class="section">
        <p>Password:</p>
        <input type="password" />
    </div>
    <button>Sign In</button>
    <button>Sign Up</button>
</div>

<style>
    #signInTitle {
        text-align: center;
        font-size: 200%;
    }

    input {
        text-align: center;
    }

    button {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 5vh;
        width: 50vw;
        height: 8vh;
        border-radius: 1000px;
        border: none;
        cursor: pointer;
        background-color: rgb(84, 121, 215);
        color: white;
        font-size: 30px;
        font-family: "Outfit", sans-serif;
        font-weight: 400;
    }

    #signIn p {
        font-size: 150%;
        margin-right: 5vw;
    }

    .section {
        display: flex;
        align-content: center;
        justify-content: space-around;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: baseline;
        color: white;
    }

    input {
        height: 5vh;
        width: 35vw;
    }

    #signIn {
        display: flex;
        margin-left: auto;
        margin-right: auto;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        align-items: baseline;
        align-content: center;
        background-color: gray;
        width: 80vw;
        height: 70vh;
        border-radius: 10px;
    }
</style>
