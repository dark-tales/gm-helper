<script>
    import {onMount} from "svelte"
    import {fade, fly, slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"
    import {sineIn} from "svelte/easing"
  import StoryHooks from "./StoryHooks.svelte";
  import Characters from "./Characters.svelte";
  import Buildings from "./Buildings.svelte";
  import { PUBLIC_API_URL } from '$env/static/public'

    // State variables related to timer
    let selectedTimer = $state(null) // '1min', '3min', '5min'
    let timeLeft = $state(0) // Time in seconds
    let isRunning = $state(false)
    let timerInterval = null // To store the setInterval ID
    let currentTimerType = $state("") // To differentiate prompts
    let showPromptModal = $state(false)
    let timeInSeconds = $state(0)

    // State variables related to encounter
    let combatEncounter = $state(false)
    let nonCombatEncounter = $state("")
    let combatEncounterChance = $state(0)
    let nonCombatEncounterChance = $state(0)
    let combatEncounterDisplay = $state(false)
    // State variables related to conversations
    let currentConvo = $state("")
    let currentFakeEncounter = $state("")
    let currentItem = $state("")
    let currentCombat = $state("")
    let currentDifficulty = $state("")
    const conversationStarters = [
    // --- Personal Reflections & Background (1-20) ---
    "What's the most surprising skill or talent you possess that has absolutely nothing to do with adventuring?",
    "Tell us about a time you tried to learn something new, and it went hilariously wrong (or surprisingly well).",
    "If you could send a single message back in time to your younger, pre-adventuring self, what would it be?",
    "What's one small comfort or luxury from your past life that you genuinely miss on the road?",
    "What's the fondest memory you have from your childhood?",
    "Is there a piece of advice you received early in life that you still live by?",
    "What's a minor habit or quirk you have that most people don't know about?",
    "If you could relive one day of your life, which one would it be and why?",
    "What's one thing you're surprisingly particular about?",
    "What's the most valuable lesson you've learned outside of combat?",
    "If you had to describe yourself in three words, what would they be?",
    "What's a dream or aspiration you had before you became an adventurer?",
    "Is there a specific scent or sound that instantly transports you back to a particular memory?",
    "What's one thing you're surprisingly good at that doesn't involve fighting or magic?",
    "If you could have dinner with any historical figure from your world, who would it be and why?",
    "What's the biggest misconception people often have about you?",
    "Is there a particular type of weather or environment that makes you feel most at ease?",
    "What's a simple pleasure you truly appreciate?",
    "What was your favorite story or fairy tale when you were growing up?",
    "If you had a personal motto, what would it be?",

    // --- World & Beliefs (21-40) ---
    "Is there any local legend, ghost story, or mythical creature from your homeland that truly fascinates (or terrifies) you?",
    "What's one common misconception outsiders have about your people or the place you come from?",
    "If you could spend a day as any other creature – magical or mundane – what would it be and why?",
    "What's the most beautiful or awe-inspiring natural wonder you've ever witnessed on your travels?",
    "What's your stance on different magical traditions? Do you prefer arcane, divine, primal, or occult?",
    "Is there a particular deity or philosophy that resonates most with you, even if you don't worship them?",
    "What's one aspect of civilization you find most admirable, and one you find most troubling?",
    "Do you believe in fate, or do you think we make our own destinies?",
    "What's the most unusual custom or tradition you've encountered in a foreign land?",
    "If you could change one law or societal norm in your home region, what would it be?",
    "What's a common saying or proverb from your culture that you find yourself using often?",
    "What's your opinion on artificers and technology in general?",
    "Have you ever encountered a phenomenon that you just couldn't explain?",
    "What's the most interesting type of monster or creature you've ever heard about?",
    "If you could master one non-combat skill or craft from another culture, what would it be?",
    "What's your understanding or belief about what happens after death?",
    "Is there a particular type of music or performance from your culture that you enjoy?",
    "What's the most significant historical event from your world that you've learned about?",
    "How do you feel about the spread of knowledge and magic to the common folk?",
    "What's one thing about your world that you wish was different?",

    // --- Hypothetical & Lighthearted (41-60) ---
    "If you had to trade your primary weapon/tool for something completely ridiculous, what would it be?",
    "What's the most bizarre item you've ever bought, found, or been gifted that you still, for some reason, hold onto?",
    "If our party were to start a non-adventuring business together, what kind of business would it be?",
    "What's a minor annoyance or pet peeve you have that really gets under your skin, even in life-or-death situations?",
    "What's the weirdest dream you've ever had?",
    "If you could only eat one meal for the rest of your life, what would it be?",
    "What's the most embarrassing moment you've ever experienced (that you're willing to share)?",
    "If you had to pick a theme song for your life, what would it be?",
    "What's your go-to method for cheering yourself up when you're down?",
    "If you could instantly learn to play any musical instrument, which one would it be?",
    "What's the funniest thing you've ever witnessed an animal do?",
    "If you suddenly woke up with a new, minor magical ability (like changing your hair color or making things glow faintly), what would it be?",
    "What's the most creative excuse you've ever heard (or used)?",
    "If you had to spend a year living in complete solitude, where would you choose to do it?",
    "What's a skill you wish you were better at, purely for entertainment value?",
    "If you could invent a new holiday, what would it celebrate?",
    "What's the silliest rumour you've ever heard about yourself or someone you know?",
    "If you could have a conversation with any animal, which one would it be and what would you ask?",
    "What's a guilty pleasure you secretly enjoy?",
    "If you could instantly learn any mundane language (not magical), which one would it be?",

    // --- Adventuring & Group Dynamics (61-80) ---
    "What's one thing you've learned about yourself since you started adventuring?",
    "What's the most unexpected skill or quality you've seen one of us display?",
    "What's your preferred method of dealing with a difficult situation: direct confrontation, stealth, or diplomacy?",
    "Is there a particular type of monster or challenge you secretly dread encountering?",
    "What's the most surprising use of a common item you've ever seen in a tight spot?",
    "What's your favorite part about traveling with this group?",
    "What's the oddest job or task you've ever taken on for money?",
    "Is there a particular type of treasure or artifact that you find most fascinating?",
    "What's your strategy for dealing with boredom during long journeys?",
    "What's the one piece of equipment you absolutely cannot adventure without?",
    "If you had to describe our party with a single animal, what would it be and why?",
    "What's a skill you admire in another member of our group?",
    "Have you ever had a close call that still makes you shiver when you think about it?",
    "What's the most memorable tavern or inn you've ever stayed in?",
    "What's one thing you've discovered about adventuring that the common folk wouldn't understand?",
    "What's your preferred method of travel: on foot, by mount, by boat, or something else?",
    "What's the riskiest gamble you've ever taken that paid off?",
    "Is there anything you find surprisingly easy or surprisingly difficult about the adventuring life?",
    "What's the best piece of equipment you've ever acquired?",
    "If we had a mascot for our adventuring party, what would it be?",

    // --- Odds & Ends / Deeper Thoughts (81-100) ---
    "What's one thing you believe with all your heart, even if others disagree?",
    "If you could ask a truly omniscient being one question, what would it be?",
    "What's a decision you've made that you still occasionally second-guess?",
    "What does 'home' mean to you now, compared to when you started adventuring?",
    "Is there something you used to believe strongly that you've since changed your mind about?",
    "What's the most valuable thing you own that isn't made of gold or jewels?",
    "If you could spend a day observing any profession or craft in the world, what would it be?",
    "What's a small act of kindness you've witnessed that stuck with you?",
    "What's your biggest fear that has nothing to do with monsters or combat?",
    "If you could offer comfort or advice to a past version of yourself, what time period would it be?",
    "What's a story you love to tell, even if it's not about yourself?",
    "What's something you're looking forward to, big or small?",
    "If you could change one thing about yourself, what would it be?",
    "What's a secret dream you rarely share with others?",
    "What's the most interesting rumour you've heard recently, true or not?",
    "What does loyalty mean to you?",
    "Is there anything you collect, even if it's just small trinkets?",
    "What's a unique tradition or celebration from your background that you miss?",
    "What's one thing you hope to achieve before your adventuring days are over?",
    "If you could leave behind one legacy for the world, what would it be?"
    ]
    const fakeEncounterQuotes = [
    "You hear what seems to be steps in the area, but it turns out to be a wild animal fleeing your presence.",
    "A distant howl echoes through the forest, but it's just the wind playing tricks on your ears.",
    "A dark shadow passes overhead, but it's only a large bird circling above.",
    "You spot a glint of metal in the bushes, only to discover it's a discarded piece of foil.",
    "A branch snaps loudly nearby, revealing a squirrel burying its nuts.",
    "You feel a sudden drop in temperature, but it's just the evening chill setting in.",
    "The ground trembles faintly, a distant rockslide, not a monstrous footfall.",
    "A strange, acrid smell fills the air, but it's just a common marsh gas.",
    "You hear faint whispers in the ruins, just the wind whistling through cracks in the stone.",
    "A rustle in the undergrowth makes you tense, but a small rabbit hops into view.",
    "The water ahead churns violently, only a school of fish feeding.",
    "A sudden, piercing shriek cuts through the night, a harmless night bird's cry.",
    "You see glowing eyes in the darkness, merely the reflection of moonlight off dew drops.",
    "A distinct metallic clang rings out, a far-off blacksmith's hammer at work.",
    "The air grows heavy and still, a sign of an approaching storm, not a lurking beast.",
    "You hear faint scratching sounds from within the walls, just mice looking for crumbs.",
    "A shimmering heat haze distorts your vision, not a magical illusion.",
    "The smell of decay is strong here, but it's just natural decomposition, no corpses.",
    "A series of deep thuds reverberates, a large tree falling in the distant woods.",
    "You feel unseen eyes watching you, just the natural paranoia of the wilderness.",
    "A sudden gust of wind blows a door open, not an intruder.",
    "Flickering lights dance in the distance, a group of fireflies, not torches.",
    "You step on something squishy, only to find it's an overripe fruit.",
    "A low growl vibrates the air, your own stomach rumbling from hunger.",
    "The path ahead looks strangely disturbed, just a minor erosion from recent rains.",
    "You hear a faint, high-pitched scream, a child playing loudly in a nearby village.",
    "A dark silhouette appears on the ridge, a uniquely shaped rock formation.",
    "The air crackles with static, a precursor to lightning, not arcane energy.",
    "You spot movement in your peripheral vision, just your own shadow playing tricks.",
    "A heavy thud comes from above, a snowdrift sliding off a roof.",
    "The ground feels strangely soft beneath your feet, a patch of thick moss, not quicksand.",
    "You smell smoke, but it's just someone cooking a meal nearby.",
    "A flash of scales catches your eye, a harmless garden snake slithering away.",
    "You hear distant chanting, a monk's morning prayers, not a ritual.",
    "A chill runs down your spine, just a draft from an open window.",
    "The sound of dripping water echoes strangely, a leaky pipe, not a monster drooling.",
    "You see faint footprints in the dust, those of a common traveler from hours ago.",
    "A low, guttural moan fills the air, the wind resonating through a hollow tree.",
    "The light flickers erratically, a sputtering torch, not unstable magic.",
    "You feel a vibration in the air, a distant waterfall, not an approaching tremor.",
    "A sense of unease washes over you, simply the effect of hunger and exhaustion.",
    "The water tastes strangely sweet, a natural spring, not a poisoned pool.",
    "You hear a distant explosion, a controlled blast in a nearby quarry.",
    "A dark form rushes past you, a bat flitting out of a cave entrance.",
    "The air smells faintly of sulfur, just natural hot springs nearby.",
    "You feel a sticky sensation on your hand, tree sap, not blood.",
    "A piercing whistle echoes, a shepherd calling their dog.",
    "You spot a faint light in the darkness, a distant campfire's embers.",
    "The ground beneath you feels hollow, a natural cave system below, not a trap.",
    "A low humming sound fills the air, a swarm of insects, not a magical device.",
    "You hear the distinct sound of snapping bones, your own knee joint cracking as you stretch.",
    "A strange symbol is carved into the wall, ancient graffiti, not a cultist's mark.",
    "The air suddenly feels thin and suffocating, just a sudden change in pressure.",
    "You glimpse a pair of glowing eyes, two fireflies dancing in unison.",
    "A high-pitched cackle echoes, a playful child's laughter from a nearby house.",
    "The ground feels oddly warm, a geothermal vent, not recent magical activity.",
    "You see faint smoke rising, a lone farmer burning brush.",
    "A sense of dread fills you, the usual anxiety of traveling alone.",
    "The sound of flapping wings overhead, a flock of pigeons taking flight.",
    "You hear faint, desperate cries, the sound of a trapped animal, not a person.",
    "A distinct smell of ozone, a distant lightning strike, not a magical anomaly.",
    "You spot something moving quickly in the corner of your eye, a falling leaf.",
    "The air is thick with dust, a passing cart on the road.",
    "You feel a prickling sensation on your skin, a swarm of gnats.",
    "A low scraping sound echoes, a loose piece of metal dragging in the wind.",
    "You hear rhythmic pounding, a distant mill's waterwheel.",
    "A flash of white in the shadows, a discarded piece of cloth.",
    "The ground ahead looks discolored, a natural mineral deposit, not a bloodstain.",
    "You smell something sweet and sickly, blooming night-flowers, not poison.",
    "A small, unnatural sound emanates from a dark corner, a spider spinning its web.",
    "You feel a light touch on your shoulder, a loose vine brushing past.",
    "The air suddenly feels charged, a pending thunderstorm, not a powerful spell.",
    "You see shadows dancing erratically, the flickering light of your own lantern.",
    "A guttural snarl echoes, a dog barking playfully.",
    "The floorboards creak loudly above you, just the house settling.",
    "You taste something metallic, a loose filling in your tooth.",
    "A faint clanking sound, armor rattling on a clothesline.",
    "The air is unnaturally still, the quiet before a heavy rain.",
    "You hear what sounds like chains dragging, a loose gate swinging in the wind.",
    "A flash of red in the dark, berries on a bush.",
    "The ground feels unstable, a shifting pile of old debris.",
    "You smell something burnt, a forgotten cooking pot.",
    "A sudden chill wind blows, sweeping leaves across your path.",
    "You hear distant shouting, a street vendor hawking wares.",
    "A strange glowing fungus catches your eye, a harmless bioluminescent plant.",
    "The air feels heavy with anticipation, the quiet before a burst of bird song.",
    "You hear what sounds like distant weeping, the wind through ancient, hollow trees.",
    "A flash of brilliant color, a rare butterfly fluttering past.",
    "The ground feels spongy, a patch of deep mud.",
    "You smell something sour, fermenting fruit, not a monstrous creature.",
    "A faint scratching on wood, a rodent gnawing on a beam.",
    "You see a reflection in the darkness, a puddle of water on the floor.",
    "A loud 'THWACK' from the bushes, a squirrel dropping an acorn.",
    "The air feels thick and oppressive, just high humidity.",
    "You hear faint laughter, children playing down the street.",
    "A shadowy figure moves swiftly past a window, your own reflection in the glass.",
    "The ground begins to vibrate, a distant heavy wagon passing by.",
    "You smell something minty, crushing wild herbs underfoot.",
    "A quick movement in the periphery, an optical illusion from eye strain.",
    "You hear what sounds like a gasp, your own sharp intake of breath.",
    "A strange, rhythmic tapping, a woodpecker at work.",
    "The air smells strongly of rain, the earth absorbing moisture.",
    "You glimpse a pair of menacing eyes, the pattern on a tree trunk.",
    "A loud *CRACK* from above, a tree branch breaking off.",
    "The ground feels unusually warm and sandy, a burrow of small rodents.",
    "You hear what sounds like tearing fabric, an old flag flapping in the wind.",
    "A sudden pressure in your chest, indigestion, not a curse.",
    "You see a flicker of movement, a small lizard darting across a rock.",
    "The air is heavy with silence, all the local wildlife is asleep."
    ]
    const itemType = $state([
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
    const pf2eMonsters = [
    "Goblin Warrior",
    "Kobold Scout",
    "Orc Brute",
    "Bandit",
    "Gnoll Hunter",
    "Bugbear Thug",
    "Skeleton Guard",
    "Zombie Shambler",
    "Ghoul",
    "Wight",
    "Wolf",
    "Dire Wolf",
    "Giant Centipede",
    "Giant Frog",
    "Giant Spider",
    "Ogre",
    "Troll",
    "Mimic",
    "Will-o'-Wisp",
    "Shadow",
    "Warg",
    "Ankhrav",
    "Cockatrice",
    "Griffon",
    "Basilisk",
    "Manticore",
    "Medusa",
    "Minotaur",
    "Chimera",
    "Wyvern",
    "Goblin Pyro",
    "Goblin Dog",
    "Kobold Dragon Mage",
    "Orc Archer",
    "Orc Warchief",
    "Bandit Leader",
    "Gnoll Sergeant",
    "Hobgoblin Soldier",
    "Hobgoblin General",
    "Bugbear Stalker",
    "Ghast",
    "Ghoul Stalker",
    "Vampire Spawn",
    "Skeleton Archer",
    "Zombie Hulk",
    "Wraith",
    "Specter",
    "Poltergeist",
    "Ogre Hurler",
    "Ogre Glutton",
    "Troll Skulker",
    "Hill Giant",
    "Ettin",
    "Harpy",
    "Banshee",
    "Succubus",
    "Quasit",
    "Imp",
    "Mephit (Fire)",
    "Mephit (Ice)",
    "Gargoyle",
    "Animated Armor",
    "Living Statue",
    "Cave Bear",
    "Boar",
    "Crocodile",
    "Giant Scorpion",
    "Giant Wasp",
    "Dire Bat",
    "Saber-tooth Tiger",
    "Hippogriff",
    "Pegasus",
    "Wysp (Air)",
    "Wysp (Earth)",
    "Salamander",
    "Water Weird",
    "Bulezau",
    "Barghest",
    "Drider",
    "Otyugh",
    "Ettercap", 
    "Azer Smith",
    "Boggard Warrior",
    "Boggard Priest",
    "Centaur Scout",
    "Darkmantle",
    "Derro Savant",
    "Dero Stabber",
    "Ettercap Broodkeeper",
    "Ettercap Webspinner",
    "Giant Fire Beetle",
    "Giant Maggot",
    "Giant Rat",
    "Giant Tick",
    "Gnoll Marauder",
    "Goblin Commando",
    "Graveknight Minion",
    "Grick",
    "Hag Servant",
    "Hag Coven Witch",
    "Hobgoblin Arcanist",
    "Hobgoblin Captain",
    "Jackalwere",
    "Leshy Vine",
    "Leshy Leaf",
    "Lizardfolk Warrior",
    "Lizardfolk Shaman",
    "Morlock",
    "Nothic",
    "Ogre Swamp Brute",
    "Oni Brute",
    "Phase Spider",
    "Pixie",
    "Quickling",
    "Rakshasa",
    "Redcap",
    "Satyr",
    "Scarecrow",
    "Sea Hag",
    "Skeletal Champion",
    "Skeleton Mage",
    "Slime Mold",
    "Slurk",
    "Spectral Guard",
    "Troglodyte Warrior",
    "Troglodyte Chieftain",
    "Vargouille",
    "Vine Leshy Warden",
    "Wendigo",
    "Werewolf",
    "Worg",
    "Yeti"
];

    // Handle timer selection
    function handleSelectTimer(type) {
        if (isRunning) {
            clearInterval(timerInterval)
            isRunning = false
        }
        selectedTimer = type        
        
        switch (type) {
            case '1min':
                const randomItem1 = Math.floor(Math.random() * itemType.length)
                currentItem = itemType[randomItem1]
                timeInSeconds = 180
                currentConvo = `Take a look at your inventory. Maybe some ${currentItem}`
                break
            case '3min':
                const randomItem3 = Math.floor(Math.random() * itemType.length)
                currentItem = itemType[randomItem3]
                timeInSeconds = 300
                currentConvo = `Take a look at the merchant inventory. Maybe some ${currentItem}`
                break
            case '5min':
                const randomIndex = Math.floor(Math.random() * conversationStarters.length)
                currentConvo = conversationStarters[randomIndex]
                timeInSeconds = 600
                break
            default:
                timeInSeconds = 0
        }
        timeLeft = timeInSeconds
    }

    function changeTimer(operator) {        
        if(operator === "add") {
            timeLeft += 60
        } else {
            timeLeft -= 60
        }
    }

    // Function to format time for display
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Start/Pause Timer
    function handleToggleTimer() {
        isRunning = !isRunning;
    }

    // Reset Timer
    function handleResetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        handleSelectTimer(selectedTimer)
        combatEncounterDisplay = false
        nonCombatEncounter = ""
        combatEncounter = false
        // selectedTimer = null;
        // timeLeft = 0;
        combatEncounterChance = 0
        nonCombatEncounterChance = 0
    }

    // Svelte's reactive statement for timer interval
    $effect(() => {
        if (isRunning && timeLeft > 0) {
            timerInterval = setInterval(() => {
                timeLeft--;
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            handleTimerFinish();
        }
        return () => clearInterval(timerInterval); // Cleanup on component destroy or effect re-run
    });

    // Handle Timer Finish - Generate Prompt
    function handleTimerFinish() {
        showPromptModal = true;
    }

    function determineEncounter() {
        combatEncounterDisplay = true
        combatEncounter = false
        nonCombatEncounter = ""
        const randomCombat = Math.floor(Math.random() * 100 + 1)
        const randomNonCombat = Math.floor(Math.random() * 100 + 1)
        const randomIndex = Math.floor(Math.random() * fakeEncounterQuotes.length)
        currentFakeEncounter = fakeEncounterQuotes[randomIndex]
        const randomCombatIndex = Math.floor(Math.random() * pf2eMonsters.length)
        const randomCombatDifficultyIndex = Math.floor(Math.random() * 10 + 1)
        currentCombat = pf2eMonsters[randomCombatIndex]
        if (randomCombatDifficultyIndex <= 5) {
            currentDifficulty = "Low"
        } else if (randomCombatDifficultyIndex >= 6 && randomCombatDifficultyIndex <= 8) {
            currentDifficulty = "Moderate"
        } else if (randomCombatDifficultyIndex >= 9 && randomCombatDifficultyIndex <= 10) {
            currentDifficulty = "Severe"
        }   
        if(randomCombat < combatEncounterChance) {
            combatEncounter = true
        }
        if(randomNonCombat < nonCombatEncounterChance) {
            const randomNonCombatType = Math.floor(Math.random() * 20 + 1)
            if(randomNonCombatType <= 10) {
                nonCombatEncounter = "storyhook"
            } else if(randomNonCombatType >= 11 && randomNonCombatType <= 15 ) {
                nonCombatEncounter = "character"
            } else if(randomNonCombatType >= 16 && randomNonCombatType <= 20 ) {
                nonCombatEncounter = "building"
            } 
        }
    }

</script>

<main class="p-4 sm:p-6 md:p-8" in:slide={{axis:"y", easing:sineOut}}>
    <!-- Timer nav -->
    <div class="flex flex-col sm:flex-row justify-start it mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button class="btn w-full sm:w-auto" onclick={() => handleSelectTimer("1min")}>10 mins timer</button>
            <button class="btn w-full sm:w-auto" onclick={() => handleSelectTimer("3min")}>1 hour timer</button>
            <button class="btn w-full sm:w-auto" onclick={() => handleSelectTimer("5min")}>8 hours timer</button>
        </div>
    </div>

    <!-- Timer display -->
    {#if selectedTimer}
        <div class="text-center mb-6 mt-4 sm:mt-4 flex-col flex items-center" in:slide={{axis:"y", easing:sineOut}}>
            <div class="flex items-end">
                <button class="btn w-full sm:w-auto" onclick={() => changeTimer("remove")}>-1 min</button>
                <p class="text-6xl font-mono mb-4 text-pf-yellow-light mr-4 ml-4">{formatTime(timeLeft)}</p>
                <button class="btn w-full sm:w-auto" onclick={() => changeTimer("add")}>+1 min</button>
            </div>
            <p class="text-2xl text-white mb-4">{currentConvo}</p>
            <div class="flex justify-center gap-4 items-center flex-col sm:flex-row mb-4"> 
                <label for="nonCombat" class="text-white">Non Combat Encounter Chances</label>
                <select name="nonCombat" id="nonCombat" class="text-white w-full sm:w-auto border-2 border-pf-yellow-light rounded" bind:value={nonCombatEncounterChance}>
                    <option value=0>None</option>
                    <option value=20>Low</option>
                    <option value=40>Medium</option>
                    <option value=60>High</option>
                </select>
                <label for="combat" class="text-white">Combat Encounter Chances</label>
                <select name="nonCombat" id="nonCombat" class="text-white w-full sm:w-auto border-2 border-pf-yellow-light rounded" bind:value={combatEncounterChance}>
                    <option value=0>None</option>
                    <option value=20>Low</option>
                    <option value=40>Medium</option>
                    <option value=60>High</option>
                </select>
            </div>
            {#if nonCombatEncounterChance && combatEncounterChance}
            <div class="flex justify-center items-center flex-col sm:flex-row">
                <button class="btn w-32" onclick={handleToggleTimer}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button class="btn w-32" onclick={determineEncounter}>Encounter</button>
                <button class="btn-red w-32" onclick={handleResetTimer}>Reset</button>
            </div>
            {/if}

            {#if combatEncounterDisplay}
                    <div class="mt-4 bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all scale-100 opacity-100 text-gray-800 flex items-center justify-between flex-col">
                        {#if combatEncounter}
                            <p class="text-2xl text-pf-red font-bold">{currentDifficulty} Combat encounter</p>
                            <p class="text-2xl text-pf-red font-bold">{currentCombat}</p>
                        {/if}
                        {#if nonCombatEncounter === "storyhook"}
                            <p class="text-2xl text-pf-red font-bold">Something is happening</p>
                        {:else if nonCombatEncounter === "character"}
                            <p class="text-2xl text-pf-red font-bold">Someone is watching</p>
                        {:else if nonCombatEncounter === "building"}
                            <p class="text-2xl text-pf-red font-bold">You find something on the way</p>
                        {/if}
                        {#if !combatEncounter && !nonCombatEncounter}
                            <p class="text-2xl text-pf-green font-bold">{currentFakeEncounter}</p>
                        {/if}
                </div>    
                {/if}
        </div>
    {/if}

    {#if nonCombatEncounter === "storyhook"}
        <StoryHooks />
    {:else if nonCombatEncounter === "character"}
        <Characters />
    {:else if nonCombatEncounter === "building"}
        <Buildings />
    {/if}

    <!-- Prompt Modal -->
    {#if showPromptModal}
        <div class="fixed inset-0 bg-grey bg-opacity-75 flex flex-col items-center justify-center z-50 p-4" transition:fade={{duration:100, easing:sineOut}}>
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all scale-100 opacity-100 text-gray-800 flex items-center justify-between flex-col">
                    <p class="text-2xl text-pf-green font-bold">Timer Completed</p>
                <div class="flex justify-end">
                    <button onclick={() => showPromptModal = false} class="btn-dark">Dismiss</button>
                </div>
            </div>
            
        </div>
    {/if}


</main>