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
    export let team = localStorage.getItem("accountNumber")
    export let event = localStorage.getItem("event")
    let showData = true
  
</script>

<main>

  {#if team}
    {#if event}
      <GoToEvents bind:event/>
      <SignOut bind:team/>
      <Buttons bind:showCategories bind:teamSelected bind:selectedOption bind:selectedFilter bind:event/>
      <Info bind:showCategories bind:teamSelected bind:selectedOption bind:selectedFilter/>
      <Editor bind:teamSelected bind:team bind:event/>
      <Categories bind:showCategories bind:selectedOption bind:selectedFilter bind:team bind:event/>
      <Options bind:selectedOption bind:team bind:event/>
      <Filters bind:selectedFilter bind:team bind:event/>
      {:else}
      <EventSelector bind:team bind:event/>
      {/if}
  {:else}
    <SignIn bind:team/>
  {/if}
  
</main>

<style>

</style>
