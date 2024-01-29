<script>
    import { event, team, teams, updateDb } from "../database";
    const ROBOT_EVENTS_KEY =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYzBmOTA1YmJhYTUxMzljNGNiNGNhN2E5N2NiMTFjMTUxZGE1YzA2MTZlNGNjOTIzYTIyZjFiMzlkNGUzZTEzYzA3MGExZGRmYTYzZmM0ZDIiLCJpYXQiOjE2NzQzNTc0MDguMTc0MzgwMSwibmJmIjoxNjc0MzU3NDA4LjE3NDM4MjksImV4cCI6MjYyMTEyODYwOC4xNjY3ODE5LCJzdWIiOiIxMTE2NTUiLCJzY29wZXMiOltdfQ.JeWKVXzcFuAjpObWa0n3javoRWJykyQBfj_DBwpOXyttaM58U30_c3X8G6cOLkz5tWjDTubAU9IqhqjirEfrRHIj2aFoEtnfol9q_1uV4uZG78jNODscCVQL0qnGscOjn9WiE76rTlYovMkEfYtvEIiB63WIh36cM5rR9Vi_6Ng8CcMGV8T5uH-hnUMD9wL3UsBEUF8XepvI6Mpf_lbKrDPUEYDvvApfd84rLA2T6jgAwL3_z7tlF7b0CJ-ONGvjrezgkkyVUcF4azIuTV6Svlogj996dXAQfvHW64RAcHp-8CDItFt81CEh_15jasJEht6wKjTzqshDxsdqpFy2vZX2H2RabncVBmhNsmBPnQkDXpsrU6QAOF4pR308g0IvcsW4B_3ZLimU5vLg3GO57z1picRAVBo8r9NgZpcOZDoJBmiZs16v-h_1PCIQ4TOgEYKzNaq7cJBWCrToKFT_CftavB8Dd5kN9swXhoWiJGgLRY9dO8n0sP8Qrm-rQs2QczQWEFGxOroCnZLg2V_foUtpUK9hKQvvC-nGwIGM0izsAPjmvntY_oRucw4NkJyC9FWvAsHReh6YPUFX5LS437dfDlr0RXrPSg6v8SsONEL25pv8tqgZEYwDg8pHb8Y2QjnutBAM-8RH2yGfNEnLrVYObacT_raq4IgqQujcVEU";

    function alertInvalidTeamName() {
        alert("Invalid team number.");
    }

    async function addTeam() {
        let teamNumber = prompt("Enter team number:")

        // If the number is empty, return
        if (!teamNumber) {
            return;
        }
        teamNumber = teamNumber.toUpperCase()
        // If the number contains a character that is not a number or letter, return
        if (!teamNumber.match(/^[0-9a-zA-Z]+$/)) {
            alertInvalidTeamName();
            return;
        }
        // If there are no letters, return
        if (!teamNumber.match(/[a-zA-Z]/g)) {
            alertInvalidTeamName();
            return;
        }
        // If there are 2 or more letters, return
        if (teamNumber.match(/[a-zA-Z]/g).length > 1) {
            alertInvalidTeamName();
            return;
        }
        // If the last character is not a letter, return
        if (!teamNumber[teamNumber.length - 1].match(/[a-zA-Z]/)) {
            alertInvalidTeamName();
            return;
        }
        // If there are no numbers, return
        if (!teamNumber.match(/[0-9]/g)) {
            alertInvalidTeamName();
            return;
        }
        // If the team is already in the database, return
        if ($teams[teamNumber]) {
            alert("Team is already added.");
            return;
        }

        // Get the team id
        let teamId = await (
            await fetch(
                `https://www.robotevents.com/api/v2/teams?number%5B%5D=${teamNumber}&program%5B%5D=1`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                },
            )
        ).json();
        teamId = teamId.data;
        if (teamId.length == 0) {
            alert("Team not found.");
            return;
        }
        let grade = teamId[0].grade;
        teamId = Number(teamId[0].id);

        // Get the team skills ranking
        let teamSkillsRanking = "-1";
        let skillsRankings = await (
            await fetch(
                `https://www.robotevents.com/api/seasons/181/skills?grade_level=${grade
                    .split(" ")
                    .join("+")}`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                },
            )
        ).json();
        for (let i = 0; i < skillsRankings.length; i++) {
            if (skillsRankings[i].team.id == teamId) {
                teamSkillsRanking = skillsRankings[i].rank;
                break;
            }
        }
        
        if(teamSkillsRanking != "-1") {
            teamSkillsRanking += " " + (grade == "High School" ? "HS" : "MS");
        }

        // Add the team to the database
        let teamInfo = {
            Id: teamId,
            Notes: "",
            Rating: 0,
            "Skills Rank": teamSkillsRanking,
            Ranking: 0,
            Division: 0,
        };

        updateDb(
            `accounts/${$team}/events/${$event}/teamList/${
                Object.keys($teams).length
            }`,
            teamNumber,
        );

        updateDb(
            `accounts/${$team}/events/${$event}/teams/${teamNumber}`,
            teamInfo,
        );
    }
</script>

<button on:click={() => addTeam()}>Add Team</button>

<style>
    button {
        position: absolute;
        top: 0.5vmin;
        right: 0.5vmin;
        width: min(16vw, 100px);
        height: max(4vh, 33px);
        background-color: rgb(84, 121, 215);
        color: white;
        font-family: "Outfit", sans-serif;
        font-weight: 400;
        border-radius: 10px;
        cursor: pointer;
        border: none;
    }
</style>
