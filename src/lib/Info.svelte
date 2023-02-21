<script>
    import { teams, categories, dbUpdated, team, event } from "../database";
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
    let categoryList = ["Name", "Ranking", "Skills Rank", "Rating"];
    dbUpdated(() => {
        categoryList = ["Name", "Ranking", "Skills Rank", "Rating"];
        team_Ranks = []
        let i = 0;
        for (const infoTeam in $teams) {
            unfiltered_Team_Ranks[i] = {
                Name: infoTeam,
                "Skills Rank": $teams[infoTeam]["Skills Rank"] == -1 ? "N/A" : $teams[infoTeam]["Skills Rank"],
                Ranking: $teams[infoTeam].Ranking,
                Rating:
                    $teams[infoTeam].Rating == 0
                        ? "Not Ranked"
                        : $teams[infoTeam].Rating,
                Notes:
                    $teams[infoTeam].Notes == "" ? "No Notes" : $teams[infoTeam].Notes,
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

        let filters = []
        if($categories){
            for(let filterName of Object.keys($categories)){
                for(let filter of $categories[filterName].filters){
                    if(filter.enabled){
                        filter.category = filterName
                        filters.push(filter)
                    }
                }
            }
        }

        teamLoop: for(let filterTeam of unfiltered_Team_Ranks){
            for(let filter of filters){
                let category = filter.category
                let type = filter.type
                let value = filter.val

                if($categories[category].type){
                    filterTeam[category] = Number(filterTeam[category])
                }

                if(type == "Equal To" && filterTeam[category] != value) continue teamLoop
                if(type == "Not Equal To" && filterTeam[category] == value) continue teamLoop
                if(type == "Greater Than" && filterTeam[category] <= value) continue teamLoop
                if(type == "Less Than" && filterTeam[category] >= value) continue teamLoop
                if(type == "Greater Than Or Equal To" && filterTeam[category] < value) continue teamLoop
                if(type == "Less Than Or Equal To" && filterTeam[category] > value) continue teamLoop
            }
            team_Ranks.push(filterTeam)
        }

        team_Ranks = team_Ranks.sort((a, b) => {
            if (a.Rating != "Not Ranked" && b.Rating != "Not Ranked") {
                return b.Rating - a.Rating;
            } else if (a.Rating != "Not Ranked" && b.Rating == "Not Ranked") {
                return -1;
            } else if (a.Rating == "Not Ranked" && b.Rating != "Not Ranked") {
                return 1;
            } else if (a["Skills Rank"] != "N/A" && b["Skills Rank"] != "N/A") {
                return a["Skills Rank"] - b["Skills Rank"];
            } else if (a["Skills Rank"] != "N/A" && b["Skills Rank"] == "N/A") {
                return -1;
            } else if (a["Skills Rank"] == "N/A" && b["Skills Rank"] == "N/A") {
                return 1;
            } else {
                return 0;
            }
        });
    });
</script>

<div class="fixTableHead">
    {#key $teams}
        {#key $categories}
            <table class="styled-table">
                <thead>
                    <tr>
                        {#each categoryList as category}
                            <th>{category}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each team_Ranks as teamInfo}
                <tr on:click={() => selectedTeam(teamInfo.Name)}>
                    {#each categoryList as category}
                        {#if category == "Name"}
                            <td class="semibold">{teamInfo[category]}</td>
                        {:else if category == "Ranking" || category == "Skills Rank" || category == "Rating" || category == "Notes"}
                            <td>{teamInfo[category]}</td>
                        {:else if $categories[category].type == "Number" || $categories[category].type == "String" || $categories[category].type == "Boolean"}
                            <td
                                >{teamInfo[category] == 0
                                    ? "N/A"
                                    : teamInfo[category]}</td
                            >
                        {:else if $categories[category].type == "Dropdown"}
                            <td
                                >{teamInfo[category] == 0
                                    ? "N/A"
                                    : teamInfo[category]}</td
                            >
                        {:else}
                            <td>Unkown Variable Type</td>
                        {/if}
                    {/each}
                </tr>
            {/each}
                </tbody>
            </table>
        {/key}
    {/key}
</div>

<style>
    table tr td {
        border-right: 1px solid rgb(208, 211, 218);
    }
    table tr td:last-of-type {
        border: none;
    }

    .semibold {
        font-weight: 700;
    }

    .fixTableHead {
        overflow-y: auto;
        height: 85vh;
    }
    .fixTableHead thead th {
        position: sticky;
        top: 0;
        font-family: "Outfit", sans-serif;
        font-weight: 600;
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
