<script>
    import Buttons from "./lib/Buttons.svelte";
    import Categories from "./lib/Categories.svelte";
    import Editor from "./lib/Editor.svelte";
    import Filters from "./lib/Filters.svelte";
    import Info from "./lib/Info.svelte";
    import Options from "./lib/Options.svelte"
    import SignIn from "./lib/SignIn.svelte";
    export let teamSelected = ""
    export let showCategories = false
    export let selectedOption = ""
    export let selectedFilter = ""
    export let team = ""
    export let event = ""
  
</script>

<main>

  {#if team != ""}
  <Buttons bind:showCategories bind:teamSelected bind:selectedOption bind:selectedFilter/>
  <Info bind:showCategories bind:teamSelected bind:selectedOption bind:selectedFilter/>
  <Editor bind:teamSelected/>
  <Categories bind:showCategories bind:selectedOption bind:selectedFilter/>
  <Options bind:selectedOption/>
  <Filters bind:selectedFilter/>
  {:else}
  <SignIn bind:team/>
  {/if}
  
</main>

<style>

</style>
