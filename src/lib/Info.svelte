<script>
    import { teams, categories, dbUpdated } from "../database";
    export let teamSelected = ""

    function selectedTeam(id) {
        teamSelected = id;
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

        team_Ranks = [...unfiltered_Team_Ranks];

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
