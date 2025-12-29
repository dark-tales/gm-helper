<script>
  import { fade, scale } from 'svelte/transition'  
  import { PUBLIC_API_URL } from '$env/static/public'

    let {allSettlement, fetchAllSettlement, show = false, onClose = () => {}} = $props()

    const cityFirstNames = [
  "Ash", "Forest", "Drift", "Gloom", "Shade", "Stone", "Iron", "Frost", "Ember", "Smoke",
  "Storm", "Dusk", "Dawn", "Bluff", "Cliff", "River", "Oak", "Pine", "Hollow", "Wisp",
  "Thorn", "Copper", "Silver", "Gold", "Cloud", "Lake", "Marsh", "Sand", "Wind", "Glow",
  "Shore", "Vale", "Glen", "Briar", "Crow", "Wolf", "Hearth", "Peak",
]
    const cityLastNames = [
  "Shore", "Watch", "Reach", "Hold", "Gate", "Cross", "Rest", "Field", "Port", "Harbor",
  "Landing", "Point", "Fall", "Falls", "Rise", "Keep", "Run", "Fort", "Bridge", "Pass",
  "End", "Peak", "Crest", "Forge", "Bay", "Cove", "Heights", "Springs", "Wells", "Rock",
  "Hill", "Deep", "Hollow", "View", "Way", "Home", "Ward",
]

    let cityName = $state("")
    let region = $state("")
    let pointsLvl = $state("Moderate")
    let points = $state(["Very Low", "Low", "Moderate", "High", "Very High"])
    // Define Stats
    let Population = $state(0)
    let Stability = $state(0)
    let Resources = $state(0)
    let Reputation = $state(0)
    let Morale = $state(0)
    let Culture = $state(0)
    const stats = ["Population", "Stability", "Resources", "Reputation", "Morale", "Culture"]

let settlementsByRegion = $derived(
    allSettlement.reduce((acc, settlement) => {
        const r = settlement.region ?? "Unknown"
        if (!acc[r]) acc[r] = []
        acc[r].push(settlement)
        return acc;
    }, {})
    )

function generateCityName() {
    let firstName = ""
    let lastName = ""
    const randomFirstIndex = Math.floor(Math.random() * cityFirstNames.length)
    firstName = cityFirstNames[randomFirstIndex]
    const randomLastIndex = Math.floor(Math.random() * cityLastNames.length)
    lastName = cityLastNames[randomLastIndex]
    cityName = firstName + " " + lastName
}

function generatepoints() {
    const randomIndex = Math.floor(Math.random() * points.length)
    pointsLvl = points[randomIndex]
    console.log(pointsLvl)
}

function generateAttr(points) {
    let totalAttrPts = 0
        if(points === "Very Low") {
            totalAttrPts = Math.floor(Math.random() * (15 - 6 + 1)) + 6
        } else if (points === "Low") {
            totalAttrPts = Math.floor(Math.random() * (45 - 15 + 1)) + 15
        } else if (points === "Moderate") {
            totalAttrPts = Math.floor(Math.random() * (75 - 45 + 1)) + 45
        } else if (points === "High") {
            totalAttrPts = Math.floor(Math.random() * (105 - 75 + 1)) + 75
        } else if (points === "Very High") {
            totalAttrPts = Math.floor(Math.random() * (120 - 105 + 1)) + 105
        } 
        
    try {
    const distributed = distributePointsWithLimits(totalAttrPts, stats, 1, 20);

    Population = distributed.Population;
    Stability = distributed.Stability;
    Resources = distributed.Resources;
    Reputation = distributed.Reputation;
    Morale = distributed.Morale;
    Culture = distributed.Culture;

    console.log(distributed, "Total:", Object.values(distributed).reduce((a,b)=>a+b,0));
    } catch (err) {
        console.error(err.message);
    }
}

async function generateSettlement(points) {
    generateAttr(points)
    try {
        const response = await fetch(`${PUBLIC_API_URL}/api/settlements`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: cityName,
                region: region,
                attributes : {
                    population: Population,
                    culture: Culture,
                    stability: Stability,
                    reputation: Reputation,
                    morale: Morale,
                    resources: Resources
                }
            })
        })
        // receiving message
        const data = await response.json()
        // if not ok send error
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        //disable form and reset
        fetchAllSettlement()
        cityName = ""
        region = ""
        pointsLvl = ""
        onClose()
    } catch (error) {
        console.error('Error saving hook to history:', error);
    }
}

