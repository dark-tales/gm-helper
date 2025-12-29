<script>
    import { createEventDispatcher } from 'svelte';
    import {fade, fly, slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"
    // Import icons
    import MdHome from 'svelte-icons/md/MdHome.svelte'
    import MdPerson from 'svelte-icons/md/MdPerson.svelte'
    import MdDirectionsWalk from 'svelte-icons/md/MdDirectionsWalk.svelte'
    import MdLibraryBooks from 'svelte-icons/md/MdLibraryBooks.svelte'
    import MdBuild from 'svelte-icons/md/MdBuild.svelte'
    import MdLocationCity from 'svelte-icons/md/MdLocationCity.svelte'
    import MdSystemUpdateAlt from 'svelte-icons/md/MdSystemUpdateAlt.svelte'

    const dispatch = createEventDispatcher();

    // Props received from the parent (+page.svelte)
    let { navMessage, activeComponent } = $props();

    // State for controlling the mobile navigation menu visibility
    let smallNav = $state(false);

    /**
     * Dispatches an event to the parent to change the active component
     * and updates the local navMessage.
     * @param {string} componentName - The name of the component to activate.
     */
    function activateComponent(componentName) {
        dispatch('changeComponent', { component: componentName });
        navMessage = componentName; // Update navMessage locally for immediate display
        smallNav = false; // Close the mobile menu after selection
        
    }

    /**
     * Toggles the visibility of the mobile navigation menu.
     */
    function toggleSmallNav() {
        smallNav = !smallNav;
        
    }
</script>

<main>
    <aside class="sm:flex flex-col sm:flex-row w-screen bg-pf-green sm:justify-between items-center p-2 sm:p-0">
        <!-- Desktop Navigation Buttons (hidden on small screens) -->
        <div class="hidden sm:flex">
            <button
                class="{activeComponent === "STORYHOOK" ? "btn-nav" : "btn-dark"} w-15 h-15 p-2 m-1 rounded-md transition-colors duration-200"
                onclick={() => activateComponent("STORYHOOK")}
                aria-label="Story Hooks"
            >
                <MdLibraryBooks class="w-8 h-8" />
            </button>
            <button
                class="{activeComponent === "CHARACTER" ? "btn-nav" : "btn-dark"} w-15 h-15 p-2 m-1 rounded-md transition-colors duration-200"
                onclick={() => activateComponent("CHARACTER")}
                aria-label="Characters"
            >
                <MdPerson class="w-8 h-8" />
            </button>
            <button
                class="{activeComponent === "ITEMS" ? "btn-nav" : "btn-dark"} w-15 h-15 p-2 m-1 rounded-md transition-colors duration-200"
                onclick={() => activateComponent("ITEMS")}
                aria-label="Items"
            >
                <MdBuild class="w-8 h-8" />
            </button>
            <button
                class="{activeComponent === "BUILDINGS" ? "btn-nav" : "btn-dark"} w-15 h-15 p-2 m-1 rounded-md transition-colors duration-200"
                onclick={() => activateComponent("BUILDINGS")}
                aria-label="Buildings"
            >
                <MdHome class="w-8 h-8" />
            </button>
            <button
                class="{activeComponent === "TRAVEL" ? "btn-nav" : "btn-dark"} w-15 h-15 p-2 m-1 rounded-md transition-colors duration-200"
                onclick={() => activateComponent("TRAVEL")}
                aria-label="Travel"
            >
                <MdDirectionsWalk class="w-8 h-8" />
            </button>
            <button
                class="{activeComponent === "SETTLEMENTS" ? "btn-nav" : "btn-dark"} w-15 h-15 p-2 m-1 rounded-md transition-colors duration-200"
                onclick={() => activateComponent("SETTLEMENTS")}
                aria-label="Settlements"
            >
                <MdLocationCity class="w-8 h-8" />
            </button>
            <button
                class="{activeComponent === "SUBSYSTEMS" ? "btn-nav" : "btn-dark"} w-15 h-15 p-2 m-1 rounded-md transition-colors duration-200"
                onclick={() => activateComponent("SUBSYSTEMS")}
                aria-label="Settlements"
            >
                <MdSystemUpdateAlt class="w-8 h-8" />
            </button>
        </div>

        <!-- Desktop Nav Message (hidden on small screens) -->
        <div class="hidden sm:flex items-center justify-end text-white font-extrabold text-5xl mr-4">
            <h1>{navMessage}</h1>
        </div>

        <!-- Mobile Nav Toggle Button (visible only on small screens) -->
        <div class="visible sm:hidden flex justify-center w-full">
            <button
                class="text-white font-extrabold text-5xl p-2 m-2 bg-pf-green hover:bg-pf-green-dark rounded-md transition-colors duration-200"
                onclick={toggleSmallNav}
                aria-expanded={smallNav}
                aria-controls="mobile-nav-menu"
            >
                {navMessage}
            </button>
        </div>

        <!-- Mobile Navigation Menu (shown only when smallNav is true and on small screens) -->
        {#if smallNav}
            <div id="mobile-nav-menu" class="visible sm:hidden flex flex-col items-center w-full mt-2" transition:slide={{axis:"y", easing:sineOut}}>
                <button
                    class="{activeComponent === "STORYHOOK" ? "btn-nav" : "btn-dark"} w-full h-15 p-3 m-1 rounded-md transition-colors duration-200"
                    onclick={() => activateComponent("STORYHOOK")}
                >
                    <MdLibraryBooks class="inline-block mr-2" /> 
                </button>
                <button
                    class="{activeComponent === "CHARACTER" ? "btn-nav" : "btn-dark"} w-full h-15 p-3 m-1 rounded-md transition-colors duration-200"
                    onclick={() => activateComponent("CHARACTER")}
                >
                    <MdPerson class="inline-block mr-2" /> 
                </button>
                <button
                    class="{activeComponent === "ITEMS" ? "btn-nav" : "btn-dark"} w-full h-15 p-3 m-1 rounded-md transition-colors duration-200"
                    onclick={() => activateComponent("ITEMS")}
                >
                    <MdBuild class="inline-block mr-2" /> 
                </button>
                <button
                    class="{activeComponent === "BUILDINGS" ? "btn-nav" : "btn-dark"} w-full h-15 p-3 m-1 rounded-md transition-colors duration-200"
                    onclick={() => activateComponent("BUILDINGS")}
                >
                    <MdHome class="inline-block mr-2" /> 
                </button>
                <button
                    class="{activeComponent === "TRAVEL" ? "btn-nav" : "btn-dark"} w-full h-15 p-3 m-1 rounded-md transition-colors duration-200"
                    onclick={() => activateComponent("TRAVEL")}
                >
                    <MdDirectionsWalk class="inline-block mr-2" /> 
                </button>
                <button
                    class="{activeComponent === "SETTLEMENTS" ? "btn-nav" : "btn-dark"} w-full h-15 p-3 m-1 rounded-md transition-colors duration-200"
                    onclick={() => activateComponent("SETTLEMENTS")}
                >
                    <MdLocationCity class="inline-block mr-2" /> 
                </button>
                <button
                    class="{activeComponent === "SUBSYSTEMS" ? "btn-nav" : "btn-dark"} w-full h-15 p-3 m-1 rounded-md transition-colors duration-200"
                    onclick={() => activateComponent("SUBSYSTEMS")}
                >
                    <MdSystemUpdateAlt class="inline-block mr-2" /> 
                </button>
            </div>
        {/if}
    </aside>
</main>


