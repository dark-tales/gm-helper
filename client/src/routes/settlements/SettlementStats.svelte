<script>
    import { onMount } from 'svelte'
    import ModalStats from './ModalStats.svelte'
    let showModal = $state(false)
    let {
        currentSettlement,
        storedAutoEvent,
        storedOpportunity,
        storedDilemma,
        storedRumor,
        activeEventType,
        onGenerateAuto,
        onGenerateOpportunity,
        onGenerateDilemma,
        onGenerateRumor,
        onDisplayAuto,
        onDisplayOpportunity,
        onDisplayDilemma,
        onDisplayRumor
    } = $props()

    // Use a reactive block to update currentSettlement.strain and strainLevel
    // whenever the attributes change. This is the correct way to handle
    // derived state without causing an infinite loop.
    $effect(() => {
        // Reset totalStrain before recalculating
        let totalStrain = 0
        
        // Defines attributes
        const attributes = [
            currentSettlement.attributes.population,
            currentSettlement.attributes.resources,
            currentSettlement.attributes.stability,
            currentSettlement.attributes.reputation,
            currentSettlement.attributes.morale,
            currentSettlement.attributes.culture
        ]

        // For each attribute calculate strain
        attributes.forEach(attr => {
            if (attr >= 0 && attr <= 4) {
            totalStrain += 2; // Dire
            } else if (attr >= 5 && attr <= 9) {
            totalStrain += 1; // Problematic
            } else if (attr >= 10 && attr <= 12) {
            totalStrain += 0; // Balanced
            } else if (attr >= 13 && attr <= 17) {
            totalStrain += 1; // High but manageable
            } else if (attr >= 18 && attr <= 20) {
            totalStrain += 2; // Overdeveloped
            }
        })
        
        // Update the settlement's strain and strainLevel properties
        // Svelte's reactivity will handle the UI update.
        currentSettlement.strain = totalStrain
        
        if (currentSettlement.strain >= 0 && currentSettlement.strain <= 3) currentSettlement.strainLevel = 'Low'
        else if (currentSettlement.strain >= 4 && currentSettlement.strain <= 7) currentSettlement.strainLevel = 'Moderate'
        else if (currentSettlement.strain >= 8) currentSettlement.strainLevel = 'High'
    })
</script>

