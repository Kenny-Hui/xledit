<script>
    import { states } from "../../../stores/preferenceStore";
    import Button from "../../shared/Button.svelte";

</script>
<main>
    <section>
        <img alt="XLEdit Logo" src="preview.png">
        <h1>Welcome to XLEdit!</h1>
        <p>XLEdit is an open-source web-based XLIFF Editor, supporting the XLIFF 1.2 format.</p>
        <p style="display: flex;justify-content:center"><Button on:click={() => $states.selectedTab = 1}>Get Started!</Button></p>
    </section>
    <section>
        <h1>Changelogs</h1>
        <p>WIP</p>
    </section>
</main>

<style>
    main {
        font-family: var(--primary-font-set);
        width: 1024px;
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
        border-bottom: 1px solid var(--border);
    }

    section {
        text-align: center;
    }
</style>