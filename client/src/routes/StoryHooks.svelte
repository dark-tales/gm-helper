<script>
    import {onMount} from "svelte"
    import {fade, fly, slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"
    import { PUBLIC_API_URL } from '$env/static/public'

    // State variables
    let allHooks = $state([])
    let hookHistory = $state([])
    let historyDetails = $state([])
    let newHookName = $state("")
    let newHookDesc = $state("")
    let newHookType = $state("")
    let newHookBiome = $state("")
    let newHookOutcomes = $state("")
    let newHookTwist = $state("")
    let newHookLoot = $state("")
    let newHookAuthor = $state("")
    let currentHook = $state("")
    let currentDifficulty = $state("")
    let currentNotes = $state("")
    let event_started = $state(false)
    let event_succeed = $state(false)
    let isFormActive = $state(false)
    let isHookHistoryActive = $state(false)
    let message = $state("")
    let messageType = $state("")
    let isHistoryOpen = $state(false)
    let isEditHistoryOpen = $state(false)
    let btnLbl = $state("Show")
    let URL = $state("")
    let selectType = $state(null)
    let selectBiome = $state(null)

    // specific data
    let types = $state(["Physical",
                "Discovery",
                "Environmental",
                "Investigation",
                "Ambush",
                "Magical",
                "Social",
                "Uncategorized"])

    let biomes = $state(["Aquatic",
                "Arctic",
                "Astral",
                "Desert",
                "Forest",
                "Swamp",
                "Mountain",
                "Plains",
                "Subterranean",
                "Urban",
                "Uncategorized"])

    const threat_lvl = ["Very easy DC -4",
        "Easy DC -2",
        "Medium DC +0",
        "Hard DC +2",
        "Very hard DC +4"
    ]

    //fetch all hooks
    async function getAllHooks() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/hooks`)
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            allHooks = await res.json()
        } catch (error) {
            console.error("Error fetching hooks:", error)
            showMessage(`Operation failed: ${error.message}`, "error");
        }
    }

    //fetch history
    async function getHistory() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/hook-history`)
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            hookHistory = await res.json()
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // Fetch one random hook
    function getOneRandomHook() {
        // Define difficulty for EVERY hook
        const randomDifficulty = Math.floor(Math.random() * 20 +1)
        if(randomDifficulty === 1) {
            currentDifficulty = threat_lvl[0]
        } else if(randomDifficulty >= 2 && randomDifficulty <= 5) {
            currentDifficulty = threat_lvl[1]
        } else if(randomDifficulty >= 6 && randomDifficulty <= 14) {
            currentDifficulty = threat_lvl[2]
        } else if(randomDifficulty >= 15 && randomDifficulty <= 19) {
            currentDifficulty = threat_lvl[3]
        } else if(randomDifficulty === 20) {
            currentDifficulty = threat_lvl[4]
        }
        
            
        // if no hook send message
        if (allHooks.length === 0) {
            showMessage("No hooks found with the selected filters!", "warning");
        }
        // request for all hook
        else if (selectType === null && selectBiome === null) {
            const randomIndex = Math.floor(Math.random() * allHooks.length)
            currentHook = allHooks[randomIndex]
            showMessage("Random hook generated!", "success");
        }   
        // request for specific type
        else if (selectType === selectType && selectBiome === null) {
            const specialType = allHooks.filter(allHooks => {
                return allHooks.type === selectType
            })
            if (specialType.length === 0) {
            showMessage("No hooks found with the selected filters!", "warning");
            } else {
            const randomIndex = Math.floor(Math.random() * specialType.length)
            currentHook = specialType[randomIndex]
            showMessage("Random hook generated!", "success");
            }
        }
        // request for specific biome
        else if (selectType === null && selectBiome === selectBiome) {
            const specialBiome = allHooks.filter(allHooks => {
                return allHooks.biome === selectBiome
            })
            if (specialBiome.length === 0) {
            showMessage("No hooks found with the selected filters!", "warning");
            } else {
            const randomIndex = Math.floor(Math.random() * specialBiome.length)
            currentHook = specialBiome[randomIndex]
            showMessage("Random hook generated!", "success");
            }
        }
        // request for both specific type and biome
        else if (selectType === selectType && selectBiome === selectBiome) {
            const specialType = allHooks.filter(allHooks => {
                return allHooks.type === selectType && allHooks.biome === selectBiome
            })
            if (specialType.length === 0) {
            showMessage("No hooks found with the selected filters!", "warning");
            } else {
            const randomIndex = Math.floor(Math.random() * (specialType.length))
            currentHook = specialType[randomIndex]
            showMessage("Random hook generated!", "success");
            }
        }
    }

    // Create new hook
    async function createNewHook(event) {
        event.preventDefault()
        // Post new hook from form
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newHookName,
                    description: newHookDesc,
                    type: newHookType,
                    biome: newHookBiome,
                    potential_outcomes: newHookOutcomes,
                    plot_twist: newHookTwist,
                    loot: newHookLoot,
                    author: newHookAuthor,
                })
            })
            // receiving message
            const data = await response.json()
            // if not ok send error
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            //disable form and reset
            isFormActive = false
            getAllHooks()
            getHistory()
            showMessage(data.message || "Hook created successfully!", "success");
            URL = ""
            newHookName = ""
            newHookDesc = ""
            newHookType = ""
            newHookBiome = ""
            newHookOutcomes = ""
            newHookTwist = ""
            newHookLoot = ""
            newHookAuthor = ""
            // if error from server update message
        } catch (error) {
            console.error('Error saving hook to history:', error);
            message = `Failed to save hook to history: ${error.message}`;
            messageType = 'error';
        }
    }

    // Edit current history hook
    async function editHistoryHook(event) {
        event.preventDefault()
    try {
            const resp = await fetch(`${PUBLIC_API_URL}/api/hook-history/${historyDetails._id}`, {
            method: "PATCH",
            headers: {
            "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: historyDetails.name,
                description: historyDetails.description,
                type: historyDetails.type,
                biome: historyDetails.biome,
                current_difficulty: historyDetails.currentDifficulty,
                potential_outcomes: historyDetails.potential_outcomes,
                plot_twist: historyDetails.plot_twist,
                loot: historyDetails.loot,
                author: historyDetails.author,
                event_started: historyDetails.event_started,
                event_succeed: historyDetails.event_succeed,
                currentNotes: historyDetails.currentNotes
            })
        })
        isEditHistoryOpen = false
        showMessage("History hook updated successfully!", "success");
        } catch (error) {
            console.error('Error saving hook to history:', error);
            message = `Failed to save hook to history: ${error.message}`;
            messageType = 'error';
        }
        
    }

    // Save current hook to history
    async function saveCurrentHook(pattern) {
        // Post current hook to history
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/hook-history`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentHook.id,
                    name: currentHook.name,
                    description: currentHook.description,
                    type: currentHook.type,
                    biome: currentHook.biome,
                    current_difficulty: currentDifficulty,
                    potential_outcomes: currentHook.potential_outcomes,
                    plot_twist: currentHook.plot_twist,
                    loot: currentHook.loot,
                    author: currentHook.author,
                    creationDate: currentHook.creationDate,
                    event_started: event_started,
                    event_succeed: event_succeed,
                    currentNotes: currentNotes
                })
            })
            // wait for response
            const data = await response.json()
            // If no response throw error
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            // update message
            showMessage("Current hook saved to history!", "success");
            getHistory()
            console.log("Current hook saved!")
            if(pattern === "delete") {
                deleteOldHook()
            }
            currentHook = ""
        } catch (error) {
            console.error('Error saving hook to history:', error);
            message = `Failed to save hook to history: ${error.message}`;
            messageType = 'error';
        }
    }

    // Delete current hook by ID
    async function deleteOldHook() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/hooks/${currentHook._id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            showMessage("Original hook deleted from database!", "success");
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }
    
    // Delete current history hook by ID
    async function deleteHistoryHook(id) {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/hook-history/${id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            isHistoryOpen = false
            getHistory()
            showMessage("History entry deleted!", "success");
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }
    
    // get all hooks when app is mounted
    onMount(() => {
        getAllHooks()
        getHistory()
    })

    // Activate form
    function activateForm(param) {
        isFormActive = isFormActive === false ? true : false  
        if(param === "db") {
            URL = `${PUBLIC_API_URL}/api/hooks`
        } else if(param === "his") {
            URL = `${PUBLIC_API_URL}/api/hook-history`
        }      
    }

    // Activate Hook History
    function activateHookHistory() {
        btnLbl = btnLbl === "Show" ? "Hide" : "Show"
        isHookHistoryActive = isHookHistoryActive === false ? true : false
    }

    // Open history
    function openHistory(history) {
        isHistoryOpen = isHistoryOpen === false ? true : false
        historyDetails = history
    }

    // --- Utility Functions ---
    function showMessage(msg, type) {
        message = msg;
        messageType = type;
        setTimeout(() => {
            message = "";
            messageType = "";
        }, 3000); // Message disappears after 3 seconds
    }

</script>

<!-- Begining of template -->
<main class="p-4 sm:p-6 md:p-8" in:slide={{axis:"y", easing:sineOut}}>

<!-- Message -->
{#if message}
        <div class=" border-2 text-grey border-pf-yellow-light text-lg font-bold fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 {messageType === 'success' ? 'bg-green-500' : messageType === 'error' ? 'bg-red-500' : 'bg-yellow-500'}">
            {message}
        </div>
    {/if}

<!-- Random hook Nav -->
<div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
    <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <button class="btn w-full sm:w-auto" onclick={getOneRandomHook}>Get one random hook</button>
        <label for="selectType" class="text-white">Filter by Type</label>
        <select name="selectType" id="selectType" bind:value={selectType} class="text-white w-full sm:w-auto border-2 border-pf-yellow-light rounded">
            <option value={null}>All</option>
            {#each types as type}
                <option value={type}>{type}</option>
            {/each}
        </select>
        <label for="selectBiome" class="text-white">Filter by Biome</label>
        <select name="selectBiome" id="selectBiome" bind:value={selectBiome} class="text-white w-full sm:w-auto border-2 border-pf-yellow-light rounded">
            <option value={null}>All</option>
            {#each biomes as biome}
                <option value={biome}>{biome}</option>
            {/each}
        </select>
    </div>
    <div class="flex flex-col sm:flex-row">
    <button class="btn w-full sm:w-auto mt-4 sm:mt-0" onclick={() => activateForm("db")}>Add new hook to database</button>
    <button class="btn w-full sm:w-auto mt-4 sm:mt-0" onclick={() => activateForm("his")}>Add new hook to history</button>
    </div>
</div>

<!-- Random Hook Display -->
{#if currentHook}
<div class="building-card" transition:slide={{axis:"y", easing:sineOut}}>        
    <div class="building-details-grid">

        <!-- Top Buttons -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 top-nav">
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto items-center">
                <button class="btn w-full sm:w-auto" onclick={saveCurrentHook}>Save Hook</button>
                <button class="btn-red w-full sm:w-auto" onclick={() => saveCurrentHook('delete')}>Save and Delete</button>
            </div>
            <button class="btn w-full sm:w-auto mt-2 sm:mt-0" onclick={() => currentHook = ''}>Close</button>
        </div>

        <!-- Header Section -->
        <div class="header-section">
            <h3>{currentHook.name}</h3>
            <p class="building-type"><strong>Type:</strong> {currentHook.type}</p>
            <p><strong>Biome:</strong> {currentHook.biome}</p>
            <p><strong>Difficulty (Player lvl + 14 (+ 2 at lvl 3/7/15)):</strong> {currentDifficulty}</p>
        </div>

        <!-- Description Section -->
        <div class="description-section">
            <p><strong>Description:</strong> {currentHook.description}</p>
        </div>

        <!-- Details Grid -->
        <div class="details-columns">
            <div class="detail-box">
                <p><strong>Potential Outcomes:</strong></p>
                <p>
                    {#each currentHook.potential_outcomes as outcome}
                        <li class="ml-8">{outcome}</li>
                    {/each}
                </p>
            </div>

            <div class="detail-box">
                <p><strong>Plot Twist:</strong></p>
                <p>{currentHook.plot_twist}</p>
            </div>

            <div class="detail-box">
                <p><strong>Potential Loot:</strong></p>
                <p>{#each currentHook.loot as l}
                        <li class="ml-8">{l}</li>
                {/each}</p>
            </div>

            <div class="detail-box">
                <p><strong>Author:</strong> {currentHook.author}</p>
            </div>
        </div>

        <!-- Notes Section -->
        <div class="notes-section">
            <label for="notes"><strong>Notes:</strong></label>
            <textarea name="notes" id="notes" bind:value={currentNotes} class="notes-textarea"></textarea>

            <div class="flex flex-col sm:flex-row sm:space-x-6 items-center mt-4">
                <label for="started" class="flex items-center space-x-2">
                    <input type="checkbox" id="started" bind:checked={event_started} class="accent-pf-yellow-light">
                    <span>Event started?</span>
                </label>

                <label for="succeed" class="flex items-center space-x-2 mt-2 sm:mt-0">
                    <input type="checkbox" id="succeed" bind:checked={event_succeed} class="accent-pf-yellow-light">
                    <span>Event succeeded?</span>
                </label>
            </div>
        </div>

        <!-- Footer Buttons -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto items-center">
                <button class="btn w-full sm:w-auto" onclick={saveCurrentHook}>Save Hook</button>
                <button class="btn-red w-full sm:w-auto" onclick={() => saveCurrentHook('delete')}>Save and Delete</button>
            </div>
            <button class="btn w-full sm:w-auto mt-2 sm:mt-0" onclick={() => currentHook = ''}>Close</button>
        </div>
    </div>
</div>
{/if}


<!-- New Hook Form -->
{#if isFormActive === true}
<div class="bg-grey text-white fixed inset-0 items-center justify-center z-50" transition:fly={{x: 200, easing:sineOut}}>
    <div class="max-w-[1200px] ml-auto mr-auto bg-grey rounded text-white p-4 sm:p-8 items-center w-full max-h-full overflow-auto">
        <form onsubmit={createNewHook} class="building-details-grid space-y-6">

            <!-- Header -->
            <div class="header-section">
                <h2 class="text-2xl font-bold mb-2">Add a New Hook</h2>
                <p class="text-pf-yellow-light italic">Provide information about a new plot hook</p>
            </div>

            <!-- Basic Info -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="name"><b>Name</b></label>
                    <textarea id="name" bind:value={newHookName}></textarea>
                </div>

                <div class="detail-box">
                    <label for="type"><b>Type</b></label>
                    <select id="type" bind:value={newHookType}>
                        {#each types as type}
                            <option value={type}>{type}</option>
                        {/each}
                    </select>
                </div>

                <div class="detail-box">
                    <label for="biome"><b>Biome</b></label>
                    <select id="biome" bind:value={newHookBiome}>
                        {#each biomes as biome}
                            <option value={biome}>{biome}</option>
                        {/each}
                    </select>
                </div>

                <div class="detail-box col-span-full">
                    <label for="description"><b>Description</b></label>
                    <textarea id="description" bind:value={newHookDesc}></textarea>
                </div>
            </div>

            <!-- Details -->
            <div class="details-columns">
                <div class="detail-box col-span-3">
                    <label for="potential_outcomes"><b>Potential Outcomes</b></label>
                    <textarea id="potential_outcomes" bind:value={newHookOutcomes}></textarea>
                </div>

                <div class="detail-box">
                    <label for="plot_twist"><b>Plot Twist</b></label>
                    <textarea id="plot_twist" bind:value={newHookTwist}></textarea>
                </div>

                <div class="detail-box">
                    <label for="loot"><b>Potential Loot</b></label>
                    <textarea id="loot" bind:value={newHookLoot}></textarea>
                </div>

                <div class="detail-box">
                    <label for="author"><b>Author</b></label>
                    <textarea id="author" bind:value={newHookAuthor}></textarea>
                </div>
            </div>

            <!-- Buttons -->
            <div class="mt-4 p-2 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 items-center">
                <button class="btn w-full sm:w-auto" type="submit">Submit</button>
                <button class="btn w-full sm:w-auto" type="button" onclick={() => isFormActive = false}>Close</button>
            </div>

        </form>
    </div>
</div>
{/if}


<!-- Show history -->
{#if !currentHook}
<div>
    <button class="btn mb-2" onclick={activateHookHistory}>{btnLbl} History</button>
</div>
{:else}
<div class="max-w-[1150px] ml-auto mr-auto mb-2">
    <button class="btn mb-4" onclick={activateHookHistory}>{btnLbl} History</button>
</div>
{/if}

<!-- History list -->
{#if isHookHistoryActive === true}
    {#if hookHistory.length === 0}
        <h2 class="text-3xl text-white font-semibold max-w-[1200px] ml-auto mr-auto">No Hook in history</h2>
    {/if}
    <div class="flex flex-col-reverse max-w-[1200px] ml-auto mr-auto" transition:fly={{y: 200, easing:sineOut}}>
        
        {#each hookHistory as history }
            <ul class="bg-pf-yellow-light m-2 rounded shadow-md odd:bg-pf-yellow">
            <li class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                <div class="mb-2 sm:mb-0">
                    <b>Name</b> : {history.name}
                </div>
                <div class="mb-2 sm:mb-0 sm:absolute sm:right-1/4 lg:absolute lg:right-2/4">
                    <b>Date</b> : {history.creationDate.slice(0,10)}
                </div>
                <button onclick={() => openHistory(history)} class="px-4 py-2 font-medium border-2 text-yellow bg-grey hover:bg-yellow hover:text-grey hover:border-grey rounded w-full sm:w-auto"><b>Details</b></button>
            </li>
            </ul>
        {/each}
    </div>
{/if}

<!-- History details -->
{#if isHistoryOpen}
<div class="bg-grey/90 text-white fixed inset-0 flex items-center justify-center p-4 z-50" transition:fly={{y: 200, easing: sineOut}}>
    <div class="building-card max-w-6xl max-h-full overflow-auto">
        {#if message}
            <div class="border-2 text-grey border-pf-yellow-light text-lg font-bold fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 {messageType === 'success' ? 'bg-green-500' : messageType === 'error' ? 'bg-red-500' : 'bg-yellow-500'}">
                {message}
            </div>
        {/if}

        <div class="building-details-grid">
            <!-- Header -->
            <div class="header-section">
                <h3>{historyDetails.name}</h3>
                <p class="building-type">
                    <strong>Type:</strong> {historyDetails.type}
                </p>
                <p><strong>Biome:</strong> {historyDetails.biome}</p>
            </div>

            <!-- Description -->
            <div class="description-section">
                <p><strong>Description:</strong> {historyDetails.description}</p>
            </div>

            <!-- Main details -->
            <div class="details-columns">                
                <div class="detail-box">
                    <p><strong>Potential Outcomes:</strong></p>
                    <p>{#each historyDetails.potential_outcomes as outcome} <li class="ml-8">{outcome}</li>{/each}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Plot Twist:</strong></p>
                    <p>{historyDetails.plot_twist}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Potential Loot:</strong></p>
                    <p>{#each historyDetails.loot as loot} <li class="ml-8">{loot}</li>{/each}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Threat Level:</strong></p>
                    <p>{historyDetails.current_difficulty}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Author:</strong></p>
                    <p>{historyDetails.author}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Creation Date:</strong></p>
                    <p>{historyDetails.creationDate}</p>
                </div>
                <div class="detail-box col-span-3">
                    <p><strong>Notes:</strong></p>
                    <p>{historyDetails.currentNotes}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Event Started?</strong></p>
                    <p>{historyDetails.event_started ? 'Yes' : 'No'}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Event Successful?</strong></p>
                    <p>{historyDetails.event_succeed ? 'Yes' : 'No'}</p>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row justify-between items-center mt-4 mb-4 space-y-2 sm:space-y-0">
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
                    <button class="btn w-full sm:w-auto" onclick={() => isEditHistoryOpen = true}>Edit</button>
                    <button class="btn-red w-full sm:w-auto" onclick={() => deleteHistoryHook(historyDetails._id)}>Delete</button>
                </div>
                <button class="btn w-full sm:w-auto" onclick={() => isHistoryOpen = false}>Close</button>
            </div>
        </div>
    </div>
</div>
{/if}


<!-- Edit Hook in History -->
{#if isEditHistoryOpen}
<div class="bg-grey text-white fixed inset-0 flex items-center justify-center p-4 z-50" transition:fly={{y: 200, easing: sineOut}}>
  <div class="building-card bg-grey rounded text-white p-4 sm:p-8 w-full max-h-full overflow-auto text-lg">
    <form onsubmit={editHistoryHook} class="building-details-grid space-y-6">

      <!-- Header -->
      <div class="header-section">
        <h2 class="text-2xl font-bold mb-2">Edit Historical Hook</h2>
        <p class="text-pf-yellow-light italic">Modify details of a past event or narrative hook</p>
      </div>

      <!-- Basic Information -->
      <div class="details-columns">
        <div class="detail-box">
          <label for="name"><b>Name</b></label>
          <input id="name" type="text" bind:value={historyDetails.name}>
        </div>

        <div class="detail-box col-span-2">
          <label for="description"><b>Description</b></label>
          <textarea id="description" bind:value={historyDetails.description}></textarea>
        </div>

        <div class="detail-box">
          <label for="type"><b>Type</b></label>
          <select id="type" bind:value={historyDetails.type}>
            {#each types as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </div>

        <div class="detail-box">
          <label for="biome"><b>Biome</b></label>
          <select id="biome" bind:value={historyDetails.biome}>
            {#each biomes as biome}
              <option value={biome}>{biome}</option>
            {/each}
          </select>
        </div>

        <div class="detail-box">
          <label for="current_difficulty"><b>Threat Level</b></label>
          <input id="current_difficulty" type="text" bind:value={historyDetails.current_difficulty}>
        </div>
      </div>

      <!-- Details Section -->
      <div class="details-columns">
        <div class="detail-box">
          <label for="potential_outcomes"><b>Potential Outcomes</b></label>
          <textarea id="potential_outcomes" bind:value={historyDetails.potential_outcomes}></textarea>
        </div>

        <div class="detail-box">
          <label for="plot_twist"><b>Plot Twist</b></label>
          <textarea id="plot_twist" bind:value={historyDetails.plot_twist}></textarea>
        </div>

        <div class="detail-box">
          <label for="loot"><b>Loot</b></label>
          <textarea id="loot" bind:value={historyDetails.loot}></textarea>
        </div>
      </div>

      <!-- Author and Metadata -->
      <div class="details-columns">
        <div class="detail-box">
          <label for="author"><b>Author</b></label>
          <input id="author" type="text" bind:value={historyDetails.author}>
        </div>

        <div class="detail-box">
          <label for="creationDate"><b>Creation Date</b></label>
          <input id="creationDate" type="text" bind:value={historyDetails.creationDate}>
        </div>

        <div class="detail-box flex flex-col justify-center space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="started" bind:checked={historyDetails.event_started}>
            <span><b>Event started?</b></span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="succeed" bind:checked={historyDetails.event_succeed}>
            <span><b>Event succeed?</b></span>
          </label>
        </div>
      </div>

      <!-- Notes and Flags -->
      <div class="details-columns">
        <div class="detail-box col-span-3">
          <label for="currentNotes"><b>Notes</b></label>
          <textarea id="currentNotes" bind:value={historyDetails.currentNotes}></textarea>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
        <button class="btn w-full sm:w-auto" type="submit">Save</button>
        <button class="btn w-full sm:w-auto" type="button" onclick={() => isEditHistoryOpen = false}>Close</button>
      </div>

    </form>
  </div>
</div>
{/if}

</main>

<style>
    .building-card {
        background-color: var(--card-bg, #1e1e1e);
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid var(--border-color, #333);
        color: var(--color-pf-yellow-light);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1.5rem;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }

    .building-details-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        align-items: flex-start;
    }

    .header-section {
        grid-column: 1 / -1;
    }

    .header-section h3 {
        margin: 0;
        border-bottom: 2px solid var(--color-pf-yellow-light);
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: xx-large;
        font-weight: bold;
    }

    .building-type {
        margin: 0.5rem 0 0 0;
        color: var(--color-pf-yellow-light);
        font-size:x-large;
    }

    .description-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0;
        margin-bottom: 0;
    }

    .description-section p {
        margin: 0;
        font-size: large;
    }

    .details-columns {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.5rem;
        grid-column: 1 / -1;
        align-items: start;
        grid-auto-rows: auto; 
        margin-bottom: 0;
    }


    @media (max-width: 1024px) {
        .details-columns {
            grid-template-columns: 1fr;
            grid-auto-rows: auto;
        }
    }

    .detail-box {
        background-color: #2a2e2f;
        padding: 1rem;
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        height: 100%;
    }
              
    .detail-box p {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    .detail-box p:last-child {
        margin-bottom: 0;
    }

    .detail-box li {
        margin-bottom: 0.25rem;
        position: relative;
    }

    .notes-section {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .notes-textarea {
        border: 2px solid var(--color-pf-yellow-light);
        width: 100%;
        min-height: 100px;
        padding: 0.5rem;
        background-color: #2a2e2f;
        color: white;
        border-radius: 4px;
        resize: vertical;
    }

    .top-nav {
        margin-bottom: -1rem;
    }

    @media (max-width: 1024px) {
        .details-columns {
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>