<script>
    import { onMount } from "svelte";
    import Button from "../../shared/Button.svelte";
    import { Pencil } from "lucide-svelte";
    import { push } from "svelte-spa-router";
    import { fly } from "svelte/transition";

    let versions = [];

    onMount(() => {
        fetch("https://api.github.com/repos/Kenny-Hui/xledit/releases").then(e => e.json()).then(data => versions = data);
    });
</script>
<main in:fly={{duration: 400,y:-20}}>
    <section>
        <img alt="XLEdit Logo" src="preview.png">
        <h1>Welcome to XLEdit!</h1>
        <hr>
        <p>XLEdit is an open-source web-based <a href="https://en.wikipedia.org/wiki/XLIFF">XLIFF</a> Editor, supporting the XLIFF 1.2 format.</p>
        <div class="action-row">
            <Button on:click={() => push("/edit")}><Pencil size={16} />Get Started!</Button>
        </div>
    </section>
    <section>
        <h1>Changelogs</h1>
        <div class="changelogs">
            {#each versions as version}
                <hr>    
                <h2>{version.name}</h2>
                {#each version.body.split("\n") as line}
                    <p>{line}</p>
                {/each}
            {/each}
        </div>
        <hr>
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
        margin: 1rem;
    }

    hr {
        margin: 1rem 0;
        box-sizing: border-box;
    }

    
    h2 {
        font-size: 1.5rem;
    }
    
    section {
        text-align: center;
    }
    
    .changelogs {
        text-align: left;
    }

    .action-row {
        margin: 0.5rem;
        display: flex;
        justify-content: center;
    }
</style>