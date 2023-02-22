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
    let creating = false;

    let events = [];
    let teamList = [];
    let teamsInfo = [];

    async function addTeams(page, eventId) {
        let response = await (
            await fetch(
                `https://www.robotevents.com/api/v2/events/${eventId}/teams?page=${page}`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();
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
        if (response.meta.current_page != response.meta.last_page) {
            await addTeams(page + 1, eventId);
        }
    }

    let teamRankings = {};
    async function getRankings(page, eventId) {
        let response = await (
            await fetch(
                `https://www.robotevents.com/api/v2/events/${eventId}/divisions/${$division}/rankings?page=${page}`,
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
            await getRankings(page + 1, eventId);
        }
    }

    let teamDivs = {};
    async function getDivTeams(page, eventId, divId) {
        let response = await (
            await fetch(
                `https://www.robotevents.com/api/v2/events/${eventId}/divisions/${divId}/rankings?page=${page}`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
                    },
                }
            )
        ).json();

        if(page == 1) teamDivs[divId] = []

        for (let ranking of response.data) {
            teamDivs[divId].push(ranking.team.name)
        }

        if (response.meta.current_page != response.meta.last_page) {
            await getDivTeams(page + 1, eventId, divId);
        }
    }

    async function createEvent(eventId) {
        creating = true;
        let divisions = await getDivisions(eventId)

        division.set(
            Object.values(divisions.divisions)[0].id
        );

        await addTeams(1, eventId);

        let skillsRankings = await (
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

        let loopTeamList = [...teamList];

        for (let i = 0; i < skillsRankings.length; i++) {
            let skillsTeam = skillsRankings[i].team.team;
            if (loopTeamList.includes(skillsTeam)) {
                loopTeamList.splice(teamList.indexOf(skillsTeam), 1);
                teamsInfo[skillsTeam]["Skills Rank"] = i + 1;
            }
        }


        for(let div of divisions.divisions){
            await getDivTeams(1, eventId, div.id)
        }
        for(let div of Object.keys(teamDivs)){
            for(let teamDiv of teamDivs[div]){
                teamsInfo[teamDiv].Division = div
            }
        }


        await getRankings(1, eventId);

        for (let ranking of Object.keys(teamRankings)) {
            teamsInfo[ranking].Ranking = teamRankings[ranking]
        }


        let eventInfo = {
            teamList: teamList,
            teams: teamsInfo,
        };

        updateDb(`accounts/${$team}/events/${eventId}`, eventInfo);
        localStorage.setItem("event", eventId);
        event.set(eventId);
        location.reload();
    }

    function Clicked(selectedEvent) {
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
{:else}
    <div id="scrolling">
        {#each events as selectorEvent}
            <div
                class="event"
                on:click={() => Clicked(selectorEvent.id)}
                on:keypress={() => Clicked(selectorEvent.id)}
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

    #creating {
        margin-top: 40vh;
        text-align: center;
        font-size: 300%;
    }

    .event p {
        margin-left: 1%;
        margin-right: 1%;
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
        height: 25vh;
        border-radius: 10px;
        cursor: pointer;
    }
</style>