<div class="stats-container">
    <h2>Settlement Attributes</h2>
    
    <div class="attribute-list">
        {#each Object.entries(currentSettlement.attributes).filter(([key]) => ['population', 'reputation', 'stability',  'morale', 'culture', 'resources'].includes(key)) as [key, value]}
            <div class="attribute-item">
                <span class="attribute-name">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span class="attribute-value">{value}</span>
            </div>
        {/each}
    </div>
    
    <div class="strain-display">
        <strong>Total Strain: <span class="strain-value {currentSettlement.strainLevel === 'Low' ? 'strain-low' : currentSettlement.strainLevel === 'Moderate' ? 'strain-moderate' : 'strain-high'}" >{currentSettlement.strain}</span></strong> 
        <strong>Level: <span class="strain-value {currentSettlement.strainLevel === 'Low' ? 'strain-low' : currentSettlement.strainLevel === 'Moderate' ? 'strain-moderate' : 'strain-high'}">{currentSettlement.strainLevel}</span></strong> 
        <button onclick={() => showModal = true}>Overwrite</button>
    </div>

    <div class="events-section">
        <h3>Generate Events</h3>
        <div class="event-btn">
            <div class="btn-group">
                <button onclick={onGenerateAuto} class={"generate-btn " + (storedAutoEvent ? "has-event" : "")}>Event</button>
                {#if storedAutoEvent}
                    <button onclick={onDisplayAuto} class={"display-btn " + (activeEventType === "Auto" ? "active-display" : "")}>Display</button>
                {/if}
            </div>
            <div class="btn-group">
                <button onclick={onGenerateOpportunity} class={"generate-btn " + (storedOpportunity ? "has-event" : "")}>Opportunity</button>
                {#if storedOpportunity}
                    <button onclick={onDisplayOpportunity} class={"display-btn " + (activeEventType === "Opportunity" ? "active-display" : "")}>Display</button>
                {/if}
            </div>
            <div class="btn-group">
                <button onclick={onGenerateDilemma} class={"generate-btn " + (storedDilemma ? "has-event" : "")}>Dilemma</button>
                {#if storedDilemma}
                    <button onclick={onDisplayDilemma} class={"display-btn " + (activeEventType === "Dilemma" ? "active-display" : "")}>Display</button>
                {/if}
            </div>
            <div class="btn-group">
                <button onclick={onGenerateRumor} class={"generate-btn " + (storedRumor ? "has-event" : "")}>Rumor</button>
                {#if storedRumor}
                    <button onclick={onDisplayRumor} class={"display-btn " + (activeEventType === "Rumor" ? "active-display" : "")}>Display</button>
                {/if}
            </div>
        </div>
    </div>

    <ModalStats show={showModal} onClose={() => showModal = false}>
        <div class="modal-attribute-list">
            {#each Object.entries(currentSettlement.attributes).filter(([key]) => ['population', 'resources', 'stability', 'reputation', 'morale', 'culture'].includes(key)) as [key, value]}
                <div class="attribute-item">
                    <span class="attribute-name">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                    <div class="attribute-item-ctrl">
                        <button onclick={() => currentSettlement.attributes[key] -= 1}>-</button>
                        <span class="attribute-value">{value}</span>
                        <button onclick={() => currentSettlement.attributes[key] += 1}>+</button>
                    </div>
                </div>
            {/each}
        </div>
    </ModalStats>
</div>

<style>
    :root {
        --bg-color: #131516;
        --card-bg: #1f2324;
        --primary-color: #efd293;
        --secondary-color: #012708;
        --text-color: #f0f0f0;
        --border-color: #333a3b;
        --pf-red: #5e0000;
        --pf-green: #3b7b59;
        --pf-yellow: #996f00;
        --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    }

    .stats-container {
        background-color: var(--card-bg);
        border-radius: 8px;
        box-shadow: var(--shadow);
        padding: 1.5rem;
        border: 1px solid var(--border-color);
    }
    .stats-container button {
        background-color: var(--primary-color);
        color: var(--bg-color);
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
        font-weight: bold;
        border: 1px solid var(--primary-color);
    }
    h2 {
        margin-top: 0;
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
        color: var(--primary-color);
    }
    h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: var(--primary-color);
        font-size: 1.1rem;
    }
    .attribute-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .modal-attribute-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .attribute-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background-color: #2a2e2f;
        border-radius: 4px;
        color: var(--text-color);
    }
    .attribute-item-ctrl button {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
    .attribute-name {
        font-weight: 600;
        color: var(--primary-color);
    }
    .attribute-value {
        color: var(--text-color);
        font-weight: 700;
    }
    .strain-display {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: var(--secondary-color);
        border-radius: 6px;
        font-size: 1.25rem;
        color: var(--primary-color);
        margin-bottom: 1.5rem;
    }
    .strain-value {
        font-weight: 900;
    }
    .strain-low {
        color: #00ff2f
    }
    .strain-moderate {
        color: #f2ff00
    }
    .strain-high {
        color: #ff0000
    }

    .events-section {
        background-color: #2a2e2f;
        padding: 1rem;
        border-radius: 6px;
        
    }

    .event-btn {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
    }
    
    .btn-group {
        display: flex;
        gap: 0.5rem;
        align-items: stretch;
        
    }
    
    .btn-group .generate-btn {
        flex: 1;
    }

    .btn-group .display-btn {
        flex: 1;
    }
    
    

    .generate-btn.has-event {
        background-color: var(--pf-yellow);
        border-color: var(--pf-yellow);
        border: 1px solid var(--pf-yellow);
    }

    .generate-btn.has-event:hover {
        background-color: var(--bg-color);
        color: var(--pf-yellow);
        
    }
    
    .display-btn {
        background-color: #4a5152;
        border-color: #4a5152;
        border: 1px solid var(--secondary-color);
        color: var(--text-color);
        padding: 0.6rem 1rem;
        font-size: 0.95rem;
    }

    .display-btn:hover {
        background-color: var(--bg-color);
        color: var(--primary-color);
        border-color: var(--secondary-color);
    }

    .display-btn.active-display {
        background-color: var(--secondary-color);
        border-color: var(--secondary-color);
        color: var(--primary-color);
    }

    .display-btn.active-display:hover {
        background-color: var(--secondary-color);
        border-color: var(--secondary-color);
        color: var(--primary-color);
    }

    

    .generate-btn:hover {
        background-color: var(--bg-color);
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
    }

    .attribute-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    h2 {
    display: block;
    font-size: 1.5em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
    }

    h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
}
    
    @media (max-width: 480px) {
        .attribute-list {
            grid-template-columns: 1fr;
        }
        .strain-display {
            flex-direction: column;
            gap: 1rem;
        }
        .attribute-item {
            flex-direction: column;
            
        }
        .attribute-item button {
            margin-top: 1rem;
            width: 1rem;
            
        }
        
    }
</style>