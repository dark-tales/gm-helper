<script>
    import {onMount} from "svelte"
    import {fade, fly, slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"
    import {sineIn} from "svelte/easing"
    import {PUBLIC_API_URL} from '$env/static/public'

    // State variables related to items generation
    let allItems = $state([])
    let currentItem = $state("")
    let selectType = $state(null)
    let isFormActive = $state(false)
    let currentNotes = $state("")
    let item_search = $state(false)
    let item_found = $state(false)

    // State variables related to new items
    let newName = $state("")
    let newType = $state("")
    let newCategory = $state("")
    let newDescription = $state("")
    let newItemHistory = $state("")
    let newLocation = $state("")
    let newHiddenPlace = $state("")
    let newTips = $state("")
    let newAuthor = $state("")

    // State variables related to item history
    let itemHistory = $state([])
    let btnLbl = $state("Show")
    let isItemHistoryActive = $state(false)
    let isDetailsOpen = $state(false)
    let itemDetails = $state([])
    let isEditDetailsOpen = $state(false)

    // specific data for Items
    let type = $state([
        "Adventuring Gear",
        "Alchemical Items",
        "Animals and Gear",
        "Apex Items",
        "Armor",
        "Artifacts",
        "Assistive Items",
        "Blighted Boons",
        "Censers",
        "Consumables",
        "Contracts",
        "Cursed Items",
        "Customizations",
        "Figureheads",
        "Grafts",
        "Grimoires",
        "Intelligent Items",
        "Materials",
        "Relics",
        "Runes",
        "Shields",
        "Siege Weapons",
        "Snares",
        "Spellhearts",
        "Staves",
        "Vehicles",
        "Wands",
        "Weapons",
        "Worn Item"
    ])

    // State variables related to message
    let message = $state("")
    let messageType = $state("")

    // Get all items
    async function getAllItems() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/items`)
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            allItems = await res.json()
        } catch (error) {
            console.error("Error fetching character:", error)
            showMessage(`Operation failed: ${error.message}`, "error");
        }
    }

    // Get Item History
        async function getItemHistory() {
            try {
                const res = await fetch(`${PUBLIC_API_URL}/api/items-history`)
                if (!res.ok) {
                    throw new Error(`Server error! Status : ${res.status}`)
                }
                itemHistory = await res.json()
            } catch (error) {
                console.error("Error fetching items:", error)
            }
        }
    
    // Activate Character History
    function activateItemHistory() {
        btnLbl = btnLbl === "Show" ? "Hide" : "Show"
        isItemHistoryActive = isItemHistoryActive === false ? true : false
    }

    // Get one random Item 
    function getOneRandomItem() {       
            
        // if no item send message
        if (allItems.length === 0) {
            showMessage("No item found with the selected filters!", "warning");
        } 
        
        // Request for all items
        else if (selectType === null) {
            const randomIndex = Math.floor(Math.random() * allItems.length)
            currentItem = allItems[randomIndex]
            showMessage("Random item generated!", "success")            
        } 
        
        // request specific Type
        else if (selectType === selectType) {
            const specialType = allItems.filter(allItems => {
                return allItems.type === selectType
            })
            if (specialType.length === 0) {
            showMessage("No item found with the selected filters!", "warning");
            } else {  
            const randomIndex = Math.floor(Math.random() * specialType.length)
            currentItem = specialType[randomIndex]
            showMessage("Random item generated!", "success");
            }
        }
    }

    // Activate form
    function activateForm(param) {
        isFormActive = isFormActive === false ? true : false  
        if(param === "db") {
            URL = `${PUBLIC_API_URL}/api/items`
        } else if(param === "his") {
            URL = `${PUBLIC_API_URL}/api/items-history`
        }      
    }

    // Create new Item
    async function createNewItem(event) {
        event.preventDefault()
        // Post new Item from form
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    type: newType,
                    category: newCategory,
                    description: newDescription,
                    item_history: newItemHistory,
                    location: newLocation,
                    hidden_place: newHiddenPlace,
                    tips: newTips, 
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
            getAllItems()
            getItemHistory()
            showMessage(data.message || "Item created successfully!", "success");
            URL = ""
            newName = ""
            newType = ""
            newCategory = ""
            newDescription = ""
            newItemHistory = ""
            newLocation = ""
            newHiddenPlace = ""
            newTips = "" 
            newAuthor = "" 
            // if error from server update message
        } catch (error) {
            console.error('Error saving Item to history:', error);
            message = `Failed to save Item to history: ${error.message}`;
            messageType = 'error';
        }
    }

    // Delete current Item by ID
    async function deleteOldItem() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/items/${currentItem._id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            showMessage("Original Item deleted from database!", "success");
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // Save current Item to history
    async function saveCurrentItem(pattern) {
        // Post current item to history
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/items-history`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentItem.id,
                    name: currentItem.name,
                    type: currentItem.type,
                    category: currentItem.category,
                    description: currentItem.description,
                    item_history: currentItem.item_history,
                    location: currentItem.location,
                    hidden_place: currentItem.hidden_place,
                    tips: currentItem.tips, 
                    author: currentItem.author,
                    item_search: item_search,
                    item_found: item_found,
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
            showMessage("Current Item saved to history!", "success");
            getItemHistory()
            if(pattern === "delete") {
                deleteOldItem()
            }
            currentItem = ""
        } catch (error) {
            console.error('Error saving Item to history:', error);
            message = `Failed to save Character to history: ${error.message}`;
            messageType = 'error';
        }
    }

    // Open history details
    function openItemDetails(history) {
        isDetailsOpen = isDetailsOpen === false ? true : false
        itemDetails = history
    }

    // Edit current history hook
    async function editHistoryItem(event) {
        event.preventDefault()
    try {
            const resp = await fetch(`${PUBLIC_API_URL}/api/items-history/${itemDetails._id}`, {
            method: "PATCH",
            headers: {
            "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: itemDetails.name,
                type: itemDetails.type,
                category: itemDetails.category,
                description: itemDetails.description,
                item_history: itemDetails.item_history,
                location: itemDetails.location,
                hidden_place: itemDetails.hidden_place,
                tips: itemDetails.tips, 
                author: itemDetails.author,
                currentNotes: itemDetails.currentNotes,
                item_search: itemDetails.item_search,
                item_found: itemDetails.item_found
            })
        })
        isEditDetailsOpen = false
        showMessage("Item updated successfully!", "success");
        } catch (error) {
            console.error('Error saving Item to history:', error);
            message = `Failed to save Item to history: ${error.message}`;
            messageType = 'error';
        }
        
    }

    // Delete current history hook by ID
    async function deleteHistoryItem(id) {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/api/items-history/${id}`, {method: "DELETE"})
            if (!res.ok) {
                throw new Error(`Server error! Status : ${res.status}`)
            }
            isDetailsOpen = false
            getItemHistory()
            showMessage("History entry deleted!", "success");
        } catch (error) {
            console.error("Error fetching hooks:", error)
        }
    }

    // get all Items when app is mounted
    onMount(() => {
        getAllItems()
        getItemHistory()
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
    
<!-- Random Item Nav -->
<div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
    <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <button class="btn w-full sm:w-auto" onclick={getOneRandomItem}>Get one random item</button>
        <label for="selectRarity" class="text-white">Filter by Type</label>
        <select name="selectRarity" id="selectRarity" bind:value={selectType} class="text-white w-full sm:w-auto border-2 border-pf-yellow-light rounded">
            <option value="{null}">All</option>
            {#each type as t}
                <option value="{t}">{t}</option>
            {/each}
        </select>   
    </div>
    <div class="flex flex-col sm:flex-row">
    <button class="btn w-full sm:w-auto mt-4 sm:mt-0" onclick={() => activateForm("db")}>Add new Item to database</button>
    <button class="btn w-full sm:w-auto mt-4 sm:mt-0" onclick={() => activateForm("his")}>Add new Item to history</button>
    </div> 
</div>

<!-- Random Item Display -->
{#if currentItem}
<div class="building-card" transition:slide={{axis:"y", easing:sineOut}}>        
    <div class="building-details-grid">
        <!-- Top Buttons -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 top-nav">
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto items-center">
                <button class="btn w-full sm:w-auto" onclick={saveCurrentItem}>Save Item</button>
                <button class="btn-red w-full sm:w-auto" onclick={() => saveCurrentItem('delete')}>Save and Delete</button>
            </div>
            <button class="btn w-full sm:w-auto mt-2 sm:mt-0" onclick={() => currentItem = ''}>Close</button>
        </div>
        <!-- Header Section -->
        <div class="header-section">
            <h3>{currentItem.name}</h3>
            <p class="building-type"><strong>Type:</strong> {currentItem.type}</p>
            <p><strong>Category:</strong> {currentItem.category}</p>
        </div>
        
        <!-- Description Section -->
        <div class="description-section">
            <p><strong>Description:</strong> {currentItem.description}</p>
        </div>

        <!-- Details Grid -->
        <div class="details-columns">
            <div class="detail-box col-span-full">
                <p><strong>Item History:</strong></p>
                <p>{currentItem.item_history}</p>
            </div>
            <div class="detail-box">
                <p><strong>Location:</strong></p>
                <p>{currentItem.location}</p>
            </div>
            <div class="detail-box col-span-2">
                <p><strong>Hidden Place:</strong></p>
                <p>{currentItem.hidden_place}</p>
            </div>
            <div class="detail-box col-span-full">
                <p><strong>Tips:</strong></p>
                <p>{#each currentItem.tips as t}<li class="ml-8">{t}</li>{/each}</p>
            </div>
            <div class="detail-box">
                <p><strong>Author:</strong> {currentItem.author}</p>
            </div>
        </div>  

        <!-- Notes Section -->
        <div class="notes-section">
            <label for="notes"><strong>Notes:</strong></label>
            <textarea name="notes" id="notes" bind:value={currentNotes} class="notes-textarea"></textarea>

            <div class="flex flex-col sm:flex-row sm:space-x-6 items-center mt-4">
                <label for="search" class="flex items-center space-x-2">
                    <input type="checkbox" id="search" bind:checked={item_search} class="accent-pf-yellow-light">
                    <span>Search started?</span>
                </label>

                <label for="founded" class="flex items-center space-x-2 mt-2 sm:mt-0">
                    <input type="checkbox" id="founded" bind:checked={item_found} class="accent-pf-yellow-light">
                    <span>Item found?</span>
                </label>
            </div>
        </div>

        <!-- Footer Buttons -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto items-center">
                <button class="btn w-full sm:w-auto" onclick={saveCurrentItem}>Save Item</button>
                <button class="btn-red w-full sm:w-auto" onclick={() => saveCurrentItem('delete')}>Save and Delete</button>
            </div>
            <button class="btn w-full sm:w-auto mt-2 sm:mt-0" onclick={() => currentItem = ''}>Close</button>
        </div>
    </div>
</div>
{/if}


<!-- New Item Form -->
{#if isFormActive === true}
<div class="bg-grey text-white fixed inset-0 items-center justify-center z-50" transition:fly={{x: 200, easing:sineOut}}>
    <div class="max-w-[1200px] ml-auto mr-auto bg-grey rounded text-white p-4 sm:p-8 items-center w-full max-h-full overflow-auto">
        <form onsubmit={createNewItem} class="building-details-grid space-y-6">

            <!-- Header -->
            <div class="header-section">
                <h2 class="text-2xl font-bold mb-2">Add a New Item</h2>
                <p class="text-pf-yellow-light italic">Provide information about a new item</p>
            </div>

            <!-- Basic Info -->
            <div class="details-columns">
                <div class="detail-box">
                    <label for="name"><b>Name</b></label>
                    <textarea id="name" bind:value={newName}></textarea>
                </div>

                <div class="detail-box">
                    <label for="type"><b>Type</b></label>
                    <select id="type" bind:value={newType}>
                        {#each type as t}
                            <option value={t}>{t}</option>
                        {/each}
                    </select>
                </div>

                <div class="detail-box">
                    <label for="category"><b>Category</b></label>
                    <textarea id="category" bind:value={newCategory}></textarea>
                </div>
            </div>

            <!-- Descriptions -->
            <div class="details-columns">
                <div class="detail-box col-span-3">
                    <label for="description"><b>Description</b></label>
                    <textarea id="description" bind:value={newDescription}></textarea>
                </div>

                <div class="detail-box col-span-3">
                    <label for="item_history"><b>Item History</b></label>
                    <textarea id="item_history" bind:value={newItemHistory}></textarea>
                </div>

                <div class="detail-box col-span-3">
                    <label for="location"><b>Location</b></label>
                    <textarea id="location" bind:value={newLocation}></textarea>
                </div>

                <div class="detail-box col-span-3">
                    <label for="hidden_place"><b>Hiding Place</b></label>
                    <textarea id="hidden_place" bind:value={newHiddenPlace}></textarea>
                </div>

                <div class="detail-box col-span-3">
                    <label for="tips"><b>Tips</b></label>
                    <textarea id="tips" bind:value={newTips}></textarea>
                </div>

                <div class="detail-box col-span-3">
                    <label for="author"><b>Author</b></label>
                    <textarea id="author" bind:value={newAuthor}></textarea>
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
{#if !currentItem}
<div>
    <button class="btn mb-2" onclick={activateItemHistory}>{btnLbl} History</button>
</div>
{:else}
<div class="max-w-[1150px] ml-auto mr-auto mb-2">
    <button class="btn mb-4" onclick={activateItemHistory}>{btnLbl} History</button>
</div>
{/if}

<!-- History list -->
{#if isItemHistoryActive === true}
    {#if itemHistory.length === 0}
        <h2 class="text-3xl text-white font-semibold max-w-[1200px] ml-auto mr-auto">No Item in history</h2>
    {/if}
    <div class="flex flex-col-reverse max-w-[1200px] ml-auto mr-auto" transition:fly={{y: 200, easing:sineOut}}>
        {#each itemHistory as history }
            <ul class="bg-pf-yellow-light m-2 rounded shadow-md odd:bg-pf-yellow">
            <li class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                <div class="mb-2 sm:mb-0">
                    <b>Name</b> : {history.name}
                </div>
                <div class="mb-2 sm:mb-0 sm:absolute sm:right-1/4 lg:absolute lg:right-2/4">
                    <b>Date</b> : {history.creationDate.slice(0,10)}
                </div>
                <button onclick={() => openItemDetails(history)} class="px-4 py-2 font-medium border-2 text-yellow bg-grey hover:bg-yellow hover:text-grey hover:border-grey rounded w-full sm:w-auto"><b>Details</b></button>
            </li>
            </ul>
        {/each}
    </div>
{/if}

<!-- Item details -->
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
                <h3>{itemDetails.name}</h3>
                <p class="building-type">
                    <strong>Type:</strong> {itemDetails.type}
                </p>
                <p><strong>Category:</strong> {itemDetails.category}</p>
            </div>

            <!-- Description -->
            <div class="description-section">
                <p><strong>Description:</strong> {itemDetails.description}</p>
            </div>

            <!-- Main details -->
            <div class="details-columns">
                <div class="detail-box col-span-3">
                    <p><strong>Item History:</strong></p>
                    <p>{itemDetails.item_history}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Location:</strong></p>
                    <p>{itemDetails.location}</p>
                </div>
                <div class="detail-box col-span-2">
                    <p><strong>Hiding Place:</strong></p>
                    <p>{itemDetails.hidden_place}</p>
                </div>
                <div class="detail-box col-span-3">
                    <p><strong>Tips:</strong></p>
                    <p>{#each itemDetails.tips as tips} <li class="ml-8">{tips}</li>{/each}</p>
                </div>
                <div class="detail-box col-span-2">
                    <p><strong>Current Notes:</strong></p>
                    <p>{itemDetails.currentNotes}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Search Started?</strong></p>
                    <p>{itemDetails.item_search ? 'Yes' : 'No'}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Item Found?</strong></p>
                    <p>{itemDetails.item_found ? 'Yes' : 'No'}</p>
                </div>
                <div class="detail-box">
                    <p><strong>Author:</strong></p>
                    <p>{itemDetails.author}</p>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row justify-between items-center mt-4 mb-4 space-y-2 sm:space-y-0">
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
                    <button class="btn w-full sm:w-auto" onclick={() => isEditDetailsOpen = true}>Edit</button>
                    <button class="btn-red w-full sm:w-auto" onclick={() => deleteHistoryItem(itemDetails._id)}>Delete</button>
                </div>
                <button class="btn w-full sm:w-auto" onclick={() => isDetailsOpen = false}>Close</button>
            </div>
        </div>
    </div>
</div>
{/if}


<!-- History Item Form -->
{#if isEditDetailsOpen}
<div class="bg-grey text-white fixed inset-0 flex items-center justify-center p-4 z-50" transition:fly={{y: 200, easing: sineOut}}>
  <div class="building-card bg-grey rounded text-white p-4 sm:p-8 w-full max-h-full overflow-auto text-lg">
    <form onsubmit={editHistoryItem} class="building-details-grid space-y-6">

      <!-- Header -->
      <div class="header-section">
        <h2 class="text-2xl font-bold mb-2">Edit Item Details</h2>
        <p class="text-pf-yellow-light italic">Modify the selected item’s information</p>
      </div>

      <!-- Basic Info -->
      <div class="details-columns">
        <div class="detail-box">
          <label for="name"><b>Name</b></label>
          <textarea id="name" bind:value={itemDetails.name}></textarea>
        </div>

        <div class="detail-box">
          <label for="type"><b>Type</b></label>
          <select id="type" bind:value={itemDetails.type}>
            {#each type as t}
              <option value={t}>{t}</option>
            {/each}
          </select>
        </div>

        <div class="detail-box">
          <label for="category"><b>Category</b></label>
          <textarea id="category" bind:value={itemDetails.category}></textarea>
        </div>

        <div class="detail-box col-span-3">
          <label for="description"><b>Description</b></label>
          <textarea id="description" bind:value={itemDetails.description}></textarea>
        </div>
      </div>

      <!-- History & Location -->
      <div class="details-columns">
        <div class="detail-box col-span-3">
          <label for="item_history"><b>Item History</b></label>
          <textarea id="item_history" bind:value={itemDetails.item_history}></textarea>
        </div>

        <div class="detail-box">
          <label for="location"><b>Location</b></label>
          <textarea id="location" bind:value={itemDetails.location}></textarea>
        </div>

        <div class="detail-box col-span-2">
          <label for="hidden_place"><b>Hiding Place</b></label>
          <textarea id="hidden_place" bind:value={itemDetails.hidden_place}></textarea>
        </div>

        <div class="detail-box col-span-3">
          <label for="tips"><b>Tips</b></label>
          <textarea id="tips" bind:value={itemDetails.tips}></textarea>
        </div>
      </div>

      <!-- Notes and Flags -->
      <div class="details-columns">
        <div class="detail-box col-span-3">
          <label for="currentNotes"><b>Notes</b></label>
          <textarea id="currentNotes" bind:value={itemDetails.currentNotes}></textarea>
        </div>

        <div class="detail-box">
          <label for="author"><b>Author</b></label>
          <textarea id="author" bind:value={itemDetails.author}></textarea>
        </div>

        <div class="detail-box flex flex-col justify-center space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="search" bind:checked={itemDetails.item_search}>
            <span><b>Search started?</b></span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="founded" bind:checked={itemDetails.item_found}>
            <span><b>Item found?</b></span>
          </label>
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
        padding-left: 1rem;
        position: relative;
    }

    .detail-box li:before {
        position: absolute;
        left: 0;
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