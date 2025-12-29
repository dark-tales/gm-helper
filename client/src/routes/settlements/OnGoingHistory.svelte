<script>
    import {slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"

    let {currentSettlement, onResolve, selectOngoing} = $props()
    let selectedEventId = $state(null)

    // Open history details
    function openHistoryDetails(history) {
        selectedEventId = selectedEventId === history.title ? null : history.title
        selectOngoing(history)
    }

    // Function launched when Opportunity is resolved
    function handleResolve(operator, event) {
        let nameToRemove = event
        let index = currentSettlement.onGoing.findIndex(obj => obj.title === nameToRemove)
        if (onResolve) {
            onResolve(operator);
            if(index !== -1) {
                currentSettlement.onGoing.splice(index, 1)
            }
            
        }       
    }

    // Function to modify success value of a specific event
    function modifySuccess(eventId, operator) {
        // Find the event in the array using its title (ID)
        const eventToUpdate = currentSettlement.onGoing.find(event => event.title === eventId)
        if (eventToUpdate) {
            if (operator === "add") {
                eventToUpdate.currentSuccess += 1
            } else if (operator === "remove") {
                if (eventToUpdate.currentSuccess > 0) {
                    eventToUpdate.currentSuccess -= 1
                }
            }
            if (eventToUpdate.currentSuccess === eventToUpdate.successToComplete) {
                eventToUpdate.status = "Success"
                console.log
                handleResolve("win", eventId)
            } 
        }
    }

    // Function to modify success value of a specific event
    function modifyRound(eventId, operator) {
        // Find the event in the array using its title (ID)
        const eventToUpdate = currentSettlement.onGoing.find(event => event.title === eventId)
        if (eventToUpdate) {
            if (operator === "add") {
                eventToUpdate.roundRemaining += 1
            } else if (operator === "remove") {
                if (eventToUpdate.roundRemaining > 0) {
                    eventToUpdate.roundRemaining -= 1
                }
            }
        }
        if (eventToUpdate.roundRemaining === 0) {
                eventToUpdate.status = "Failure"
                handleResolve("lost", eventId)
            }
    }

</script>

<div class="opportunity-history-container">
    <h2>Ongoing Event</h2>
    <div class="event-list">
        {#each currentSettlement.onGoing as o}
            <div class="event-card">
                <div class="single-event-card">
                    <div class="single-event-title">
                        <h3>{o.title}</h3>
                        <span class="event-type">{o.type}</span>
                        <span class="status-ongoing">{o.status}</span>
                    </div>
                    <div class="single-event-date">
                        <h4>{o.createdAt.slice(0,10)}</h4>
                        <button onclick={() => openHistoryDetails(o)}>Details</button>
                    </div>
                </div>
                {#if selectedEventId === o.title}
                    <div class="single-event-details" transition:slide={{axis:"y", duration: 150, easing:sineOut}}>
                        <div class="details-grid">
                            <div class="grid-item description-item">
                                <p><strong>Description:</strong> {o.description}</p>
                            </div>
                            
                            <div class="grid-item">
                                <p><strong>Cost:</strong></p>
                                <ul>
                                    {#each o.cost as oc }
                                        <li>{oc.attribute} {oc.change > 0 ? '+' : ''}{oc.change}</li>
                                    {/each}
                                </ul>
                            </div>
                            
                            <div class="grid-item">
                                <p><strong>Effects:</strong></p>
                                <ul>
                                    {#each o.effects as oe }
                                        <li>{oe.attribute} {oe.change > 0 ? '+' : ''}{oe.change}</li>
                                    {/each}
                                </ul>
                            </div>
                            
                            <div class="grid-item skill-check-item">
                                <p><strong>Skill Check:</strong></p>
                                <ul>
                                    {#each o.skillCheck as sc }
                                        <li><strong>Easy:</strong> {sc.easy}</li>
                                        <li><strong>Medium:</strong> {sc.medium}</li>
                                        <li><strong>Hard:</strong> {sc.hard}</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>

                        <div class="success-round-container">
                            <div class="grid-item success-item">
                                <p><strong>Current Success:</strong> {o.currentSuccess}</p>
                                <p><strong>Success to Complete:</strong> {o.successToComplete}</p>
                                <div class="buttons-container">
                                    <button onclick={() => modifySuccess(selectedEventId, "add")}>Add Success</button>
                                    <button onclick={() => modifySuccess(selectedEventId, "remove")}>Remove Success</button>
                                </div>
                            </div>
                            
                            <div class="grid-item round-item">                                
                                <p><strong>Remaining Rounds:</strong> {o.roundRemaining}</p>
                                <p><strong>Total Rounds:</strong> {o.roundTotal}</p>
                                <div class="buttons-container">
                                    <button onclick={() => modifyRound(selectedEventId, "add")}>Add Round</button>
                                    <button onclick={() => modifyRound(selectedEventId, "remove")}>Remove Round</button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <p>No ongoing events right now.</p>
        {/each}
    </div>
</div>

<style>
    .opportunity-history-container {
        background-color: var(--card-bg);
        border-radius: 8px;
        box-shadow: var(--shadow);
        padding: 1.5rem;
        border: 1px solid var(--border-color);
        color: var(--primary-color);
        margin-bottom: 2rem;
    }
    button {
        background-color: var(--primary-color);
        color: var(--bg-color);
        border: none;
        padding: 0.5rem 0.5rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
        font-weight: bold;
        border: 1px solid var(--primary-color);
    }
    button:hover {
        background-color: var(--bg-color);
        color: var(--primary-color);
    }
    h2 {
        margin-top: 0;
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
        color: var(--primary-color);
    }
    .event-list {
        display: grid;
        gap: 1rem;
    }
    .event-card {
        padding-left: 1rem;
        padding-right: 1rem;
        background-color: #2a2e2f; /* A slightly lighter shade of the card background */
        border-left: 4px solid var(--primary-color);
        border-radius: 4px;
        color: var(--text-color);
    }
    .event-card h3 {
        margin-right: 1rem;
        color: var(--primary-color);
    }
    .event-card h4 {
        margin-right: 1rem;
        color: var(--primary-color);
    }
    .event-card li {
        margin-left: 4rem;
        color: var(--primary-color);
    }
    .event-card p {
        margin-left: 1rem;
        margin-top: 0;
        color: var(--primary-color);
    }
    .single-event-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .single-event-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .single-event-date {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .single-event-details {
        padding-bottom: 1rem;
    }
    .event-type {
        display: inline-block;
        background-color: var(--secondary-color);
        color: var(--text-color);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    .status-ongoing {
        display: inline-block;
        background-color: var(--primary-color);
        margin-left: 1rem;
        color: black;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    .single-event-details {
        padding-bottom: 1rem;
        
    }

    .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
    }

    /* New container for success and rounds */
    .success-round-container {
        display: grid;
        grid-template-columns: 1fr 1fr; /* Two equal columns for success and rounds */
        gap: 1rem;
        margin-top: 1rem; /* Add some space from the details grid */
    }

    .grid-item {
        background-color: var(--card-bg);
        padding: 1rem;
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
    }
    
    .description-item {
        grid-column: 1 / -1; /* Make the description span the full width of the details-grid */
    }
    
    .grid-item p, .grid-item li {
        margin: 0 0 0.5rem 0;
        padding: 0;
        margin-left: 0;
    }
    
    .grid-item ul {
        list-style-type: none;
        padding-left: 0;
    }

    .buttons-container {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
        justify-content: flex-start;
    }
    
    .buttons-container button {
        flex-grow: 1;
    }

    .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
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
    
    
    @media (max-width: 768px) {
        .details-grid {
            grid-template-columns: 1fr;
        }
        
        .event-list {
            display: flex;
            flex-direction: column;
        }
        .success-round-container {
            display: flex;
            flex-direction: column;
        }
        .single-event-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        .single-event-title h3 {
            margin-bottom: 0;
        }
        .single-event-card {
            flex-direction: column;
            align-items: flex-start;
        }
        
        
    }
</style>