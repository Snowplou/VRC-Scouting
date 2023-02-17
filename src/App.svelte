<script>
    import Buttons from "./lib/Buttons.svelte";
    import Editor from "./lib/Editor.svelte";
    import Info from "./lib/Info.svelte";
    export let teamSelected = ""
  
</script>

<main>

  <Buttons />
  <Info bind:teamSelected/>
  <Editor bind:teamSelected/>
  
</main>

<style>

</style>
