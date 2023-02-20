<script>
    import moment from "moment";
    import { schedule_update } from "svelte/internal";
    import {
        teams,
        team,
        event,
        eventMatches,
        updateMatches,
        getDivisions,
    } from "../database";

    let updating = false;
    let divisions = {};
    let chosenDiv = 1;
    let timeBehind = 0;

    function updateDiv(elm) {
        chosenDiv = elm.target.value;
        update();
    }

    function utcToTime(time) {
        var localTime = moment.utc(time).local().format("h:mm A");
        return localTime;
    }

    function timeToOffset(time) {
        return moment(time, "h:m A")
            .add(timeBehind, "m")
            .local()
            .format("h:mm A");
    }

    (async () => {
        let info = (await getDivisions($event)).divisions;
        for (let div of info) {
            divisions[div.id] = div.name;
        }
    })();

    update()

    async function update() {
        if (updating) return;
        updating = true;
        let updateButton = document.getElementById("update");

        if (updateButton) {
            updateButton.innerHTML = "updating";
            updateButton.style.cursor = "default";
        }

        await updateMatches(1, $event, chosenDiv);

        let lastMatch = 0;
        for (let match of Object.values($eventMatches.qualify)) {
            if (!match.started) {
                lastMatch = match.matchnum - 1;
                break;
            }
        }

        let timeScheduled = utcToTime(
            $eventMatches.qualify[lastMatch].scheduled
        );
        let timeStarted = utcToTime($eventMatches.qualify[lastMatch].started);
        // timeScheduled = utcToTime(
        //     moment(timeScheduled, "h:mm A").add(-1, "minutes")
        // );
        timeBehind = moment(timeStarted, "h:mm A").diff(
            moment(timeScheduled, "h:mm A")
        );
        timeBehind /= 1000 * 60; // Milliseconds to minutes

        if (updateButton) {
            updateButton.innerHTML = "Update";
            updateButton.style.cursor = "pointer";
        }
        updating = false;
    }

    let show = {
        qualify: true,
        r16: true,
        quarter: true,
        semi: true,
        final: true,
    };
</script>

<button id="update" on:click={() => update()} on:keypress={() => update()}
    >Update</button
>

<div id="division">
    Division: <select value="1" on:change={(elm) => updateDiv(elm)}>
        {#each Object.keys(divisions) as div}
            <option value={div}>{divisions[div]}</option>
        {/each}
    </select>
</div>

<div id="show">
    {#each Object.keys(show) as round}
        <div class="selection">
            <p>
                {round}:
                <input
                    type="checkbox"
                    on:change={() => (show[round] = !show[round])}
                    checked={true}
                />
            </p>
        </div>
    {/each}
</div>

<div id="scrolling">
    {#each Object.keys($eventMatches) as round}
        {#if show[round]}
            {#if Object.keys($eventMatches[round]).length}
                <p class="roundTitle">{round}</p>
            {/if}

            {#each Object.values($eventMatches[round]) as match}
                <div class="match">
                    {match.name}<br />
                    <div class="teams">
                        <div class="red">
                            {match.alliances[1].teams[0].team.name}<br />
                            {match.alliances[1].teams[1].team.name}
                        </div>
                        <div style="margin-top: 1.5%;">
                            <div class="score">
                                {#if match.started}
                                    {match.alliances[1].score} - {match
                                        .alliances[0].score}
                                {:else}
                                    Not Started
                                {/if}
                            </div>
                            <div class="field">
                                Field {match.field}
                            </div>
                        </div>
                        <div class="blue">
                            {match.alliances[0].teams[0].team.name}<br />
                            {match.alliances[0].teams[1].team.name}
                        </div>
                    </div>
                    <div class="times">
                        {#key timeBehind}
                            TM Time: {utcToTime(match.scheduled)}
                            <br />
                            {#if match.started}
                                Actual Time: {utcToTime(match.started)}
                            {:else}
                                Estimated Time: {timeToOffset(
                                    utcToTime(match.scheduled)
                                )}
                            {/if}
                        {/key}
                    </div>
                </div>
            {/each}
        {/if}
    {/each}
</div>

<style>
    .times {
        font-size: 75%;
        margin: 0.5%;
    }

    #division {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1%;
        text-align: center;
    }

    #update {
        display: flex;
        align-items: center;
        justify-content: center;
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

    .teams {
        display: flex;
        justify-content: space-between;
        font-size: 75%;
        margin-top: 1vh;
        margin-left: 2%;
        margin-right: 2%;
    }

    .field {
        color: rgb(100, 144, 255);
    }

    .score {
        font-size: 150%;
        margin: 0;
    }

    .blue {
        color: blue;
        font-size: 150%;
    }

    .red {
        color: red;
        font-size: 150%;
    }

    .selection {
        margin-top: -3%;
        margin-bottom: -3%;
    }

    .roundTitle {
        text-align: center;
    }

    .roundTitle::first-letter {
        text-transform: capitalize;
    }

    #show {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        align-items: center;
        justify-content: space-around;
        padding-top: 2vh;
        margin: 1%;
        font-size: 125%;
    }

    #show p::first-letter {
        text-transform: capitalize;
    }

    #show input {
        scale: 125%;
    }

    .match {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        width: 90vw;
        height: 25vh;
        background-color: gray;
        margin-top: 0;
        margin-bottom: 1vh;
        border-radius: 10px;
        color: white;
    }

    #scrolling {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        overflow-y: scroll;
        font-size: 125%;
        height: 78vh;
    }
</style>
