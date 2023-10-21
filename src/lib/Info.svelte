<script>
    import { fly } from "svelte/transition";
    import {
        team,
        event,
        teams,
        removedTeams,
        categories,
        dbUpdated,
        division,
        sortingType,
        updateDb,
    } from "../database";
    export let teamSelected = "";
    export let showCategories = false;
    export let selectedOption = "";
    export let selectedFilter = "";

    function selectedTeam(id) {
        if (teamSelected) teamSelected = "";
        else {
            teamSelected = id;
            showCategories = false;
            selectedOption = "";
            selectedFilter = "";
        }
    }

    let unfiltered_Team_Ranks = [];
    let team_Ranks = [];
    let categoryList = ["Team Number", "Ranking", "Skills Rank", "Rating"];
    dbUpdated(() => {
        categoryList = ["Team Number", "Ranking", "Skills Rank", "Rating"];
        team_Ranks = [];
        let i = 0;
        for (const infoTeam in $teams) {
            unfiltered_Team_Ranks[i] = {
                "Team Number": infoTeam,
                "Skills Rank":
                    $teams[infoTeam]["Skills Rank"] == -1
                        ? "N/A"
                        : $teams[infoTeam]["Skills Rank"],
                Ranking: $teams[infoTeam].Ranking,
                Rating:
                    $teams[infoTeam].Rating == 0
                        ? "Not Ranked"
                        : $teams[infoTeam].Rating,
                Notes:
                    $teams[infoTeam].Notes == ""
                        ? "No Notes"
                        : $teams[infoTeam].Notes,
                Division: $teams[infoTeam].Division,
            };

            for (let category in $categories) {
                let val = $teams[infoTeam][category];
                if ($categories[category].type == "Boolean") {
                    let boolVal = $teams[infoTeam][category];
                    if (boolVal == "" || boolVal == undefined) {
                        unfiltered_Team_Ranks[i][category] = "❔";
                    } else if (boolVal == "true") {
                        unfiltered_Team_Ranks[i][category] = "✅";
                    } else {
                        unfiltered_Team_Ranks[i][category] = "❌";
                    }
                } else {
                    unfiltered_Team_Ranks[i][category] =
                        val == undefined ? 0 : val;
                }
            }

            i++;
        }

        for (let category in $categories) {
            categoryList.push(category);
        }
        categoryList.push("Notes");

        let filters = [];
        if ($categories) {
            for (let filterName of Object.keys($categories)) {
                for (let filter of $categories[filterName].filters) {
                    if (filter.enabled) {
                        filter.category = filterName;
                        filters.push(filter);
                    }
                }
            }
        }

        teamLoop: for (let filterTeam of unfiltered_Team_Ranks) {
            for (let filter of filters) {
                let category = filter.category;
                let type = filter.type;
                let value = filter.val;
                let teamVal = filterTeam[category];

                if ($categories[category].type == "Number") {
                    filterTeam[category] = Number(filterTeam[category]);
                }

                if ($categories[category].type == "Boolean") {
                    if (teamVal == "✅") teamVal = "true";
                    else if (teamVal == "❌") teamVal = "false";
                    else teamVal = "unknown";
                }

                if (type == "Equal To" && teamVal != value) continue teamLoop;
                if (type == "Not Equal To" && teamVal == value)
                    continue teamLoop;
                if (type == "Greater Than" && teamVal <= value)
                    continue teamLoop;
                if (type == "Less Than" && teamVal >= value) continue teamLoop;
                if (type == "Greater Than Or Equal To" && teamVal < value)
                    continue teamLoop;
                if (type == "Less Than Or Equal To" && teamVal > value)
                    continue teamLoop;
            }
            team_Ranks.push(filterTeam);
        }

        sort();
    });

    sortingType.subscribe(() => {
        sort();
    });

    function sortLogic(a, b) {
        if ($sortingType == "name") {
            if (a["Team Number"].length > b["Team Number"].length) return 1;
            else if (a["Team Number"].length < b["Team Number"].length)
                return -1;
            else if (a["Team Number"] > b["Team Number"]) return 1;
            else if (a["Team Number"] < b["Team Number"]) return -1;
            else return 0;
        } else if ($sortingType == "rank") {
            if (a.Ranking == 0) return 1;
            else if (b.Ranking == 0) return -1;
            else if (a.Ranking > b.Ranking || a.Ranking == 0) return 1;
            else return -1;
        } else if ($sortingType == "skills") {
            let aSkills = a["Skills Rank"].split(" ");
            let bSkills = b["Skills Rank"].split(" ");
            aSkills[0] = Number(aSkills[0]);
            bSkills[0] = Number(bSkills[0]);
            if (aSkills.length == 1 && bSkills.length == 1) return 0;
            else if (aSkills.length == 1) return 1;
            else if (bSkills.length == 1) return -1;
            else if (aSkills[0] > bSkills[0]) return 1;
            else if (aSkills[0] < bSkills[0]) return -1;
            else if (aSkills[1] == "MS") return 1;
            else return -1;
        } else if ($sortingType == "rating") {
            let numA = Number(a.Rating);
            let numB = Number(b.Rating);
            if (a.Rating == "Not Ranked" && b.Rating == "Not Ranked") return 0;
            else if (a.Rating == "Not Ranked") return 1;
            else if (b.Rating == "Not Ranked") return -1;
            else if (numA > numB) return -1;
            else if (numA < numB) return 1;
            else return 0;
        }
    }

    function sort() {
        team_Ranks = team_Ranks.sort((a, b) => {
            if ($removedTeams) {
                if (
                    $removedTeams.includes(a["Team Number"]) &&
                    $removedTeams.includes(b["Team Number"])
                )
                    return sortLogic(a, b);
                else if ($removedTeams.includes(a["Team Number"])) return 1;
                else if ($removedTeams.includes(b["Team Number"])) return -1;
            }

            return sortLogic(a, b);
        });
    }

    function sortingChanged(elm) {
        sortingType.set(elm.target.value);
        localStorage.setItem("sortingType", $sortingType);
    }
