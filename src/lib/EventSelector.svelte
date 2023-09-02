<script>
    import moment from "moment";
    const ROBOT_EVENTS_KEY =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYzBmOTA1YmJhYTUxMzljNGNiNGNhN2E5N2NiMTFjMTUxZGE1YzA2MTZlNGNjOTIzYTIyZjFiMzlkNGUzZTEzYzA3MGExZGRmYTYzZmM0ZDIiLCJpYXQiOjE2NzQzNTc0MDguMTc0MzgwMSwibmJmIjoxNjc0MzU3NDA4LjE3NDM4MjksImV4cCI6MjYyMTEyODYwOC4xNjY3ODE5LCJzdWIiOiIxMTE2NTUiLCJzY29wZXMiOltdfQ.JeWKVXzcFuAjpObWa0n3javoRWJykyQBfj_DBwpOXyttaM58U30_c3X8G6cOLkz5tWjDTubAU9IqhqjirEfrRHIj2aFoEtnfol9q_1uV4uZG78jNODscCVQL0qnGscOjn9WiE76rTlYovMkEfYtvEIiB63WIh36cM5rR9Vi_6Ng8CcMGV8T5uH-hnUMD9wL3UsBEUF8XepvI6Mpf_lbKrDPUEYDvvApfd84rLA2T6jgAwL3_z7tlF7b0CJ-ONGvjrezgkkyVUcF4azIuTV6Svlogj996dXAQfvHW64RAcHp-8CDItFt81CEh_15jasJEht6wKjTzqshDxsdqpFy2vZX2H2RabncVBmhNsmBPnQkDXpsrU6QAOF4pR308g0IvcsW4B_3ZLimU5vLg3GO57z1picRAVBo8r9NgZpcOZDoJBmiZs16v-h_1PCIQ4TOgEYKzNaq7cJBWCrToKFT_CftavB8Dd5kN9swXhoWiJGgLRY9dO8n0sP8Qrm-rQs2QczQWEFGxOroCnZLg2V_foUtpUK9hKQvvC-nGwIGM0izsAPjmvntY_oRucw4NkJyC9FWvAsHReh6YPUFX5LS437dfDlr0RXrPSg6v8SsONEL25pv8tqgZEYwDg8pHb8Y2QjnutBAM-8RH2yGfNEnLrVYObacT_raq4IgqQujcVEU";
    import {
        teams,
        categories,
        accounts,
        getEvents,
        eventsUpdated,
        updateDb,
        team,
        event,
        division,
        getDivisions,
    } from "../database";
    export let creatingEvent = false;
    let creating = false;

    let events = [];
    let teamList = [];
    let teamsInfo = [];

    async function addTeams(eventId, progressBar) {
        let response = await (
            await fetch(
                `https://www.robotevents.com/api/v2/events/${eventId}/teams?per_page=99999`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();

        progressBar.innerHTML = "Getting Teams...";

        for (let eventTeams of response.data) {
            teamsInfo[eventTeams.number] = {
                Id: eventTeams.id,
                Notes: "",
                Rating: 0,
                "Skills Rank": -1,
                Ranking: 0,
                Division: 0,
            };
            teamList.push(eventTeams.number);
        }
    }

    let teamRankings = {};
    async function getRankings(eventId, division, progressBar) {
        let response = await (
            await fetch(
                `https://www.robotevents.com/api/v2/events/${eventId}/divisions/${division}/rankings?per_page=99999`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();

        progressBar.innerHTML = "Getting Team Rankings...";

        for (let ranking of response.data) {
            teamRankings[ranking.team.name] = ranking.rank;
        }
    }

    let teamDivs = {};
    async function getDivTeams(eventId, divId, progressBar) {
        let response = await (
            await fetch(
                `https://www.robotevents.com/api/v2/events/${eventId}/divisions/${divId}/rankings?per_page=99999`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();

        progressBar.innerHTML = "Sorting Teams Into Divisions...";

        teamDivs[divId] = []
        for (let ranking of response.data) {
            teamDivs[divId].push(ranking.team.name);
        }
    }

    let divisions;
    async function createEvent(eventId) {
        creating = true;
        creatingEvent = true;

        divisions = await getDivisions(eventId);

        division.set(Object.values(divisions.divisions)[0].id);
        localStorage.setItem("division", $division);

        let divs = {};
        for (let divisionInfo of divisions.divisions) {
            divs[divisionInfo.name] = divisionInfo.id;
        }

        let progressBar = document.getElementById("progress");
        progressBar.innerHTML = "Getting Teams...";
        await addTeams(eventId, progressBar);

        progressBar.innerHTML = "Getting Skills Rankings...";

        let middleSkillsRankings = await (
            await fetch(
                `https://www.robotevents.com/api/seasons/181/skills?grade_level=Middle+School`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();

        progressBar.innerHTML = "Getting Skills Rankings...";

        let highSkillsRankings = await (
            await fetch(`https://www.robotevents.com/api/seasons/181/skills`, {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                },
            })
        ).json();

        let loopTeamList = [...teamList];

        for (let i = 0; i < middleSkillsRankings.length; i++) {
            let middleSkillsTeam = middleSkillsRankings[i].team.team;
            if (loopTeamList.includes(middleSkillsTeam)) {
                loopTeamList.splice(teamList.indexOf(middleSkillsTeam), 1);
                teamsInfo[middleSkillsTeam]["Skills Rank"] = i + 1 + " MS";
            }
        }

        for (let i = 0; i < highSkillsRankings.length; i++) {
            let highSkillsTeam = highSkillsRankings[i].team.team;
            if (loopTeamList.includes(highSkillsTeam)) {
                loopTeamList.splice(teamList.indexOf(highSkillsTeam), 1);
                teamsInfo[highSkillsTeam]["Skills Rank"] = i + 1 + " HS";
            }
        }

        progressBar.innerHTML = "Sorting Teams Into Divisions...";

        for (let div of divisions.divisions) {
            await getDivTeams(eventId, div.id, progressBar);
        }

        for (let div of Object.keys(teamDivs)) {
            for (let teamDiv of teamDivs[div]) {
                if(!teamsInfo[teamDiv]) teamsInfo[teamDiv] = {}
                teamsInfo[teamDiv].Division = div;
            }
        }

        progressBar.innerHTML = "Getting Rankings...";

        for (let div of Object.keys(teamDivs)) {
            teamRankings = {};
            await getRankings(eventId, div, progressBar);

            for (let ranking of Object.keys(teamRankings)) {
                teamsInfo[ranking].Ranking = teamRankings[ranking];
            }
        }

        let eventInfo = {
            teamList: teamList,
            teams: teamsInfo,
            divisions: divs,
        };

        progressBar.innerHTML = "Done!";

        updateDb(`accounts/${$team}/events/${eventId}`, eventInfo);
        localStorage.setItem("event", eventId);
        event.set(eventId);
        creatingEvent = true;
        location.reload();
    }

    function deleteEvent(selectedEvent, eventName) {
        if (
            !confirm(
                `Are you sure that you want to delete the event: ${eventName}?`
            )
        )
            return;
        if (
            !confirm(
                `This will delete all of the data stored for ${eventName}. Are you sure that you want to continue?`
            )
        )
            return;

        updateDb(`accounts/${$team}/events/${selectedEvent}`, null);
    }

    function Clicked(elm, selectedEvent) {
        if (elm.target.type) return; // Don't run if delete button was pressed
        if ($accounts[$team].events) {
            if (!$accounts[$team].events[selectedEvent]) {
                createEvent(selectedEvent);
            } else {
                localStorage.setItem("event", selectedEvent);
                event.set(selectedEvent);
                location.reload();
            }
        } else {
            createEvent(selectedEvent);
        }
    }

    eventsUpdated(async () => {
        events = (await getEvents($accounts[$team].id)).data;
    });
</script>

{#if creating}
    <p id="creating">Creating Event...</p>
    <p id="progress">Getting Divisions...</p>
{:else}
    <div id="scrolling">
        {#each events as selectorEvent}
            <div
                class="event"
                on:click={(elm) => Clicked(elm, selectorEvent.id)}
                on:keypress={(elm) => Clicked(elm, selectorEvent.id)}
            >
                <p>{selectorEvent.name}</p>
                <p>{selectorEvent.location.venue}</p>
                <p>
                    {moment
                        .utc(selectorEvent.start)
                        .format("MMMM Do YYYY")}{moment
                        .utc(selectorEvent.start)
                        .format("MMMM Do YYYY") ==
                    moment.utc(selectorEvent.end).format("MMMM Do YYYY")
                        ? ""
                        : " - " +
                          moment.utc(selectorEvent.end).format("MMMM Do YYYY")}
                </p>
                <button
                    on:click={() =>
                        deleteEvent(selectorEvent.id, selectorEvent.name)}
                    on:keypress={() =>
                        deleteEvent(selectorEvent.id, selectorEvent.name)}
                    >Delete</button
                >
            </div>
        {/each}
    </div>
{/if}

<style>
    #scrolling {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
    }

    button {
        margin-bottom: 1%;
        width: 20%;
        height: 20%;
        border-radius: 10px;
        border: none;
        cursor: pointer;
    }

    #creating {
        margin-top: 40vh;
        text-align: center;
        font-size: 300%;
    }

    .event p {
        margin-left: 1%;
        margin-right: 1%;
    }

    #progress {
        text-align: center;
    }

    .event {
        display: flex;
        align-items: center;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        text-align: center;
        margin-bottom: 5vh;
        margin-left: auto;
        margin-right: auto;
        background-color: rgb(84, 121, 215);
        color: white;
        width: 75vw;
        height: 30vh;
        border-radius: 10px;
        cursor: pointer;
    }
</style>
