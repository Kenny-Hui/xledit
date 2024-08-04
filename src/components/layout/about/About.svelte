<script>
    import { onMount } from "svelte";
    import { states } from "../../../stores/preferenceStore";
    import Button from "../../shared/Button.svelte";

    let versions = [];

    onMount(() => {
        fetch("https://api.github.com/repos/Kenny-Hui/xledit/releases").then(e => e.json()).then(data => versions = data);
    });
</script>
<main>
    <section>
        <img alt="XLEdit Logo" src="preview.png">
        <h1>Welcome to XLEdit!</h1>
        <hr>
        <p>XLEdit is an open-source web-based XLIFF Editor, supporting the XLIFF 1.2 format.</p>
        <p style="display: flex;justify-content:center"><Button on:click={() => $states.selectedTab = 1}>Get Started!</Button></p>
    </section>
    <section>
        <h1>Changelogs</h1>
        <hr>
        <div class="changelogs">
            {#each versions as version}
                <hr>    
                <h2>{version.name}</h2>
                {#each version.body.split("\r\n") as line}
                    <p>{line}</p>
                {/each}
            {/each}
        </div>
    </section>
</main>

<style>
    main {
        font-family: var(--primary-font-set);
        width: 1024px;
        padding: 1rem;
        box-sizing: border-box;
        margin: auto;
        max-width: 100%;
        font-size: 18px;
        line-height: 1.5;
    }

    section img {
        max-height: 400px;
        max-width: 100%;
        box-shadow: 0 0 12px #000;
        border-radius: 0.5rem;
    }

    h1 {
        font-size: 2rem;
        padding: 1rem;
        margin: 1rem;
    }

    .changelogs {
        text-align: left;
    }

    h2 {
        font-size: 1.5rem;
    }

    section {
        text-align: center;
    }
</style>