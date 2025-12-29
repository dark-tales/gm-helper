<script>
    // CAMPAIGN NAME 
    let campaign = "SYNDICATE"
    // import main components
    import StoryHooks from "./StoryHooks.svelte";

    // import icons
    
    import Characters from "./Characters.svelte";
    import Items from "./Items.svelte";
    import Buildings from "./Buildings.svelte";
    import Travel from "./Travel.svelte";
    import Navbar from "./Navbar.svelte";
    import Settlements from "./settlements/Settlements.svelte";
  import Subsystems from "./subsystems/Subsystems.svelte";
    let navMessage = $state("HOME")
    let activeComponent = $state("WELCOME")

    // Function to handle the custom event from Navbar
    function handleComponentChange(event) {
        activeComponent = event.detail.component; // Update activeComponent with the data from the event
        navMessage = event.detail.component; // Also update navMessage if you want it to reflect the active component
    }
</script>

<main class="bg-grey animate-fade-in w-screen h-screen flex flex-col">
    <Navbar {navMessage} {activeComponent} on:changeComponent={handleComponentChange} />
    
    <div class="grow">
        {#if activeComponent === "WELCOME"}
            <h2 class="text-pf-yellow-light text-7xl p-4 m-4 font-semibold md:text-8xl md:p-24 md:m-24 md:font-bold lg:text-9xl lg:p-32 lg:m-32 lg:font-extrabold text-center ">Welcome to <br> {campaign}</h2>
        {/if}
        {#if activeComponent === "STORYHOOK"}
            <StoryHooks />
        {/if}
        {#if activeComponent === "CHARACTER"}
            <Characters />
        {/if}
        {#if activeComponent === "ITEMS"}
            <Items />
        {/if}
        {#if activeComponent === "BUILDINGS"}
            <Buildings />
        {/if}
        {#if activeComponent === "TRAVEL"}
            <Travel />
        {/if}
        {#if activeComponent === "SETTLEMENTS"}
            <Settlements />
        {/if}
        {#if activeComponent === "SUBSYSTEMS"}
            <Subsystems />
        {/if}
    </div>
</main>

<style>
        /* Define the fade-in keyframes */
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        /* Apply the animation using a custom utility or directly */
        .animate-fade-in {
            animation: fadeIn 0.2s ease-in forwards; /* 2 seconds duration, ease-in-out timing, stays at end state */
        } 
</style>