function distributePointsWithLimits(totalPoints, statNames, min = 1, max = 20) {
    const n = statNames.length;
    const result = {};

    // First, ensure minimum allocation
    let pointsLeft = totalPoints - n * min;

    if (pointsLeft < 0) {
        throw new Error("Total points too low to satisfy the minimum per stat");
    }

    // Initialize each stat with min
    statNames.forEach(name => result[name] = min);

    // Distribute remaining points
    for (let i = 0; i < n; i++) {
        if (i === n - 1) {
            // Give remaining points to last stat, respecting max
            result[statNames[i]] += Math.min(pointsLeft, max - result[statNames[i]]);
        } else {
            // Random allocation between 0 and remaining points or max limit
            const allocatable = Math.min(pointsLeft, max - result[statNames[i]]);
            const value = Math.floor(Math.random() * (allocatable + 1));
            result[statNames[i]] += value;
            pointsLeft -= value;
        }
    }

    return result;
}


</script>

{#if show}
  <div class="backdrop" transition:fade={{ duration: 200 }}></div>
  <div class="modal" transition:scale={{ duration: 200 }}>
    <!-- Header -->
    <div class="header-section">
        <h2>Add a New Settlement</h2>
        <p class="subtitle">Provide information about a new settlement</p>
    </div>

    <!-- Generator Buttons -->
    <div class="generator-buttons">
        <button onclick={generateCityName} class="btn-generate">Generate Name</button>
        <button onclick={generatepoints} class="btn-generate">Generate Points</button>
    </div>

    <!-- Form -->
    <form onsubmit={(e) => { e.preventDefault(); generateSettlement(pointsLvl); }} class="form-content">
        <div class="form-grid">
            <div class="form-field">
                <label for="name">Name</label>
                <input type="text" id="name" bind:value={cityName} placeholder="Enter settlement name">
            </div>
            
            <div class="form-field">
                <label for="region">Region</label> 
                <select name="region" id="region" bind:value={region}>
                    <option value="">New region</option>
                    {#each Object.entries(settlementsByRegion) as [r, settlements]}
                    <option value={r}>{r}</option>
                    {/each}
                </select>
                <input type="text" id="region" bind:value={region} placeholder="Enter region">
                
            </div>
            
            <div class="form-field">
                <label for="points">Points Level</label>
                <select name="points" id="points" bind:value={pointsLvl}>
                    <option value="Very Low">Very Low (6-15)</option>
                    <option value="Low">Low (15-45)</option>
                    <option value="Moderate">Moderate (45-75)</option>
                    <option value="High">High (75-105)</option>
                    <option value="Very High">Very High (105-120)</option>
                </select>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
            <button type="button" onclick={onClose} class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Create Settlement</button>
        </div>
    </form>
  </div>
{/if}

<style>
    :root {
        --bg-color: #131516;
        --card-bg: #1f2324;
        --primary-color: #efd293;
        --border-color: #333a3b;
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 999;
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        padding: 2rem;
        border-radius: 8px;
        min-width: 600px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        color: var(--primary-color);
        border: 1px solid var(--border-color);
        z-index: 1000;
    }

    .header-section {
        margin-bottom: 2rem;
        /* border-bottom: 2px solid var(--primary-color); */
        padding-bottom: 1rem;
    }

    .header-section h2 {
        font-size: 1.75rem;
        font-weight: bold;
        margin: 0 0 0.5rem 0;
        color: var(--primary-color);
    }

    .subtitle {
        font-style: italic;
        opacity: 0.8;
        margin: 0;
        font-size: 0.95rem;
    }

    .generator-buttons {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .btn-generate {
        flex: 1;
        background-color: transparent;
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: bold;
    }

    .btn-generate:hover {
        background-color: var(--primary-color);
        color: var(--bg-color);
    }

    .form-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-field label {
        font-weight: bold;
        color: var(--primary-color);
        font-size: 0.95rem;
    }

    .form-field input,
    .form-field select {
        border: 2px solid var(--border-color);
        padding: 0.75rem;
        background-color: var(--bg-color);
        color: var(--primary-color);
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    .form-field input:focus,
    .form-field select:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .form-field input::placeholder {
        color: rgba(239, 210, 147, 0.4);
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding-top: 1rem;
        /* border-top: 1px solid var(--border-color); */
    }

    .btn-primary {
        background-color: var(--primary-color);
        color: var(--bg-color);
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: opacity 0.2s;
        font-weight: bold;
    }

    .btn-primary:hover {
        opacity: 0.9;
    }

    .btn-secondary {
        background-color: transparent;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: bold;
    }

    .btn-secondary:hover {
        background-color: var(--primary-color);
        color: var(--bg-color);
    }

    @media (max-width: 768px) {
        .modal {
            padding: 1.5rem;
            min-width: unset;
            width: 90%;
        }

        .generator-buttons {
            flex-direction: column;
        }

        .header-section h2 {
            font-size: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        .modal {
            padding: 1rem;
            width: 95%;
        }

        .modal-actions {
            flex-direction: column-reverse;
        }

        .btn-primary,
        .btn-secondary,
        .btn-generate {
            width: 100%;
        }
    }
</style>