</script>

<div id="sortingType">
    <p>Sort:</p>
    <select value={$sortingType} on:change={(elm) => sortingChanged(elm)}>
        <option value="rank">Rankings</option>
        <option value="name">Team Number</option>
        <option value="skills">Skills Rankings</option>
        <option value="rating">Rating</option>
    </select>
</div>

<div class="fixTableHead">
    {#key $teams}
        {#key $categories}
            {#key $sortingType}
                {#key $removedTeams}
                    {#key team_Ranks}
                        <table class="styled-table" in:fly={{ y: -100, duration: 1000 }} out:fly={{ y: -100, duration: 500 }}>
                            <thead>
                                <tr>
                                    {#each categoryList as category}
                                        <th>{category}</th>
                                    {/each}
                                </tr>
                            </thead>
                            <tbody>
                                {#each team_Ranks as teamInfo, i}
                                    {#if teamInfo.Division == $division || $division == "all"}
                                        <tr
                                            on:click={(elm) =>
                                                selectedTeam(
                                                    teamInfo["Team Number"]
                                                )}
                                            on:keypress={(elm) =>
                                                selectedTeam(
                                                    teamInfo["Team Number"]
                                                )}
                                            class={$removedTeams
                                                ? $removedTeams.includes(
                                                      teamInfo["Team Number"]
                                                  )
                                                    ? "strikethrough"
                                                    : ""
                                                : ""}
                                        >
                                            {#each categoryList as category}
                                                {#if category == "Team Number"}
                                                    <td class="semibold" style="background-color: {i % 2 == 0 ? "#ffffff" : "#f3f3f3"}"
                                                        >{teamInfo[
                                                            category
                                                        ]}</td
                                                    >
                                                {:else if category == "Ranking" || category == "Skills Rank" || category == "Rating" || category == "Notes"}
                                                    <td>{teamInfo[category]}</td
                                                    >
                                                {:else if $categories[category].type == "Number" || $categories[category].type == "String" || $categories[category].type == "Boolean"}
                                                    <td
                                                        >{teamInfo[category] ==
                                                        0
                                                            ? "N/A"
                                                            : teamInfo[
                                                                  category
                                                              ]}</td
                                                    >
                                                {:else if $categories[category].type == "Dropdown"}
                                                    <td
                                                        >{teamInfo[category] ==
                                                        0
                                                            ? "N/A"
                                                            : teamInfo[
                                                                  category
                                                              ]}</td
                                                    >
                                                {:else}
                                                    <td>Unkown Variable Type</td
                                                    >
                                                {/if}
                                            {/each}
                                        </tr>
                                    {/if}
                                {/each}
                            </tbody>
                        </table>
                    {/key}
                {/key}
            {/key}
        {/key}
    {/key}
</div>

<style>
    .strikethrough {
        color: red;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII=");
        background-repeat: repeat-x;
        background-position: 50% 50%;
    }

    #sortingType {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        margin-top: -3%;
        margin-bottom: -1%;
    }
    #sortingType select {
        height: 25%;
    }

    table tr td {
        border-right: 1px solid rgb(208, 211, 218);
    }
    table tr td:last-of-type {
        border: none;
    }

    .semibold {
        font-weight: 700;
    }

    /* Make the team numbers stay on the screen */
    .styled-table tbody tr td:first-child {
        position: sticky;
        left: 0;
    }

    /* Make a border to the right of the team numbers that doesn't scroll with the rest of the table */
    .styled-table tbody tr td:first-child::after {
        content: "";
        position: absolute;
        top: 0;
        right: -1px;
        height: 100%;
        width: 1px;
        background-color: rgb(208, 211, 218);
    }

    .fixTableHead {
        overflow-y: auto;
        height: 77vh;
    }
    .fixTableHead thead th {
        position: sticky;
        top: 0;
        font-family: "Outfit", sans-serif;
        font-weight: 600;
        z-index: 2;
    }
    table {
        border-collapse: collapse;
    }
    th {
        background: rgb(84, 121, 215);
    }

    .styled-table {
        border-collapse: collapse;
        margin: 10px 0;
        font-size: 0.9em;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        margin-left: auto;
        margin-right: auto;
        margin-top: 0;
        width: 85%;
    }

    .styled-table thead tr {
        background-color: rgb(84, 121, 215);
        color: #ffffff;
        text-align: left;
    }
    .styled-table th,
    .styled-table td {
        padding: 12px 15px;
    }
    .styled-table tbody tr {
        border-bottom: 1px #dddddd;
    }

    .styled-table tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
    }
</style>
