<script>
    import {onMount} from "svelte"
    import {fade, fly, slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"
    import { PUBLIC_API_URL } from '$env/static/public'

    // State variables related to characters generation
    let allChar = $state([])
    let currentChar = $state("")
    let selectRarity = $state(null)
    let selectAncestry = $state(null)
    let isFormActive = $state(false)
    let currentNotes = $state("")

    // State variables related to history
    let charHistory = $state([])
    let btnLbl = $state("Show")
    let isCharHistoryActive = $state(false)
    let isDetailsOpen = $state(false)
    let characterDetails = $state([])
    let isEditDetailsOpen = $state(false)

    // State variable related to new Character
    let newCharName = $state("")
    let newRarity = $state("")
    let newCommon = $state("")
    let newUncommon = $state("")
    let newRare = $state("")
    let newVersatile = $state("")
    let newAncestryDesc = $state("")
    let newAncestryRarity = $state("")
    let NewBackground = $state("")
    let newEdict = $state("")
    let newAnathema = $state("")
    let newAttributes = $state("")
    let newMainSkill = $state("")
    let newLoreSkill = $state("")
    let newBestApproach = $state("")
    let newWorstApproach = $state("")
    let newPenalty = $state("")
    let newPhysTrait = $state("")
    let newPsyTrait = $state("")
    let newQuirks = $state("")
    let newSecret = $state("")
    let newArc = $state("")
    let newCharAuthor = $state("")
    let currentAttitude = $state("")

    // Specific data made for Characters
    let rarity = $state([
        "Common",
        "Uncommon",
        "Rare",
        "Versatile"
    ])

    let commonAncestries = $state([
        "Dwarf",
        "Elf",
        "Gnome",
        "Goblin",
        "Halfling",
        "Human"
    ])

    let uncommonAncestries = $state([
        "Amurrun",
        "Azarketi",
        "Fetchling",
        "Hobgoblin",
        "Iruxi",
        "Kholo",
        "Kitsune",
        "Kobold",
        "Nagaji",
        "Tengu",
        "Tripkee",
        "Vanara",
        "Ysoki"
    ])

    let rareAncestries = $state([
        "Anadi",
        "Android",
        "Automaton", 
        "Conrasu",
        "Fleshwarp",
        "Ghoran",
        "Goloma",
        "Kashrishi",
        "Poppet",
        "Shisk",
        "Shoony",
        "Skeleton",
        "Sprite",
        "Strix",
        "Vishkanya"
    ])

    let versatileAncestries = $state([
        "Aiuvarin",
        "Beastkin",
        "Changeling",
        "Dhampir",
        "Dromaar",
        "Geniekin",
        "Nephilim"
    ])

    let attitude = $state([
        "Hostile",
        "Unfriendly",
        "Indifferent",
        "Friendly",
        "Helpful"
    ])

    // State variables related to History

    // State variables related to message
    let message = $state("")
    let messageType = $state("")

    // ----------------------------------------------------------------------------------------------------FUNCTIONS

    // Get all characters
    async function getAllCharacters() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/all-characters`)
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            allChar = await res.json()
        } catch (error) {
            console.error("Error fetching character:", error)
            showMessage(`Operation failed: ${error.message}`, "error");
        }
    }

    // Get Character History
    async function getCharHistory() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/characters-history`)
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            charHistory = await res.json()
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // Get one random Character 
    function getOneRandomCharacter() {       
            
        // if no character send message
        if (allChar.length === 0) {
            showMessage("No character found with the selected filters!", "warning");
        } 
        
        // Request for all Characters
        else if (selectRarity === null) {
            const randomIndex = Math.floor(Math.random() * allChar.length)
            currentChar = allChar[randomIndex]
            showMessage("Random character generated!", "success");
        } 
        
        // request specific Rarity
        else if (selectRarity === selectRarity && selectAncestry === null) {
            const specialRarity = allChar.filter(allChar => {
                return allChar.ancestry_rarity === selectRarity
            })
            if (specialRarity.length === 0) {
            showMessage("No character found with the selected filters!", "warning");
            } else {  
            const randomIndex = Math.floor(Math.random() * specialRarity.length)
            currentChar = specialRarity[randomIndex]
            showMessage("Random character generated!", "success");
            }
        }

        // request specific Common Ancestry 
        else if (selectRarity === "Common" && selectAncestry === selectAncestry) {
            const specialAncestry = allChar.filter(allChar => {
                return allChar.commonAncestries === selectAncestry
            })
            if (specialAncestry.length === 0) {
            showMessage("No character found with the selected filters!", "warning");
            } else {
            const randomIndex = Math.floor(Math.random() * specialAncestry.length)
            currentChar = specialAncestry[randomIndex]
            showMessage("Random character generated!", "success");
            }
        }

        // request specific Uncommon Ancestry 
        else if (selectRarity === "Uncommon" && selectAncestry === selectAncestry) {
            const specialAncestry = allChar.filter(allChar => {
                return allChar.uncommonAncestries === selectAncestry
            })
            if (specialAncestry.length === 0) {
            showMessage("No character found with the selected filters!", "warning");
            } else {
            const randomIndex = Math.floor(Math.random() * specialAncestry.length)
            currentChar = specialAncestry[randomIndex]
            showMessage("Random character generated!", "success");
            }
        }
        
        // request specific Rare Ancestry 
        else if (selectRarity === "Rare" && selectAncestry === selectAncestry) {
            const specialAncestry = allChar.filter(allChar => {
                return allChar.rareAncestries === selectAncestry
            })
            if (specialAncestry.length === 0) {
            showMessage("No character found with the selected filters!", "warning");
            } else {
            const randomIndex = Math.floor(Math.random() * specialAncestry.length)
            currentChar = specialAncestry[randomIndex]
            showMessage("Random character generated!", "success");
            }
        }
        
        // request specific Versatile Ancestry 
        else if (selectRarity === "Versatile" && selectAncestry === selectAncestry) {
            const specialAncestry = allChar.filter(allChar => {
                return allChar.versatileAncestries === selectAncestry
            })
            if (specialAncestry.length === 0) {
            showMessage("No character found with the selected filters!", "warning");
            } else {
            const randomIndex = Math.floor(Math.random() * specialAncestry.length)
            currentChar = specialAncestry[randomIndex]
            showMessage("Random character generated!", "success");
            }
        }
    }

    // Activate form
    function activateForm(param) {
        isFormActive = isFormActive === false ? true : false  
        if(param === "db") {
            URL = `${PUBLIC_API_URL}/api/all-characters`
        } else if(param === "his") {
            URL = `${PUBLIC_API_URL}/api/characters-history`
        }      
    }

    // Create new Character
    async function createNewCharacter(event) {
        event.preventDefault()
        // Post new Character from form
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newCharName,
                    commonAncestries: newCommon,
                    uncommonAncestries: newUncommon,
                    rareAncestries: newRare,
                    versatileAncestries: newVersatile,
                    ancestry_description: newAncestryDesc,
                    ancestry_rarity: newAncestryRarity,
                    background: NewBackground, 
                    edict: newEdict, 
                    anathema: newAnathema,
                    main_attribute: newAttributes,
                    main_skill: newMainSkill,
                    lore_skill: newLoreSkill, 
                    best_social_approach: newBestApproach,
                    worst_social_approach: newWorstApproach,
                    social_penalty: newPenalty,
                    physical_traits: newPhysTrait, 
                    psychological_traits: newPsyTrait,
                    quirks: newQuirks, 
                    dark_secret: newSecret, 
                    character_arc: newArc,
                    author: newCharAuthor
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
            getAllCharacters()
            getCharHistory()
            showMessage(data.message || "Character created successfully!", "success");
            URL = ""
            newCharName = ""
            newCommon = ""
            newUncommon = ""
            newRare = ""
            newVersatile = ""
            newAncestryDesc = ""
            newAncestryRarity = ""
            NewBackground = "" 
            newEdict = "" 
            newAnathema = ""
            newAttributes = ""
            newMainSkill = ""
            newLoreSkill = "" 
            newBestApproach = ""
            newWorstApproach = ""
            newPenalty = ""
            newPhysTrait = "" 
            newPsyTrait = ""
            newQuirks = "" 
            newSecret = "" 
            newArc = ""
            newCharAuthor = ""
            // if error from server update message
        } catch (error) {
            console.error('Error saving Character to history:', error);
            message = `Failed to save Character to history: ${error.message}`;
            messageType = 'error';
        }
    }

    // Save current Character to history
    async function saveCurrentChar(pattern) {
        // Post current hook to history
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/characters-history`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentChar.id,
                    name: currentChar.name,
                    commonAncestries: currentChar.commonAncestries,
                    uncommonAncestries: currentChar.uncommonAncestries,
                    rareAncestries: currentChar.rareAncestries,
                    versatileAncestries: currentChar.versatileAncestries,
                    ancestry_description: currentChar.ancestry_description,
                    ancestry_rarity: currentChar.ancestry_rarity,
                    background: currentChar.background,
                    edict: currentChar.edict,
                    anathema: currentChar.anathema,
                    main_attribute: currentChar.main_attribute,
                    main_skill: currentChar.main_skill,
                    lore_skill: currentChar.lore_skill,
                    best_social_approach: currentChar.best_social_approach,
                    worst_social_approach: currentChar.worst_social_approach,
                    social_penalty: currentChar.social_penalty,
                    physical_traits: currentChar.physical_traits,
                    psychological_traits: currentChar.psychological_traits,
                    quirks: currentChar.quirks,
                    dark_secret: currentChar.dark_secret,
                    character_arc: currentChar.character_arc,
                    author: currentChar.author,
                    currentNotes: currentChar.currentNotes,
                    currentAttitude: currentChar.currentAttitude
                })
            })
            // wait for response
            const data = await response.json()
            // If no response throw error
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            // update message
            showMessage("Current Character saved to history!", "success");
            getCharHistory()
            if(pattern === "delete") {
                deleteOldChar()
            }
            currentChar = ""
        } catch (error) {
            console.error('Error saving Character to history:', error);
            message = `Failed to save Character to history: ${error.message}`;
            messageType = 'error';
        }
    }

    // Delete current Character by ID
    async function deleteOldChar() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/all-characters/${currentChar._id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            showMessage("Original Character deleted from database!", "success");
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // Activate Character History
    function activateCharHistory() {
        btnLbl = btnLbl === "Show" ? "Hide" : "Show"
        isCharHistoryActive = isCharHistoryActive === false ? true : false
    }

    // Open history
    function openCharDetails(history) {
        isDetailsOpen = isDetailsOpen === false ? true : false
        characterDetails = history
    }

    // Edit current history hook
    async function editHistoryCharacter(event) {
        event.preventDefault()
    try {
            const resp = await fetch(`${PUBLIC_API_URL}/api/characters-history/${characterDetails._id}`, {
            method: "PATCH",
            headers: {
            "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: characterDetails.id,
                name: characterDetails.name,
                commonAncestries: characterDetails.commonAncestries,
                uncommonAncestries: characterDetails.uncommonAncestries,
                rareAncestries: characterDetails.rareAncestries,
                versatileAncestries: characterDetails.versatileAncestries,
                ancestry_description: characterDetails.ancestry_description,
                ancestry_rarity: characterDetails.ancestry_rarity,
                background: characterDetails.background,
                edict: characterDetails.edict,
                anathema: characterDetails.anathema,
                main_attribute: characterDetails.main_attribute,
                main_skill: characterDetails.main_skill,
                lore_skill: characterDetails.lore_skill,
                best_social_approach: characterDetails.best_social_approach,
                worst_social_approach: characterDetails.worst_social_approach,
                social_penalty: characterDetails.social_penalty,
                physical_traits: characterDetails.physical_traits,
                psychological_traits: characterDetails.psychological_traits,
                quirks: characterDetails.quirks,
                dark_secret: characterDetails.dark_secret,
                character_arc: characterDetails.character_arc,
                author: characterDetails.author,
                currentNotes: characterDetails.currentNotes,
                currentAttitude: characterDetails.currentAttitude
            })
        })
        isEditDetailsOpen = false
        showMessage("Character updated successfully!", "success");
        } catch (error) {
            console.error('Error saving Character to history:', error);
            message = `Failed to save Character to history: ${error.message}`;
            messageType = 'error';
        }
        
    }

    // Delete current history hook by ID
    async function deleteHistoryCharacter(id) {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/characters-history/${id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            isDetailsOpen = false
            getCharHistory()
            showMessage("History entry deleted!", "success");
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // get all Character when app is mounted
    onMount(() => {
        getAllCharacters()
        getCharHistory()
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
    
<!-- Random Character Nav -->
<div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
    <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <button class="btn w-full sm:w-auto" onclick={getOneRandomCharacter}>Get one random character</button>
        <label for="selectRarity" class="text-white">Filter by Rarity</label>
        <select name="selectRarity" id="selectRarity" bind:value={selectRarity} class="text-white w-full sm:w-auto rounded border-2 border-pf-yellow-light">
            <option value="{null}">All</option>
            {#each rarity as r}
                <option value="{r}">{r}</option>
            {/each}
        </select>
        {#if selectRarity === "Common"}
            <label for="selectAncestry" class="text-white">Filter by Ancestry</label>
            <select name="selectAncestry" id="selectAncestry" bind:value={selectAncestry} class="text-white w-full sm:w-auto rounded border-2 border-pf-yellow-light">
                <option value="{null}">All</option>
                {#each commonAncestries as Ancestry}
                    <option value="{Ancestry}">{Ancestry}</option>
                {/each}
            </select>
        {/if}
        {#if selectRarity === "Uncommon"}
            <label for="selectAncestry" class="text-white">Filter by Ancestry</label>
            <select name="selectAncestry" id="selectAncestry" bind:value={selectAncestry} class="text-white w-full sm:w-auto rounded border-2 border-pf-yellow-light">
                <option value="{null}">All</option>
                {#each uncommonAncestries as Ancestry}
                    <option value="{Ancestry}">{Ancestry}</option>
                {/each}
            </select>
        {/if}
        {#if selectRarity === "Rare"}
            <label for="selectAncestry" class="text-white">Filter by Ancestry</label>
            <select name="selectAncestry" id="selectAncestry" bind:value={selectAncestry} class="text-white w-full sm:w-auto rounded border-2 border-pf-yellow-light">
                <option value="{null}">All</option>
                {#each rareAncestries as Ancestry}
                    <option value="{Ancestry}">{Ancestry}</option>
                {/each}
            </select>
        {/if}
        {#if selectRarity === "Versatile"}
            <label for="selectAncestry" class="text-white">Filter by Ancestry</label>
            <select name="selectAncestry" id="selectAncestry" bind:value={selectAncestry} class="text-white w-full sm:w-auto rounded border-2 border-pf-yellow-light">
                <option value="{null}">All</option>
                {#each versatileAncestries as Ancestry}
                    <option value="{Ancestry}">{Ancestry}</option>
                {/each}
            </select>
        {/if}
        
    </div>
    <div class="flex flex-col sm:flex-row">
    <button class="btn w-full sm:w-auto mt-4 sm:mt-0" onclick={() => activateForm("db")}>Add new Character to database</button>
    <button class="btn w-full sm:w-auto mt-4 sm:mt-0" onclick={() => activateForm("his")}>Add new Character to history</button>
    </div> 
</div>

<!-- Random character display -->
{#if currentChar}
    <div class="building-card" transition:slide={{axis:"y", easing:sineOut}}>
        <!-- Top Nav -->
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 top-nav">
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
                    <button class="btn w-full sm:w-auto" onclick={saveCurrentChar}>Save Character</button>
                    <button class="btn-red w-full sm:w-auto" onclick={() => saveCurrentChar("delete")}>Save and Delete</button>
                </div>
                <button class="btn w-full sm:w-auto mt-2 sm:mt-0" onclick={() => currentChar = ""}>Close</button>
        </div>

        <div class="building-details-grid">
            <div class="header-section">
                <h3>{currentChar.name}</h3>
                <p class="building-type"><strong>Ancestries:</strong> {currentChar.commonAncestries} {currentChar.uncommonAncestries} {currentChar.rareAncestries} {currentChar.versatileAncestries}</p>
                <p><strong>Rarity:</strong> {currentChar.ancestry_rarity}</p>
            </div>
            
            <div class="description-section">
                <p><strong>Description:</strong> {currentChar.ancestry_description}</p>
                
            </div>

            <div class="details-columns">
                <div class="detail-box">
                    <p><strong>Background:</strong></p>
                    <p>{currentChar.background}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Edict:</strong></p>
                    <p>{currentChar.edict}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Anathema:</strong></p>
                    <p>{currentChar.anathema}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Main Attribute:</strong></p>
                    <p>{currentChar.main_attribute}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Main Skill:</strong></p>
                    <p>{currentChar.main_skill}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Lore Skill:</strong></p>
                    <p>{currentChar.lore_skill}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Best Social Approach:</strong></p>
                    <p>{currentChar.best_social_approach}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Worst Social Approach:</strong></p>
                    <p>{currentChar.worst_social_approach}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Social Penalty:</strong></p>
                    <p>{currentChar.social_penalty}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Physical Traits:</strong></p>
                    <p>{#each currentChar.physical_traits as physTraits}
                    <li class="ml-8">{physTraits}</li>
                    {/each }</p>
                </div>
                <div class="detail-box">
                    <p><strong>Psychological Traits:</strong></p>
                    <p>{#each currentChar.psychological_traits as psyTraits}
                    <li class="ml-8">{psyTraits}</li>
                    {/each }</p>
                </div>
                <div class="detail-box">
                    <p><strong>Roleplay hints:</strong></p>
                    <p>{#each currentChar.quirks as q}
                    <li class="ml-8">{q}</li>
                    {/each }</p>
                </div>
                <div class="detail-box">
                    <p><strong>Dark Secret:</strong></p>
                    <p>{currentChar.dark_secret}</p>
                </div>
                <div class="detail-box col-span-2">
                    <p><strong>Character Arc:</strong></p>
                    <p>{currentChar.character_arc}</p>
                </div>
            </div>  
            
            <div class="details-columns">
                <div class="detail-box span-full-row">
                    <p><strong>Author:</strong> {currentChar.author}</p>
                </div>
            </div>

            <div class="notes-section">
                <label for="notes"><strong>Notes:</strong></label>
                <textarea name="notes" id="notes" bind:value={currentNotes} class="notes-textarea"></textarea>
                
                <div class="flex items-center mt-4">
                    <p class="pt-1 pb-1"><b>Attitude</b> : </p>
                    <select name="selectAttitude" id="selectAttitude" bind:value={currentAttitude} class="text-white w-full sm:w-auto ml-8 border-2 border-pf-yellow-light rounded">
                        <option value="None">None</option>
                        {#each attitude as a}
                            <option value="{a}">{a}</option>
                        {/each}
                    </select>
                </div>
            </div>
            
            <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
                    <button class="btn w-full sm:w-auto" onclick={saveCurrentChar}>Save Character</button>
                    <button class="btn-red w-full sm:w-auto" onclick={() => saveCurrentChar("delete")}>Save and Delete</button>
                </div>
                <button class="btn w-full sm:w-auto mt-2 sm:mt-0" onclick={() => currentChar = ""}>Close</button>
            </div>
        </div>
    </div>
    {/if}

<!-- New Character Form -->
    {#if isFormActive === true}
    <div class="bg-grey text-white fixed inset-0 items-center justify-center z-50" transition:fly={{x: 200, easing:sineOut}}>
        <div class="max-w-[1200px] ml-auto mr-auto bg-grey rounded text-white p-4 sm:p-8 items-center w-full max-h-full overflow-auto">
            <form onsubmit={createNewCharacter} class="building-details-grid space-y-6">
                
                <!-- Header -->
                <div class="header-section">
                <h2 class="text-2xl font-bold mb-2">Add a New Character</h2>
                <p class="text-pf-yellow-light italic">Provide information about a new character</p>
                </div>
                
                <!-- Basic Info -->
                <div class="details-columns">
                    <div class="detail-box">
                        <label for="name"><b>Name</b></label>
                        <textarea id="name" bind:value={newCharName}></textarea>
                    </div>

                    <div class="detail-box">
                            <label for="rarity"><b>Rarity</b></label>
                            <select name="rarity" id="rarity" bind:value={newRarity}>
                                {#each rarity as r}
                                    <option value={r}>{r}</option>
                                {/each}
                            </select>
                    </div>

                    {#if newRarity === "Common"}                        
                        <div class="detail-box">
                        <label for="ancestry"><b>Ancestry</b></label>
                        <select name="ancestry" id="ancestry" bind:value={newCommon}>
                            {#each commonAncestries as ancestry}
                                <option value={ancestry}>{ancestry}</option>
                            {/each}
                        </select>
                    </div>
                    {/if}
                    {#if newRarity === "Uncommon"}
                        <div class="detail-box">
                        <label for="ancestry"><b>Ancestry</b></label>
                        <select name="ancestry" id="ancestry" bind:value={newUncommon}>
                            {#each uncommonAncestries as ancestry}
                                <option value={ancestry}>{ancestry}</option>
                            {/each}
                        </select>
                    </div>
                    {/if}
                    {#if newRarity === "Rare"}
                        <div class="detail-box">
                        <label for="ancestry"><b>Ancestry</b></label>
                        <select name="ancestry" id="ancestry" bind:value={newRare}>
                            {#each rareAncestries as ancestry}
                                <option value={ancestry}>{ancestry}</option>
                            {/each}
                        </select>
                    </div>
                    {/if}
                    {#if newRarity === "Versatile"}
                        <div class="detail-box">
                        <label for="ancestry"><b>Ancestry</b></label>
                        <select name="ancestry" id="ancestry" bind:value={newVersatile}>
                            {#each versatileAncestries as ancestry}
                                <option value={ancestry}>{ancestry}</option>
                            {/each}
                        </select>
                    </div>
                    {/if}
                                       
                    <div class="detail-box col-span-3">
                        <label for="description"><b>Ancestry Description</b></label>
                        <textarea name="description" id="description" bind:value={newAncestryDesc}> </textarea>
                    </div>
                </div>

                <!-- Descriptions -->
                <div class="details-columns">
                    <div class="detail-box">
                        <label for="background"><b>Background</b></label>
                        <textarea name="background" id="background" bind:value={NewBackground} > </textarea>
                    </div>
                    
                    <div class="detail-box">
                        <label for="edict"><b>Edict</b></label>
                        <textarea name="edict" id="edict" bind:value={newEdict} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="anathema"><b>Anathema</b></label>
                        <textarea name="anathema" id="anathema" bind:value={newAnathema} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="main_attribute"><b>Main Attributes</b></label>
                        <textarea name="main_attribute" id="main_attribute" bind:value={newAttributes} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="main_skill"><b>Main Skill</b></label>
                        <textarea name="main_skill" id="main_skill" bind:value={newMainSkill} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="lore_skill"><b>Lore Skill</b></label>
                        <textarea name="lore_skill" id="lore_skill" bind:value={newLoreSkill} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="best_social_approach"><b>Best Social Approach</b></label>
                        <textarea name="best_social_approach" id="best_social_approach" bind:value={newBestApproach} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="worst_social_approach"><b>Worst Social Approach</b></label>
                        <textarea name="worst_social_approach" id="worst_social_approach" bind:value={newWorstApproach} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="social_penalty"><b>Social Penalty</b></label>
                        <textarea name="social_penalty" id="social_penalty" bind:value={newPenalty} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="physical_traits"><b>Physical Traits</b></label>
                        <textarea name="physical_traits" id="physical_traits" bind:value={newPhysTrait} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="psychological_traits"><b>Psychological Traits</b></label>
                        <textarea name="psychological_traits" id="psychological_traits" bind:value={newPsyTrait} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="quirks"><b>Roleplay Hint</b></label>
                        <textarea name="quirks" id="quirks" bind:value={newQuirks} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="dark_secret"><b>Dark Secret</b></label>
                        <textarea name="dark_secret" id="dark_secret" bind:value={newSecret} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="character_arc"><b>Character Arc</b></label>
                        <textarea name="character_arc" id="character_arc" bind:value={newArc} > </textarea>
                    </div>
                    <div class="detail-box">
                        <label for="author"><b>Author</b></label>
                        <textarea name="author" id="author" bind:value={newCharAuthor} > </textarea>
                    </div>
                </div>
                <div class="mt-4 p-2 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 items-center">
                    <button class="btn w-full sm:w-auto" type="submit">Submit</button>
                    <button class="btn w-full sm:w-auto" type="button" onclick={() => isFormActive = false}>Close</button>
                </div>
            </form>
        </div>
    </div>
{/if}    


<!-- Show history -->
 {#if !currentChar}
<div>
    <button class="btn mb-2" onclick={activateCharHistory}>{btnLbl} History</button>
</div>
{:else}
<div class="max-w-[1150px] ml-auto mr-auto mb-2">
    <button class="btn mb-4" onclick={activateCharHistory}>{btnLbl} History</button>
</div>
{/if}

<!-- History list -->
{#if isCharHistoryActive === true}
    {#if charHistory.length === 0}
        <h2 class="text-3xl text-white font-semibold max-w-[1200px] ml-auto mr-auto">No Character in history</h2>
    {/if}
    <div class="flex flex-col-reverse max-w-[1200px] ml-auto mr-auto" transition:fly={{y: 200, easing:sineOut}}>
        {#each charHistory as history }
            <ul class="bg-pf-yellow-light m-2 rounded shadow-md odd:bg-pf-yellow">
            <li class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                <div class="mb-2 sm:mb-0">
                    <b>Name</b> : {history.name}
                </div>
                <div class="mb-2 sm:mb-0 sm:absolute sm:right-1/4 lg:absolute lg:right-2/4">
                    <b>Date</b> : {history.creationDate.slice(0,10)}
                </div>
                <button onclick={() => openCharDetails(history)} class="px-4 py-2 font-medium border-2 text-yellow bg-grey hover:bg-yellow hover:text-grey hover:border-grey rounded w-full sm:w-auto"><b>Details</b></button>
            </li>
            </ul>
        {/each}
    </div>
{/if}

<!-- Character details -->
{#if isDetailsOpen}
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
                <h3>{characterDetails.name}</h3>
                <p class="building-type">
                    <strong>Ancestries:</strong> {characterDetails.commonAncestries} {characterDetails.uncommonAncestries}
                    {characterDetails.rareAncestries} {characterDetails.versatileAncestries}
                </p>
                <p><strong>Rarity:</strong> {characterDetails.ancestry_rarity}</p>
            </div>

            <!-- Description -->
            <div class="description-section">
                <p><strong>Description:</strong> {characterDetails.ancestry_description}</p>
            </div>

            <!-- Main details -->
            <div class="details-columns">
                <div class="detail-box">
                    <p><strong>Background:</strong></p>
                    <p>{characterDetails.background}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Edict:</strong></p>
                    <p>{characterDetails.edict}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Anathema:</strong></p>
                    <p>{characterDetails.anathema}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Main Attribute:</strong></p>
                    <p>{characterDetails.main_attribute}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Main Skill:</strong></p>
                    <p>{characterDetails.main_skill}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Lore Skill:</strong></p>
                    <p>{characterDetails.lore_skill}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Best Social Approach:</strong></p>
                    <p>{characterDetails.best_social_approach}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Worst Social Approach:</strong></p>
                    <p>{characterDetails.worst_social_approach}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Social Penalty:</strong></p>
                    <p>{characterDetails.social_penalty}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Physical Traits:</strong></p>
                    <p>{#each characterDetails.physical_traits as t}<li class="ml-8">{t}</li>{/each}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Psychological Traits:</strong></p>
                    <p>{#each characterDetails.psychological_traits as t}<li class="ml-8">{t}</li>{/each}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Roleplay Hints:</strong></p>
                    <p>{#each characterDetails.quirks as q}<li class="ml-8">{q}</li>{/each}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Dark Secret:</strong></p>
                    <p>{characterDetails.dark_secret}</p>
                </div>
                <div class="detail-box col-span-2">
                    <p><strong>Character Arc:</strong></p>
                    <p>{characterDetails.character_arc}</p>
                </div>
            </div>

            <!-- Author -->
            <div class="details-columns">
                <div class="detail-box span-full-row">
                    <p><strong>Author:</strong> {characterDetails.author}</p>
                </div>
            </div>

            <!-- Notes + Attitude -->
            <div class="notes-section">
                <p><strong>Notes:</strong> {characterDetails.currentNotes}</p>

                <div class="flex items-center mt-4">
                    <p class="pt-1 pb-1"><b>Attitude</b> : </p>
                    <p class="ml-4">{characterDetails.currentAttitude}</p>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row justify-between items-center mt-4 mb-4 space-y-2 sm:space-y-0">
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
                    <button class="btn w-full sm:w-auto" onclick={() => isEditDetailsOpen = true}>Edit</button>
                    <button class="btn-red w-full sm:w-auto" onclick={() => deleteHistoryCharacter(characterDetails._id)}>Delete</button>
                </div>
                <button class="btn w-full sm:w-auto" onclick={() => isDetailsOpen = false}>Close</button>
            </div>
        </div>
    </div>
</div>
{/if}


<!-- History Character Form -->
{#if isEditDetailsOpen}
<div class="bg-grey text-white fixed inset-0 flex items-center justify-center p-4 z-50" transition:fly={{y: 200, easing: sineOut}}>
  <div class="building-card bg-grey rounded text-white p-4 sm:p-8 w-full max-h-full overflow-auto text-lg">
    <form onsubmit={editHistoryCharacter} class="building-details-grid space-y-6">

      <!-- Header -->
      <div class="header-section">
        <h2 class="text-2xl font-bold mb-2">Edit Character Details</h2>
        <p class="text-pf-yellow-light italic">Modify the selected character’s information</p>
      </div>

      <!-- Basic Info -->
      <div class="details-columns">
        <div class="detail-box">
          <label for="name"><b>Name</b></label>
          <textarea id="name" bind:value={characterDetails.name}></textarea>
        </div>

        <div class="detail-box">
          <label for="rarity"><b>Rarity</b></label>
          <select name="rarity" id="rarity" bind:value={characterDetails.ancestry_rarity}>
            {#each rarity as r}
              <option value={r}>{r}</option>
            {/each}
          </select>
        </div>

        {#if characterDetails.ancestry_rarity === "Common"}
          <div class="detail-box">
            <label for="ancestry"><b>Ancestry</b></label>
            <select name="ancestry" id="ancestry" bind:value={characterDetails.commonAncestries}>
              {#each commonAncestries as ancestry}
                <option value={ancestry}>{ancestry}</option>
              {/each}
            </select>
          </div>
        {/if}

        {#if characterDetails.ancestry_rarity === "Uncommon"}
          <div class="detail-box">
            <label for="ancestry"><b>Ancestry</b></label>
            <select name="ancestry" id="ancestry" bind:value={characterDetails.uncommonAncestries}>
              {#each uncommonAncestries as ancestry}
                <option value={ancestry}>{ancestry}</option>
              {/each}
            </select>
          </div>
        {/if}

        {#if characterDetails.ancestry_rarity === "Rare"}
          <div class="detail-box">
            <label for="ancestry"><b>Ancestry</b></label>
            <select name="ancestry" id="ancestry" bind:value={characterDetails.rareAncestries}>
              {#each rareAncestries as ancestry}
                <option value={ancestry}>{ancestry}</option>
              {/each}
            </select>
          </div>
        {/if}

        {#if characterDetails.ancestry_rarity === "Versatile"}
          <div class="detail-box">
            <label for="ancestry"><b>Ancestry</b></label>
            <select name="ancestry" id="ancestry" bind:value={characterDetails.versatileAncestries}>
              {#each versatileAncestries as ancestry}
                <option value={ancestry}>{ancestry}</option>
              {/each}
            </select>
          </div>
        {/if}

        <div class="detail-box col-span-3">
          <label for="description"><b>Ancestry Description</b></label>
          <textarea name="description" id="description" bind:value={characterDetails.ancestry_description}></textarea>
        </div>
      </div>

      <!-- Descriptions -->
      <div class="details-columns">
        <div class="detail-box">
          <label for="background"><b>Background</b></label>
          <textarea id="background" bind:value={characterDetails.background}></textarea>
        </div>

        <div class="detail-box">
          <label for="edict"><b>Edict</b></label>
          <textarea id="edict" bind:value={characterDetails.edict}></textarea>
        </div>

        <div class="detail-box">
          <label for="anathema"><b>Anathema</b></label>
          <textarea id="anathema" bind:value={characterDetails.anathema}></textarea>
        </div>

        <div class="detail-box">
          <label for="main_attribute"><b>Main Attribute</b></label>
          <textarea id="main_attribute" bind:value={characterDetails.main_attribute}></textarea>
        </div>

        <div class="detail-box">
          <label for="main_skill"><b>Main Skill</b></label>
          <textarea id="main_skill" bind:value={characterDetails.main_skill}></textarea>
        </div>

        <div class="detail-box">
          <label for="lore_skill"><b>Lore Skill</b></label>
          <textarea id="lore_skill" bind:value={characterDetails.lore_skill}></textarea>
        </div>

        <div class="detail-box">
          <label for="best_social_approach"><b>Best Social Approach</b></label>
          <textarea id="best_social_approach" bind:value={characterDetails.best_social_approach}></textarea>
        </div>

        <div class="detail-box">
          <label for="worst_social_approach"><b>Worst Social Approach</b></label>
          <textarea id="worst_social_approach" bind:value={characterDetails.worst_social_approach}></textarea>
        </div>

        <div class="detail-box">
          <label for="social_penalty"><b>Social Penalty</b></label>
          <textarea id="social_penalty" bind:value={characterDetails.social_penalty}></textarea>
        </div>

        <div class="detail-box">
          <label for="physical_traits"><b>Physical Traits</b></label>
          <textarea id="physical_traits" bind:value={characterDetails.physical_traits}></textarea>
        </div>

        <div class="detail-box">
          <label for="psychological_traits"><b>Psychological Traits</b></label>
          <textarea id="psychological_traits" bind:value={characterDetails.psychological_traits}></textarea>
        </div>

        <div class="detail-box">
          <label for="quirks"><b>Roleplay Hint</b></label>
          <textarea id="quirks" bind:value={characterDetails.quirks}></textarea>
        </div>

        <div class="detail-box">
          <label for="dark_secret"><b>Dark Secret</b></label>
          <textarea id="dark_secret" bind:value={characterDetails.dark_secret}></textarea>
        </div>

        <div class="detail-box">
          <label for="character_arc"><b>Character Arc</b></label>
          <textarea id="character_arc" bind:value={characterDetails.character_arc}></textarea>
        </div>

        <div class="detail-box">
          <label for="author"><b>Author</b></label>
          <textarea id="author" bind:value={characterDetails.author}></textarea>
        </div>
      </div>

      <!-- Notes and Attitude -->
      <div class="details-columns">
        <div class="detail-box col-span-2">
          <label for="notes"><b>Notes</b></label>
          <textarea id="notes" bind:value={characterDetails.currentNotes}></textarea>
        </div>

        <div class="detail-box">
          <label for="selectAttitude"><b>Attitude</b></label>
          <select id="selectAttitude" bind:value={characterDetails.currentAttitude}>
            <option value="None">None</option>
            {#each attitude as a}
              <option value={a}>{a}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
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
