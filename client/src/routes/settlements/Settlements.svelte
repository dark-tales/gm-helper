<script>
    import { onMount } from 'svelte'
    import {fade, fly, slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"
    import {sineIn} from "svelte/easing"
    import SettlementStats from './SettlementStats.svelte'
    import EventHistory from './EventHistory.svelte'
    import OnGoingHistory from './OnGoingHistory.svelte'
    import EventCard from './EventCard.svelte'
	import OpportunityCard from './OpportunityCard.svelte'
	import DilemmaCard from './DilemmaCard.svelte'
	import RumorCard from './RumorCard.svelte';
    import ModalEndTurn from './ModalEndTurn.svelte'
    import { PUBLIC_API_URL } from '$env/static/public'
    import ModalGenerateSettlement from './ModalGenerateSettlement.svelte'
    
    let allSettlement = $state([])
    let selectedRegion = $state(null)
    let currentSettlement = $state(null)
    let currentEvent = $state("")
    let showGenerateModal = $state(false)
    
    // Separate storage for each event type
    let storedAutoEvent = $state(null)
    let storedOpportunity = $state(null)
    let storedDilemma = $state(null)
    let storedRumor = $state(null)
    let activeEventType = $state(null) // Track which event type is currently displayed
    
    let eventsHistory = $state([])
    let onGoingHistory = $state([])
    let currentOnGoing = $state({})
    let address = $state("")
    let isMainNavOpen = $state(false)
    let isSecNavOpen = $state(false)
    let showEditModal = $state(false)

    onMount(async () => {
    await fetchAllSettlement()
    // Small delay to allow the slide animation to play
    setTimeout(() => {
        isMainNavOpen = true
    }, 1)
    })

    // Function to fetch all settlement data
    async function fetchAllSettlement() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/settlements`);
            if (!res.ok) throw new Error('Failed to fetch settlement data');
            const data = await res.json();
            allSettlement = data;
        } catch (error) {
            console.error(error);
        }
    }

    // Function to generate a new automatic event by fetching a random template
    async function generateAutoEvent(type) {
        if(type === "Auto") {
            address = `${PUBLIC_API_URL}/api/events/random/${currentSettlement.strainLevel}`
        } else if (type === "Opportunity") {
            address = `${PUBLIC_API_URL}/api/opportunity/random/${currentSettlement.strainLevel}`
        } else if (type === "Dilemma") {
            address = `${PUBLIC_API_URL}/api/dilemma/random/${currentSettlement.strainLevel}`
        } else if (type === "Rumor") {
            address = `${PUBLIC_API_URL}/api/rumor/random`
        }
        const eventStrainLevel = currentSettlement.strainLevel;
        try {
            // Fetch a random event template based on the current strain
            const templateRes = await fetch(address);
            if (!templateRes.ok) throw new Error('Failed to fetch a random event template');
            const fetchedEvent = await templateRes.json();
            
            // Store the event in the appropriate variable based on type
            if (type === "Auto") {
                storedAutoEvent = fetchedEvent;
            } else if (type === "Opportunity") {
                storedOpportunity = fetchedEvent;
            } else if (type === "Dilemma") {
                storedDilemma = fetchedEvent;
            } else if (type === "Rumor") {
                storedRumor = fetchedEvent;
            }
            
            console.log(`${type} event generated and stored`);
        } catch (error) {
            console.error('Error generating event:', error);
            const errorEvent = {
                title: 'Error Generating Event',
                description: 'An error occurred while trying to generate a new event. Please check the server logs.',
                type: 'error'
            };
            
            // Store error in the appropriate variable
            if (type === "Auto") {
                storedAutoEvent = errorEvent;
            } else if (type === "Opportunity") {
                storedOpportunity = errorEvent;
            } else if (type === "Dilemma") {
                storedDilemma = errorEvent;
            } else if (type === "Rumor") {
                storedRumor = errorEvent;
            }
        }
    }

    // Function to display a stored event
    function displayEvent(type) {
        if (type === "Auto" && storedAutoEvent) {
            currentEvent = storedAutoEvent;
            activeEventType = "Auto";
        } else if (type === "Opportunity" && storedOpportunity) {
            currentEvent = storedOpportunity;
            activeEventType = "Opportunity";
        } else if (type === "Dilemma" && storedDilemma) {
            currentEvent = storedDilemma;
            activeEventType = "Dilemma";
        } else if (type === "Rumor" && storedRumor) {
            currentEvent = storedRumor;
            activeEventType = "Rumor";
        } else {
            console.warn(`No ${type} event has been generated yet`);
        }
    }

    // Function to apply event effects to the current settlement
    function applyEventEffects() {
    if (!currentEvent || !currentEvent.effects || !currentSettlement) {
        console.warn('No current event, effects, or settlement to apply effects to');
        return;
    }
    // Create a copy of the current settlement to avoid direct mutation issues
    const updatedSettlement = { ...currentSettlement };
    updatedSettlement.attributes = { ...currentSettlement.attributes };
    // Apply each effect to the corresponding attribute
    currentEvent.effects.forEach(effect => {
        const attributeName = effect.attribute.toLowerCase();
        const changeValue = parseInt(effect.change) || 0;
        // Check if the attribute exists in the settlement
        if (updatedSettlement.attributes.hasOwnProperty(attributeName)) {
            const currentValue = updatedSettlement.attributes[attributeName];
            const newValue = currentValue + changeValue;
            
            // Optional: Clamp values between 0 and 20 (typical range for settlement attributes)
            updatedSettlement.attributes[attributeName] = Math.max(0, Math.min(20, newValue));
            
            console.log(`Applied ${changeValue} to ${attributeName}: ${currentValue} → ${updatedSettlement.attributes[attributeName]}`);
        } else {
            console.warn(`Attribute '${attributeName}' not found in settlement attributes`);
        }
    });   
    // Create a new history entry with event details and the current date
    const historyEntry = {
        title: currentEvent.title,
        description: currentEvent.description,
        type: currentEvent.type,
        effects: currentEvent.effects,
        createdAt: new Date().toISOString()
    };
    // Create a copy of the history array and prepend the new entry
    updatedSettlement.history = [historyEntry, ...updatedSettlement.history]
    console.log("Event succesfully added to history")
    // Update the settlement state
    currentSettlement = updatedSettlement;
    // Delete the event and clear stored reference
    deleteEvent("events")
    storedAutoEvent = null;
    currentEvent = ""
    activeEventType = null;
    console.log('Event effects applied successfully')
    }

    // Function to apply rumor effects to the current settlement
    function applyRumorEffects() {
    if (!currentEvent || !currentSettlement) {
        console.warn('No current event, effects, or settlement to apply effects to');
        return;
    }
    // Create a copy of the current settlement to avoid direct mutation issues
    const updatedSettlement = { ...currentSettlement };
    
    // Create a new history entry with event details and the current date
    const historyEntry = {
        title: currentEvent.title,
        description: currentEvent.description,
        type: currentEvent.type,
        eventType: currentEvent.eventType,
        contact: currentEvent.contact,
        contactMotivation: currentEvent.contactMotivation,
        locationType : currentEvent.locationType,
        specificLocation : currentEvent.specificLocation,
        believability : currentEvent.believability,
        twist : currentEvent.twist,
        effects: currentEvent.effects,
        createdAt: new Date().toISOString()
    };
    // Create a copy of the history array and prepend the new entry
    updatedSettlement.history = [historyEntry, ...updatedSettlement.history]
    console.log("Event succesfully added to history")
    // Update the settlement state
    currentSettlement = updatedSettlement;
    // Delete the event and clear stored reference
    deleteEvent("rumor")
    storedRumor = null;
    currentEvent = ""
    activeEventType = null;
    console.log('Event effects applied successfully')
    }

    // Function to apply dilemma effects to the current settlement
    function applyDilemmaEffects(choice) {
    
    // Create a copy of the current settlement to avoid direct mutation issues
    const updatedSettlement = { ...currentSettlement };
    updatedSettlement.attributes = { ...currentSettlement.attributes };
    // Apply each effect to the corresponding attribute
    if(choice === "choice1") {
        currentEvent.choice1.effects.forEach(effect => {
            const attributeName = effect.attribute.toLowerCase();
            const changeValue = parseInt(effect.change) || 0;
            // Check if the attribute exists in the settlement
            if (updatedSettlement.attributes.hasOwnProperty(attributeName)) {
                const currentValue = updatedSettlement.attributes[attributeName];
                const newValue = currentValue + changeValue;
                
                // Optional: Clamp values between 0 and 20 (typical range for settlement attributes)
                updatedSettlement.attributes[attributeName] = Math.max(0, Math.min(20, newValue));
                
                console.log(`Applied ${changeValue} to ${attributeName}: ${currentValue} → ${updatedSettlement.attributes[attributeName]}`);
            } else {
                console.warn(`Attribute '${attributeName}' not found in settlement attributes`);
            }
        })
        // Create a new history entry with event details and the current date
        const historyEntry = {
        title: currentEvent.title,
        description: currentEvent.choice1.description,
        type: currentEvent.type,
        effects: currentEvent.choice1.effects,
        createdAt: new Date().toISOString()
        }
        // Create a copy of the history array and prepend the new entry
        updatedSettlement.history = [historyEntry, ...updatedSettlement.history]
        console.log("Event succesfully added to history")
        // Update the settlement state
        currentSettlement = updatedSettlement;
        // Delete the event and clear stored reference
        deleteEvent("dilemma")
        storedDilemma = null;
        currentEvent = ""
        activeEventType = null;
        console.log('Event effects applied successfully')
    }   if(choice === "choice2") {
        currentEvent.choice2.effects.forEach(effect => {
            const attributeName = effect.attribute.toLowerCase();
            const changeValue = parseInt(effect.change) || 0;
            // Check if the attribute exists in the settlement
            if (updatedSettlement.attributes.hasOwnProperty(attributeName)) {
                const currentValue = updatedSettlement.attributes[attributeName];
                const newValue = currentValue + changeValue;
                
                // Optional: Clamp values between 0 and 20 (typical range for settlement attributes)
                updatedSettlement.attributes[attributeName] = Math.max(0, Math.min(20, newValue));
                
                console.log(`Applied ${changeValue} to ${attributeName}: ${currentValue} → ${updatedSettlement.attributes[attributeName]}`);
            } else {
                console.warn(`Attribute '${attributeName}' not found in settlement attributes`);
            }
        })
        // Create a new history entry with event details and the current date
        const historyEntry = {
        title: currentEvent.title,
        description: currentEvent.choice2.description,
        type: currentEvent.type,
        effects: currentEvent.choice2.effects,
        createdAt: new Date().toISOString()
        }
        // Create a copy of the history array and prepend the new entry
        updatedSettlement.history = [historyEntry, ...updatedSettlement.history]
        console.log("Event succesfully added to history")
        // Update the settlement state
        currentSettlement = updatedSettlement;
        // Delete the event and clear stored reference
        deleteEvent("dilemma")
        storedDilemma = null;
        currentEvent = ""
        activeEventType = null;
        console.log('Event effects applied successfully')
    }}

    // Function to apply opportunity effects to the current settlement
    async function applyOpportunityEffects() {
    if (!currentEvent || !currentEvent.effects || !currentSettlement) {
        console.warn('No current event, effects, or settlement to apply effects to');
        return;
    }
    // Create a copy of the current settlement to avoid direct mutation issues
    const updatedSettlement = { ...currentSettlement };
    updatedSettlement.attributes = { ...currentSettlement.attributes };
    // Apply each effect to the corresponding attribute
    currentEvent.cost.forEach(cost => {
        const attributeName = cost.attribute.toLowerCase();
        const changeValue = parseInt(cost.change) || 0;
        // Check if the attribute exists in the settlement
        if (updatedSettlement.attributes.hasOwnProperty(attributeName)) {
            const currentValue = updatedSettlement.attributes[attributeName];
            const newValue = currentValue + changeValue;
            
            // Optional: Clamp values between 0 and 20 (typical range for settlement attributes)
            updatedSettlement.attributes[attributeName] = Math.max(0, Math.min(20, newValue));
            
            console.log(`Applied ${changeValue} to ${attributeName}: ${currentValue} → ${updatedSettlement.attributes[attributeName]}`);
        } else {
            console.warn(`Attribute '${attributeName}' not found in settlement attributes`);
        }
    });   
    // Create a new history entry with ongoing event details and the current date
    const ongoingEntry = {
        title: currentEvent.title,
        description: currentEvent.description,
        type: currentEvent.type,
        status: currentEvent.status,
        cost: currentEvent.cost,
        effects: currentEvent.effects,
        skillCheck: currentEvent.skillCheck,
        successToComplete: currentEvent.successToComplete,
        currentSuccess: currentEvent.currentSuccess,
        roundRemaining: currentEvent.roundRemaining,
        roundTotal: currentEvent.roundTotal,
        createdAt: new Date().toISOString()
    };
    // Create a copy of the history array and prepend the new entry
    updatedSettlement.onGoing = [ongoingEntry, ...updatedSettlement.onGoing]
    console.log("Opportunity succesfully added to ongoing event")
    // Update the settlement state
    currentSettlement = updatedSettlement;
    // Delete the event and clear stored reference
    deleteEvent("opportunity")
    storedOpportunity = null;
    currentEvent = ""
    activeEventType = null;
    console.log('Opportunity effects applied successfully')
    }

    // Function to update the ongoing state from the child
    function handleSelectOngoing(completedOpportunityData) {
        currentOnGoing = completedOpportunityData
    }

    // Function to complete an opportunity, adds effects to the current settlement and event history
    function completeOpportunityEffects(operator) {
    if (!currentOnGoing || !currentSettlement) {
        console.warn('No current ongoing event, effects, or settlement to apply effects to');
        return;
    }
    
    // Create a copy of the current settlement to avoid direct mutation issues
    const updatedSettlement = { ...currentSettlement };
    updatedSettlement.attributes = { ...currentSettlement.attributes };
    
    if (operator === "win") {
        // Apply each effect to the corresponding attribute
        currentOnGoing.effects.forEach(effects => {
            const attributeName = effects.attribute.toLowerCase();
            const changeValue = parseInt(effects.change) || 0;
            // Check if the attribute exists in the settlement
            if (updatedSettlement.attributes.hasOwnProperty(attributeName)) {
                const currentValue = updatedSettlement.attributes[attributeName];
                const newValue = currentValue + changeValue;
                // Optional: Clamp values between 0 and 20 (typical range for settlement attributes)
                updatedSettlement.attributes[attributeName] = Math.max(0, Math.min(20, newValue));
                console.log(`Applied ${changeValue} to ${attributeName}: ${currentValue} → ${updatedSettlement.attributes[attributeName]}`);
            } else {
                console.warn(`Attribute '${attributeName}' not found in settlement attributes`);
            }
        })   
    }
    

    // Create a new history entry with ongoing event details and the current date
    const historyEntry = {
        title: currentOnGoing.title,
        description: currentOnGoing.description,
        type: currentOnGoing.type,
        status: currentOnGoing.status,
        cost: currentOnGoing.cost,
        effects: currentOnGoing.effects,
        skillCheck: currentOnGoing.skillCheck,
        successToComplete: currentOnGoing.successToComplete,
        currentSuccess: currentOnGoing.currentSuccess,
        roundRemaining: currentOnGoing.roundRemaining,
        roundTotal: currentOnGoing.roundTotal,
        createdAt: new Date().toISOString()
    }
    // Create a copy of the history array and prepend the new entry
    updatedSettlement.history = [historyEntry, ...updatedSettlement.history]
    console.log("Opportunity succesfully added to event history")
    // Update the settlement state
    currentSettlement = updatedSettlement;
    // // Add the resolved event to history
    currentOnGoing = {}
    console.log('Opportunity effects applied successfully')    
    }

    // Delete current Event by ID
    async function deleteEvent(type) {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/${type}/${currentEvent._id}`, {method: "DELETE"})
            console.log("Event deleted successfully!")
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // On mount fetch all settlements
    onMount(async () => {
        await fetchAllSettlement() 
        
    })

    // End turn and save current Settlement
    async function endTurn() {
    handleEdit()
    if (!currentSettlement || !currentSettlement._id) {
        console.error("Cannot end turn: No settlement selected or missing ID.");
        return;
    }
    // Send the PATCH request to the server
    try {
        const res = await fetch(`${PUBLIC_API_URL}/api/settlements/${currentSettlement._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            // The currentSettlement object contains all the latest updates
            body: JSON.stringify(currentSettlement),
        });

        if (!res.ok) {
            // Throw an error if the server response is not 2xx
            const errorData = await res.json();
            throw new Error(`Failed to save settlement. Status: ${res.status}. Error: ${errorData.message || 'Unknown error'}`);
        }

        const updatedData = await res.json();
        console.log("Settlement saved successfully.");

        // Clear current state and switch nav back to main menu
        currentSettlement = null;
        currentEvent = "";
        storedAutoEvent = null;
        storedOpportunity = null;
        storedDilemma = null;
        storedRumor = null;
        activeEventType = null;
        currentOnGoing = {};
        isSecNavOpen = false;
        isMainNavOpen = true;
        
        // Re-fetch all settlements to update the list on the main page
        await fetchAllSettlement();

    } catch (error) {
        console.error("Error during End Turn/Save:", error);
        alert("Failed to save the settlement! Check console for details.");
    }

    }

    // Function to open the edit modal
    function handleEdit() {
        showEditModal = showEditModal === false ? true : false
    }

    let settlementsByRegion = $derived(
    allSettlement.reduce((acc, settlement) => {
        const r = settlement.region ?? "Unknown"
        if (!acc[r]) acc[r] = []
        acc[r].push(settlement)
        return acc;
    }, {})
    )

    
</script>

<main>
    {#if isMainNavOpen === true}
        <!-- REGION BUTTON ROW -->
        <div class="region-nav" in:slide={{axis:"y", duration: 300, easing: sineOut}}>
            <div>
                {#each Object.entries(settlementsByRegion) as [region, settlements]}
                    <button
                        onclick={() => selectedRegion = region}
                        class="{selectedRegion === region ? 'button-nav' : 'button-dark'}"
                    >
                        {region}
                    </button>
                    {/each}
                </div>
                <div><button onclick={() => showGenerateModal = true}>Generate Settlement</button></div>
            </div>
            
            <ModalGenerateSettlement show={showGenerateModal} allSettlement={allSettlement} fetchAllSettlement={fetchAllSettlement} onClose={() => showGenerateModal = false}> </ModalGenerateSettlement>
         
        <!-- SETTLEMENTS BELOW THE ROW -->
        {#if selectedRegion}
            <div class="settlement-nav" in:slide={{axis:"y", duration: 300, easing: sineOut}} out:slide={{axis:"y", duration: 200, easing: sineOut}}>
                {#key selectedRegion}
                    {#each settlementsByRegion[selectedRegion] as settlement}
                        <button onclick={() => {
                            currentSettlement = settlement;
                            currentEvent = "";
                            storedAutoEvent = null;
                            storedOpportunity = null;
                            storedDilemma = null;
                            storedRumor = null;
                            activeEventType = null;
                            isMainNavOpen = false;
                            isSecNavOpen = true;
                        }}>
                            {settlement.title}
                        </button>
                    {/each}
                {/key}
            </div>
        {/if}
    {/if}

    {#if isSecNavOpen === true}
        <div class="secondary-settlement-nav" in:slide={{axis:"y", duration: 300, easing: sineOut}}>
            <button onclick={() => { 
                isMainNavOpen = true;
                isSecNavOpen = false;
                currentSettlement = "";
                currentEvent = "";
                storedAutoEvent = null;
                storedOpportunity = null;
                storedDilemma = null;
                storedRumor = null;
                activeEventType = null;
                selectedRegion = null;
            }}>Back</button>
            <p class="settlement-title">{currentSettlement.title}</p>
            <button onclick={handleEdit}>End Turn</button>
        </div>
    {/if}

    {#if showEditModal}
    <div class="modal-overlay">
        <div class="modal-content">
            <h2>Are you sure you want to end turn?</h2>
            <h2>Please add "{currentSettlement.strainLevel} Strain" condition to players</h2>
            <button onclick={handleEdit}>Close</button>
            <button onclick={endTurn} class="save-btn">End turn</button>
        </div>
    </div>
    {/if}
    
    <div class="container">
        
        {#if currentSettlement}
        <!-- Stats and events section -->
        <div class="stats-and-event" transition:slide={{axis:"y", easing:sineOut}}>
            <!-- Stats section -->
            <SettlementStats
                bind:currentSettlement={currentSettlement}
                {storedAutoEvent}
                {storedOpportunity}
                {storedDilemma}
                {storedRumor}
                {activeEventType}
                onGenerateAuto={() => generateAutoEvent("Auto")}
                onGenerateOpportunity={() => generateAutoEvent("Opportunity")}
                onGenerateDilemma={() => generateAutoEvent("Dilemma")}
                onGenerateRumor={() => generateAutoEvent("Rumor")}
                onDisplayAuto={() => displayEvent("Auto")}
                onDisplayOpportunity={() => displayEvent("Opportunity")}
                onDisplayDilemma={() => displayEvent("Dilemma")}
                onDisplayRumor={() => displayEvent("Rumor")}
            />
            <!-- Events section -->
            <div class="current-event">
                <h2>Current Event</h2>
                {#if currentEvent.type === "Automatic" }
                        <EventCard bind:currentEvent={currentEvent} onResolve={applyEventEffects}/>
                {:else if currentEvent.type === "Opportunity"}
                        <OpportunityCard bind:currentEvent={currentEvent} onResolve={applyOpportunityEffects}/>
                {:else if currentEvent.type === "Dilemma"}
                        <DilemmaCard bind:currentEvent={currentEvent} onResolve={applyDilemmaEffects}/>
                {:else if currentEvent.type === "Rumor"}
                        <RumorCard bind:currentEvent={currentEvent} onResolve={applyRumorEffects}/>
                {:else}
                    <p>No current event. Generate or display an event from the stats panel.</p>
                {/if}
            </div>
        </div>
        <div transition:slide={{axis:"y", easing:sineOut}}>
            <OnGoingHistory bind:currentSettlement={currentSettlement} bind:currentOnGoing={currentOnGoing} onResolve={completeOpportunityEffects} selectOngoing={handleSelectOngoing}/>
            <EventHistory bind:currentSettlement={currentSettlement} />
        </div>
        
        {/if}
    </div>

</main>

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
    

    /* Modal Styles */
    .save-btn {
        background-color: var(--pf-green);
        border-color: var(--pf-green);
        
    }
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: var(--card-bg);
        color: var(--primary-color);
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 600px;
        position: relative;
        max-height: 80vh;
        overflow-y: auto;
    }

    .container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 1264px;
        margin: 0 auto;
        padding-left: 2rem;
        padding-right: 2rem;
        padding-bottom: 2rem;
        
    }
    
    /* h1 {
        font-size: clamp(3rem, 8vw, 7rem);
        font-weight: 900;
        text-align: center;
        color: var(--primary-color);
        margin-bottom: 2rem;
        margin-top: 10%;
    }
    h3 {
        font-size: 2rem;
        font-weight: 400;
        text-align: center;
        color: var(--primary-color);
        margin-top: 6rem;
        margin-bottom: 2rem;
    } */
    .settlement-title {
        font-size: 2rem;
        padding: 0;
        margin: 0;
        font-weight: 700;
    }
    .stats-and-event {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    .current-event {
        background-color: var(--card-bg);
        border-radius: 8px;
        box-shadow: var(--shadow);
        padding: 1.5rem;
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        color: #efd293;
    }
    
    
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .current-event p {
        text-align: center;
        font-style: italic;
        
    }
    
    .current-event h2 {
        margin-top: 0;
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }
    
    button {
        background-color: var(--primary-color);
        color: var(--bg-color);
        border: none;
        padding: 16px;
        margin: 0;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease-out;
        font-weight: bold;
        border: 1px solid var(--primary-color);
    }

    .button-nav {
        background-color: var(--primary-color);
        color: var(--bg-color);
        border: none;
        padding: 16px;
        margin: 0;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease-out;
        font-weight: bold;
        border: 1px solid var(--primary-color);
    }

    .button-dark {
        background-color: var(--bg-color);
        color: var(--primary-color);
        border: none;
        padding: 16px;
        margin: 0;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease-out;
        font-weight: bold;
        border: 1px solid var(--primary-color);
    }

    button:hover {
        background-color: var(--bg-color);
        color: var(--primary-color);
    }
    
    .button-nav:hover {
        background-color: var(--primary-color);
        color: var(--bg-color);
    }

    .button-dark:hover {
        background-color: var(--primary-color);
        color: var(--bg-color);
    }
    
    p {
        color: var(--primary-color);
    }
    .secondary-settlement-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        margin-top: 32px;
        height: 3rem;
        width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }
    .settlement-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    width: 100%;
}

    .settlement-nav button {
        padding: 16px;
    }

    .stats-and-event {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
    }

    /* h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
} */

.region-nav {
    
    display: flex;
    flex-direction: row;  /* horizontal row */
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin: 48px 48px;
}

/* .generate-modal {
    color: #efd293;
} */


.region-nav button {
    margin-right: 32px;
}
    
    @media (max-width: 968px) {
        .stats-and-event {
            grid-template-columns: 1fr;
            justify-content: center;
        }
        .settlement-nav {
            flex-direction: column;
            align-items: stretch;
        }
        h1 {
            font-size: 4rem;
        }
        .settlement-title {
            margin-left: auto;
            margin-right: auto;
        }
        
    }
</style>