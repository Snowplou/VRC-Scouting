<script>
  import Buttons from "./lib/Buttons.svelte";
  import Categories from "./lib/Categories.svelte";
  import Editor from "./lib/Editor.svelte";
  import EventSelector from "./lib/EventSelector.svelte";
  import Filters from "./lib/Filters.svelte";
  import GoToEvents from "./lib/GoToEvents.svelte";
  import Info from "./lib/Info.svelte";
  import Options from "./lib/Options.svelte";
  import SignIn from "./lib/SignIn.svelte";
  import SignOut from "./lib/SignOut.svelte";
  export let teamSelected = "";
  export let showCategories = false;
  export let selectedOption = "";
  export let selectedFilter = "";
  import { team, event } from "./database";
  import Matches from "./lib/Matches.svelte";
  import GoToTeams from "./lib/GoToTeams.svelte";
    import GoToMatches from "./lib/GoToMatches.svelte";
    import DivisionSelector from "./lib/DivisionSelector.svelte";
  export let showMatches = false;
</script>

<main>
  {#if $team}
    {#if $event}
      <DivisionSelector/>
      {#if showMatches}
        <GoToTeams bind:showMatches />
        <SignOut />
        <Matches />
      {:else}
        <GoToEvents />
        <SignOut />
        <GoToMatches bind:showMatches/>
        <Buttons
          bind:showCategories
          bind:teamSelected
          bind:selectedOption
          bind:selectedFilter
        />
        <Info
          bind:showCategories
          bind:teamSelected
          bind:selectedOption
          bind:selectedFilter
        />
        <Editor bind:teamSelected />
        <Categories
          bind:showCategories
          bind:selectedOption
          bind:selectedFilter
        />
        <Options bind:selectedOption />
        <Filters bind:selectedFilter />
      {/if}
    {:else}
      <EventSelector />
    {/if}
  {:else}
    <SignIn />
  {/if}
</main>

<style>
  main {
    overflow-y: none;
  }
</style>
