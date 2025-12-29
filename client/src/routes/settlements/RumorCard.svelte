<script>
    import { onMount } from 'svelte'

    let {currentEvent, onResolve} = $props()
    let showEditModal = $state(false)

    // Function to open the edit modal
    function handleEdit() {
        showEditModal = true
    }

    // Function to close the edit modal
    function handleCloseModal() {
        showEditModal = false;
    }

    // Function to handle saving the edited event (dummy for now)
    function handleSave() { 
        // In a real application, you'd send the updated data to your backend here.
        console.log("Saving updated event:", currentEvent);
        showEditModal = false; 
    }
      
    function handleResolve() {
        if (onResolve) {
            onResolve()
        }
    }
</script>

<div class="event-card">
    <div class="header-section">
        <h3>{currentEvent.title}</h3>
    </div>
    <p class="description-text">{currentEvent.description}</p>
    
    <div class="opportunity-details-grid">
        <div class="grid-item">
            <p><strong>Event Type:</strong> {currentEvent.eventType}</p>
        </div>
        
        <div class="grid-item">
            <p><strong>Location Type:</strong> {currentEvent.locationType}</p>
        </div>
        
        <div class="grid-item span-full-row">
            <p><strong>Specific Location:</strong> {currentEvent.specificLocation}</p>
        </div>
    </div>
    
    <div class="opportunity-details-grid">
        <div class="grid-item span-full-row">
            <p><strong>Contact:</strong> {currentEvent.contact}</p>
        </div>

        <div class="grid-item span-full-row">
            <p><strong>Contact Motivation:</strong> {currentEvent.contactMotivation}</p>
        </div>

        <div class="grid-item">
            <p><strong>Believability:</strong> {currentEvent.believability}</p>
        </div>
        
        <div class="grid-item">
            <p><strong>Twist:</strong> {currentEvent.twist}</p>
        </div>
    </div>

    {#if currentEvent.effects && currentEvent.effects.length > 0}
        <div class="opportunity-details-grid">
            <div class="grid-item span-full-row">
                <p><strong>Effects:</strong></p>
                <ul>
                    {#each currentEvent.effects as effect}
                        <li>{effect.attribute}: {effect.change > 0 ? '+' : ''}{effect.change}</li>
                    {/each}
                </ul>
            </div>
        </div>
    {/if}
    
    <div class="event-actions">
        <button onclick={handleEdit} class="edit-button">Edit Event</button>
        <button onclick={handleResolve} class="resolve-button">Resolve Event</button>
    </div>
</div>

{#if showEditModal}
    <div class="modal-overlay">
        <div class="modal-content">
            <h3>Edit Event</h3>
            <form onsubmit={handleSave}>
                <label>
                    Title:
                    <input type="text" bind:value={currentEvent.title} />
                </label>
                <label>
                    Description:
                    <textarea bind:value={currentEvent.description}></textarea>
                </label>
                <label>
                    Event Type:
                    <select name="type" id="type" bind:value={currentEvent.eventType}>
                        <option value="Treasure Hunt">Treasure Hunt</option>
                        <option value="Social / Political Intrigue">Social / Political Intrigue</option>
                        <option value="Exploration">Exploration</option>
                        <option value="Bounty / Monster Hunt">Bounty / Monster Hunt</option>
                    </select>
                </label>
                <label>
                    Contact:
                    <textarea bind:value={currentEvent.contact}></textarea>
                </label>
                <label>
                    Contact Motivation:
                    <textarea bind:value={currentEvent.contactMotivation}></textarea>
                </label>
                <label>
                    Location Type:
                    <select name="type" id="type" bind:value={currentEvent.locationType}>
                        <option value="Specific NPC Property">Specific NPC Property</option>
                        <option value="Dangerous Dungeon / Ruin">Dangerous Dungeon / Ruin</option>
                        <option value="Generic Locale">Generic Locale</option>
                        <option value="Unique Geographical Feature">Unique Geographical Feature</option>
                    </select>
                </label>
                <label>
                    Specific Location:
                    <textarea bind:value={currentEvent.specificLocation}></textarea>
                </label>
                <label>
                    Believability:
                    <select name="type" id="type" bind:value={currentEvent.believability}>
                        <option value="Completely False">Completely False</option>
                        <option value="Partially True">Partially True</option>
                        <option value="Completely True">Completely True</option>
                    </select>
                </label>
                <label>
                    Twist:
                    <textarea bind:value={currentEvent.twist}></textarea>
                </label>
                
                
                <div class="modal-actions">
                    <button type="button" onclick={handleCloseModal}>Cancel</button>
                    <button type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    /* Global Card Structure */
    .event-card {
        background-color: var(--card-bg);
        border-radius: 8px;
        box-shadow: var(--shadow);
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid var(--border-color);
        color: var(--primary-color);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    /* Header Section Styling */
    .header-section {
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }

    .header-section h3 {
        margin: 0;
    }
    
    .description-text {
        margin-bottom: 0;
        margin-top: 0;
    }

    /* Grid Layout for Details (re-using the target's class name) */
    .opportunity-details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two equal columns */
        gap: 1rem; /* Reduced gap slightly for details */
    }
    
    /* Individual Detail Boxes */
    .grid-item {
        background-color: #2a2e2f; /* Dark background for detail boxes */
        padding: 1rem;
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
    }
    
    .span-full-row {
        grid-column: 1 / -1; /* Spans the full width of the grid */
    }

    .grid-item p {
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-size: 0.95rem; /* Slightly smaller text for detail paragraphs */
    }
    
    .grid-item strong {
        color: var(--primary-color);
    }
    
    .grid-item ul {
        list-style-type: none;
        padding-left: 0;
        margin: 0;
    }
    
    .grid-item li {
        margin-bottom: 0.25rem;
    }
    
    /* Action Button Section */
    .event-actions {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }
    
    button {
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
    
    button:hover {
        background-color: var(--bg-color);
        color: var(--primary-color);
    }

    /* Modal Styles (Copied from the target component) */
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
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 600px;
        position: relative;
        max-height: 80vh;
        overflow-y: auto;
    }

    .modal-content form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .modal-content label {
        display: flex;
        flex-direction: column;
        font-weight: bold;
    }

    .modal-content input, .modal-content textarea, .modal-content select {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        background-color: #333;
        color: white;
        margin-top: 0.5rem;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    /* Grid Layout for Details (re-using the target's class name) */
    .opportunity-details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two equal columns */
        gap: 1rem; /* Reduced gap slightly for details */
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
        .opportunity-details-grid {
            grid-template-columns: 1fr;
        }
    }
</style>