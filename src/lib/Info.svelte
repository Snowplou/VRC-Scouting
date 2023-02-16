<script>
    import { loop_guard, query_selector_all, select_multiple_value } from "svelte/internal";
    import { teams, categories, filters, dbUpdated } from "../database";
    import teamSelected from "../App.svelte"

    function selectedTeam(id){
        teamSelected = id
    }
    
    let unfiltered_Team_Ranks = [];
    let team_Ranks = [];
    let categoryList = ["Name", "Rank", "Rating"];
    dbUpdated(() => {
        categoryList = ["Name", "Rank", "Rating"];
        let i = 0;
        for (const team in teams) {
            unfiltered_Team_Ranks[i] = {
                Name: team,
                Rank: teams[team].Rank == -1 ? "N/A" : teams[team].Rank,
                Rating:
                    teams[team].Rating == 0 ? "Not Ranked" : teams[team].Rating,
                Notes: teams[team].Notes == "" ? "No Notes" : teams[team].Notes,
            };

            for (let category in $categories) {
                let val = teams[team][category];
                if ($categories[category].type == "Boolean") {
                    let boolVal = teams[team][category];
                    if (boolVal == "none" || boolVal == undefined) {
                        unfiltered_Team_Ranks[i][category] = "❔";
                    } else if (boolVal) {
                        unfiltered_Team_Ranks[i][category] = "✅";
                    } else {
                        unfiltered_Team_Ranks[i][category] = "❌";
                    }
                } else {
                    unfiltered_Team_Ranks[i][category] = val == undefined ? 0 : val;
                }
            }

            i++;
        }

        for (let category in $categories) {
            categoryList.push(category);
        }
        categoryList.push("Notes");

        if (/*filters*/false) {
            for (let team in unfiltered_Team_Ranks) {
                let teamInfo = unfiltered_Team_Ranks[team];
                allFilters: for (let filter of Object.keys($filters)) {
                    conditionsInFilter: for(let value of Object.keys($filters[filter])){
                        let condition = $filters[filter][value]
                        if(condition == "equal to" && teamInfo[filter] != value) break allFilters
                        if(condition == "not equal to" && teamInfo[filter] == value) break allFilters
                        if(condition == "greater than" && teamInfo[filter] <= value) break allFilters
                        if(condition == "less than" && teamInfo[filter] >= value) break allFilters
                        if(condition == "greater than or equal to" && teamInfo[filter] < value) break allFilters
                        if(condition == "less than or equal to" && teamInfo[filter] > value) break allFilters
                    }
                    team_Ranks.push(teamInfo)
                }
            }
        }
        else{
            team_Ranks = [...unfiltered_Team_Ranks]
        }

        team_Ranks = team_Ranks.sort((a, b) => {
            if (a.Rating != "Not Ranked" && b.Rating != "Not Ranked") {
                return b.Rating - a.Rating;
            } else if (a.Rating != "Not Ranked" && b.Rating == "Not Ranked") {
                return -1;
            } else if (a.Rating == "Not Ranked" && b.Rating != "Not Ranked") {
                return 1;
            } else if (a.Rank != "N/A" && b.Rank != "N/A") {
                return a.Rank - b.Rank;
            } else if (a.Rank != "N/A" && b.Rank == "N/A") {
                return -1;
            } else if (a.Rank == "N/A" && b.Rank == "N/A") {
                return 1;
            } else {
                return 0;
            }
        });
    });
    
</script>

<div class="fixTableHead">
    <table class="styled-table">
        <thead>
            <tr>
                {#each categoryList as category}
                    <th>{category}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each team_Ranks as team}
                <tr on:click={() => selectedTeam(team.Name)}>
                    {#each categoryList as category}
                        {#if category == "Name" || category == "Rank" || category == "Rating" || category == "Notes"}
                            <td>{team[category]}</td>
                        {:else if $categories[category].type == "Number" || $categories[category].type == "String" || $categories[category].type == "Boolean"}
                            <td
                                >{team[category] == 0
                                    ? "N/A"
                                    : team[category]}</td
                            >
                        {:else if $categories[category].type == "Dropdown"}
                            <td
                                >{team[category] == 0
                                    ? "N/A"
                                    : team[category]}</td
                            >
                        {:else}
                            <td>Unkown Variable Type</td>
                        {/if}
                    {/each}
                </tr>
            {/each}
            <!-- and so on... -->
        </tbody>
    </table>
</div>

<style>
    .fixTableHead {
        overflow-y: auto;
        height: 71vh;
    }
    .fixTableHead thead th {
        position: sticky;
        top: 0;
    }
    table {
        border-collapse: collapse;
    }
    th {
        background: #009879;
    }

    .styled-table {
        border-collapse: collapse;
        margin: 10px 0;
        font-size: 0.9em;
        font-family: sans-serif;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        margin-left: auto;
        margin-right: auto;
        margin-top: 0;
        width: 85%;
    }

    .styled-table thead tr {
        background-color: #009879;
        color: #ffffff;
        text-align: left;
    }
    .styled-table th,
    .styled-table td {
        padding: 12px 15px;
    }
    .styled-table tbody tr {
        border-bottom: 1px solid #dddddd;
    }

    .styled-table tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
    }

    .styled-table tbody tr:last-of-type {
        border-bottom: 2px solid #009879;
    }
</style>