<script>
    import { saving } from "../database";
</script>

<div id="saving" style={"opacity:" + ($saving ? 1 : 0)}>
    <p>Saving</p>
    <div id="spinner" />
</div>

<style>
    #saving {
        margin-top: -1vh;
        float: right;
    }

    #spinner {
        margin-top: -100vh;
        margin-left: 6vw;
        display: inline-block;
        width: 3vh;
        height: 3vh;
        border: 3px solid rgba(84, 121, 215, 0.5);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        -webkit-animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
</style>
