<script>
    import { onMount } from 'svelte'

    let {currentEvent, onResolve} = $props()
    let showEditModal = $state(false)
    
    // // Function to handle resolving a moral dilemma event
    // async function handleChoice(choice) {
    //     console.log("Choice selected:", choice);
    // }
    
    // Function to open the edit modal
    function handleEdit() {
        showEditModal = true
    }

    // Function to close the edit modal
    function handleCloseModal() {
        showEditModal = false;
    }

    // Function to handle saving the edited event
    function handleSave() {
        // In a real application, you'd send the updated data to your backend here.
        console.log("Saving updated event:", currentEvent);
        showEditModal = false; 
    }

    function handleResolve() {
        if (onResolve) {
            onResolve();
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
            <p><strong>Cost:</strong></p>
            <ul>
                {#each currentEvent.cost as cost }
                    <li>{cost.attribute} {cost.change > 0 ? '+' : ''}{cost.change}</li>
                {/each}
            </ul>
        </div>
        
        <div class="grid-item">
            <p><strong>Effects:</strong></p>
            <ul>
                {#each currentEvent.effects as effect }
                    <li>{effect.attribute} {effect.change > 0 ? '+' : ''}{effect.change}</li>
                {/each}
            </ul>
        </div>
        
        <div class="grid-item skill-check-section span-full-row">
            <p><strong>Skill Check:</strong></p>
            <ul>
                {#each currentEvent.skillCheck as skill }
                    <li><strong>Easy:</strong> {skill.easy}</li>
                    <li><strong>Medium:</strong> {skill.medium}</li>
                    <li><strong>Hard:</strong> {skill.hard}</li>
                {/each}
            </ul>
        </div>
    </div>
    
    <div class="stats-grid">
        <div class="grid-item">
            <p><strong>Success to Complete: </strong> {currentEvent.successToComplete}</p>
        </div>
        <div class="grid-item">
            <p><strong>Rounds Remaining: </strong> {currentEvent.roundRemaining}</p>
        </div>
    </div>

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
                
                <h4>Cost:</h4>
                {#each currentEvent.cost as cost, i}
                    <div class="effect-item">
                        <label>
                            Attribute:
                            <select name="attr" id="attr" bind:value={currentEvent.effects[i].attribute}>
                                <option value="Population">Population</option>
                                <option value="Stability">Stability</option>
                                <option value="Morale">Morale</option>
                                <option value="Culture">Culture</option>
                                <option value="Reputation">Reputation</option>
                                <option value="Ressources">Ressources</option>
                            </select>
                        </label>
                        <label>
                            Change:
                            <input type="number" bind:value={currentEvent.cost[i].change} />
                        </label>
                    </div>
                {/each}

                <h4>Effects:</h4>
                {#each currentEvent.effects as effect, i}
                    <div class="effect-item">
                        <label>
                            Attribute:
                            <select name="attr" id="attr" bind:value={currentEvent.effects[i].attribute}>
                                <option value="Population">Population</option>
                                <option value="Stability">Stability</option>
                                <option value="Morale">Morale</option>
                                <option value="Culture">Culture</option>
                                <option value="Reputation">Reputation</option>
                                <option value="Ressources">Ressources</option>
                            </select>
                        </label>
                        <label>
                            Change:
                            <input type="number" bind:value={currentEvent.effects[i].change} />
                        </label>
                    </div>
                {/each}
                
                <h4>Skill Check:</h4>
                {#each currentEvent.skillCheck as skill, i}
                    <div class="effect-item">
                        <label>
                            Easy:
                            <input type="text" bind:value={currentEvent.skillCheck[i].easy} />
                        </label>
                        <label>
                            Medium:
                            <input type="text" bind:value={currentEvent.skillCheck[i].medium} />
                        </label>
                        <label>
                            Hard:
                            <input type="text" bind:value={currentEvent.skillCheck[i].hard} />
                        </label>
                    </div>
                {/each}

                <label>
                    Success to Complete:
                    <input type="number" bind:value={currentEvent.successToComplete} />
                </label>
                <label>
                    Rounds Remaining:
                    <input type="number" bind:value={currentEvent.roundRemaining} />
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

    .opportunity-details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two equal columns for cost and effects */
        gap: 1.5rem;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .grid-item {
        background-color: #2a2e2f;
        padding: 1rem;
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
    }
    
    .skill-check-section {
        grid-column: 1 / -1; /* This item spans the full width of the grid */
    }

    .grid-item p {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    .grid-item ul {
        list-style-type: none;
        padding-left: 0;
        margin: 0;
    }
    
    .grid-item li {
        margin-bottom: 0.25rem;
    }
    
    .event-actions {
        display: flex;
        justify-content: space-between;
    }
    
    .resolve-button {
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
    
    .resolve-button:hover {
        background-color: var(--bg-color);
        color: var(--primary-color);
    }

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

    .opportunity-details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .grid-item {
        background-color: #2a2e2f;
        padding: 1rem;
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
    }
    
    .skill-check-section {
        grid-column: 1 / -1;
    }

    .grid-item p {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    .grid-item ul {
        list-style-type: none;
        padding-left: 0;
        margin: 0;
    }
    
    .grid-item li {
        margin-bottom: 0.25rem;
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
        max-height: 80vh; /* Set a maximum height relative to the viewport height */
        overflow-y: auto; /* Add a scrollbar if content overflows vertically */
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

    .modal-content h4 {
        margin-bottom: 0;
        margin-top: 0;
    }

    .opportunity-details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two equal columns for cost and effects */
        gap: 1.5rem;
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
