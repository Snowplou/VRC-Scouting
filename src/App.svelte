<script>
    import Buttons from "./lib/Buttons.svelte";
    import Categories from "./lib/Categories.svelte";
    import Editor from "./lib/Editor.svelte";
    import Info from "./lib/Info.svelte";
    import Options from "./lib/Options.svelte"
    export let teamSelected = ""
    export let showCategories = false
    export let selectedOption = ""
    export let showFilters = false
  
</script>

<main>

  <Buttons bind:showCategories bind:teamSelected bind:selectedOption bind:showFilters/>
  <Info bind:showCategories bind:teamSelected bind:selectedOption bind:showFilters/>
  <Editor bind:teamSelected/>
  <Categories bind:showCategories bind:selectedOption bind:showFilters/>
  <Options bind:showCategories bind:selectedOption bind:showFilters/>
  
</main>

<style>

</style>
