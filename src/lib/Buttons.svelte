<script>
    import { teams, updateDb } from "../database";
    export let showCategories = false;
    export let teamSelected = ""
    let updating = false
    const ROBOT_EVENTS_KEY =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYzBmOTA1YmJhYTUxMzljNGNiNGNhN2E5N2NiMTFjMTUxZGE1YzA2MTZlNGNjOTIzYTIyZjFiMzlkNGUzZTEzYzA3MGExZGRmYTYzZmM0ZDIiLCJpYXQiOjE2NzQzNTc0MDguMTc0MzgwMSwibmJmIjoxNjc0MzU3NDA4LjE3NDM4MjksImV4cCI6MjYyMTEyODYwOC4xNjY3ODE5LCJzdWIiOiIxMTE2NTUiLCJzY29wZXMiOltdfQ.JeWKVXzcFuAjpObWa0n3javoRWJykyQBfj_DBwpOXyttaM58U30_c3X8G6cOLkz5tWjDTubAU9IqhqjirEfrRHIj2aFoEtnfol9q_1uV4uZG78jNODscCVQL0qnGscOjn9WiE76rTlYovMkEfYtvEIiB63WIh36cM5rR9Vi_6Ng8CcMGV8T5uH-hnUMD9wL3UsBEUF8XepvI6Mpf_lbKrDPUEYDvvApfd84rLA2T6jgAwL3_z7tlF7b0CJ-ONGvjrezgkkyVUcF4azIuTV6Svlogj996dXAQfvHW64RAcHp-8CDItFt81CEh_15jasJEht6wKjTzqshDxsdqpFy2vZX2H2RabncVBmhNsmBPnQkDXpsrU6QAOF4pR308g0IvcsW4B_3ZLimU5vLg3GO57z1picRAVBo8r9NgZpcOZDoJBmiZs16v-h_1PCIQ4TOgEYKzNaq7cJBWCrToKFT_CftavB8Dd5kN9swXhoWiJGgLRY9dO8n0sP8Qrm-rQs2QczQWEFGxOroCnZLg2V_foUtpUK9hKQvvC-nGwIGM0izsAPjmvntY_oRucw4NkJyC9FWvAsHReh6YPUFX5LS437dfDlr0RXrPSg6v8SsONEL25pv8tqgZEYwDg8pHb8Y2QjnutBAM-8RH2yGfNEnLrVYObacT_raq4IgqQujcVEU";

    function toggleShowCategories(){
        showCategories = !showCategories
        if(showCategories) teamSelected = ""
    }

    async function updateSkills() {
        if(updating) return

        let skillsButton = document.getElementById("skillsUpdater")
        skillsButton.innerHTML = "Updating..."
        skillsButton.style.cursor = "default"
        updating = true

        let skillsRating = await (
            await fetch(
                `https://www.robotevents.com/api/seasons/173/skills?program=1`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();
        let teamList = Object.keys($teams);

        for (let i = 0; i < skillsRating.length; i++) {
            let team = skillsRating[i].team.team;
            if (teamList.includes(team)) {
                teamList.splice(teamList.indexOf(team), 1);
                updateDb(`teams/${team}/Rank`, i + 1);
            }
        }

        for (let team of teamList) {
            updateDb(`teams/${team}/Rank`, -1);
        }

        updating = false
        skillsButton.innerHTML = "Skills"
        skillsButton.style.cursor = "pointer"
    }
</script>

<div>
    <button id="skillsUpdater" on:click={updateSkills} on:keydown={updateSkills}>Skills</button>

    <button on:click={() => toggleShowCategories()} on:keypress={() => toggleShowCategories()}>Categories</button>
</div>

<style>
    button {
        padding: 10px;
        margin: 2vmin;
        width: 160px;
        height: 35px;
        background-color: rgb(84, 121, 215);
        color: white;
        cursor: pointer;
        border-style: none;
        border-radius: 1000px;
        font-size: 110%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }

    div {
        display: flex;
        justify-content: space-between;
    }
</style>
