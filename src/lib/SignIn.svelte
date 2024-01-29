<script>
    import { accounts, updateDb, team } from "../database";
    const ROBOT_EVENTS_KEY =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYzBmOTA1YmJhYTUxMzljNGNiNGNhN2E5N2NiMTFjMTUxZGE1YzA2MTZlNGNjOTIzYTIyZjFiMzlkNGUzZTEzYzA3MGExZGRmYTYzZmM0ZDIiLCJpYXQiOjE2NzQzNTc0MDguMTc0MzgwMSwibmJmIjoxNjc0MzU3NDA4LjE3NDM4MjksImV4cCI6MjYyMTEyODYwOC4xNjY3ODE5LCJzdWIiOiIxMTE2NTUiLCJzY29wZXMiOltdfQ.JeWKVXzcFuAjpObWa0n3javoRWJykyQBfj_DBwpOXyttaM58U30_c3X8G6cOLkz5tWjDTubAU9IqhqjirEfrRHIj2aFoEtnfol9q_1uV4uZG78jNODscCVQL0qnGscOjn9WiE76rTlYovMkEfYtvEIiB63WIh36cM5rR9Vi_6Ng8CcMGV8T5uH-hnUMD9wL3UsBEUF8XepvI6Mpf_lbKrDPUEYDvvApfd84rLA2T6jgAwL3_z7tlF7b0CJ-ONGvjrezgkkyVUcF4azIuTV6Svlogj996dXAQfvHW64RAcHp-8CDItFt81CEh_15jasJEht6wKjTzqshDxsdqpFy2vZX2H2RabncVBmhNsmBPnQkDXpsrU6QAOF4pR308g0IvcsW4B_3ZLimU5vLg3GO57z1picRAVBo8r9NgZpcOZDoJBmiZs16v-h_1PCIQ4TOgEYKzNaq7cJBWCrToKFT_CftavB8Dd5kN9swXhoWiJGgLRY9dO8n0sP8Qrm-rQs2QczQWEFGxOroCnZLg2V_foUtpUK9hKQvvC-nGwIGM0izsAPjmvntY_oRucw4NkJyC9FWvAsHReh6YPUFX5LS437dfDlr0RXrPSg6v8SsONEL25pv8tqgZEYwDg8pHb8Y2QjnutBAM-8RH2yGfNEnLrVYObacT_raq4IgqQujcVEU";

    function hash(string) {
        let hash = 0,
            i,
            chr;
        if (string.length === 0) return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    // Focuses on the password input when the enter key is pressed
    function numberEnter(elm) {
        if (elm.key != "Enter") return;
        elm.target.parentNode.parentNode.children[1].children[1].focus();
    }

    // Focuses on the sign in button when the enter key is pressed
    function passwordEnter(elm) {
        if (elm.key != "Enter") return;
        // Wait 100ms before focusing on the button so that it doesn't recognize the enter key as the enter key for the button
        setTimeout(() => {
        elm.target.parentNode.parentNode.children[2].focus();
        }, 100);
    }

    function signIn(elm){
        let children = elm.target.parentNode.children;
        let teamNumber = children[0].children[1].value;
        if(teamNumber) teamNumber = teamNumber.toUpperCase()
        let password = children[1].children[1].value;

        if ($accounts) {
            if (!$accounts[teamNumber]) {
                alert("This account doesn't exist!");
                return;
            }
        }

        if($accounts[teamNumber].password != hash(password)){
            alert("You entered the wrong password!")
            return
        }

        team.set(teamNumber)
        localStorage.setItem("accountNumber", $team)
        location.reload()
    }

    async function signUp(elm) {
        let children = elm.target.parentNode.children;
        let teamNumber = children[0].children[1].value;
        if(teamNumber) teamNumber = teamNumber.toUpperCase()
        let password = children[1].children[1].value;

        if (!teamNumber || !password) {
            alert("The team number and password can not be empty.");
            return;
        }

        if ($accounts) {
            if ($accounts[teamNumber]) {
                alert("This account already exists!");
                return;
            }
        }

        let response = await(await fetch(`https://www.robotevents.com/api/v2/teams?number%5B%5D=${teamNumber}&program%5B%5D=1`, {headers: {"accept": "application/json", "Authorization": `Bearer ${ROBOT_EVENTS_KEY}`}})).json()
        if(response.data.length == 0){
            alert("That team does not exist!")
            return
        }
        let teamId = response.data[0].id

        let teamInfo = {
            id: teamId,
            password: hash(password),
        };
        updateDb(`accounts/${teamNumber}`, teamInfo);

        team.set(teamNumber)
        localStorage.setItem("accountNumber", $team)
        location.reload()
    }
</script>

<p id="signInTitle">Enter Your Team Number And Password</p>
<div id="signIn">
    <div class="section">
        <p>Team Number:</p>
        <input type="text" on:keydown={(elm) => numberEnter(elm)}/>
    </div>
    <div class="section">
        <p>Password:</p>
        <input type="password" on:keydown={(elm) => passwordEnter(elm)}/>
    </div>
    <button on:click={(elm) => signIn(elm)} on:keypress={(elm) => signIn(elm)}>Sign In</button>
    <button on:click={(elm) => signUp(elm)} on:keypress={(elm) => signUp(elm)}
        >Sign Up</button
    >
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
        margin-right: 3vw;
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
