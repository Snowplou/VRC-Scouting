<script>
    import { teams, updateDb, team, event, division, getDivisions, getDivisionsFromDb } from "../database";
    export let showCategories = false;
    export let showNotes = false;
    export let selectedOption = "";
    export let selectedFilter = "";
    export let teamSelected = "";
    let updating = false;
    const ROBOT_EVENTS_KEY =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYzBmOTA1YmJhYTUxMzljNGNiNGNhN2E5N2NiMTFjMTUxZGE1YzA2MTZlNGNjOTIzYTIyZjFiMzlkNGUzZTEzYzA3MGExZGRmYTYzZmM0ZDIiLCJpYXQiOjE2NzQzNTc0MDguMTc0MzgwMSwibmJmIjoxNjc0MzU3NDA4LjE3NDM4MjksImV4cCI6MjYyMTEyODYwOC4xNjY3ODE5LCJzdWIiOiIxMTE2NTUiLCJzY29wZXMiOltdfQ.JeWKVXzcFuAjpObWa0n3javoRWJykyQBfj_DBwpOXyttaM58U30_c3X8G6cOLkz5tWjDTubAU9IqhqjirEfrRHIj2aFoEtnfol9q_1uV4uZG78jNODscCVQL0qnGscOjn9WiE76rTlYovMkEfYtvEIiB63WIh36cM5rR9Vi_6Ng8CcMGV8T5uH-hnUMD9wL3UsBEUF8XepvI6Mpf_lbKrDPUEYDvvApfd84rLA2T6jgAwL3_z7tlF7b0CJ-ONGvjrezgkkyVUcF4azIuTV6Svlogj996dXAQfvHW64RAcHp-8CDItFt81CEh_15jasJEht6wKjTzqshDxsdqpFy2vZX2H2RabncVBmhNsmBPnQkDXpsrU6QAOF4pR308g0IvcsW4B_3ZLimU5vLg3GO57z1picRAVBo8r9NgZpcOZDoJBmiZs16v-h_1PCIQ4TOgEYKzNaq7cJBWCrToKFT_CftavB8Dd5kN9swXhoWiJGgLRY9dO8n0sP8Qrm-rQs2QczQWEFGxOroCnZLg2V_foUtpUK9hKQvvC-nGwIGM0izsAPjmvntY_oRucw4NkJyC9FWvAsHReh6YPUFX5LS437dfDlr0RXrPSg6v8SsONEL25pv8tqgZEYwDg8pHb8Y2QjnutBAM-8RH2yGfNEnLrVYObacT_raq4IgqQujcVEU";

    function toggleShowCategories() {
        showCategories = !showCategories;
        if (showCategories) {
            teamSelected = "";
            selectedOption = "";
            selectedFilter = "";
            showNotes = false;
        }
    }

    function toggleShowNotes() {
        showNotes = !showNotes;
        if (showNotes) {
            teamSelected = "";
            selectedOption = "";
            selectedFilter = "";
            showCategories = false;
        }
    }

    let teamRankings = {};
    async function getRankings(page, eventId, div) {
        let response = await (
            await fetch(
                `https://www.robotevents.com/api/v2/events/${$event}/divisions/${div}/rankings?page=${page}`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();

        for (let ranking of response.data) {
            teamRankings[ranking.team.name] = ranking.rank;
        }

        if (response.meta.current_page != response.meta.last_page) {
            await getRankings(page + 1, eventId, div);
        }
    }

    async function updateInfo() {
        if (updating) return;

        let skillsButton = document.getElementById("skillsUpdater");

        skillsButton.innerHTML = "Updating...";
        skillsButton.style.cursor = "default";
        updating = true;

        let middleSkillsRankings = await (
            await fetch(
                `https://www.robotevents.com/api/seasons/173/skills?grade_level=Middle+School`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();
        let teamList = Object.keys($teams);

        for (let i = 0; i < middleSkillsRankings.length; i++) {
            let middleSkillsTeam = middleSkillsRankings[i].team.team;
            if (teamList.includes(middleSkillsTeam)) {
                teamList.splice(teamList.indexOf(middleSkillsTeam), 1);
                updateDb(
                    `accounts/${$team}/events/${$event}/teams/${middleSkillsTeam}/Skills Rank`,
                    i + 1 + " MS"
                );
            }
        }

        let highSkillsRankings = await (
            await fetch(`https://www.robotevents.com/api/seasons/173/skills`, {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                },
            })
        ).json();

        for (let i = 0; i < highSkillsRankings.length; i++) {
            let highSkillsTeam = highSkillsRankings[i].team.team;
            if (teamList.includes(highSkillsTeam)) {
                teamList.splice(teamList.indexOf(highSkillsTeam), 1);
                updateDb(
                    `accounts/${$team}/events/${$event}/teams/${highSkillsTeam}/Skills Rank`,
                    i + 1 + " HS"
                );
            }
        }

        for (let highSkillsTeam of teamList) {
            updateDb(
                `accounts/${$team}/events/${$event}/teams/${highSkillsTeam}/Skills Rank`,
                -1
            );
        }

        if ($division == "all") {
            let divs = await getDivisions($event);
            divs = divs.divisions;
            for (let div of divs) {
                await getRankings(1, $event, div.id);
            }
        } else {
            await getRankings(1, $event, $division);
        }

        for (let ranking of Object.keys(teamRankings)) {
            updateDb(
                `accounts/${$team}/events/${$event}/teams/${ranking}/Ranking`,
                teamRankings[ranking]
            );
        }

        updating = false;
        skillsButton.innerHTML = "Update";
        skillsButton.style.cursor = "pointer";
    }
</script>

<div>
    <button id="skillsUpdater" on:click={updateInfo} on:keydown={updateInfo}
        >Update</button
    >
    <button
        on:click={() => toggleShowNotes()}
        on:keypress={() => toggleShowNotes()}>Notes</button
    >
    <button
        on:click={() => toggleShowCategories()}
        on:keypress={() => toggleShowCategories()}>Categories</button
    >
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
