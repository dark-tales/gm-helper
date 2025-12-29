<script>
    import {slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"

    let {currentSettlement} = $props()
    let selectedEventId = $state(null)

    // Open history details
    function openHistoryDetails(history) {
        console.log(history.title)
        selectedEventId = selectedEventId === history.title ? null : history.title
        // buildingDetails = history
    }

    function deleteEvent(event) {
        let nameToRemove = event
        let index = currentSettlement.history.findIndex(obj => obj.title === nameToRemove)
        if(index !== -1) {
                currentSettlement.history.splice(index, 1)
            }
    }
</script>

<div class="event-history-container">
    <h2>Event History</h2>
    <div class="event-list">
        {#each currentSettlement.history as h}
            <div class="event-card">
                <div class="single-event-card">
                    <div class="single-event-title">
                        <h3>{h.title}</h3>
                        <span class="event-type">{h.type}</span>
                        {#if h.status}    
                            <span class={h.status === "Success" ? "status-success" : "status-fail"}>{h.status}</span>
                        {/if}
                    </div>
                    <div class="single-event-date">
                        <h4>{h.createdAt.slice(0,10)}</h4>
                        <button onclick={() => openHistoryDetails(h)}>Details</button>
                    </div>
                </div>
                {#if selectedEventId === h.title && h.type === "Automatic"}     
                    <div class="single-event-details" transition:slide={{axis:"y", duration: 150, easing:sineOut}}>
                        <div class="details-grid">
                            <div class="grid-item span-full-row">
                                <p><strong>Description:</strong> {h.description}</p>
                            </div>
                            <div class="grid-item">
                                <p><strong>Effects:</strong></p>
                                <ul>
                                    {#each h.effects as he }
                                        <li>{he.attribute} {he.change > 0 ? '+' : ''}{he.change}</li>
                                    {/each}
                                </ul>
                            </div>
                            <button class="delete" onclick={() => deleteEvent(selectedEventId)}>Delete</button>
                        </div>
                    </div>
                {/if}
                {#if selectedEventId === h.title && h.type === "Opportunity"}     
                    <div class="single-event-details" transition:slide={{axis:"y", duration: 150, easing:sineOut}}>
                        <div class="details-grid">
                            <div class="grid-item span-full-row">
                                <p><strong>Description:</strong> {h.description}</p>
                            </div>
                            <div class="opportunity-details-grid">
                                <div class="grid-item">
                                    <p><strong>Cost:</strong></p>
                                    <ul>
                                        {#each h.cost as hc }
                                            <li>{hc.attribute} {hc.change > 0 ? '+' : ''}{hc.change}</li>
                                        {/each}
                                    </ul>
                                </div>
                                
                                <div class="grid-item">
                                    <p><strong>Effects:</strong></p>
                                    <ul>
                                        {#each h.effects as he }
                                            <li>{he.attribute} {he.change > 0 ? '+' : ''}{he.change}</li>
                                        {/each}
                                    </ul>
                                </div>
                                
                                <div class="grid-item">
                                    <p><strong>Skill Check:</strong></p>
                                    <ul>
                                        {#each h.skillCheck as hs }
                                            <li><strong>Easy:</strong> {hs.easy}</li>
                                            <li><strong>Medium:</strong> {hs.medium}</li>
                                            <li><strong>Hard:</strong> {hs.hard}</li>
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="stats-grid">
                                <div class="grid-item">
                                    <p><strong>Success to Complete: </strong> {h.successToComplete}</p>
                                </div>
                                <div class="grid-item">
                                    <p><strong>Rounds Remaining: </strong> {h.roundRemaining}</p>
                                </div>
                            </div>
                            <button class="delete" onclick={() => deleteEvent(selectedEventId)}>Delete</button>
                        </div>
                    </div>
                {/if}
                {#if selectedEventId === h.title && h.type === "Dilemma"}     
                    <div class="single-event-details" transition:slide={{axis:"y", duration: 150, easing:sineOut}}>
                        <div class="details-grid">
                            <div class="grid-item span-full-row">
                                <p><strong>Description:</strong> {h.description}</p>
                            </div>
                            <div class="grid-item">
                                <p><strong>Effects:</strong></p>
                                <ul>
                                    {#each h.effects as he }
                                        <li>{he.attribute} {he.change > 0 ? '+' : ''}{he.change}</li>
                                    {/each}
                                </ul>
                            </div>
                            <button class="delete" onclick={() => deleteEvent(selectedEventId)}>Delete</button>
                        </div>
                    </div>
                {/if}
                {#if selectedEventId === h.title && h.type === "Rumor"}     
                    <div class="single-event-details" transition:slide={{axis:"y", duration: 150, easing:sineOut}}>
                        <div class="details-grid">
                            <div class="grid-item span-full-row">
                                <p><strong>Description:</strong> {h.description}</p>
                            </div>
                            <div class="stats-grid">
                                
                                <div class="grid-item">
                                    <p><strong>Event Type: </strong> {h.eventType}</p>
                                </div>
                                <div class="grid-item">
                                    <p><strong>Contact: </strong> {h.contact}</p>
                                </div>
                            </div>
                            <div class="grid-item span-full-row">
                                <p><strong>Contact Motivation: </strong> {h.contactMotivation}</p>                               
                            </div>
                            <div class="opportunity-details-grid">
                                <div class="grid-item">
                                    <p><strong>Location Type: </strong> {h.locationType}</p>
                                </div>
                                <div class="grid-item">
                                    <p><strong>Specific Location: </strong> {h.specificLocation}</p>
                                </div>
                                <div class="grid-item">
                                    <p><strong>Believability: </strong> {h.believability}</p>
                                </div>
                            </div>
                            <div class="grid-item span-full-row">
                                <p><strong>Twist: </strong> {h.twist}</p>                               
                            </div>
                            <button class="delete" onclick={() => deleteEvent(selectedEventId)}>Delete</button>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <p>No events have occurred yet.</p>
        {/each}
    </div>
</div>

<style>
    .delete {
        background-color: #660000;
        border: 2px solid var(--card-bg);
        color: var(--primary-color);
        width: 31.5%;
    }
    .event-history-container {
        background-color: var(--card-bg);
        border-radius: 8px;
        box-shadow: var(--shadow);
        padding: 1.5rem;
        border: 1px solid var(--border-color);
        color: var(--primary-color);
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
        background-color: #2a2e2f;
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
    p {
        margin-bottom: 0;
    }
    /* New Grid Styling */
    .details-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .grid-item {
        background-color: var(--card-bg);
        padding: 1rem;
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
    }

    .span-full-row {
        grid-column: 1 / -1;
    }

    .opportunity-details-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* Two equal columns for cost and effects */
        gap: 1.5rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }
    .status-success {
        display: inline-block;
        background-color: var(--secondary-color);
        margin-left: 1rem;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    .status-fail {
        display: inline-block;
        background-color: #660000;
        margin-left: 1rem;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .single-event-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        .single-event-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
    }
</style>