<script>
    import Buttons from "./lib/Buttons.svelte";
    import Categories from "./lib/Categories.svelte";
    import Editor from "./lib/Editor.svelte";
    import EventSelector from "./lib/EventSelector.svelte";
    import Filters from "./lib/Filters.svelte";
    import GoToEvents from "./lib/GoToEvents.svelte";
    import Info from "./lib/Info.svelte";
    import Options from "./lib/Options.svelte"
    import SignIn from "./lib/SignIn.svelte";
    import SignOut from "./lib/SignOut.svelte";
    export let teamSelected = ""
    export let showCategories = false
    export let selectedOption = ""
    export let selectedFilter = ""
    import { team, event } from "./database";
    let showData = true
  
</script>

<main>

  {#if team}
    {#if $event}
      <GoToEvents/>
      <SignOut/>
      <Buttons bind:showCategories bind:teamSelected bind:selectedOption bind:selectedFilter/>
      <Info bind:showCategories bind:teamSelected bind:selectedOption bind:selectedFilter/>
      <Editor bind:teamSelected/>
      <Categories bind:showCategories bind:selectedOption bind:selectedFilter/>
      <Options bind:selectedOption/>
      <Filters bind:selectedFilter/>
      {:else}
      <EventSelector/>
      {/if}
  {:else}
    <SignIn/>
  {/if}
  
</main>

<style>

</style>
