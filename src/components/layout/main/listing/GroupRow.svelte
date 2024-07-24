<script lang="ts">
	import { fly } from 'svelte/transition';
	import { ChevronDown, ChevronRight, PlusIcon, TrashIcon } from 'lucide-svelte';
	import UnitRow from "./UnitRow.svelte";
    import { openDialog } from '../../../../stores/uiStores';
    import CreateDialog from '../../../overlay/dialogs/create/CreateDialog.svelte';
    import { Group, Unit } from '../../../../../lib/types';
	import { DialogProperty, type SearchQuery } from '../../../../utils/types';
    import { selectedFile, selectedUnit } from '../../../../stores/data';
    import { haveUnit, removeGroup } from '../../../../../lib/util';
    import Tooltip from '../../../shared/Tooltip.svelte';
	export let expanded = false;
	export let group: Group;
	export let searchQuery: SearchQuery;
	let tree: Element;
	let items = 0;

	function toggle() {
		if(!group.isRoot) expanded = !expanded;
	}

	function meetCriteria(data: Unit | Group, query: SearchQuery): boolean {
		if(data instanceof Group) {
			return query.searchTerm.length == 0 ? true : haveUnit(data, meetCriteria);
		} else if(data instanceof Unit) {
			if(!meetFilter(data, searchQuery)) return false;
			if(searchQuery.searchTerm.length === 0) return true;
			let queryLowerCase = searchQuery.searchTerm.toLowerCase();
			return data.id.toLowerCase().includes(queryLowerCase) || data.source.toLocaleLowerCase().includes(queryLowerCase);
		}
	}

	function meetFilter(unit: Unit, query: SearchQuery) {
		if(!query.showNumericOnly && (/^\d+$/.test(unit.source))) return false;
		if(!query.showTranslated && (unit.target != null)) return false;
		if(!query.showUntranslated && (unit.target == null)) return false;
		
		return true;
	}

	function add() {
		openDialog(new DialogProperty(CreateDialog, { path: group.path }, () => {
			group = group;
			expanded = true;
		}));
	}

	$: group.groups, group.units, items = group.groups.filter(e => meetCriteria(e, searchQuery)).length + group.units.filter(e => meetCriteria(e, searchQuery)).length;

	$: if($selectedUnit && $selectedUnit.getFullPathStr().startsWith(group.path.join("/"))) expanded = true;

    function remove() {
        removeGroup($selectedFile.rootGroup, group.path);
		$selectedFile = $selectedFile;
    }
</script>

<div>
	<div class="group">	
		<button on:click={toggle} class="expandable">
			{#if group.isRoot}
				<span class="root">
					{group.id}
				</span>	
			{:else}
				<div class="icon">
					{#if expanded}
						<ChevronDown />
					{:else}
						<ChevronRight />
					{/if}
				</div>
				{group.id}
			{/if}

			<span class="itemCount">{items} items</span>
		</button>
	
		<div class="action-row">
			{#if !group.isRoot}
				<Tooltip tooltip="Delete Group">
					<button on:click={remove}><TrashIcon size={20} color="red" /></button>
				</Tooltip>
			{/if}
			
			<Tooltip tooltip="Create...">
				<button on:click={add}><PlusIcon size={20} /></button>
			</Tooltip>
		</div>
	</div>
	
	{#if (group.isRoot || expanded || (searchQuery.searchTerm.length != 0 && meetCriteria(group, searchQuery)))}
		<ul bind:this={tree} transition:fly="{{ y: -25, duration: 100 }}">
			{#each group.groups as subgroup}
				<li>
					{#if meetCriteria(subgroup, searchQuery)}	
						{#if subgroup != null}
							<svelte:self group={subgroup} {searchQuery} />
						{:else}
							{#each subgroup.units as entry}
								{#if meetCriteria(entry, searchQuery)}
									<UnitRow {entry} />
								{/if}
							{/each}
						{/if}
					{/if}
				</li>
			{/each}
			{#each group.units as entry}
				{#if meetCriteria(entry, searchQuery)}
					<UnitRow {entry} />
				{/if}
			{/each}
		</ul>
	{/if}
</div>

<style>
    * {
		font-size: 18px;
    }

	.root {
		background-color: var(--light-blue);
		padding: 0.15rem 0.7rem;
		border-radius: 100px;
	}

	ul {
		border-left: 1px solid #eee;
		list-style: none;
		padding: 0 0 0 0.6em;
		margin: 0 0 0 0.6em;
	}

	li {
		padding: 0 0;
	}

	.icon {
		display: inline-block;
		vertical-align: middle;
	}

	.group {
		position: relative;
		display: flex;
		justify-content: space-between;
		border: 1px solid var(--border);
	}

	.group:hover {
		background-color: #F3F3F3;
	}

	.group::before {
		transition: background-color .1s;
		content: '';
		position: absolute;
		background-color: transparent;
		width: 5px;
		height: 100%;
		top: 0;
		left: 0;
	}

	.group:hover::before {
		background-color: var(--blue-highlight);
	}

	.group:hover .action-row {
		opacity: 1;
	}

	.expandable {
		transition: background-color .1s;
		padding: 12px;
		display: block;
		cursor: pointer;
		width: 100%;
		text-align: left;
		background: transparent;
		border: none;
	}

	.action-row {
		display: flex;
		align-items: center;
		padding: 0 .5em;
		background: none;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity .1s;
	}

	.action-row button {
		outline: transparent;
		border: none;
		padding: 0.25rem;
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
	}

	.action-row button:hover {
		background-color: var(--highlight);
	}

	.itemCount {
		padding-left: 10px;
		color: gray;
		font-size: 0.75em;
	}
</style>