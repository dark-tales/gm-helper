<script>
    import {onMount} from "svelte"
    import {fade, fly, slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"
    import {sineIn} from "svelte/easing"
    import { PUBLIC_API_URL } from '$env/static/public'

    // State variables related to buildings generation
    let allBuildings = $state([])
    let currentBuilding = $state("")
    let selectType = $state(null)
    let isFormActive = $state(false)
    let currentNotes = $state("")
    let building_founded = $state(false)
    let building_visited = $state(false)

    // State variables related to new buildings
    let newName = $state("")
    let newType = $state("")
    let newSummary = $state("")
    let newExterior = $state("")
    let newInterior_ground_floor = $state("")
    let newInterior_upper_levels = $state("")
    let newUsefulness_hints = $state("")
    let newActivities_suggested = $state("")
    let newPrimary_materials = $state("")
    let newSound = $state("")
    let newSmell = $state("")
    let newTouch = $state("")
    let newSight = $state("")
    let newHistory_clues = $state("")
    let newNotable_decorations = $state("")
    let newObjects_laying_around = $state("")
    let newAuthor = $state("")

    // State variables related to building history
    let buildingHistory = $state([])
    let btnLbl = $state("Show")
    let isBuildingHistoryActive = $state(false)
    let isDetailsOpen = $state(false)
    let buildingDetails = $state([])
    let isEditDetailsOpen = $state(false)

    // specific data for Buildings
    let type = $state([
        "Social",
        "Residential",
        "Commercial",
        "Industrial",
        "Religious",
        "Magical",
        "Military",
        "Administrative",
        "Utility",
        "Criminal",
        "Academic",
        "Hospitality",
        "Civic",
        "Ruin",
        "Containment",
        "Medical",
        "Agricultural",
        "Transit",
        "Obscure",
        "Cultural",
        "Resource"
    ])

    // State variables related to message
    let message = $state("")
    let messageType = $state("")

    // Get all buildings
    async function getAllBuildings() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/buildings`)
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            allBuildings = await res.json()
        } catch (error) {
            console.error("Error fetching character:", error)
            showMessage(`Operation failed: ${error.message}`, "error");
        }
    }

    // Get Building History
        async function getBuildingHistory() {
            try {
                const res = await fetch(`${PUBLIC_API_URL}/api/buildings-history`)
                if (!res.ok) {
                    throw new Error(`Server error! Status : ${res.status}`)
                }
                buildingHistory = await res.json()
            } catch (error) {
                console.error("Error fetching buildings:", error)
            }
        }
    
    // Activate Character History
    function activateBuildingHistory() {
        btnLbl = btnLbl === "Show" ? "Hide" : "Show"
        isBuildingHistoryActive = isBuildingHistoryActive === false ? true : false
    }

    // Get one random Building 
    function getOneRandomBuilding() {       
            
        // if no building send message
        if (allBuildings.length === 0) {
            showMessage("No building found with the selected filters!", "warning");
        } 
        
        // Request for all buildings
        else if (selectType === null) {
            const randomIndex = Math.floor(Math.random() * allBuildings.length)
            currentBuilding = allBuildings[randomIndex]
            showMessage("Random building generated!", "success")            
        } 
        
        // request specific Type
        else if (selectType === selectType) {
            const specialType = allBuildings.filter(allBuildings => {
                return allBuildings.type === selectType
            })
            if (specialType.length === 0) {
            showMessage("No building found with the selected filters!", "warning");
            } else {  
            const randomIndex = Math.floor(Math.random() * specialType.length)
            currentBuilding = specialType[randomIndex]
            showMessage("Random building generated!", "success");
            }
        }
    }

    // Activate form
    function activateForm(param) {
        isFormActive = isFormActive === false ? true : false  
        if(param === "db") {
            URL = `${PUBLIC_API_URL}/api/buildings`
        } else if(param === "his") {
            URL = `${PUBLIC_API_URL}/api/buildings-history`
        }      
    }

    // Create new Building
    async function createNewBuilding(event) {
        event.preventDefault()
        // Post new Building from form
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    type: newType,
                    summary: newSummary,
                    exterior: newExterior,
                    interior_ground_floor: newInterior_ground_floor,
                    interior_upper_levels: newInterior_upper_levels,
                    usefulness_hints: newUsefulness_hints,
                    activities_suggested: newActivities_suggested,
                    primary_materials: newPrimary_materials,
                    sound: newSound,
                    smell: newSmell,
                    touch: newTouch,
                    sight: newSight,
                    history_clues: newHistory_clues,
                    notable_decorations: newNotable_decorations,
                    objects_laying_around: newObjects_laying_around,
                    author: newAuthor 
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
            getAllBuildings()
            getBuildingHistory()
            showMessage(data.message || "Building created successfully!", "success");
            URL = ""
            newName= ""
            newType= ""
            newSummary= ""
            newExterior= ""
            newInterior_ground_floor= ""
            newInterior_upper_levels= ""
            newUsefulness_hints= ""
            newActivities_suggested= ""
            newPrimary_materials= ""
            newSound= ""
            newSmell= ""
            newTouch= ""
            newSight= ""
            newHistory_clues= ""
            newNotable_decorations= ""
            newObjects_laying_around= ""
            newAuthor = ""

            // if error from server update message
        } catch (error) {
            console.error('Error saving Building to history:', error);
            message = `Failed to save Building to history: ${error.message}`;
            messageType = 'error';
        }
    }

    // Delete current Building by ID
    async function deleteOldBuilding() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/buildings/${currentBuilding._id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            showMessage("Original Building deleted from database!", "success");
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // Save current Building to history
    async function saveCurrentBuilding(pattern) {
        // Post current building to history
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/buildings-history`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentBuilding.id,
                    name: currentBuilding.name,
                    type: currentBuilding.type,
                    summary: currentBuilding.summary,
                    exterior: currentBuilding.exterior,
                    interior_ground_floor: currentBuilding.interior_ground_floor,
                    interior_upper_levels: currentBuilding.interior_upper_levels,
                    usefulness_hints: currentBuilding.usefulness_hints,
                    activities_suggested: currentBuilding.activities_suggested,
                    primary_materials: currentBuilding.primary_materials,
                    sound: currentBuilding.sound,
                    smell: currentBuilding.smell,
                    touch: currentBuilding.touch,
                    sight: currentBuilding.sight,
                    history_clues: currentBuilding.history_clues,
                    notable_decorations: currentBuilding.notable_decorations,
                    objects_laying_around: currentBuilding.objects_laying_around,
                    author: currentBuilding.author,
                    currentNotes: currentNotes,
                    building_founded: building_founded,
                    building_visited: building_visited
                })
            })
            // wait for response
            const data = await response.json()
            // If no response throw error
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            // update message
            showMessage("Current Building saved to history!", "success");
            getBuildingHistory()
            if(pattern === "delete") {
                deleteOldBuilding()
            }
            currentBuilding = ""
        } catch (error) {
            console.error('Error saving Building to history:', error);
            message = `Failed to save Building to history: ${error.message}`;
            messageType = 'error';
        }
    }

    // Open history details
    function openBuildingDetails(history) {
        isDetailsOpen = isDetailsOpen === false ? true : false
        buildingDetails = history
    }

    // Edit current history hook
    async function editHistoryBuilding(event) {
        event.preventDefault()
    try {
            const resp = await fetch(`${PUBLIC_API_URL}/api/buildings-history/${buildingDetails._id}`, {
            method: "PATCH",
            headers: {
            "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: buildingDetails.id,
                name: buildingDetails.name,
                type: buildingDetails.type,
                summary: buildingDetails.summary,
                exterior: buildingDetails.exterior,
                interior_ground_floor: buildingDetails.interior_ground_floor,
                interior_upper_levels: buildingDetails.interior_upper_levels,
                usefulness_hints: buildingDetails.usefulness_hints,
                activities_suggested: buildingDetails.activities_suggested,
                primary_materials: buildingDetails.primary_materials,
                sound: buildingDetails.sound,
                smell: buildingDetails.smell,
                touch: buildingDetails.touch,
                sight: buildingDetails.sight,
                history_clues: buildingDetails.history_clues,
                notable_decorations: buildingDetails.notable_decorations,
                objects_laying_around: buildingDetails.objects_laying_around,
                author: buildingDetails.author,
                currentNotes: buildingDetails.currentNotes,
                building_founded: buildingDetails.building_founded,
                building_visited: buildingDetails.building_visited
            })
        })
        isEditDetailsOpen = false
        showMessage("Building updated successfully!", "success");
        } catch (error) {
            console.error('Error saving Building to history:', error);
            message = `Failed to save Building to history: ${error.message}`;
            messageType = 'error';
        }
        
    }

    // Delete current history hook by ID
    async function deleteHistoryBuilding(id) {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/buildings-history/${id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            isDetailsOpen = false
            getBuildingHistory()
            showMessage("History entry deleted!", "success");
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // get all Buildings when app is mounted
    onMount(() => {
        getAllBuildings()
        getBuildingHistory()
    })

    // Message function 
    function showMessage(msg, type) {
        message = msg;
        messageType = type;
        setTimeout(() => {
            message = "";
            messageType = "";
        }, 3000); // Message disappears after 3 seconds
    }

</script>

    <!-- ---------------------------------------------------------------------------------------------------- TEMPLATE -->
     
<main class="p-4 sm:p-6 md:p-8" in:slide={{axis:"y", easing:sineOut}}>
<!-- Message -->
 {#if message}
        <div class="border-2 text-grey border-pf-yellow-light text-lg font-bold fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 {messageType === 'success' ? 'bg-green-500' : messageType === 'error' ? 'bg-red-500' : 'bg-yellow-500'}">
            {message}
        </div>
    {/if}
    
<!-- Random Building Nav -->
<div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
    <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <button class="btn w-full sm:w-auto" onclick={getOneRandomBuilding}>Get one random building</button>
        <label for="selectRarity" class="text-white">Filter by Type</label>
        <select name="selectRarity" id="selectRarity" bind:value={selectType} class="text-white w-full sm:w-auto border-2 border-pf-yellow-light rounded">
            <option value="{null}">All</option>
            {#each type as t}
                <option value="{t}">{t}</option>
            {/each}
        </select>   
    </div>
    <div class="flex flex-col sm:flex-row">
    <button class="btn w-full sm:w-auto mt-4 sm:mt-0" onclick={() => activateForm("db")}>Add new Building to database</button>
    <button class="btn w-full sm:w-auto mt-4 sm:mt-0" onclick={() => activateForm("his")}>Add new Building to history</button>
    </div> 
</div>

<!-- Random building display -->
{#if currentBuilding}
    <div class="building-card" transition:slide={{axis:"y", easing:sineOut}}>
        <!-- Top Nav -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 top-nav">
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto items-center">
                <button class="btn w-full sm:w-auto" onclick={saveCurrentBuilding}>Save Building</button>
                <button class="btn-red w-full sm:w-auto" onclick={() => saveCurrentBuilding("delete")}>Save and Delete</button>
            </div>
            <button class="btn w-full sm:w-auto mt-2 sm:mt-0" onclick={() => currentBuilding = ""}>Close</button>
        </div>

        <div class="building-details-grid">
            <div class="header-section">
                <h3>{currentBuilding.name}</h3>
                <p class="building-type"><strong>Type:</strong> {currentBuilding.type}</p>
            </div>
            
            <div class="description-section">
                <p><strong>Summary:</strong> {currentBuilding.summary}</p>
            </div>
            
            <div class="details-columns">
                <div class="detail-box">
                    <p><strong>Exterior Description:</strong></p>
                    <p>{currentBuilding.exterior}</p>
                </div>
                
                <div class="detail-box">
                    <p><strong>Main Floor Description:</strong></p>
                    <p>{currentBuilding.interior_ground_floor}</p>
                </div>
                
                
                <div class="detail-box">
                    <p><strong>Upper Floor Description:</strong></p>
                    {#if currentBuilding.interior_upper_levels}
                    <p>{currentBuilding.interior_upper_levels}</p>
                    {:else}
                    <p>No Upper Floor Description</p>
                    {/if}
                </div>
                

                <div class="detail-box">
                    <p><strong>Primary Materials:</strong></p>
                    <ul>
                        {#each currentBuilding.primary_materials as mat}
                            <li>{mat}</li>
                        {/each}
                    </ul>
                </div>

                <div class="detail-box">
                    <p><strong>Notable Decorations:</strong></p>
                    <ul>
                        {#each currentBuilding.notable_decorations as deco}
                            <li>{deco}</li>
                        {/each}
                    </ul>
                </div>
                
                <div class="detail-box">
                    <p><strong>Objects Laying Around:</strong></p>
                    <ul>
                        {#each currentBuilding.objects_laying_around as obj}
                            <li>{obj}</li>
                        {/each}
                    </ul>
                </div>

                <div class="detail-box">
                    <p><strong>Possible Activities:</strong></p>
                    <ul>
                        {#each currentBuilding.activities_suggested as act}
                            <li>{act}</li>
                        {/each}
                    </ul>
                </div>
                
                <div class="detail-box">
                    <p><strong>History Clues:</strong></p>
                    <ul>
                        {#each currentBuilding.history_clues as his}
                            <li>{his}</li>
                        {/each}
                    </ul>
                </div>
                
                <div class="detail-box">
                    <p><strong>Useful Hints:</strong></p>
                    <ul>
                        {#each currentBuilding.usefulness_hints as hints}
                            <li>{hints}</li>
                        {/each}
                    </ul>
                </div>
            </div>
            
            <div class="sensory-section">                
                <div class="sensory-grid">
                    <div class="detail-box">
                        <p><strong>Sounds:</strong></p>
                        <ul>
                            {#each currentBuilding.sound as s}
                                <li>{s}</li>
                            {/each}
                        </ul>
                    </div>
                    
                    <div class="detail-box">
                        <p><strong>Smells:</strong></p>
                        <ul>
                            {#each currentBuilding.smell as s}
                                <li>{s}</li>
                            {/each}
                        </ul>
                    </div>
                    
                    <div class="detail-box">
                        <p><strong>Touch:</strong></p>
                        <ul>
                            {#each currentBuilding.touch as t}
                                <li>{t}</li>
                            {/each}
                        </ul>
                    </div>
                    
                    <div class="detail-box">
                        <p><strong>Sight:</strong></p>
                        <ul>
                            {#each currentBuilding.sight as s}
                                <li>{s}</li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="details-columns">
                <div class="detail-box span-full-row">
                    <p><strong>Author:</strong> {currentBuilding.author}</p>
                </div>
            </div>

            <div class="notes-section">
                <label for="notes"><strong>Notes:</strong></label>
                <textarea name="notes" id="notes" bind:value={currentNotes} class="notes-textarea"></textarea>
                
                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" name="search" bind:checked={building_visited}>
                        Building found?
                    </label>
                    <label>
                        <input type="checkbox" name="founded" bind:checked={building_founded}>
                        Building visited?
                    </label>
                </div>
            </div>
        </div>
        
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 top-nav">
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto items-center">
                <button class="btn w-full sm:w-auto" onclick={saveCurrentBuilding}>Save Building</button>
                <button class="btn-red w-full sm:w-auto" onclick={() => saveCurrentBuilding("delete")}>Save and Delete</button>
            </div>
            <button class="btn w-full sm:w-auto mt-2 sm:mt-0" onclick={() => currentBuilding = ""}>Close</button>
        </div>
    </div>
{/if}

<!-- New Building Form -->
{#if isFormActive === true}
<div class="bg-grey text-white fixed inset-0 flex items-center justify-center p-4 z-50" transition:fly={{y: 200, easing: sineOut}}>
    <div class="max-w-[1200px] ml-auto mr-auto bg-grey rounded text-white p-4 sm:p-8 w-full max-h-full overflow-auto text-lg  shadow-xl">
        <form onsubmit={createNewBuilding} class="building-details-grid space-y-6">
            
            <!-- Header -->
            <div class="header-section">
                <h2 class="text-2xl font-bold mb-2">Add a New Building</h2>
                <p class="text-pf-yellow-light italic">Provide information about a new structure</p>
            </div>

            <!-- Basic Info -->
            <div class="details-columns">
                <div class="detail-box col-span-2">
                    <label for="name" class="font-bold">Name</label>
                    <input type="text" id="name" bind:value={newName} class="input-field">
                </div>

                <div class="detail-box">
                    <label for="type" class="font-bold">Type</label>
                    <select id="type" bind:value={newType} class="input-field">
                        {#each type as t}
                            <option value={t}>{t}</option>
                        {/each}
                    </select>
                </div>

                <div class="detail-box col-span-full">
                    <label for="summary" class="font-bold">Summary</label>
                    <textarea id="summary" bind:value={newSummary} class="input-field h-24"></textarea>
                </div>
            </div>

            <!-- Descriptions -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="exterior" class="font-bold">Exterior Description</label>
                    <textarea id="exterior" bind:value={newExterior} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="interior_ground_floor" class="font-bold">Main Floor Description</label>
                    <textarea id="interior_ground_floor" bind:value={newInterior_ground_floor} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="interior_upper_levels" class="font-bold">Upper Floor Description</label>
                    <textarea id="interior_upper_levels" bind:value={newInterior_upper_levels} class="input-field h-24"></textarea>
                </div>
            </div>

            <!-- Activities, Materials, and Hints -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="usefulness_hints" class="font-bold">Useful Hints</label>
                    <textarea id="usefulness_hints" bind:value={newUsefulness_hints} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="activities_suggested" class="font-bold">Potential Activities</label>
                    <textarea id="activities_suggested" bind:value={newActivities_suggested} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="primary_materials" class="font-bold">Primary Materials</label>
                    <textarea id="primary_materials" bind:value={newPrimary_materials} class="input-field h-24"></textarea>
                </div>
            </div>

            <!-- Sensory Section -->
            <div class="sensory-section">
                <div class="sensory-grid">
                    <div class="detail-box">
                        <label for="sound" class="font-bold">Sounds</label>
                        <textarea id="sound" bind:value={newSound} class="input-field h-20"></textarea>
                    </div>
                    <div class="detail-box">
                        <label for="smell" class="font-bold">Smells</label>
                        <textarea id="smell" bind:value={newSmell} class="input-field h-20"></textarea>
                    </div>
                    <div class="detail-box">
                        <label for="touch" class="font-bold">Touch</label>
                        <textarea id="touch" bind:value={newTouch} class="input-field h-20"></textarea>
                    </div>
                    <div class="detail-box">
                        <label for="sight" class="font-bold">Sight</label>
                        <textarea id="sight" bind:value={newSight} class="input-field h-20"></textarea>
                    </div>
                </div>
            </div>

            <!-- History and Objects -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="history_clues" class="font-bold">History Clues</label>
                    <textarea id="history_clues" bind:value={newHistory_clues} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="notable_decorations" class="font-bold">Notable Decorations</label>
                    <textarea id="notable_decorations" bind:value={newNotable_decorations} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="objects_laying_around" class="font-bold">Objects Laying Around</label>
                    <textarea id="objects_laying_around" bind:value={newObjects_laying_around} class="input-field h-24"></textarea>
                </div>
            </div>

            <!-- Metadata -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="author" class="font-bold">Author</label>
                    <input id="author" type="text" bind:value={newAuthor} class="input-field">
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <button class="btn w-full sm:w-auto" type="submit">Submit</button>
                <button class="btn w-full sm:w-auto" type="button" onclick={() => isFormActive = false}>Close</button>
            </div>

        </form>
    </div>
</div>
{/if}



<!-- Show history -->
{#if !currentBuilding}
<div>
    <button class="btn mb-2" onclick={activateBuildingHistory}>{btnLbl} History</button>
</div>
{:else}
<div class="max-w-[1150px] ml-auto mr-auto mb-2">
    <button class="btn mb-4" onclick={activateBuildingHistory}>{btnLbl} History</button>
</div>
{/if}

<!-- History list -->
{#if isBuildingHistoryActive === true}
    {#if buildingHistory.length === 0}
        <h2 class="text-3xl text-white font-semibold max-w-[1200px] ml-auto mr-auto">No Building in history</h2>
    {/if}
    <div class="flex flex-col-reverse max-w-[1200px] ml-auto mr-auto" transition:fly={{y: 200, easing:sineOut}}>
        {#each buildingHistory as history }
            <ul class="bg-pf-yellow-light m-2 rounded shadow-md odd:bg-pf-yellow">
            <li class="flex flex-col sm:flex-row justify-between buildings-start sm:items-center p-4">
                <div class="mb-2 sm:mb-0">
                    <b>Name</b> : {history.name}
                </div>
                <div class="mb-2 sm:mb-0 sm:absolute sm:right-1/4 lg:absolute lg:right-2/4">
                    <b>Date</b> : {history.creationDate.slice(0,10)}
                </div>
                <button onclick={() => openBuildingDetails(history)} class="px-4 py-2 font-medium border-2 text-yellow bg-grey hover:bg-yellow hover:text-grey hover:border-grey rounded w-full sm:w-auto"><b>Details</b></button>
            </li>
            </ul>
        {/each}
    </div>
{/if}

<!-- Building details -->
{#if isDetailsOpen}
<div class="bg-grey text-white fixed inset-0 flex items-center justify-center p-4 z-50" transition:fly={{y: 200, easing:sineOut}}>
    <div class="building-card max-w-6xl max-h-full overflow-auto">
        {#if message}
            <div class="border-2 text-grey border-pf-yellow-light text-lg font-bold fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 {messageType === 'success' ? 'bg-green-500' : messageType === 'error' ? 'bg-red-500' : 'bg-yellow-500'}">
                {message}
            </div>
        {/if}

        <div class="building-details-grid space-y-4">
            <div class="header-section">
                <h2 class="text-2xl font-bold mb-2">{buildingDetails.name}</h2>
                <p class="text-pf-yellow-light italic">{buildingDetails.type}</p>
                <p class="mt-2">{buildingDetails.summary}</p>
            </div>

            <div class="details-columns">
                <div class="detail-box">
                    <p><strong>Exterior Description</strong></p>
                    <p>{buildingDetails.exterior}</p>
                </div>

                <div class="detail-box">
                    <p><strong>Main Floor</strong></p>
                    <p>{buildingDetails.interior_ground_floor}</p>
                </div>

                {#if buildingDetails.interior_upper_levels}
                <div class="detail-box">
                    <p><strong>Upper Floor</strong></p>
                    <p>{buildingDetails.interior_upper_levels}</p>
                </div>
                {/if}

                <div class="detail-box">
                    <p><strong>Useful Hints</strong></p>
                    <ul>
                        {#each buildingDetails.usefulness_hints as hint}
                            <li>{hint}</li>
                        {/each}
                    </ul>
                </div>

                <div class="detail-box">
                    <p><strong>Activities</strong></p>
                    <ul>
                        {#each buildingDetails.activities_suggested as act}
                            <li>{act}</li>
                        {/each}
                    </ul>
                </div>

                <div class="detail-box">
                    <p><strong>Primary Materials</strong></p>
                    <ul>
                        {#each buildingDetails.primary_materials as mat}
                            <li>{mat}</li>
                        {/each}
                    </ul>
                </div>

                <div class="detail-box">
                    <p><strong>History Clues</strong></p>
                    <ul>
                        {#each buildingDetails.history_clues as clue}
                            <li>{clue}</li>
                        {/each}
                    </ul>
                </div>

                <div class="detail-box">
                    <p><strong>Notable Decorations</strong></p>
                    <ul>
                        {#each buildingDetails.notable_decorations as deco}
                            <li>{deco}</li>
                        {/each}
                    </ul>
                </div>

                <div class="detail-box">
                    <p><strong>Objects Laying Around</strong></p>
                    <ul>
                        {#each buildingDetails.objects_laying_around as obj}
                            <li>{obj}</li>
                        {/each}
                    </ul>
                </div>
            </div>

            <div class="sensory-section">                
                <div class="sensory-grid">
                    <div class="detail-box">
                        <p><strong>Sounds</strong></p>
                        <ul>
                            {#each buildingDetails.sound as s}
                                <li>{s}</li>
                            {/each}
                        </ul>
                    </div>

                    <div class="detail-box">
                        <p><strong>Smells</strong></p>
                        <ul>
                            {#each buildingDetails.smell as s}
                                <li>{s}</li>
                            {/each}
                        </ul>
                    </div>

                    <div class="detail-box">
                        <p><strong>Touch</strong></p>
                        <ul>
                            {#each buildingDetails.touch as t}
                                <li>{t}</li>
                            {/each}
                        </ul>
                    </div>

                    <div class="detail-box">
                        <p><strong>Sight</strong></p>
                        <ul>
                            {#each buildingDetails.sight as s}
                                <li>{s}</li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>

            <div class="details-columns">
                <div class="detail-box span-full-row">
                    <p><strong>Author</strong> : {buildingDetails.author}</p>
                    <p><strong>Current Notes</strong> : {buildingDetails.currentNotes}</p>
                    <p><strong>Building founded?</strong> : {buildingDetails.building_founded ? 'Yes' : 'No'}</p>
                    <p><strong>Building visited?</strong> : {buildingDetails.building_visited ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center">
            <button class="btn w-full sm:w-auto" onclick={() => isEditDetailsOpen = true}>Edit</button>
            <button class="btn-red w-full sm:w-auto" onclick={() => deleteHistoryBuilding(buildingDetails._id)}>Delete</button>
            <button class="btn w-full sm:w-auto" onclick={() => isDetailsOpen = false}>Close</button>
        </div>
    </div>
</div>
{/if}

<!-- History Building Form -->
{#if isEditDetailsOpen}
<div class="bg-grey text-white fixed inset-0 flex items-center justify-center p-4 z-50" transition:fly={{y: 200, easing:sineOut}}>
    <div class="building-card bg-grey rounded text-white p-4 sm:p-8 w-full max-h-full overflow-auto text-lg">
        <form onsubmit={editHistoryBuilding} class="building-details-grid space-y-6">
            
            <!-- Header -->
            <div class="header-section">
                <h2 class="text-2xl font-bold mb-2">Edit Building Details</h2>
                <p class="text-pf-yellow-light italic">Update information about this structure</p>
            </div>

            <!-- Basic Info -->
            <div class="details-columns">
                <div class="detail-box col-span-2">
                    <label for="name" class="font-bold">Name</label>
                    <input type="text" id="name" bind:value={buildingDetails.name} class="input-field">
                </div>

                <div class="detail-box">
                    <label for="type" class="font-bold">Type</label>
                    <select id="type" bind:value={buildingDetails.type} class="input-field">
                        {#each type as t}
                            <option value={t}>{t}</option>
                        {/each}
                    </select>
                </div>

                <div class="detail-box col-span-full">
                    <label for="summary" class="font-bold">Summary</label>
                    <textarea id="summary" bind:value={buildingDetails.summary} class="input-field h-24"></textarea>
                </div>
            </div>

            <!-- Descriptions -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="exterior" class="font-bold">Exterior Description</label>
                    <textarea id="exterior" bind:value={buildingDetails.exterior} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="interior_ground_floor" class="font-bold">Main Floor Description</label>
                    <textarea id="interior_ground_floor" bind:value={buildingDetails.interior_ground_floor} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="interior_upper_levels" class="font-bold">Upper Floor Description</label>
                    <textarea id="interior_upper_levels" bind:value={buildingDetails.interior_upper_levels} class="input-field h-24"></textarea>
                </div>
            </div>

            <!-- Activities, Materials, and Hints -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="usefulness_hints" class="font-bold">Useful Hints</label>
                    <textarea id="usefulness_hints" bind:value={buildingDetails.usefulness_hints} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="activities_suggested" class="font-bold">Potential Activities</label>
                    <textarea id="activities_suggested" bind:value={buildingDetails.activities_suggested} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="primary_materials" class="font-bold">Primary Materials</label>
                    <textarea id="primary_materials" bind:value={buildingDetails.primary_materials} class="input-field h-24"></textarea>
                </div>
            </div>

            <!-- Sensory Section -->
            <div class="sensory-section">
                <div class="sensory-grid">
                    <div class="detail-box">
                        <label for="sound" class="font-bold">Sounds</label>
                        <textarea id="sound" bind:value={buildingDetails.sound} class="input-field h-20"></textarea>
                    </div>
                    <div class="detail-box">
                        <label for="smell" class="font-bold">Smells</label>
                        <textarea id="smell" bind:value={buildingDetails.smell} class="input-field h-20"></textarea>
                    </div>
                    <div class="detail-box">
                        <label for="touch" class="font-bold">Touch</label>
                        <textarea id="touch" bind:value={buildingDetails.touch} class="input-field h-20"></textarea>
                    </div>
                    <div class="detail-box">
                        <label for="sight" class="font-bold">Sight</label>
                        <textarea id="sight" bind:value={buildingDetails.sight} class="input-field h-20"></textarea>
                    </div>
                </div>
            </div>

            <!-- History and Objects -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="history_clues" class="font-bold">History Clues</label>
                    <textarea id="history_clues" bind:value={buildingDetails.history_clues} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="notable_decorations" class="font-bold">Notable Decorations</label>
                    <textarea id="notable_decorations" bind:value={buildingDetails.notable_decorations} class="input-field h-24"></textarea>
                </div>

                <div class="detail-box">
                    <label for="objects_laying_around" class="font-bold">Objects Laying Around</label>
                    <textarea id="objects_laying_around" bind:value={buildingDetails.objects_laying_around} class="input-field h-24"></textarea>
                </div>
            </div>

            <!-- Metadata -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="author" class="font-bold">Author</label>
                    <input id="author" type="text" bind:value={buildingDetails.author} class="input-field">
                    <div class="meta-box">
                        <input type="checkbox" bind:checked={buildingDetails.building_founded} class="accent-pf-yellow-light">
                        <span><b>Building Founded?</b></span>
                        <input type="checkbox" bind:checked={buildingDetails.building_visited} class="accent-pf-yellow-light">
                        <span><b>Building Visited?</b></span>
                    </div>
                </div>

                <div class="detail-box col-span-2">
                    <label for="currentNotes" class="font-bold">Notes</label>
                    <textarea id="currentNotes" bind:value={buildingDetails.currentNotes} class="input-field h-32"></textarea>
                </div>

                

            </div>
            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <button class="btn w-full sm:w-auto" type="submit">Submit</button>
                <button class="btn w-full sm:w-auto" type="button" onclick={() => isEditDetailsOpen = false}>Close</button>
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
    
    .span-full-row {
        grid-column: 1 / -1;
    }
        
    .sensory-section {
        grid-column: 1 / -1;
        margin-bottom: 0;
    } 
              
    .detail-box p {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    .detail-box p:last-child {
        margin-bottom: 0;
    }

    .detail-box ul {
        list-style-type: none;
        padding-left: 0;
        margin: 0.5rem 0 0 0;
    }

    .detail-box li {
        margin-bottom: 0.25rem;
        padding-left: 1rem;
        position: relative;
    }

    .detail-box li:before {
        content: "•";
        position: absolute;
        left: 0;
    }

    .sensory-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1.5rem;
        align-items: start;
        grid-auto-rows: auto; 
    }

    @media (max-width: 640px) {
        .sensory-grid {
            grid-template-columns: 1fr;
        }
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

    .checkbox-group {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        margin-top: 0.5rem;
    }

    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }    

    .meta-box {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-evenly;
        margin-top: 2rem;
    }

    .top-nav {
        margin-bottom: -1rem;
    }

    @media (max-width: 640px) {
        .details-columns {
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
    }


</style>