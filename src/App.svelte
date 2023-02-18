<script>
    import Buttons from "./lib/Buttons.svelte";
    import Categories from "./lib/Categories.svelte";
    import Editor from "./lib/Editor.svelte";
    import Info from "./lib/Info.svelte";
    export let teamSelected = ""
    export let showCategories = false
  
</script>

<main>

  <Buttons bind:showCategories bind:teamSelected/>
  <Info bind:showCategories bind:teamSelected/>
  <Editor bind:teamSelected/>
  <Categories bind:showCategories/>
  
</main>

<style>

</style>
