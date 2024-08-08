<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import OptionEntry from "../../shared/OptionEntry.svelte";
    import Button from "../../shared/Button.svelte";
    import { DialogProperty } from "../../../utils/types";
    import { Unit } from "../../../../lib/types";

    const dispatch = createEventDispatcher();

    export let dialog: DialogProperty;
    let key: string;
    let value: string;

    export let dialogTitle;
    dialogTitle = "Add Attribute";

    let form: HTMLFormElement;

    function addAttribute(): void {
        if(form.reportValidity()) {
            let unit: Unit = dialog.data?.unit;

            let attr = document.createAttribute(key);
            attr.value = value.trim();
            unit.attributes.setNamedItem(attr);
            dialog.callback();
            dispatch('close', null);
        };
    }

    let attributes = ["approved", "translate", "reformat", "xml:space" , "datatype", "ts", "phase-name" , "restype", "resname", "extradata", "help-id", "menu", "menu-option" , "menu-name", "coord", "font", "css-style", "style", "exstyle", "extype", "maxbytes", "minbytes" , "size-unit", "maxheight", "minheight", "maxwidth", "minwidth" , "charclass"];
</script>

<form bind:this={form} on:submit={(e) => e.preventDefault()}>
    <OptionEntry>
        <div slot="key">
            <p>Key</p>
        </div>
        <div slot="value">
            <input bind:value={key} type="text" list="attributes" pattern="([^\t\n\f \/>\x22'=]+)" title="You must enter a valid HTML Attribute Name    ">
            <datalist id="attributes">
                {#each attributes as attr}
                    <option value="{attr}">
                {/each}
            </datalist>
        </div>
    </OptionEntry>

    <OptionEntry>
        <div slot="key">
            <p>Value</p>
        </div>
        <div slot="value">
            <input bind:value={value} type="text">
        </div>
    </OptionEntry>

    <div class="create-btn">
        <Button on:click={addAttribute} on:click>Add</Button>
    </div>
</form>