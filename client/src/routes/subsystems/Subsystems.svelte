<script>
    import {fade, fly, slide} from "svelte/transition"
    import {sineOut} from "svelte/easing"
    import {sineIn} from "svelte/easing"

    let selectedSystem = $state(null) 
    let selectedBiomeName = $state(null)   
    let selectedBiome = $state(null)
    let currentObstacle = $state(null)
    let currentPreparation = $state(null)
    let currentThreat = $state(null)
    let currentGeneralTraits = $state([])
    let currentSpecificTraits = $state([])
    let partyLvl = $state(null)
    let currentDC = $state(null)
    let partySize = $state(null)
    let currentSteps = $state(null)

    const biomes = $state(["Aquatic",
                "Arctic",
                "Astral",
                "Desert",
                "Forest",
                "Swamp",
                "Mountain",
                "Plains",
                "Subterranean",
                "Urban"
            ])

    const threat_lvl = $state([
        {threat:"Very easy", mod:-5},
        {threat:"Easy", mod:-2},
        {threat:"Moderate", mod:0},
        {threat:"Hard", mod:2},
        {threat:"Very hard", mod:5},
    ])

    const chasesBiomeData = $state({
        Forest: [
        {name:"Dense Wood",description:"A thick, overgrown forest where movement is difficult and visibility is limited."},
        {name:"Light Wood",description:"A sparse forest with widely spaced trees and easy visibility."},
        {name:"Mossy Thicket",description:"Soft moss blankets the ground and trees, absorbing sound and muffling movement."},
        {name:"Fallen Timber",description:"A cluttered section filled with toppled logs and broken branches."},
        {name:"Ancient Grove",description:"Towering old-growth trees create a quiet, reverent atmosphere."},
        {name:"Young Forest",description:"Small, recently grown trees crowd together with thin trunks and light canopy."},
        {name:"Foggy Underbrush",description:"Thick ground fog obscures vision and twists depth perception."},
        {name:"Rocky Rise",description:"A forested hill with uneven stone slopes hidden beneath leaves."},
        {name:"Quiet Glade",description:"An open clearing where sound carries clearly through the air."},
        {name:"Thorny Brambles",description:"Dense, thorn-covered vines block paths and snag clothing."},
        {name:"Riverbank Wood",description:"Trees cluster tightly along a flowing river, their roots exposed and slick."},
        {name:"Windy Canopy",description:"High winds rattle branches and scatter leaves through the air."},
        {name:"Darkened Grove",description:"Thick canopy layers the forest floor in heavy shadow."},
        {name:"Lush Bloom",description:"Colorful flowers and thick vegetation fill this vibrant patch of forest."},
        {name:"Abandoned Campsite",description:"Signs of past travelers remain—burned fire pits, scattered tools, and footprints."},
        {name:"Animal Burrows",description:"Tunnels, dens, and burrows dot the forest, creating unstable ground."},
        {name:"Overgrown Path",description:"A long-forgotten trail nearly swallowed by vegetation, barely recognizable."},
        {name:"Steep Ravine",description:"A sudden drop or rise in the forest floor makes travel treacherous."},
        {name:"Sacred Circle",description:"Stone markers or carved totems indicate old rituals once performed here."},
        {name:"Hunting Grounds",description:"Signs of predators—tracks, claw marks, and disturbed earth—warn of danger."},
        {name:"Rotting Logs",description:"Old, decayed wood litters the area, giving way underfoot with a soft crunch."},
        {name:"Mushroom Grove",description:"Clusters of oversized mushrooms grow in thick patches across the forest floor."},
        {name:"Silent Woods",description:"A strangely quiet zone where no animals call or move."},
        {name:"Busy Wildlife Trail",description:"Animals frequently travel here, leaving a well-worn natural path."},
        {name:"Hidden Spring",description:"A small freshwater spring drips from the rocks, surrounded by greenery."}

        ],
        Desert: [
        {name:"Shifting Dunes",description:"Tall dunes constantly reshaped by the wind, making navigation difficult."},
        {name:"Flat Sand Plains",description:"Open stretches of sand with no cover and full visibility."},
        {name:"Rocky Outcrop",description:"Jagged stone formations rise from the desert, offering shade and vantage points."},
        {name:"Salt Flats",description:"Blinding white salt stretches endlessly, reflecting harsh sunlight."},
        {name:"Oasis Edge",description:"Sparse palms and a hint of moisture mark the edge of a life-giving oasis."},
        {name:"Deep Desert",description:"A barren expanse far from civilization, devoid of tracks or landmarks."},
        {name:"Sandstorm Zone",description:"Harsh winds whip sand across the landscape, obscuring sight and sound."},
        {name:"Desert Canyon",description:"Narrow stone walls create winding paths with patches of shade."},
        {name:"Wadi Bed",description:"A dry riverbed filled with cracked earth and scattered debris."},
        {name:"Dried Oasis",description:"An abandoned oasis with only withered trees and empty pools remaining."},
        {name:"Scorched Ground",description:"Blackened earth where intense heat or lightning once struck."},
        {name:"Cacti Field",description:"Clusters of tall cacti create difficult, needle-studded terrain."},
        {name:"Broken Ruins",description:"Ancient stone remnants buried half-under shifting sand."},
        {name:"Wind-Carved Pillars",description:"Tall sandstone columns shaped by centuries of erosion."},
        {name:"Buried Trail",description:"A half-covered path that appears and disappears under the dunes."},
        {name:"Whispering Cliffs",description:"Wind blowing across cliff edges creates eerie, flute-like tones."},
        {name:"Mirage Flats",description:"Heatwaves distort the horizon, making distances impossible to judge."},
        {name:"Nomad Camp Remains",description:"Leftover fire pits, ropes, and stakes hint at recent travelers."},
        {name:"Dune Saddle",description:"A dip between two large dunes that channels wind and sand."},
        {name:"Cracked Earth Plateau",description:"Raised ground split by deep fissures from relentless sun."},
        {name:"Sinkhole Patch",description:"Loose sand threatens to collapse under unwary steps."},
        {name:"Desert Scrubland",description:"Sparse, hardy bushes cling to life among dry soil and stones."},
        {name:"Hidden Water Pocket",description:"A secret pocket of moisture buried beneath cooler sand layers."},
        {name:"Bone Field",description:"Sun-bleached bones of animals mark this harsh hunting ground."},
        {name:"Starlit Expanse",description:"At night the sky glows brilliantly above cold, silent desert sands."}

        ],
        Aquatic: [
            {name:"Coral Reef",description:"A vibrant reef teeming with marine life and colorful corals."},
            {name:"Kelp Forest",description:"Tall kelp strands sway with the current, creating cover and obstacles."},
            {name:"Open Sea",description:"A vast expanse of water with no landmarks, easy to get disoriented."},
            {name:"Sunlit Shallows",description:"Shallow waters where sunlight penetrates, revealing fish and sand patterns."},
            {name:"Deep Trench",description:"Dark, deep waters with strong currents and extreme pressure."},
            {name:"Rocky Shore",description:"Jagged rocks and tide pools create tricky footing and hazards."},
            {name:"Shipwreck Site",description:"A sunken vessel with broken wood and hidden nooks to explore."},
            {name:"Underwater Cave",description:"A dark, enclosed space with uneven floor and limited exit points."},
            {name:"Sandy Bottom",description:"Flat, featureless seabed where movement is easy but cover is scarce."},
            {name:"Mangrove Roots",description:"Dense, tangled roots make navigation difficult but provide hiding spots."},
            {name:"Thermal Vent",description:"Hot water bubbles from the seabed, creating turbulence and danger."},
            {name:"Sunken Ruins",description:"Ancient stone structures partially buried in sand and silt."},
            {name:"Seagrass Meadow",description:"Thick, soft seagrass slows movement but provides stealth opportunities."},
            {name:"Strong Current Zone",description:"Fast water flow pushes players along, making controlled movement difficult."},
            {name:"Floating Debris Field",description:"Floating objects drift in the water, offering temporary support or hazards."},
            {name:"Bioluminescent Waters",description:"Glowing organisms light the area, aiding visibility but alerting predators."},
            {name:"Choppy Surface",description:"Surface waves make it hard to see or maintain balance."},
            {name:"Tidepool Cluster",description:"Shallow pockets of water with slippery rocks and small marine life."},
            {name:"Cave Entrance",description:"A dark underwater cave opening with strong suction currents."},
            {name:"Ice-Covered Waters",description:"Thin ice patches make movement treacherous and restrict vision."},
            {name:"Deep Kelp Gorge",description:"A trench of thick kelp, slowing movement and obscuring sightlines."},
            {name:"Algae Bloom",description:"Thick green algae reduces visibility and fouls equipment."},
            {name:"Open Lagoon",description:"A calm, wide water area with good visibility but no cover."},
            {name:"Predator Lair",description:"Signs of dangerous aquatic creatures—tracks, teeth marks, disturbed sand."}

        ],
        Arctic: [
            {name:"Snow-Covered Plains",description:"Vast stretches of white snow with few landmarks and high visibility."},
            {name:"Frozen Lake",description:"A solid sheet of ice that may crack under heavy weight."},
            {name:"Glacial Crevasse",description:"A deep, narrow fissure in the ice, dangerous to cross."},
            {name:"Ice Cave",description:"A cold, enclosed space with slippery surfaces and limited exits."},
            {name:"Blizzard Zone",description:"Heavy snow and wind reduce visibility and hamper movement."},
            {name:"Snowy Forest",description:"Sparse, frost-covered trees provide minimal cover and difficult footing."},
            {name:"Frozen Tundra",description:"Flat, open ice and snow with extreme exposure to cold and wind."},
            {name:"Icebergs Cluster",description:"Floating ice chunks create hazards and uneven surfaces."},
            {name:"Permafrost Ridge",description:"Hard, uneven ice and snow make travel slow and treacherous."},
            {name:"Frostbitten Cliff",description:"Sheer icy cliffs with potential for falls and avalanches."},
            {name:"Snowdrift Valley",description:"Deep snowdrifts slow movement and obscure obstacles."},
            {name:"Icy Cavern",description:"Slippery walls and frozen floors make navigation tricky."},
            {name:"Glacial Runoff",description:"Cold streams and meltwater create slippery and unstable ground."},
            {name:"Frozen Wasteland",description:"Barren ice fields with little to no cover or resources."},
            {name:"Aurora Sky",description:"Beautiful night skies with aurora lighting, aiding visibility slightly."},
            {name:"Ice-Covered Rocks",description:"Sharp, slick stones jutting from snow, creating hazards."},
            {name:"Avalanche Path",description:"Signs of previous snow slides warn of unstable slopes."},
            {name:"Frost-Laden Trees",description:"Trees coated in ice, branches brittle and likely to break."},
            {name:"Hidden Crevasse",description:"A narrow fissure concealed by snow, dangerous to stumble into."},
            {name:"Frozen River",description:"A thinly iced river that may give way under weight."},
            {name:"Snow-Covered Ruins",description:"Ancient structures buried partially under snow and ice."},
            {name:"Icy Shoreline",description:"Slippery edges along frozen water, tricky for footing."},
            {name:"Blizzard Shelter",description:"A rocky overhang offering protection from wind and snow."},
            {name:"Wind-Swept Dunes",description:"Snow dunes shaped by wind obscure direction and slow progress."},
            {name:"Seal or Penguin Colony",description:"Dense wildlife can aid tracking or create hazards."}

        ],
        Astral: [
            {name:"Floating Islands",description:"Chunks of land hover in the void, separated by gaps of empty space."},
            {name:"Ethereal Bridge",description:"A semi-transparent path of magical energy connects two floating platforms."},
            {name:"Starlit Expanse",description:"A wide open plane illuminated by distant stars and glowing nebulae."},
            {name:"Cosmic Rift",description:"A tear in the astral fabric reveals swirling energies and strange lights."},
            {name:"Planar Vortex",description:"A swirling mass of energy that pulls objects toward its center."},
            {name:"Crystalline Spires",description:"Jagged, floating crystal towers shimmer with inner light."},
            {name:"Aurora Veil",description:"Waves of color drift through the void, creating shifting light patterns."},
            {name:"Void Chasm",description:"A bottomless gap between platforms, perilous to cross."},
            {name:"Astral Sea",description:"A liquid-like expanse of shimmering energy that ripples under movement."},
            {name:"Phasing Platform",description:"A platform that intermittently flickers in and out of reality."},
            {name:"Twilight Rift",description:"A zone of dim light where colors and shapes are distorted."},
            {name:"Floating Ruins",description:"Ancient structures drift silently in the void, partially intact."},
            {name:"Energy Filaments",description:"Threads of pure magical energy stretch across the void, dangerous but useful for traversal."},
            {name:"Gravity Well",description:"Localized distortion pulls objects toward its center, affecting movement."},
            {name:"Nebula Cluster",description:"Dense clouds of astral dust obscure vision and alter perception."},
            {name:"Temporal Distortion",description:"Time flows irregularly; actions may feel delayed or accelerated."},
            {name:"Mirror Plane",description:"Reflective surfaces confuse depth and direction."},
            {name:"Ghostly Echoes",description:"Whispers of past events swirl around, hinting at secrets."},
            {name:"Luminous Cradle",description:"A soft glowing platform that eases movement and steadies footing."},
            {name:"Fading Starscape",description:"Stars slowly vanish and reappear, disorienting navigation."},
            {name:"Floating Monolith",description:"A massive, solitary structure hovering in the void, ominous and mysterious."},
            {name:"Shimmering Path",description:"A path of light that bends slightly with movement, offering a safe route."},
            {name:"Astral Garden",description:"Floating flora and fauna drift weightlessly, creating a surreal environment."},
            {name:"Warped Archway",description:"A portal-like structure bends reality, potentially teleporting travelers."},
            {name:"Void Cradle",description:"A concave platform that stabilizes those who step upon it, but only temporarily."}
           
        ],
        Swamp: [
            {name:"Misty Bog",description:"Thick fog rises from stagnant water, reducing visibility and dampening sound."},
            {name:"Murky Water",description:"Shallow, dirty pools slow movement and obscure what lies beneath."},
            {name:"Overgrown Marsh",description:"Tall grasses and reeds tangle together, creating natural obstacles."},
            {name:"Tree Roots Tangle",description:"Exposed roots twist across the ground, making footing treacherous."},
            {name:"Sinking Mud",description:"Soft, wet ground threatens to trap or slow travelers."},
            {name:"Dense Thicket",description:"Thick vegetation forces detours and slows movement."},
            {name:"Swamp Clearing",description:"A rare open area with firmer ground and better visibility."},
            {name:"Rotting Logs",description:"Old fallen trees are slippery and may break under weight."},
            {name:"Algae-Covered Water",description:"Slippery surfaces make crossing shallow water risky."},
            {name:"Hollowed Trees",description:"Dead or hollow trunks can provide shelter or hiding spots."},
            {name:"Quagmire",description:"Deep mud pits require careful navigation or strength checks."},
            {name:"Leech Patches",description:"Pools of stagnant water attract bloodsuckers that can hinder movement."},
            {name:"Insect Swarm",description:"Biting flies and mosquitoes distract and irritate travelers."},
            {name:"Fungal Growths",description:"Clusters of mushrooms and fungi obscure footing and may be hazardous."},
            {name:"Snaking Vines",description:"Thick vines cross paths and may entangle the unwary."},
            {name:"Willow-Lined Waterway",description:"Slow-moving streams bordered by drooping branches provide stealth opportunities."},
            {name:"Frog Ponds",description:"Small pools with slippery edges, home to amphibious creatures."},
            {name:"Sunken Tree Stumps",description:"Partially submerged stumps create obstacles and hazards."},
            {name:"Swamp Mists",description:"Low-hanging mist reduces visibility but muffles sound."},
            {name:"Boggy Trail",description:"A muddy path that gives some footing but slows travel."},
            {name:"Deadfall",description:"Fallen branches and logs block clear paths and obscure hazards."},
            {name:"Reed Beds",description:"Tall reeds hide creatures and objects but make movement cumbersome."},
            {name:"Rotting Vegetation",description:"Smell and slippery surfaces make the area unpleasant and risky."},
            {name:"Hidden Sinkholes",description:"Soft ground may collapse unexpectedly under weight."},
            {name:"Ancient Swamp Ruins",description:"Crumbled stonework partially submerged in water and mud, offering cover and exploration opportunities."}
        ],
        Mountain: [
            {name:"Rocky Cliff",description:"Steep, jagged rocks make climbing and footing treacherous."},
            {name:"Snow-Capped Peak",description:"High-altitude peaks with deep snow and thin air."},
            {name:"Narrow Ledge",description:"A slim path along a cliff, with sheer drops on one side."},
            {name:"Mountain Pass",description:"A winding trail through the mountains, often exposed to wind and falling rocks."},
            {name:"Boulder Field",description:"Large scattered rocks obstruct movement and require careful navigation."},
            {name:"Ice-Covered Slope",description:"Slippery frozen surfaces increase risk of falling."},
            {name:"Crumbling Path",description:"Loose gravel and stones make footing unstable."},
            {name:"Cave Entrance",description:"A rocky opening leading into a dark, sheltered interior."},
            {name:"Windy Ridge",description:"Strong gusts push travelers and reduce balance on narrow paths."},
            {name:"Avalanche-Prone Slope",description:"Signs of previous slides warn of potential danger."},
            {name:"Mountain Stream",description:"Cold, fast-flowing water cuts across trails, requiring care to cross."},
            {name:"Cliffside Overhang",description:"A rocky ledge that provides temporary shelter from wind."},
            {name:"High Plateau",description:"A flat elevated area with panoramic views but little cover."},
            {name:"Falling Rocks Zone",description:"Loose stones above threaten travelers with sudden rockfall."},
            {name:"Alpine Meadow",description:"A rare patch of grass and flowers, offering easier footing and respite."},
            {name:"Hidden Gorge",description:"A narrow canyon that obscures paths and limits visibility."},
            {name:"Frozen Waterfall",description:"A cascading waterfall now frozen, creating slippery climbing challenges."},
            {name:"Sharp Ridge",description:"Jagged edges of rock demand careful navigation."},
            {name:"Mountain Shrine",description:"An ancient, weathered structure perched precariously on a cliff."},
            {name:"Snowdrift Hollow",description:"Accumulated snow in depressions slows movement and hides hazards."},
            {name:"Rockslide Debris",description:"Freshly fallen rocks block or complicate the path."},
            {name:"Mist-Covered Peak",description:"Low clouds obscure vision and make orientation difficult."},
            {name:"Eagle’s Nest Ledge",description:"A narrow outcrop inhabited by birds of prey, dangerous to approach."},
            {name:"Hidden Hot Spring",description:"A geothermal pool offers warmth but may be hard to reach."},
            {name:"Mountain Ridge Overlook",description:"A vantage point with clear views, but exposed to hazards."}

        ],
        Plains : [
            {name:"Rolling Grasslands",description:"Gentle hills covered in tall grasses stretch as far as the eye can see."},
            {name:"Open Prairie",description:"Flat, open terrain with few obstacles and full visibility."},
            {name:"Wildflower Meadow",description:"Colorful flowers dot the grassy expanse, providing minimal cover."},
            {name:"Dirt Track",description:"A well-worn path cuts through the plains, easing travel."},
            {name:"Grazing Herd",description:"Animals roam the plains, creating potential movement hazards or distractions."},
            {name:"Shallow Stream",description:"A small watercourse meanders through the grasses, easy to cross."},
            {name:"Wind-Swept Flats",description:"Strong winds reduce accuracy of ranged attacks and impede movement."},
            {name:"Scattered Trees",description:"Occasional trees offer shade and cover but are few and far between."},
            {name:"Tall Grass Thicket",description:"Thick grass provides concealment but slows movement."},
            {name:"Rocky Outcrop",description:"Small rock formations break up the monotony and can serve as vantage points."},
            {name:"Dry Riverbed",description:"A parched channel winds through the plains, with cracked earth and loose stones."},
            {name:"Abandoned Homestead",description:"Old buildings and fences partially collapsed, offering minor shelter."},
            {name:"Grass-Covered Dune",description:"Low hills of earth and grass provide partial cover and elevation."},
            {name:"Wild Animal Trail",description:"A beaten path left by migrating creatures, aiding navigation."},
            {name:"Foggy Morning",description:"Low fog reduces visibility and muffles sound."},
            {name:"Sun-Baked Soil",description:"Hard, dry ground slows digging or other earth-related tasks."},
            {name:"Scattered Bushes",description:"Small shrubs offer minimal concealment and can hide hazards."},
            {name:"Open Vista",description:"Wide open spaces make stealth difficult but offer long-range views."},
            {name:"Hollow Mound",description:"Depressions in the ground can obscure movement or hide objects."},
            {name:"Temporary Pond",description:"Rainwater collects in a shallow depression, muddying the area."},
            {name:"Wind-Twisted Grass",description:"Tall grasses bend with the wind, making movement slightly easier in one direction."},
            {name:"Stone Cairn",description:"Small rock piles mark paths or boundaries."},
            {name:"Bird Flock Zone",description:"Overhead flocks can reveal movement but also distract enemies."},
            {name:"Abandoned Trail",description:"A barely-visible old path that can be followed with some skill."},
            {name:"Cattle Grazing Area",description:"Animals graze, potentially blocking paths or drawing attention."}

        ],
        Subterranean : [
            {name:"Narrow Tunnel",description:"A tight, winding passage that restricts movement and visibility."},
            {name:"Cavernous Chamber",description:"A large underground room with high ceilings and echoing sounds."},
            {name:"Stalactite Forest",description:"Pointed formations hang from the ceiling, creating hazards for unwary travelers."},
            {name:"Stalagmite Field",description:"Jagged protrusions rise from the ground, complicating navigation."},
            {name:"Underground River",description:"A flowing waterway cuts through the cavern, requiring careful crossing."},
            {name:"Moss-Covered Walls",description:"Slippery moss makes footing tricky and walls treacherous."},
            {name:"Collapsed Tunnel",description:"Rubble and fallen stone block paths and require climbing or clearing."},
            {name:"Crystal Cavern",description:"Shimmering mineral formations provide light and potential magical energy."},
            {name:"Echoing Passage",description:"Sounds carry strangely, making stealth difficult and disorienting orientation."},
            {name:"Subterranean Lake",description:"A dark, still body of water, potentially hiding hazards or creatures."},
            {name:"Fungal Grove",description:"Large mushrooms and fungi obscure movement and create obstacles."},
            {name:"Narrow Ledge",description:"A slim path along a cavern wall, with a dangerous drop below."},
            {name:"Underground Ruins",description:"Remnants of an ancient civilization partially buried and decayed."},
            {name:"Slick Floor",description:"Wet or oily surfaces make footing treacherous and risk falls."},
            {name:"Hidden Crevice",description:"A narrow fissure that can be used to bypass obstacles, but hard to spot."},
            {name:"Air Pocket",description:"A small, breathable space in otherwise toxic or low-oxygen areas."},
            {name:"Subterranean Hot Spring",description:"Warm water provides comfort and a rare safe resting spot."},
            {name:"Cave-in Zone",description:"Loose rocks above threaten sudden collapse."},
            {name:"Glowworm Cluster",description:"Bioluminescent insects provide dim light, aiding perception."},
            {name:"Underground Stream",description:"Fast-flowing water channels can sweep travelers off their feet."},
            {name:"Rocky Slope",description:"Inclined surfaces demand careful climbing to avoid slips."},
            {name:"Chasm Bridge",description:"A natural rock bridge crosses a deep fissure, precarious but useful."},
            {name:"Tight Crawlspace",description:"A small, cramped tunnel requiring squeezing or crawling."},
            {name:"Subterranean Forest",description:"A patch of massive fungi or stalagmites mimics a forest, creating cover."},
            {name:"Mineral Vein",description:"Exposed ore or crystal veins may aid crafting or exploration, but attract attention."}

        ],
        Urban : [
            {name:"Busy Market",description:"Crowded streets filled with merchants and shoppers, creating noise and movement obstacles."},
            {name:"Narrow Alley",description:"Tight passages between buildings, useful for stealth but easy to get trapped."},
            {name:"Rooftop Path",description:"High above the streets, requiring Acrobatics to navigate safely."},
            {name:"Abandoned Warehouse",description:"Large empty building offering cover but dark and potentially dangerous."},
            {name:"Cobblestone Street",description:"Uneven paving slows movement slightly and makes stealth tricky."},
            {name:"Open Plaza",description:"A wide, open space with little cover but good visibility."},
            {name:"Fountain Square",description:"Water features provide minor obstacles and slick surfaces."},
            {name:"Residential Block",description:"Clustered buildings with narrow gaps and potential entry points."},
            {name:"Construction Site",description:"Unfinished structures and debris create hazards but also shortcuts."},
            {name:"Bridge Over Street",description:"Elevated walkway that can be used for observation or bypassing traffic."},
            {name:"City Gates",description:"Fortified entrances controlling traffic flow and visibility."},
            {name:"Backyard Passage",description:"Hidden paths behind buildings for covert movement."},
            {name:"Shantytown",description:"Dense, haphazardly-built structures make navigation and stealth difficult."},
            {name:"Marketplace Stall",description:"Temporary structures providing minor cover and hiding spots."},
            {name:"Street Fountain",description:"Water and stone create slick areas and low obstacles."},
            {name:"Temple Steps",description:"Large steps leading to religious buildings, useful for vantage but open to view."},
            {name:"City Walls",description:"Tall fortifications restricting movement and offering defensive advantage."},
            {name:"Sewer Entrance",description:"Dark, cramped tunnels below the streets, offering stealth routes."},
            {name:"Watchtower",description:"Tall vantage point for surveillance or sniping."},
            {name:"Crowded Tavern",description:"Noise and movement from patrons can hide or reveal actions."},
            {name:"Marketplace Roofs",description:"Connected rooftops allow traversal over streets, but are risky."},
            {name:"Street Corner",description:"Visibility and cover vary depending on position and crowd density."},
            {name:"Alleyway Hideout",description:"A secluded corner for covert observation or ambush."},
            {name:"Open Courtyard",description:"Exposed space with little cover, making stealth difficult."},
            {name:"Fenced Garden",description:"Enclosed greenery providing limited cover and obstacles for movement."}

        ]
    })

    const infiltrationBiomeData = $state({
        Forest: [
  {name:"Forest Guard Post", description:"Scouts watch from a camouflaged station among the trees, alert for movement or unusual sounds."},
  {name:"Reinforced Brush Gate", description:"A barrier of woven branches, thorns, or lashed logs blocks the path and is kept secured."},
  {name:"Camouflaged Snare Trap", description:"A hidden snare or tripline lies among leaves and vines, easy to trigger if unnoticed."},
  {name:"Wandering Patrol", description:"Hunters, rangers, or enemy scouts wander the woods on a looping watch pattern."},
  {name:"Tree-Perch Lookout", description:"A scout sits high in a tree platform with good visibility over the forest floor."},
  {name:"Alarm Vine", description:"A tensioned vine triggers rattling shells, stones, or a magical chime when disturbed."},
  {name:"Hollow Log Crawl", description:"An enormous fallen log hides a narrow but quiet tunnel for those who can squeeze inside."},
  {name:"Shaded Grove Path", description:"Dark undergrowth offers concealing shadows but magnifies every snapped twig and leaf."},
  {name:"Beast Den", description:"A territorial predator or trained war-beast rests here, quick to react to foreign scents."},
  {name:"Listening Thicket", description:"A naturally echoing cluster of roots and branches where sound travels unusually well."},
  {name:"Brambled Chokepoint", description:"Dense thorn bushes form a bottleneck that’s difficult to cross without noise."},
  {name:"Druidic Ward Rune", description:"A faint glowing glyph carved into a stone or tree alerts its creator if crossed."},
  {name:"Ridge Overwatch", description:"A scout waits on a rocky rise, watching trails below for intruders."},
  {name:"Moonlit Clearing", description:"A bright, open glade exposes anyone crossing it under clear moonlight."},
  {name:"Concealed Pitfall", description:"A pit covered in leaves and branches waits to trap the unwary."},
  {name:"Captured Hunter", description:"A tied or wounded hunter might cry for help—or whisper warnings to infiltrators."},
  {name:"Sleeping Encampment", description:"Sleeping rangers or bandits lie in tents or bedrolls; any noise risks waking them."},
  {name:"Cluttered Campsite", description:"Scattered tools, cooking gear, and fragile items make quiet traversal difficult."},
  {name:"Hidden Animal Trail", description:"A faint game trail provides a silent bypass—but only if the characters can find it."},
  {name:"Spirit-Locked Tree Door", description:"A magically sealed wooden portal only opens for those who speak its druidic command words."},
  {name:"Exposed Root Bridge", description:"Crossing this narrow, elevated root system risks slipping or being seen from below."},
  {name:"Fast Patrol Rotation", description:"Forest scouts switch routes frequently, requiring precise timing for safe infiltration."},
  {name:"Creaking Branch Floor", description:"Loose branches, dead leaves, or brittle roots crack loudly with careless steps."},
  {name:"Messenger Elk Route", description:"A trained animal or swift scout moves rapidly along a worn path unpredictably."},
  {name:"Crowded Forage Area", description:"Gatherers, hunters, or forest dwellers move about; infiltrators must blend or hide."},
  {name:"Trap-Laden Supply Cache", description:"A stash of gear is protected with alarms or simple but noisy traps."},
  {name:"Reflective Ponds", description:"Still water pools reflect silhouettes, making it easy for a distant lookout to spot movement."},
  {name:"Smoke Drift Zone", description:"Campfire smoke hangs low, obscuring vision but causing coughing or sound slips."},
  {name:"Dry Leaf Carpet", description:"An area thick with crisp leaves challenges anyone attempting silent movement."}
        ],
        Desert: [
            {name:"Dune Watch Post", description:"Scouts observe from atop a tall dune, silhouettes outlined against the sky."},
            {name:"Reinforced Tent Flap", description:"A guarded tent entrance is lashed tight with ropes and bone toggles."},
            {name:"Buried Sand Trap", description:"A concealed pit or snare hidden under loose sand awaits the unwary."},
            {name:"Roaming Patrol", description:"Mounted riders or desert scouts circle the area following established routes."},
            {name:"Canyon Lookout Perch", description:"A sentry watches from a rocky ledge overlooking the desert floor."},
            {name:"Glass Chime Alarm", description:"Delicate glass beads or shells hang from ropes, rattling loudly if disturbed."},
            {name:"Collapsed Ruin Passage", description:"A narrow gap through ancient stonework allows a hidden but tight approach."},
            {name:"Shifting Shadow Ridge", description:"Jagged rocks provide deep shadows but loose gravel makes each step risky."},
            {name:"Hyena Den", description:"Territorial beasts rest here, sensitive to unfamiliar scents or sounds."},
            {name:"Echoing Ravine", description:"A narrow ravine amplifies even the softest sound, making stealth difficult."},
            {name:"Thorned Desert Brush", description:"Dry, brittle shrubs line the path and crack loudly if stepped on."},
            {name:"Ward Marked Obelisk", description:"A carved stone bears runes that alert cultists or guardians when crossed."},
            {name:"Sun-Bleached Plateau", description:"An exposed rock shelf offers little cover and reveals movement clearly."},
            {name:"Moonlit Dune Basin", description:"Silver light creates stark silhouettes against pale sand, exposing infiltrators."},
            {name:"Cracked Earth Sinkhole", description:"A weak patch of dried earth may collapse underfoot, creating noise."},
            {name:"Tethered Prisoner", description:"A captive or spy may alert guards—or offer information if approached quietly."},
            {name:"Sleeping Caravan", description:"Merchants or nomads sleep around a central fire; noise risks waking the camp."},
            {name:"Overstuffed Supply Tent", description:"Stacks of pottery, crates, and tools make silent movement tricky."},
            {name:"Hidden Footpath", description:"A lightly-used track follows the dunes, allowing a quiet bypass if noticed."},
            {name:"Sun-Sealed Stone Door", description:"A heavy stone slab sealed with heat or magic blocks access without careful work."},
            {name:"Wind-Carved Archway", description:"Passing under this natural arch exposes infiltrators to lookouts on both sides."},
            {name:"Fast Patrol Cycle", description:"Desert sentries rotate quickly to avoid heat exhaustion, making timing essential."},
            {name:"Gravel-Screech Flats", description:"A field of sharp stones screeches underfoot unless crossed with extreme care."},
            {name:"Messenger Camel Route", description:"A rider or trained animal moves unpredictably between outposts."},
            {name:"Busy Oasis", description:"Travelers, wildlife, or locals occupy a water-rich grove; blending in becomes key."},
            {name:"Trapped Treasure Niche", description:"An alcove of valuables is rigged with alarms or deadly sand-based traps."},
            {name:"Polished Copper Mirrors", description:"Mirrored metal plates reflect sunlight used by lookouts to spot distant movement."},
            {name:"Dust-Haze Corridor", description:"A cloud of dust obscures vision but causes coughing or noisy movement."},
            {name:"Dried Brush Carpet", description:"A layer of dried plants cracks and crunches loudly beneath careless steps."}
        ],
        Aquatic: [
            {name:"Kelp Watch Post", description:"Hidden sentries lurk within thick kelp strands, watching for disturbances in the water."},
            {name:"Reef Gate", description:"A barrier of coral growths and woven seaweed blocks passage into a guarded area."},
            {name:"Silt Cloud Trap", description:"A thin layer of loose silt erupts into visibility-ruining clouds when disturbed."},
            {name:"Patrolling Shoal", description:"Merfolk, sahuagin, or aquatic scouts circle the area in quiet, sweeping routes."},
            {name:"Coral Overlook", description:"A sentry watches from atop a coral outcrop with clear line-of-sight across the seafloor."},
            {name:"Shell Chime Alarm", description:"Strings of delicate shells clatter loudly with even the slightest water movement."},
            {name:"Collapsed Cavern Slot", description:"A narrow fissure in a rocky wall offers a hidden but cramped infiltration route."},
            {name:"Shadowed Trench", description:"A deep, dark trench provides concealment but one wrong fin stroke echoes loudly."},
            {name:"Predator Nest", description:"A territorial sea creature—shark, eel, or serpent—guards its territory aggressively."},
            {name:"Echoing Cavern", description:"Underwater cave acoustics amplify noise through the currents."},
            {name:"Brambling Coral", description:"Sharp coral branches snag equipment and create scraping sounds if brushed."},
            {name:"Rune-Marked Pillar", description:"A stone column etched with glowing runes alerts watchers when crossed."},
            {name:"Open Sand Expanse", description:"A vast sandy plain offers no cover, making stealth extremely difficult."},
            {name:"Bioluminescent Clearing", description:"Glowing algae light the area, revealing anyone who passes through."},
            {name:"Sinking Sand Pocket", description:"A patch of unstable seabed collapses into a slow-suction trap if stepped on."},
            {name:"Shackled Prisoner", description:"A captive anchored to a rock formation may shout—or create bubbles—when approached."},
            {name:"Sleeping Encampment", description:"Aquatic dwellers rest in suspended nets or coral huts; noise risks waking them."},
            {name:"Cluttered Wreckage", description:"Broken ship timbers and scattered debris make quiet navigation difficult."},
            {name:"Secret Current Path", description:"A narrow flow of water provides a hidden and silent bypass if detected."},
            {name:"Coral-Sealed Door", description:"A magically reinforced coral growth blocks entry until carefully weakened or opened."},
            {name:"Seafloor Ridge Crossing", description:"A raised ridge exposes infiltrators to watchers on both sides."},
            {name:"Tight Patrol Rotation", description:"Aquatic guards rotate shifts quickly to avoid fatigue, requiring precise timing."},
            {name:"Crunching Shell Bed", description:"A field of broken shells crunches and snaps underfoot—or fin—if crossed carelessly."},
            {name:"Messenger Ray Route", description:"A trained sea creature glides along a regular but unpredictable path."},
            {name:"Busy Feeding Grounds", description:"A cluster of fish, crabs, or aquatic folk are active here; blending in is key."},
            {name:"Trap-Laden Treasure Cache", description:"A stash of valuables inside a coral alcove is protected with magical or physical traps."},
            {name:"Reflective Bubble Veins", description:"Lines of shimmering bubbles reveal movement to distant watchers."},
            {name:"Murky Silt Corridor", description:"Suspended silt clouds obscure vision but make silent movement difficult."},
            {name:"Cracking Sponge Field", description:"A bed of brittle sponges pops and crackles loudly when brushed or stepped on."}
        ],
        Arctic: [
  {name:"Ice Watch Post", description:"Sentries keep lookout from atop an icy rise or snow-covered ridge."},
  {name:"Frozen Barrier Gate", description:"A wall of packed snow, ice blocks, or frozen timber blocks the way."},
  {name:"Snow-Covered Pit Trap", description:"A concealed pit lies hidden under a thin crust of snow and frost."},
  {name:"Roaming Frost Patrol", description:"Cold-resistant scouts or beasts move along set patrol paths through the tundra."},
  {name:"Glacial Overlook", description:"A lookout perched on glacial ice surveys a wide expanse of frozen ground."},
  {name:"Icicle Chime Alarm", description:"Hanging icicles or bone wind-chimes tinkle sharply when disturbed."},
  {name:"Collapsed Ice Crevice", description:"A narrow crack in the ice offers a hidden but cramped infiltration route."},
  {name:"Shadowed Snowdrift", description:"Deep snowbanks provide concealment but crunch loudly under pressure."},
  {name:"Beast Den in the Frost", description:"A polar predator’s lair—bear, wolf, or ice-breathing beast—guards its territory fiercely."},
  {name:"Echoing Ice Tunnel", description:"Frozen caverns carry sound unnaturally well, making stealth more difficult."},
  {name:"Rime-Thorn Thicket", description:"A patch of frostbitten shrubs crackles when brushed, alerting nearby guards."},
  {name:"Rune-Etched Ice Pillar", description:"A glowing frost rune alerts its caster when passed or disturbed."},
  {name:"Open Snowfield", description:"A bright, flat expanse of snow offers no cover, exposing anyone crossing it."},
  {name:"Moonlit Glacier Face", description:"Reflected moonlight on ice creates sharp visibility for watchers above."},
  {name:"Weak Ice Shelf", description:"A fragile patch of ice threatens to crack loudly—or collapse—underfoot."},
  {name:"Bound Survivor", description:"A captive or stranded wanderer may cry out—or whisper intel if approached quietly."},
  {name:"Sleeping Outpost", description:"Tents or igloos house resting guards; any noise risks waking the camp."},
  {name:"Cluttered Sled Yard", description:"Sleds, crates, and frozen gear create obstacles that crunch or clatter easily."},
  {name:"Hidden Wind Carve", description:"A narrow snow-carved channel provides a silent bypass if discovered."},
  {name:"Ice-Sealed Door", description:"A door frozen shut requires careful chipping or magic to open quietly."},
  {name:"Ridge-Line Crossing", description:"A narrow ridge exposes infiltrators to watchers on both sides."},
  {name:"Fast Frost Patrol Cycle", description:"Guards rotate rapidly to avoid cold fatigue, requiring precise timing to sneak through."},
  {name:"Crunching Snowfield", description:"Hard-packed snow cracks and crunches loudly beneath careless steps."},
  {name:"Messenger Hawk Route", description:"A trained bird flies regular scouting circuits overhead."},
  {name:"Busy Hunting Grounds", description:"Wildlife or hunters are active here, making blending in or avoiding attention crucial."},
  {name:"Trapped Ice Cache", description:"A stash of chilled goods or relics is protected with mundane or magical frost traps."},
  {name:"Reflective Ice Wall", description:"Smooth ice surfaces reflect motion, making sneaking more difficult."},
  {name:"Snow-Haze Corridor", description:"Windblown snow reduces visibility but muffles some sounds while amplifying others."},
  {name:"Cracking Frost Sheet", description:"Thin layers of frost snap loudly when crushed underfoot."}
        ],
        Astral: [
  {name:"Mindwatch Post", description:"Psychic sentries perceive disturbances not by sight, but through mental ripples."},
  {name:"Etheric Gateframe", description:"A shimmering barrier of condensed astral matter blocks the way, shifting with thought."},
  {name:"Floating Shard Trap", description:"Invisible gravity pockets send razorlike crystal shards spinning when disturbed."},
  {name:"Patrolling Thoughtforms", description:"Constructed minds or astral guardians glide on looping, unnatural patrol routes."},
  {name:"Starlit Vantage Spire", description:"A lookout hovers atop a drifting pillar with panoramic astral visibility."},
  {name:"Resonance Chime Lattice", description:"Psychic tuning rods vibrate when minds approach, triggering silent alarms."},
  {name:"Folded Space Slip", description:"A narrow dimensional overlap offers a hidden but disorienting infiltration route."},
  {name:"Shadowless Corridor", description:"Light behaves strangely here, making stealth rely entirely on stillness and silence."},
  {name:"Astral Predator Nest", description:"A psychic or incorporeal beast lurks, sensitive to emotional or mental spikes."},
  {name:"Echoing Thought Hall", description:"Psychic echoes repeat intruders’ stray thoughts, risking detection."},
  {name:"Fractured Reality Tangle", description:"Splintered geometry twists paths and may reflect movement unpredictably."},
  {name:"Ward Sigil Constellation", description:"Floating runes orbit an area, alerting their creator when crossed or disturbed."},
  {name:"Open Void Expanse", description:"A huge region of drifting astral emptiness offers no concealment whatsoever."},
  {name:"Luminescent Pathway", description:"A glowing trail of motes brightens when traversed, creating a luminous footprint."},
  {name:"Instability Rift", description:"A flickering tear in reality threatens to flare loudly or collapse if approached."},
  {name:"Bound Mindshard", description:"An imprisoned psyche might erupt with warning cries—or share secret knowledge."},
  {name:"Slumbering Projection", description:"Dormant mental projections float here; any disturbance awakens psychic guardians."},
  {name:"Scattered Arcane Debris", description:"Remnants of broken spells and floating objects drift unpredictably, bumping noisily."},
  {name:"Secret Flow Current", description:"A subtle psychic current allows a silent bypass for those attuned to its direction."},
  {name:"Astral-Sealed Doorway", description:"A door of solid thought responds only to specific mental patterns or keys."},
  {name:"Drifting Plateau Crossing", description:"Floating platforms expose infiltrators to watchers positioned on higher tiers."},
  {name:"Rapid Watch Rotation", description:"Psychic guards shift their awareness quickly, requiring perfect timing to slip past."},
  {name:"Crackling Thought Field", description:"A field of volatile psychic energy crackles when minds stray too close."},
  {name:"Messenger Psyche Route", description:"A roaming mindshape or mental courier moves unpredictably between nodes."},
  {name:"Busy Planar Confluence", description:"Spirits, travelers, and astral entities converge here; blending in is critical."},
  {name:"Trap-Laden Memory Cache", description:"A vault of stored memories is protected by illusions, wards, or psychic traps."},
  {name:"Reflective Psyche Mirrors", description:"Mind-mirroring surfaces reveal emotional or mental disturbances at a distance."},
  {name:"Nebula-Haze Corridor", description:"Clouds of astral mist obscure sight but distort sound and thought."},
  {name:"Cracking Crystal Lattice", description:"A fragile crystalline surface snaps loudly when stepped on or touched."}
        ],
        Swamp: [
  {name:"Bog Watch Post", description:"Sentries perch on stilts or crude platforms above the muck, scanning for movement."},
  {name:"Reed Gate", description:"A woven barrier of reeds, vines, and mud blocks passage into a guarded area."},
  {name:"Mire Sink Trap", description:"A patch of treacherous mud swallows a careless step and makes loud, bubbling noises."},
  {name:"Drifting Patrol", description:"Swamp dwellers or scouts travel slowly by raft or wade through the shallows on patrol routes."},
  {name:"Croaking Canopy Perch", description:"A lookout waits in the branches above, hidden among moss and dangling vines."},
  {name:"Bone Chime Alarm", description:"Tied bones clatter together with even a faint ripple of water or wind."},
  {name:"Collapsed Root Tunnel", description:"A tangle of roots creates a narrow, hidden passage beneath a giant swamp tree."},
  {name:"Fog-Thick Hollow", description:"Deep mist clouds visibility; sound seems to travel in unpredictable directions."},
  {name:"Predator Nest", description:"A territorial alligator, giant frog, or marsh beast lurks near its den, alert to disturbances."},
  {name:"Echoing Cypress Grove", description:"Sound bounces strangely among hollow trees and waterlogged trunks."},
  {name:"Spine-Reed Thicket", description:"Sharp, brittle reeds snap loudly when stepped on or brushed aside."},
  {name:"Ward-Carved Totem", description:"A ritual totem marked with runes alerts its creator when crossed or disturbed."},
  {name:"Open Bog Expanse", description:"A wide stretch of shallow water and moss mats offers almost no concealment."},
  {name:"Glowmoss Clearing", description:"Bioluminescent moss illuminates intruders with soft green light."},
  {name:"Sucking Mud Pocket", description:"A patch of hidden quick-mud tugs loudly at boots or limbs as it pulls downward."},
  {name:"Bound Swamp Hermit", description:"A tied or trapped wanderer may call out—or whisper warnings to infiltrators."},
  {name:"Sleeping Shanty Camp", description:"Huts built on stilts hold resting guards; any disturbance risks waking them."},
  {name:"Cluttered Marsh Debris", description:"Floating logs, driftwood, and broken planks bump and creak unpredictably."},
  {name:"Secret Water Channel", description:"A narrow, still canal offers a silent bypass for those who notice it."},
  {name:"Vine-Sealed Hut Door", description:"Thick vines bind a doorway shut and snap loudly if cut or pulled carelessly."},
  {name:"Raised Root Crossing", description:"Exposed roots form a natural bridge, leaving travelers visible from below."},
  {name:"Quick Patrol Rotation", description:"Swamp guards switch routes often to avoid sinking terrain, requiring precise timing."},
  {name:"Crunching Bog Crust", description:"Thin layers of dried muck crack loudly underfoot before sinking into mud."},
  {name:"Messenger Crocodile Route", description:"A trained creature or scout moves swiftly through the water along an unpredictable path."},
  {name:"Crowded Forage Patch", description:"Foragers, creatures, and locals move about frequently, making stealth challenging."},
  {name:"Trap-Laden Cache Mound", description:"A raised mound storing goods is protected with snares, alarms, or fetishes."},
  {name:"Reflective Water Mirror", description:"Still swamp water mirrors movement, making it visible to distant watchers."},
  {name:"Murky Bog Corridor", description:"Dense algae and mist obscure vision but amplify splashes and movement sounds."},
  {name:"Cracking Peat Mat", description:"A floating mat of peat groans, cracks, or partially collapses under pressure."}
        ],
        Mountain: [
  {name:"Ridge Watch Post", description:"Guards perch on a narrow outcrop overlooking the switchback paths below."},
  {name:"Stone Gate", description:"A reinforced barrier of stacked boulders blocks entry to a defended passage."},
  {name:"Loose Gravel Slide", description:"A patch of unstable scree shifts loudly underfoot with even careful movement."},
  {name:"Cliffside Patrol", description:"Scouts traverse a precarious ledge route, visible from far down the slope."},
  {name:"Eagle's Perch Lookout", description:"A sentry or trained bird watches from a high crag jutting over the pass."},
  {name:"Wind Chime Talus Alarm", description:"Rattling stones and metal scraps strung between rocks jingle in the wind."},
  {name:"Collapsed Tunnel Mouth", description:"A partially caved-in cavern entrance hides a cramped, quiet path inward."},
  {name:"Thin-Air Ravine", description:"Cold, thin air makes breathing noisy and movement more noticeable."},
  {name:"Predator Eyrie", description:"A territorial mountain beast lurks in a ledge-nest, alert to vibrations and sound."},
  {name:"Echoing Stone Corridor", description:"Sharp echoes bounce unpredictably between narrow rock walls."},
  {name:"Shardfall Slope", description:"Jagged slate fragments crack loudly when stepped on or scraped."},
  {name:"Carved Warning Cairn", description:"Stacked stones etched with runes alert watchers when disturbed."},
  {name:"Open Cliff Expanse", description:"A long exposed traverse leaves little opportunity for cover or approach."},
  {name:"Glinting Ice Patch", description:"Thin frost reflects light in flashes that can reveal movement from afar."},
  {name:"Hollow Rock Shelf", description:"A brittle shelf of stone groans and pops under any weight placed on it."},
  {name:"Captured Mountaineer", description:"A restrained climber or scout may shout warnings—or subtle guidance."},
  {name:"Sleeping Peak Camp", description:"Tents cling to a flat spot along the ridge where resting guards lie close together."},
  {name:"Creaking Rope Bridge", description:"A weather-beaten suspension bridge sways and groans with every step."},
  {name:"Hidden Goat Trail", description:"A narrow, quiet animal path provides silent movement for those who spot it."},
  {name:"Boulder-Wedged Door", description:"Heavy stones jam a door or passage, and dislodging them creates thunderous noise."},
  {name:"Exposed Spine Ridge", description:"A high, narrow ridge makes infiltrators visible against the skyline."},
  {name:"Rapid Patrol Shift", description:"Mountain guards vary their routes as falling rocks force constant path changes."},
  {name:"Cracking Frost Crust", description:"A thin layer of frozen snow snaps loudly when crossed."},
  {name:"Messenger Hawk Route", description:"A trained bird circles between posts, alerting watchers to unusual movement."},
  {name:"Crowded Forager Shelf", description:"Locals and creatures gather on a rare flat terrace, making stealth difficult."},
  {name:"Trap-Lined Cliff Cache", description:"Supplies stored beneath an overhang are ringed with alarms and snares."},
  {name:"Reflective Ice Face", description:"A sheet of ice mirrors movement and glints with passing shadows."},
  {name:"Mist-Filled Crevasse", description:"Dense fog oozes up from a fissure, muffling vision but amplifying slipping sounds."},
  {name:"Groaning Rock Arch", description:"A natural stone arch vibrates and rumbles when disturbed even slightly."}
        ],
        Plains: [
  {name:"Watchtower Post", description:"A lone lookout scans the flat expanse for movement over miles of grassland."},
  {name:"Fenced Gate", description:"A simple wooden fence or stockade blocks passage and is monitored by guards."},
  {name:"Dry Creek Bed Trap", description:"A hidden depression or crack in the earth threatens to trip or slow intruders."},
  {name:"Roving Cavalry Patrol", description:"Mounted scouts circle along predictable or unpredictable routes across the plain."},
  {name:"Hawkeye Lookout", description:"A sentry or trained bird spots movement from afar against the open horizon."},
  {name:"Wind Chime Alarm", description:"Strung metal or bone fragments tinkle loudly in the plain’s open breezes."},
  {name:"Collapsed Dugout", description:"A partially caved-in shelter provides a narrow, concealed pathway."},
  {name:"Tall Grass Thicket", description:"Deep grasses obscure vision but amplify noise with every step."},
  {name:"Predator Lair", description:"A pack of wolves or a territorial beast watches its hunting grounds carefully."},
  {name:"Echoing Stone Outcrop", description:"Occasional rocky formations reflect sound, revealing subtle movements."},
  {name:"Scattered Boulders", description:"Loose rocks shift underfoot, creating sudden noise or alerts."},
  {name:"Marked Boundary Totem", description:"A carved pole or marker warns of guarded territory."},
  {name:"Open Prairie Expanse", description:"Flat, featureless terrain offers no cover for stealthy movement."},
  {name:"Sun-Baked Clearing", description:"Bright sunlight highlights any movement across the open ground."},
  {name:"Loose Soil Patch", description:"Soft earth shifts and squeaks, revealing anyone walking carelessly."},
  {name:"Bound Scout", description:"A tied or trapped local may cry out—or whisper warnings to intruders."},
  {name:"Sleeping Camp", description:"Tents and temporary shelters hold resting guards; noise risks detection."},
  {name:"Cluttered Wagon Debris", description:"Fallen carts, crates, and tools create obstacles that can be noisy."},
  {name:"Hidden Herd Trail", description:"A faint path made by animals or people offers quiet passage if found."},
  {name:"Stockade Door", description:"A reinforced gate is difficult to bypass without creating noise."},
  {name:"Exposed Ridge Crossing", description:"A low rise leaves travelers silhouetted against the skyline."},
  {name:"Rapid Patrol Rotation", description:"Guards shift routes frequently to cover the wide, open territory."},
  {name:"Cracking Dry Grass", description:"Brittle stalks snap underfoot, betraying movement."},
  {name:"Messenger Falcon Route", description:"A trained bird or rider moves quickly along a set route, alerting sentries."},
  {name:"Crowded Grazing Patch", description:"Cattle, wildlife, or workers gather here, making stealth difficult."},
  {name:"Trap-Laden Supply Pile", description:"Stored goods are protected with alarms, snares, or tripwires."},
  {name:"Reflective Waterhole", description:"A small pond reflects light and reveals silhouettes to distant watchers."},
  {name:"Dusty Corridor", description:"Wind-blown dust obscures vision but carries sound across the plain."},
  {name:"Cracking Earth Mat", description:"Dry, brittle ground groans and crumbles under weight."}
        ],
        Subterranean: [
  {name:"Tunnel Watch Post", description:"A sentry peers from a hidden alcove, monitoring the narrow passage ahead."},
  {name:"Stone Gate", description:"A crudely reinforced stone door blocks the path and is watched by guards or traps."},
  {name:"Pitfall Trap", description:"A concealed hole in the floor drops intruders into a lower chamber or spike trap."},
  {name:"Patrolling Goblin", description:"A scout or small group moves silently along winding corridors."},
  {name:"High Ledge Lookout", description:"A figure watches from a ledge above, ready to alert others."},
  {name:"Rattling Bone Alarm", description:"Loose bones or debris rattle when disturbed, warning nearby sentries."},
  {name:"Collapsed Passage", description:"A partially fallen tunnel offers a narrow, hidden route inward."},
  {name:"Shadowed Cavern", description:"Darkness conceals movement, but echoes betray every footstep."},
  {name:"Predator Lair", description:"A giant spider, cave bear, or other subterranean creature guards its home."},
  {name:"Echoing Chamber", description:"Sound bounces unpredictably across stone walls, revealing noise to distant ears."},
  {name:"Loose Rock Pile", description:"A pile of rubble shifts and clatters under even careful movement."},
  {name:"Marked Rune Pillar", description:"A carved stone warns of magically protected territory."},
  {name:"Open Chamber", description:"A wide cavern offers no cover for stealthy approaches."},
  {name:"Glowing Fungi Patch", description:"Bioluminescent mushrooms light the area, exposing anyone passing through."},
  {name:"Hidden Trapdoor", description:"A camouflaged hatch leads downward but creaks when opened."},
  {name:"Bound Prisoner", description:"A captive may cry out—or whisper warnings to infiltrators."},
  {name:"Sleeping Camp", description:"A small encampment of guards or miners rests; noise risks detection."},
  {name:"Cluttered Storage Room", description:"Crates, barrels, and loose stone make quiet movement difficult."},
  {name:"Narrow Ledge Path", description:"A thin rock ledge offers a hidden route but is treacherous to cross."},
  {name:"Reinforced Doorway", description:"A heavy stone or metal door requires careful manipulation to avoid noise."},
  {name:"Exposed Balcony", description:"A ledge overlooking the tunnel leaves intruders visible from below."},
  {name:"Rapid Patrol Rotation", description:"Guards rotate frequently, making timing crucial for stealth."},
  {name:"Cracking Floor Tiles", description:"Loose or brittle stone cracks loudly when stepped on."},
  {name:"Messenger Rat Route", description:"Trained rats or small creatures move along predictable paths, alerting sentries."},
  {name:"Crowded Work Area", description:"Miners, foragers, or denizens occupy this zone, complicating stealth."},
  {name:"Trap-Laden Treasure Cache", description:"A stash of valuables is protected with mundane and magical traps."},
  {name:"Reflective Water Pool", description:"A shallow pool mirrors movement, exposing intruders to watchers."},
  {name:"Dust-Filled Corridor", description:"A tunnel filled with dry dust amplifies sound but may conceal movement visually."},
  {name:"Loose Gravel Mat", description:"A patch of small stones and debris crunches and shifts under weight."}
        ],
        Urban : [
  {name:"Guard Post", description:"A pair or squad of guards maintain watch, scanning for movement or unusual sounds."},
  {name:"Locked Door", description:"A secure door bars further passage, requiring stealthy picking or an alternate route."},
  {name:"Mechanical Trap", description:"A hidden trap—pressure plate, wire, or rune—lies in the path, requiring careful disarming."},
  {name:"Patrolling Guards", description:"A moving patrol cycles through the area on a predictable or unpredictable schedule."},
  {name:"Watchtower Overlook", description:"A high vantage point exposes sneaking characters to long-range observation."},
  {name:"Alarm Wire", description:"A thin tripline triggers bells, chimes, or magical alerts if disturbed."},
  {name:"Narrow Crawlspace", description:"A cramped passage allows bypassing a main route but requires slow, quiet movement."},
  {name:"Shadowed Hallway", description:"Deep shadows make hiding easier—but sound echoes easily here."},
  {name:"Guard Dog Pen", description:"Trained beasts are ready to bark or attack at the slightest disturbance."},
  {name:"Listening Post", description:"A designated spot where guards specifically listen for movement or whispered speech."},
  {name:"Barricaded Passage", description:"Furniture, crates, or debris block the route, forcing noisy movement to get through."},
  {name:"Arcane Surveillance Rune", description:"A magical sigil glows faintly, triggering alarms if stepped on or crossed."},
  {name:"Sentry Sniper Perch", description:"A distant archer or lookout watches a long corridor or courtyard."},
  {name:"Torch-Lit Corridor", description:"Bright light exposes any creature attempting to pass unseen."},
  {name:"Hidden Pressure Plate", description:"A silent but deadly trap awaits anyone who steps on the wrong tile."},
  {name:"Chained Prisoner", description:"A frightened or desperate captive may shout when approached—or help the infiltrators."},
  {name:"Barracks Entrance", description:"Sleeping or resting soldiers lie inside; any noise risks waking a group."},
  {name:"Disorganized Storage Room", description:"Stacks of crates and fragile objects create noise hazards for careless movement."},
  {name:"Secret Door", description:"A hidden entrance offers a silent bypass—if the characters can find it."},
  {name:"Magical Lock", description:"A magically sealed barrier requires Passwall, a key item, or successful Thievery with special tools."},
  {name:"Open Balcony", description:"Crossing this exposed platform risks being seen from below or above."},
  {name:"Tight Guard Rotation", description:"Guards rotate shifts quickly, making timing a stealth passage critical."},
  {name:"Ringing Floor Tiles", description:"Loose tiles clang loudly unless crossed with precision and care."},
  {name:"Messenger Route", description:"A courier or runner moves back and forth unpredictably, potentially spotting intruders."},
  {name:"Crowded Interior", description:"Servants, workers, or commoners move about; the challenge is blending in rather than hiding."},
  {name:"Booby-Trapped Chest", description:"A trapped container tempts investigation but may set off a loud alarm."},
  {name:"Reflective Mirrors", description:"Mirrors in corners allow guards to watch blind spots."},
  {name:"Smoke-Filled Room", description:"Dim, hazy air obscures vision but makes coughing or stumbling more likely."},
  {name:"Loose Gravel Path", description:"Crunchy debris makes stealth extremely difficult unless avoided or carefully swept aside."}
        ]
    })

    const researchBiomeData = $state({
        Forest: [
  {name: "Scout's Lookout", description: "A small wooden platform in the trees provides a vantage point, used by local rangers to observe the area."},
  {name: "Loremother Tree", description: "A massive, ancient oak stands at the center of the forest; travelers often leave notes or markings here to share guidance."},
  {name: "Mushroom Circle", description: "A ring of large mushrooms grows in a clearing, often used by locals as a landmark or meeting point."},
  {name: "Hidden Grove", description: "A quiet grove used by rangers or hunters to rest and exchange information about the forest."},
  {name: "Stone Cairn", description: "A simple stack of stones marks a trail junction, containing small notes or clues left by previous travelers."},
  {name: "Babbling Brook", description: "A shallow stream runs through the forest, with worn banks where locals often leave messages or supplies."},
  {name: "Forest Stag Trail", description: "Tracks of wildlife indicate the safest routes and areas of interest for those familiar with the forest."},
  {name: "Ranger's Hut", description: "A small hut used by forest rangers contains maps, notes, and firsthand knowledge of the area."},
  {name: "Forest Treehouse", description: "A modest treehouse serves as a hideout or observation point, where travelers leave journals or markings."},
  {name: "Abandoned Cabin", description: "A neglected cabin contains maps, old supplies, or messages left by previous visitors."},
  {name: "Beaver Dam", description: "A dam built by beavers offers clues about water flow, local wildlife, and potential hazards."},
  {name: "Windy Ridge", description: "A high ridge provides a clear view of the surrounding forest and may reveal paths or activity below."},
  {name: "Fallen Log Crossing", description: "A large log forms a natural bridge over a creek, often used by hunters and travelers alike."},
  {name: "Animal Tracks", description: "Footprints of deer, wolves, or bears provide information on local animal patterns and areas to avoid."},
  {name: "Forest Clearing", description: "An open patch in the trees often serves as a campsite or meeting point for travelers."},
  {name: "Old Ranger's Camp", description: "A site where forest rangers once stayed, still containing notes and small useful supplies."},
  {name: "Hidden Trail", description: "A barely noticeable path winds through dense undergrowth, used by locals to move quietly through the forest."},
  {name: "Logging Outpost", description: "A small building left by woodcutters contains maps, tools, and information about the surrounding terrain."},
  {name: "Forest Tavern", description: "A small tavern or roadside inn near the forest offers a place to gather rumors and local knowledge."},
  {name: "Abandoned Hunting Stand", description: "A raised platform used for hunting contains clues or notes about wildlife and patrols."},
  {name: "Trail Markers", description: "Carved notches or painted signs on trees indicate important paths or landmarks in the forest."},
  {name: "Hidden Campsite", description: "A discreet campsite used by travelers contains journals, supplies, or local tips."},
  {name: "Forest Bridge", description: "A simple wooden bridge crosses a stream, often serving as a landmark or information point."},
  {name: "Rock Outcrop", description: "A small rocky hill offers a clear view of the forest and may reveal hidden trails or activity."},
  {name: "Natural Shelter", description: "A rock overhang or hollowed tree trunk provides temporary shelter and a place for leaving messages."},
  {name: "Traveler's Note", description: "A message left on a tree or in a small hollow provides directions, warnings, or tips."},
  {name: "Lookout Tree", description: "A tall tree offers a vantage point where scouts or travelers have left notes or signals."},
  {name: "Forest Stream Crossing", description: "A shallow crossing point offers safe passage and may be marked with clues or signs."},
  {name: "Hollow Log Hideout", description: "A hollowed log serves as a temporary shelter and a place to leave small objects or notes."},
  {name: "Forest Watchtower", description: "A wooden tower used to observe the area, often containing logs or messages from rangers."},
  {name: "Berry Patch", description: "A patch of edible berries marks a common stop for travelers, who sometimes leave notes or signs."},
  {name: "Stone Bench Clearing", description: "A natural clearing with a simple stone bench where locals rest and share information."}
        ],
        Desert: [
  {name: "Caravan Outpost", description: "A small outpost used by traders and travelers to rest, exchange information, and share news."},
  {name: "Oasis Camp", description: "A hidden oasis where locals and nomads gather, offering opportunities to gather rumors or supplies."},
  {name: "Sandstone Cairn", description: "A stack of stones marks a trail junction or memorial, sometimes containing notes left by travelers."},
  {name: "Abandoned Tent", description: "A deserted camp with supplies, maps, or messages left behind by previous visitors."},
  {name: "Desert Caravan Trail", description: "A worn path used by traders and nomads, where clues about recent movements can be found."},
  {name: "Wind-Swept Ridge", description: "A ridge overlooking the surrounding dunes, providing a vantage point to spot routes or travelers."},
  {name: "Trading Post", description: "A small, makeshift trading post offers a place to gather local information and barter for supplies."},
  {name: "Nomad's Campfire", description: "A campfire site used by nomads leaves signs of recent activity and possible clues."},
  {name: "Buried Supply Cache", description: "A partially buried crate or chest holds goods and notes left by merchants or explorers."},
  {name: "Sun-Baked Stone Marker", description: "A stone marker indicates a route or landmark, sometimes with carvings or messages."},
  {name: "Travelers’ Rest Hut", description: "A simple shelter used by desert travelers to rest and exchange news."},
  {name: "Dry Creek Crossing", description: "A shallow wash or creekbed provides a natural route and clues about recent travel."},
  {name: "Sand Dune Ridge", description: "A high dune provides a view over the area and may reveal tracks or trails."},
  {name: "Abandoned Watchtower", description: "A small, ruined watchtower used historically to monitor trade routes, holding old maps or notes."},
  {name: "Fennec Fox Burrow", description: "Tracks and burrows of local wildlife provide clues about the terrain and activity."},
  {name: "Hidden Sandstone Alcove", description: "A small alcove in a rock formation provides shelter and a discreet place to leave messages."},
  {name: "Desert Tavern", description: "A tiny tavern or tea house near a route offers information from passing travelers and locals."},
  {name: "Nomad's Tent", description: "A tent belonging to a traveling group provides an opportunity to gain guidance or rumors."},
  {name: "Ancient Caravan Ruins", description: "The remains of an old trading caravan hide supplies, notes, and clues about past routes."},
  {name: "Salt Flat Marker", description: "A unique rock or natural formation marks a crossing point, sometimes annotated with messages."},
  {name: "Desert Well", description: "A small well offers water and is often a place where travelers leave messages or barter."},
  {name: "Sunset Ridge", description: "A vantage point where locals and travelers observe the surrounding dunes and exchange information."},
  {name: "Rock Shelter", description: "A natural shelter in a rock face provides cover and sometimes hidden notes or supplies."},
  {name: "Trade Route Signpost", description: "A wooden post or carved stone indicates a route and may have directional notes left by travelers."},
  {name: "Hidden Market Stall", description: "A temporary stall where traders exchange goods and occasionally share local knowledge."},
  {name: "Burial Cairn", description: "A small cairn marks a grave or waypoint, containing small items or messages left behind."},
  {name: "Dune Crossing", description: "A commonly used pass between dunes leaves signs and tracks from previous travelers."},
  {name: "Abandoned Supply Wagon", description: "A stranded wagon holds goods, maps, and clues about the surrounding desert."},
  {name: "Nomad Guide Post", description: "A small post or marker left by nomads helps travelers navigate and may include messages."},
  {name: "Wind-Swept Canyon", description: "A narrow canyon exposes footprints, dropped items, and other subtle clues about recent activity."},
  {name: "Oasis Palm Grove", description: "A cluster of palms around a water source provides a meeting point for travelers and merchants."},
  {name: "Stone Shelter", description: "A simple stone shelter offers a resting place and may contain notes left by previous visitors."}
        ],
        Aquatic: [
  {name: "Coral Outcrop", description: "A large coral formation provides shelter for marine life and may hide small artifacts or natural clues."},
  {name: "Sunken Shipwreck", description: "The remains of a vessel rest on the seabed, holding journals, cargo, or navigational notes."},
  {name: "Hidden Lagoon", description: "A quiet, sheltered lagoon is visited by local fishermen or travelers, offering information about the area."},
  {name: "Fisherman's Hut", description: "A simple hut along the coast contains nets, maps, and advice from local fishermen."},
  {name: "Kelp Forest Path", description: "A dense patch of kelp hides natural passages and leaves traces of creatures or human activity."},
  {name: "Tidepool Nook", description: "Small tidepools reveal clues about local wildlife patterns and tidal changes."},
  {name: "Harbor Watchtower", description: "A small tower overlooking a harbor provides logs, charts, and notes from local sailors."},
  {name: "Drifting Fishing Boat", description: "A boat anchored or adrift contains clues or messages left by its crew."},
  {name: "Shoreline Caves", description: "Natural caves along the coast conceal objects, notes, or signs of recent visitors."},
  {name: "Abandoned Pier", description: "A decaying pier holds remnants of past shipments, tools, or charts."},
  {name: "Seagull Roost", description: "A colony of birds nests along cliffs, and their activity can indicate hidden paths or objects."},
  {name: "Sailor’s Tavern", description: "A small tavern near the docks is a place to gather rumors, local knowledge, or maps."},
  {name: "Hidden Dockside Shed", description: "A discreet shed contains supplies, messages, or nautical tools left behind."},
  {name: "Reef Passage", description: "A navigable channel through the coral provides natural clues to currents and hazards."},
  {name: "Buoy Marker", description: "A buoy marks a safe route or hazard and may contain notes or tied objects for travelers."},
  {name: "Saltwater Marsh", description: "Shallow marshes along the coast hide tracks, discarded items, or natural signs of passage."},
  {name: "Fisherman’s Nets", description: "Discarded or drying nets sometimes conceal messages or small objects left by locals."},
  {name: "Lighthouse Base", description: "A coastal lighthouse contains logs, maps, or messages left by keepers or sailors."},
  {name: "Driftwood Shelter", description: "Natural or improvised shelters made from driftwood offer a temporary refuge and possible clues."},
  {name: "Floating Trade Raft", description: "A small raft used by traders may hold cargo, notes, or observations about the surrounding area."},
  {name: "Seashell Markers", description: "Arranged shells indicate trails, resting spots, or clues left by other travelers."},
  {name: "Hidden Fishing Cove", description: "A quiet cove used by locals to fish or gather supplies contains signs of activity."},
  {name: "Shipwright’s Workshop", description: "A small dockside workshop contains plans, logs, and clues about recent shipments."},
  {name: "Tide-Altered Ruins", description: "Structures partially submerged or eroded by tides hold remnants of notes, tools, or small items."},
  {name: "Anchorage Point", description: "A safe spot to anchor boats may have signs, messages, or marks left by previous visitors."},
  {name: "Coastal Watch Post", description: "A small post allows observation of the coast and nearby waterways, often with written logs."},
  {name: "Hidden Lagoon Cabin", description: "A cabin along a secluded lagoon provides shelter and information left by locals or travelers."},
  {name: "Driftwood Marker", description: "Pieces of driftwood arranged in a pattern indicate routes, hazards, or locations of interest."},
  {name: "Tidepool Observing Rock", description: "A rock formation provides a good vantage point to study currents, wildlife, or passing vessels."},
  {name: "Sandbar Crossing", description: "A shallow sandbar is a natural passage, showing footprints or objects left by travelers."},
  {name: "Harbor Merchant Stall", description: "A small stall along the docks offers goods and local knowledge for those who ask."}
        ],
        Arctic: [
  {name: "Frozen Watch Hut", description: "A small hut used by explorers or rangers offers shelter and notes about the surrounding terrain."},
  {name: "Glacial Ridge", description: "A high ridge provides a vantage point over the ice and snow, revealing tracks and travel routes."},
  {name: "Ice-Covered Cave", description: "A natural cave carved into the glacier contains tools, notes, or signs of previous travelers."},
  {name: "Abandoned Trading Post", description: "A small building left by fur traders or explorers contains journals, maps, and local tips."},
  {name: "Polar Scout Camp", description: "A temporary camp used by local guides or scouts provides information on recent activity."},
  {name: "Snowdrift Crossing", description: "A shallow pass through snowdrifts shows footprints and signs of movement."},
  {name: "Frozen Riverbank", description: "The ice along a river or stream holds tracks, small objects, and clues about nearby wildlife."},
  {name: "Iceberg Observation Point", description: "A stable iceberg or rock outcrop offers a vantage point for studying currents and distant activity."},
  {name: "Seals’ Haul-Out", description: "A stretch of ice where seals gather provides clues about local fauna and the surrounding terrain."},
  {name: "Frozen Cabin", description: "A small wooden cabin used by explorers or researchers contains maps, logs, and messages."},
  {name: "Abandoned Sled Depot", description: "A site with sleds and supplies left behind provides insight into previous journeys."},
  {name: "Wind-Swept Bluff", description: "A bluff overlooks the surrounding area, revealing paths, tracks, and notable landmarks."},
  {name: "Icy Shoreline", description: "A stretch of coast where ice meets the water shows signs of travel, fishing, or stranded items."},
  {name: "Fisherman’s Hut", description: "A small hut near the shore offers tools, fish stocks, and advice from locals or past visitors."},
  {name: "Snowy Animal Tracks", description: "Tracks of foxes, bears, or reindeer provide hints about local activity and travel routes."},
  {name: "Glacial Crevasse Observation", description: "Careful observation of a crevasse reveals subtle signs of movement or hidden passages."},
  {name: "Permafrost Burial Mound", description: "A small mound encased in permafrost marks a resting place, offering notes or items from the past."},
  {name: "Ice-Covered Watchtower", description: "A ruined wooden tower holds maps, logs, or messages left by previous observers."},
  {name: "Frozen Fjord Shelter", description: "A natural rock overhang or small hut along a fjord provides shelter and local information."},
  {name: "Snow-Covered Cairn", description: "A cairn marks a waypoint or trail junction, sometimes with messages or small objects."},
  {name: "Driftwood Cache", description: "Pieces of driftwood or washed-up debris indicate travel patterns and hold minor clues."},
  {name: "Frozen Lake Shore", description: "The edge of a frozen lake shows tracks, tools, or evidence of recent activity."},
  {name: "Harbor Ice Shed", description: "A small shed along a frozen harbor contains notes, fishing equipment, or trade logs."},
  {name: "Observation Ice Mound", description: "A mound of snow and ice provides a concealed spot to study wildlife or distant travelers."},
  {name: "Frozen Cliff Ledge", description: "A ledge along a cliff gives a view of the surrounding terrain and marks left by explorers."},
  {name: "Snow Drift Cave", description: "A shallow cave hidden by snow offers shelter and can contain items or notes from prior visitors."},
  {name: "Abandoned Ice Hut", description: "A small hut built for temporary shelter holds tools, maps, and journals."},
  {name: "Wind-Swept Icefield", description: "Patterns in the snow reveal tracks, drift marks, and hints about movement through the area."},
  {name: "Glacial Rock Outcrop", description: "An exposed rock formation offers shelter and a place to leave messages or observe activity."},
  {name: "Seal Tracks Crossing", description: "Tracks across the ice indicate recent wildlife movement and areas of interest."},
  {name: "Frozen Lagoon", description: "A small lagoon provides water, a resting spot, and clues about local fauna and human activity."},
  {name: "Ice-Covered Watch Path", description: "A narrow path along the ice shows signs of use by explorers, rangers, or travelers."}
        ],
        Astral: [
  {name: "Celestial Nexus", description: "A shimmering convergence of astral currents, offering glimpses of distant planes and cosmic patterns."},
  {name: "Floating Spire", description: "A narrow, suspended spire drifts in the void, inscribed with shifting glyphs that hint at hidden truths."},
  {name: "Starfall Pool", description: "A pool of liquid starlight reflects visions of other worlds and echoes of past travelers."},
  {name: "Phantom Observatory", description: "An ethereal platform where ghostly instruments track the motions of celestial bodies and planar shifts."},
  {name: "Luminescent Passage", description: "A corridor of glowing energy pulses rhythmically, revealing clues to those who can interpret its light."},
  {name: "Void Garden", description: "Floating flora of impossible geometry sway in silent harmony, whispering fragments of forgotten lore."},
  {name: "Shifting Archway", description: "A doorway that seems to bend space and time, allowing insight into distant places when observed carefully."},
  {name: "Echoing Constellation", description: "Stars align in patterns that hum with information for those attuned to their resonance."},
  {name: "Crystal Memory Spire", description: "A tower of translucent crystal records echoes of past events, visible to those who study it closely."},
  {name: "Astral Current", description: "A river of flowing light carries whispers of knowledge and visions of far-off realms."},
  {name: "Floating Ruins", description: "Pieces of an ancient, drifting city hold carvings, murals, and hidden messages of arcane significance."},
  {name: "Phantom Gate", description: "A translucent portal flickers between states, hinting at pathways to other realms and secret knowledge."},
  {name: "Ethereal Bridge", description: "A bridge made of light and shadow links floating platforms, revealing hints about the structure of the astral plane."},
  {name: "Celestial Library", description: "A hall of floating books and scrolls drifts weightlessly, offering fragments of cosmic wisdom."},
  {name: "Starlit Spiral", description: "A spiral of light rises into nothingness, its twisting steps encoding messages for the observant."},
  {name: "Mirror of Planes", description: "A reflective surface shows distant worlds, memories, or echoes, each containing fragments of knowledge."},
  {name: "Void Lanterns", description: "Small orbs of suspended energy drift past, revealing brief visions or signs to those who watch closely."},
  {name: "Drifting Monolith", description: "A massive stone floats unmoored, etched with shifting runes that convey cryptic truths."},
  {name: "Astral Fountain", description: "A fountain of liquid light arcs in impossible patterns, imparting insight through observation."},
  {name: "Nebula Alcove", description: "A corner of swirling cosmic gas conceals whispers of secrets and hints at distant phenomena."},
  {name: "Phantom Choir", description: "Ethereal voices echo in harmony, revealing tidbits of cosmic knowledge to those who listen."},
  {name: "Gravity Rift", description: "A tear in space bends perception and allows glimpses of distant knowledge or hidden paths."},
  {name: "Temporal Shard", description: "A floating crystal pulses with moments from past and future events, conveying subtle clues."},
  {name: "Astral Lantern Cluster", description: "A group of luminous orbs hovers in formation, each conveying abstract signs or messages."},
  {name: "Shimmering Platform", description: "A platform of pure light reveals fleeting patterns and visions when traversed."},
  {name: "Ethereal Archive", description: "Floating scrolls and fragments of knowledge drift endlessly, providing abstract clues to those who follow them."},
  {name: "Void Garden Path", description: "A twisting path among drifting flora and starlight offers cryptic guidance to the observer."},
  {name: "Phasing Pillar", description: "A pillar alternates between visibility and transparency, encoding shifting knowledge in its form."},
  {name: "Luminous Spiral Stair", description: "Steps made of energy rise and fall unpredictably, each step revealing a fragment of insight."},
  {name: "Celestial Beacon", description: "A bright point of light marks a location of significance, hinting at hidden truths and cosmic alignments."},
  {name: "Drifting Sigil", description: "A glowing sigil floats in space, its shifting form encoding information about unseen events."},
  {name: "Eclipse Mirror", description: "A disc of shadow and light reflects visions from across the astral plane, offering abstract guidance."},
  {name: "Starlight Canopy", description: "A layer of suspended stars arcs overhead, each twinkle providing subtle insight to the patient observer."}
        ],
        Swamp: [
  {name: "Ranger Watch Post", description: "A small wooden platform or hut allows rangers to monitor movement and gather information about the area."},
  {name: "Fisherman's Dock", description: "A simple dock used by locals or travelers to fish, trade, and share rumors about the swamp."},
  {name: "Hidden Boardwalk", description: "A narrow, raised walkway through the swamp shows signs of travel and occasional left-behind notes."},
  {name: "Abandoned Hut", description: "A neglected shelter contains tools, maps, or journals left by previous visitors or swamp dwellers."},
  {name: "Clearing with Campsite", description: "A natural clearing serves as a resting spot for rangers, hunters, or travelers."},
  {name: "Skeletal Tree", description: "A tall, leafless tree marks a location often used to leave signs or messages."},
  {name: "Mud-Covered Trail", description: "A well-trodden path through thick mud shows footprints and signs of recent activity."},
  {name: "Swamp Ferry Crossing", description: "A small boat or raft crossing point is used by locals and leaves subtle clues of passage."},
  {name: "Fisherman's Cabin", description: "A modest cabin along a waterway contains nets, logs, and tips about the surrounding swamp."},
  {name: "Beaver Dam Observation", description: "A dam built by beavers provides insight into water flow, wildlife patterns, and navigable paths."},
  {name: "Hidden Trading Hut", description: "A small shack where locals or traveling merchants exchange goods and information."},
  {name: "Overgrown Pier", description: "A decaying wooden pier shows tracks and discarded objects from previous visitors."},
  {name: "Swamp Clearing with Fire Pit", description: "A resting spot where travelers or rangers leave messages, maps, or small items."},
  {name: "Treehouse Lookout", description: "A modest treehouse serves as an observation post and may contain notes from rangers or hunters."},
  {name: "Wildlife Tracks", description: "Footprints of swamp animals provide information about local patterns and areas to approach carefully."},
  {name: "Reed-lined Channel", description: "A narrow waterway hidden among reeds reveals traces of travel and possible secret passages."},
  {name: "Abandoned Fishing Platform", description: "A wooden platform once used for fishing contains nets, tools, and minor clues."},
  {name: "Hidden Campsite", description: "A discreet campsite used by locals or travelers contains maps, journals, or supplies."},
  {name: "Log Bridge", description: "A fallen log forming a bridge across shallow water shows signs of repeated use."},
  {name: "Mudflat Observation Point", description: "A raised area overlooking the swamp allows study of wildlife and travel routes."},
  {name: "Swamp Tavern", description: "A small, rustic tavern along a path provides social interaction and rumors from locals or travelers."},
  {name: "Abandoned Hunting Stand", description: "A raised platform used by hunters contains notes and observations about the swamp."},
  {name: "Hidden Wildlife Den", description: "A den or burrow provides clues about animal behavior and nearby paths."},
  {name: "Flooded Hollow", description: "A water-filled depression hides tracks, objects, and hints about recent activity."},
  {name: "Stone Marker", description: "A moss-covered stone marks a trail, landmark, or hidden cache used by locals."},
  {name: "Floating Vegetation Patch", description: "A mat of vegetation provides a crossing point and shows signs of recent use."},
  {name: "Observation Tree", description: "A tall tree used as a lookout provides visibility over the surrounding swamp."},
  {name: "Hidden Creek Bend", description: "A curve in a creek hides signs, items, or notes left by previous travelers."},
  {name: "Swamp Cabin Ruins", description: "Ruins of a small cabin provide materials, maps, or messages for those exploring the area."},
  {name: "Raised Walkway Crossing", description: "A simple walkway over deep mud or water allows safe passage and may show marks of prior use."},
  {name: "Marshland Ridge", description: "A small elevated area provides a vantage point and evidence of animal or human movement."},
  {name: "Fallen Tree Shelter", description: "A large fallen tree offers a dry resting spot and may contain left-behind items or clues."}
        ],
        Mountain: [
  {name: "Cliffside Lookout", description: "A natural ledge or simple platform provides a vantage point for observing valleys and trails below."},
  {name: "Shepherd's Hut", description: "A small hut used by shepherds or climbers contains maps, notes, and local advice."},
  {name: "Mountain Pass", description: "A narrow trail through rocky terrain shows signs of frequent travel and animal tracks."},
  {name: "Abandoned Mining Cabin", description: "A small, deserted cabin holds tools, journals, and messages from previous miners."},
  {name: "High Ridge", description: "A ridge offers a sweeping view of the surrounding peaks, trails, and possible hazards."},
  {name: "Rock Shelter", description: "A natural overhang provides temporary protection and a place for leaving notes or small items."},
  {name: "Trail Marker Cairn", description: "A pile of stones marks a trail junction, often with small notes or signs left by travelers."},
  {name: "Mountain Tavern", description: "A rustic inn along a pass offers social interaction, local information, and rumors from travelers."},
  {name: "Alpine Meadow", description: "A flat area among the peaks serves as a campsite or resting spot and may contain signs of passage."},
  {name: "Abandoned Lookout Tower", description: "A small, ruined tower provides a vantage point and may contain maps or logs."},
  {name: "Shepherd’s Pen", description: "A fenced area used for livestock contains signs, notes, or traces of recent activity."},
  {name: "Snowfield Crossing", description: "A stretch of snow reveals footprints, tracks, and evidence of recent travel."},
  {name: "Mountain Stream", description: "A clear stream provides water and shows signs of wildlife or human passage."},
  {name: "Climber’s Rope Station", description: "Fixed ropes or pitons mark climbing routes and can indicate frequently used paths."},
  {name: "Rockslide Debris", description: "An area affected by a rockslide hides tracks, objects, or clues about recent events."},
  {name: "Hermit’s Hut", description: "A small, isolated hut offers guidance, maps, or local knowledge from a solitary resident."},
  {name: "Eagle Nest Cliffs", description: "Nests perched on cliffs provide indirect clues about safe paths and the surrounding wildlife."},
  {name: "Forest Edge Trail", description: "A trail where trees meet rocky terrain contains subtle signs of travel and activity."},
  {name: "Abandoned Shepherd's Shelter", description: "A small shelter offers protection and may hold journals, maps, or minor supplies."},
  {name: "Mountain Cave", description: "A shallow cave provides refuge and may contain traces of previous explorers or wildlife."},
  {name: "Stone Bridge Crossing", description: "A natural stone formation serves as a crossing over a ravine or stream, showing signs of use."},
  {name: "Frozen Waterfall Base", description: "The base of a frozen waterfall provides water, shelter, and evidence of recent passage."},
  {name: "Trail Junction", description: "A key intersection of paths marked by stones or notches indicates common travel routes."},
  {name: "Windy Peak", description: "A high peak exposes wind patterns, tracks, and distant signs of settlements or travelers."},
  {name: "Rocky Outcrop", description: "An isolated outcrop provides a vantage point for observation and spotting hidden paths."},
  {name: "Abandoned Supply Cache", description: "A hidden cache contains provisions, tools, or notes left by explorers or locals."},
  {name: "Moss-Covered Boulder", description: "A prominent boulder serves as a landmark and may hold messages or carvings from previous travelers."},
  {name: "Mountain Goat Path", description: "Trails used by wildlife indicate safe routes and areas of interest for those navigating the terrain."},
  {name: "Snow-Covered Cabin", description: "A small cabin in a high-altitude area provides shelter, logs, and local insights."},
  {name: "Cliffside Ledge", description: "A narrow ledge along a cliff offers a hidden observation point or resting spot."},
  {name: "Alpine Hut", description: "A modest hut used by travelers or guides contains maps, notes, and advice about nearby routes."},
  {name: "Rocky Gorge", description: "A narrow gorge between cliffs reveals traces of human and animal movement."},
  {name: "Hidden Mountain Spring", description: "A freshwater spring in a secluded spot provides water and occasional notes or markings from visitors."}
        ],
        Plains: [
  {name: "Ranger Outpost", description: "A small wooden outpost used by rangers to observe wildlife and travelers across the open plains."},
  {name: "Abandoned Farmstead", description: "An old farmhouse and barns provide maps, notes, and clues about past activity."},
  {name: "Traveler’s Tent", description: "A simple tent set up by nomads or traders offers information about routes and local happenings."},
  {name: "Herding Encampment", description: "A temporary camp for herders and livestock, with traces of activity and messages left behind."},
  {name: "Windmill Observation Post", description: "A small windmill on a rise provides a vantage point to spot paths, tracks, or settlements."},
  {name: "Stone Marker", description: "A carved stone marks a trail junction or grazing area and may hold inscriptions or notes."},
  {name: "Abandoned Trading Post", description: "A small trading hut or shack used in the past contains tools, logs, and maps."},
  {name: "Natural Watch Ridge", description: "A gentle rise in the plains allows for observation of the surrounding area and passing travelers."},
  {name: "Small Tavern", description: "A modest tavern along a trade route offers social interaction, rumors, and guidance from locals."},
  {name: "Grassland Stream", description: "A shallow stream provides water and traces of wildlife or travelers who passed recently."},
  {name: "Nomad Campfire", description: "A campsite used by traveling nomads contains notes, supplies, and clues about regional activity."},
  {name: "Abandoned Wagon", description: "A stranded wagon holds maps, supplies, or messages left by traders or travelers."},
  {name: "Cattle Corral", description: "An enclosure for livestock shows signs of recent use and possible messages or notes."},
  {name: "Buried Cache", description: "A shallow cache hidden in the grass contains provisions or minor tools left by others."},
  {name: "Observation Hill", description: "A low hill offers visibility over the plains and may reveal tracks, smoke signals, or routes."},
  {name: "Hut Among Trees", description: "A small hut at the edge of a grove or copse provides shelter and information from locals."},
  {name: "Dry Riverbed Crossing", description: "A riverbed with little water shows footprints, vehicle tracks, and traces of recent passage."},
  {name: "Abandoned Barn", description: "A small barn contains old tools, maps, or journals providing clues about the area."},
  {name: "Marker Cairn", description: "A small pile of stones marks a trail, grazing area, or waypoint used by travelers."},
  {name: "Grain Storage Hut", description: "A simple storage hut holds supplies and occasionally notes from those who maintained it."},
  {name: "Watchtower Ruins", description: "The remains of a small wooden watchtower provide a vantage point and old logs or notes."},
  {name: "Wildlife Tracks", description: "Patterns of animal movement reveal routes, grazing areas, or nearby activity."},
  {name: "Windy Knoll", description: "A raised spot provides a view over the plains and marks where travelers or herders often pass."},
  {name: "Stone Fence Crossing", description: "A low stone fence marks property boundaries and may contain messages or signs."},
  {name: "Abandoned Shepherd’s Hut", description: "A small hut used by shepherds offers notes, maps, and guidance about nearby pastures."},
  {name: "Trading Wagon", description: "A wagon along a route provides supplies and social interaction with merchants or locals."},
  {name: "Hidden Grassland Path", description: "A barely noticeable trail through the tall grass shows footprints and travel patterns."},
  {name: "Seasonal Camp", description: "A temporary camp set up during migrations or harvests contains signs and minor clues."},
  {name: "Lone Oak Shelter", description: "A solitary tree offers shade and a resting spot, sometimes with notes or objects left by travelers."},
  {name: "Abandoned Observation Post", description: "A small post used historically to watch over the plains holds old logs or maps."},
  {name: "Cattle Track Crossing", description: "Well-worn paths used by livestock provide traces of movement and occasional hidden items."},
  {name: "Grassland Pond", description: "A small water body provides hydration for wildlife and travelers, along with potential signs of activity."},
  {name: "Low Stone Shelter", description: "A simple rock structure provides cover and may contain supplies or messages left by locals."}
        ],
        Subterranean: [
  {name: "Miners' Hut", description: "A small hut used by miners contains tools, maps, and notes about tunnel networks and hazards."},
  {name: "Collapsed Tunnel", description: "A section of fallen rock shows signs of previous excavation and possible hidden passages."},
  {name: "Natural Cavern", description: "A spacious cavern offers shelter and may contain evidence of wildlife or prior explorers."},
  {name: "Underground Stream", description: "A flowing stream through the tunnels provides water and leaves clues about the cave system."},
  {name: "Abandoned Storage Room", description: "A small room once used to store supplies contains logs, notes, or remnants of activity."},
  {name: "Tunnel Junction", description: "An intersection of passages shows traces of travel and directions to other areas."},
  {name: "Stalactite-Lined Passage", description: "A decorated passage offers natural landmarks that can help map or navigate the tunnels."},
  {name: "Rope-Ladder Shaft", description: "A vertical shaft with a rope or ladder marks an access point and shows signs of previous use."},
  {name: "Smuggler's Cache", description: "A hidden alcove contains supplies, maps, or minor notes left by travelers or traders."},
  {name: "Observation Alcove", description: "A small nook provides a concealed place to watch other passages or traffic in the tunnels."},
  {name: "Lamp-Hung Gallery", description: "A long hall with old lamp hooks may contain messages or logs left by previous explorers."},
  {name: "Abandoned Camp", description: "A campsite used by spelunkers or miners offers temporary shelter and written clues."},
  {name: "Underground Pool", description: "A quiet pool reflects the surrounding tunnels and may contain small objects or signs of activity."},
  {name: "Rocky Overhang", description: "A natural overhang provides cover and a place to leave notes or minor supplies."},
  {name: "Stalagmite Marker", description: "A distinctive stalagmite acts as a waypoint or marker within the tunnel system."},
  {name: "Subterranean Bridge", description: "A simple wooden or stone bridge crosses an underground ravine and shows evidence of frequent use."},
  {name: "Fisher's Cave", description: "A small cavern used to trap fish or collect water provides practical insights and signs of occupation."},
  {name: "Miner's Observation Post", description: "A raised area allows monitoring of nearby tunnels and passages, often with notes or logs."},
  {name: "Hidden Shaft", description: "A narrow vertical shaft leads to another level or chamber, often showing signs of careful use."},
  {name: "Old Tool Cache", description: "A storage nook with abandoned tools provides insight into past mining or exploration activity."},
  {name: "Cave Mouth Camp", description: "A small camp near the cave entrance is used for shelter and information gathering."},
  {name: "Fungal Growth Area", description: "A patch of edible or observed fungi provides clues about moisture, light, and foot traffic."},
  {name: "Underground Waterfall", description: "A waterfall within the cave system serves as a landmark and source of information about passages."},
  {name: "Collapsed Bridge", description: "A ruined bridge marks previous travel routes and indicates hazards or human activity."},
  {name: "Hidden Alcove Hut", description: "A tiny hut tucked into a cavern provides shelter and minor notes or maps."},
  {name: "Deep Tunnel Stretch", description: "A long tunnel offers observation points, tracks, and signs of recent passage."},
  {name: "Rockfall Zone", description: "An area prone to rockfall holds clues about previous travelers’ routes and hazards."},
  {name: "Underground Outcrop", description: "A protruding rock formation provides a natural vantage point within the tunnel system."},
  {name: "Subterranean Ladder Access", description: "A ladder leads to a higher level or shaft, with notes or tools left by explorers."},
  {name: "Hidden Water Channel", description: "A narrow channel of water provides navigation clues and signs of life."},
  {name: "Abandoned Quarry Room", description: "A former quarry chamber holds traces of past extraction and practical information."},
  {name: "Cavern Ridge", description: "A raised ridge in a cavern offers observation points and can contain footprints or small markers."},
  {name: "Tight Passage", description: "A narrow tunnel shows wear from travel and may contain notes or discarded items."}
        ],
        Urban: [
  {name: "Rooftop Lookout", description: "A small perch atop a building provides a vantage point over streets, plazas, and alleys."},
  {name: "Abandoned Tenement", description: "An old, empty building holds scraps of paper, notes, and clues about past residents."},
  {name: "Market Stall", description: "A busy stall offers social interaction and rumors from merchants and passersby."},
  {name: "Alleyway Observation", description: "A narrow alley provides a concealed spot to watch movement and traffic."},
  {name: "Tavern Corner Table", description: "A quiet corner in a local tavern is ideal for overhearing gossip and gathering information."},
  {name: "Watchtower Platform", description: "A small platform on a watchtower gives a clear view of streets, courtyards, and activity."},
  {name: "Street Vendor", description: "A vendor provides local gossip, maps, or tips for navigating the city."},
  {name: "Abandoned Workshop", description: "An old workshop contains tools, notes, or minor items left by previous occupants."},
  {name: "Hidden Courtyard", description: "A secluded courtyard offers privacy for discreet observation and collecting rumors."},
  {name: "Messenger Post", description: "A place where messengers gather provides insight into recent events and local news."},
  {name: "City Guard Barracks", description: "The local guard’s barracks offer clues about patrol schedules and city security."},
  {name: "Library Annex", description: "A small library or archive contains records, maps, and historical notes."},
  {name: "Rooftop Garden", description: "A private or public garden provides a vantage point and potential contacts with locals."},
  {name: "Fountain Square", description: "A busy square with a fountain allows discreet observation and social interaction."},
  {name: "Dockside Warehouse", description: "A warehouse near the docks contains shipment records and signs of recent activity."},
  {name: "Street-side Inn", description: "A modest inn offers social contact, rumors, and occasional written notices."},
  {name: "Abandoned Stable", description: "A small stable contains tools, tack, and traces of recent human or animal activity."},
  {name: "Hidden Alley Loft", description: "A loft accessible via a hidden alley provides a good observation point over nearby streets."},
  {name: "Backyard Garden", description: "A small garden behind a building may hide notes, maps, or signs of neighbors’ activity."},
  {name: "Bridge Overlook", description: "A bridge provides a clear line of sight over canals, streets, or courtyards."},
  {name: "Shopkeeper’s Backroom", description: "A backroom in a shop may hold ledgers, notes, and local insights."},
  {name: "Rooftop Chimney Nook", description: "A small nook near a chimney offers concealment and a good vantage point."},
  {name: "Abandoned Tavern Cellar", description: "A cellar holds old storage, notes, and remnants of past gatherings."},
  {name: "Messenger’s Alley", description: "A passage where messengers meet provides information about recent deliveries or events."},
  {name: "City Wall Rampart", description: "A section of the city wall allows observation of both internal streets and external approaches."},
  {name: "Hidden Courtyard Well", description: "A well in a secluded courtyard offers water and may hide messages or clues."},
  {name: "Merchant’s Loft", description: "A loft above a shop offers both storage and valuable insight into trade routes and activity."},
  {name: "Public Square Fountain", description: "A fountain in a crowded square allows observation while blending into daily life."},
  {name: "Abandoned Tenement Rooftop", description: "A rooftop provides a quiet vantage point with traces of previous activity."},
  {name: "Narrow Bridge Alley", description: "A small alley leading to a bridge shows traffic patterns and occasional messages."},
  {name: "Dockside Shack", description: "A tiny shack along the docks contains tools, notes, and information about incoming shipments."},
  {name: "Quiet Courtyard Bench", description: "A bench in a quiet courtyard provides a spot to observe passersby and gather gossip."},
  {name: "Warehouse Rooftop", description: "The roof of a warehouse allows a broad view of the surrounding streets and docks."}
]

    })

    const preparationActivities = $state([
  {name: "Bribe Contact", description: "You offer a bribe to your contact to help the heist in some way."},
  {name: "Forge Documents", description: "You prepare forgeries that might serve as convincing props."},
  {name: "Gain Contact", description: "You try to make contact with an individual who can aid you in the infiltration."},
  {name: "Gossip", description: "You seek out rumors about the infiltration’s target."},
  {name: "Scout Location", description: "You spend time observing the place or group you wish to infiltrate."},
  {name: "Secure Disguises", description: "You seek to procure or create disguises."},
  {name: "Acquire Maps", description: "You obtain layout diagrams, sketches, or rough terrain maps of the target area."},
  {name: "Case Security", description: "You assess guards, patrols, locks, alarms, and magical wards in advance."},
  {name: "Plant Evidence", description: "You secretly place misleading items that will help later misdirection."},
  {name: "Practice Route", description: "You rehearse the chosen infiltration path to reduce surprises."},
  {name: "Shadow Target", description: "You follow a key individual to learn their patterns and vulnerabilities."},
  {name: "Lift Keys", description: "You attempt to steal or duplicate access keys, badges, or sigils."},
  {name: "Acquire Escort", description: "You recruit someone who can plausibly accompany you inside."},
  {name: "Spread Misinformation", description: "You deliberately seed false rumors that distract or mislead defenders."},
  {name: "Study Schedules", description: "You learn the daily rhythms, work shifts, and meal times of the target."},
  {name: "Consult Expert", description: "You seek advice from someone knowledgeable about the target's defenses or culture."},
  {name: "Prepare Alibis", description: "You create explanations or false identities to avoid suspicion if questioned."},
  {name: "Test Defenses", description: "You perform a small, harmless probe to gauge security response times."},
  {name: "Gather Tools", description: "You collect necessary equipment like lockpicks, climbing gear, or magical items."},
  {name: "Train Team", description: "You drill your allies on signals, fallback plans, and coordinated actions."},
  {name: "Mark Safe Houses", description: "You establish temporary hideouts or fallback points near the target."},
  {name: "Analyze Weaknesses", description: "You identify structural, magical, or behavioral vulnerabilities to exploit."},
  {name: "Charm Informant", description: "You persuade, flatter, or befriend someone willing to share useful secrets."},
  {name: "Acquire Distractions", description: "You prepare smoke bombs, illusions, noise-makers, or accomplices to divert attention."},
  {name: "Track Deliveries", description: "You monitor supply caravans or shipments that provide access opportunities."},
  {name: "Observe Weather", description: "You check for fog, storms, or conditions that may favor stealth."},
  {name: "Copy Seals", description: "You duplicate official seals, stamps, or magical signatures necessary for passage."},
  {name: "Secure Exit Plan", description: "You establish escape routes and emergency signals for retreat."},
  {name: "Stash Supplies", description: "You hide useful items near the target for later retrieval during the mission."}
])

    const generalPositiveTraits = $state([
        "Shortcut : Success reveals an easier path (next roll DC -2)",
        "Opened : One additionnal path ahead",
        "Boosted Momentum : On Success, +1 step progress",
        "Prepared : Crit success grants a Hero Point",
        "Coordinated : Crit success lets a second character attempt this node for free this turn (no action cost)",
        "Additionnal time : Players must succeed in 1 round to trigger an additional Avantage on next Obstacle",
        "Healing : All characters gets healing",
        "Advantageous : Crit success grants additionnal Avantage"
    ])
    const generalNegativeTraits = $state([
        "Setback : Failure reveals the path is harder than anticipated (next roll DC +2)",
        "Closed : One less path ahead",
        "Trapped : Traps trigger random basic save for all players",
        "Unstable : On Failure, -1 step progress",
        "Unprepared : Crit Failure removes a Hero Point",
        "Uncoordinated : Crit Failure lets a second character NOT attempt this node this turn (one action cost)",
        "Time sensitive : Players must succeed in 1 round or trigger an additionnal Complication on next Obstacle",
        "Dangerous : Crit Failure grants additionnal Complication"
    ])
    const specificPositiveTraits = $state([
        "Well-lighted : +1 Perception",
        "Well grounded : +1 Athletics",
        "Shadowed : +1 Stealth",
        "Soft Footing : +1 Acrobatics",
        "Open Terrain : +1 Survival",
        "Friendly Crowd : +1 Diplomacy",
        "Loose Obstacles : +1 Thievery",
        "Arcane Flow : +1 Arcana",
        "Sacred Aura : +1 Religion",
        "Historical Markings : +1 Society",
        "Natural Scent Trail : +1 Survival",
        "Predictable Wildlife : +1 Nature",
        "Ready Tools : +1 Crafting",
        "Exposed Mechanism : +1 Thievery",
        "Trusting Atmosphere : +1 Deception",
        "Echoing Threats : +1 Intimidation",
        "Clean Environment : +1 Medicine",
        "Resonant Leylines : +1 Occultism",
        "Captive Audience : +1 Performance",
        "Smooth Path : +1 Acrobatics",
        "Firm Ground : +1 Athletics",
        "Quiet Shadows : +1 Stealth",
        "Clear View : +1 Perception",
        "Gathered Crowd : +1 Diplomacy",
        "Orderly Desk : +1 Crafting",
        "Stable Mechanism : +1 Thievery",
        "Magical Resonance : +1 Arcana",
        "Holy Sanctum : +1 Religion",
        "Well-Preserved Documents : +1 Society",
        "Animal Tracks : +1 Nature",
        "Clean Lab : +1 Medicine",
        "Focused Audience : +1 Performance",
        "Cooperative Allies : +1 Deception",
        "Strong Presence : +1 Intimidation",
        "Hidden Path : +1 Survival",
        "Prepared Station : +1 Crafting",
        "Guiding Lights : +1 Perception",
        "Balanced Terrain : +1 Athletics",
        "Whispering Shadows : +1 Stealth",
        "Subtle Magic : +1 Occultism",
        "Blindingly Well-Lighted : +2 Perception",
        "Rock-Solid Ground : +2 Athletics",
        "Perfect Shadows : +2 Stealth",
        "Supreme Footing : +2 Acrobatics",
        "Clear Open Terrain : +2 Survival",
        "Charismatic Crowd : +2 Diplomacy",
        "Masterfully Loose Obstacles : +2 Thievery",
        "Intense Arcane Flow : +2 Arcana",
        "Holy Presence : +2 Religion",
        "Pristine Historical Markings : +2 Society",
        "Exemplary Animal Tracks : +2 Nature",
        "Expertly Ready Tools : +2 Crafting",
        "Precision Mechanism : +2 Thievery",
        "Fully Trusting Atmosphere : +2 Deception",
        "Dominating Presence : +2 Intimidation",
        "Immaculate Lab : +2 Medicine",
        "Potent Leylines : +2 Occultism",
        "Captivating Audience : +2 Performance"
    ])
    const specificNegativeTraits = $state([
        "Dimly Lit : -1 Perception",
        "Unstable Ground : -1 Athletics",
        "Overexposed : -1 Stealth",
        "Rough Footing : -1 Acrobatics",
        "Obstructed Terrain : -1 Survival",
        "Hostile Crowd : -1 Diplomacy",
        "Jammed Mechanisms : -1 Thievery",
        "Arcane Interference : -1 Arcana",
        "Profane Aura : -1 Religion",
        "Obscured Markings : -1 Society",
        "Muddled Scents : -1 Survival",
        "Skittish Wildlife : -1 Nature",
        "Broken Tools : -1 Crafting",
        "Concealed Mechanism : -1 Thievery",
        "Doubtful Atmosphere : -1 Deception",
        "Muffled Presence : -1 Intimidation",
        "Unsanitary Environment : -1 Medicine",
        "Chaotic Leylines : -1 Occultism",
        "Disinterested Audience : -1 Performance",
        "Slippery Surface : -1 Acrobatics",
        "Loose Stones : -1 Athletics",
        "Bright Glare : -1 Perception",
        "Crowded Market : -1 Diplomacy",
        "Entangled Vines : -1 Thievery",
        "Distorted Magic : -1 Arcana",
        "Desecrated Ground : -1 Religion",
        "Fragmented Documents : -1 Society",
        "Wild Animal Panic : -1 Nature",
        "Contaminated Area : -1 Medicine",
        "Disruptive Audience : -1 Performance",
        "Intimidating Opponent : -1 Intimidation",
        "Confusing Shadows : -1 Stealth",
        "Obstructed Path : -1 Survival",
        "Broken Equipment : -1 Crafting",
        "Unstable Mechanism : -1 Thievery",
        "Chaotic Energy : -1 Occultism",
        "Distrustful Atmosphere : -1 Deception",
        "Pitch Dark : -2 Perception",
        "Cracked Ground : -2 Athletics",
        "Exposed to All : -2 Stealth",
        "Treasonous Footing : -2 Acrobatics",
        "Impassable Terrain : -2 Survival",
        "Hostile Mob : -2 Diplomacy",
        "Broken Mechanisms : -2 Thievery",
        "Magical Chaos : -2 Arcana",
        "Desecrated Shrine : -2 Religion",
        "Illegible Documents : -2 Society",
        "Confusing Scents : -2 Survival",
        "Frenzied Wildlife : -2 Nature",
        "Destroyed Tools : -2 Crafting",
        "Hidden Traps : -2 Thievery",
        "Suspicious Atmosphere : -2 Deception",
        "Oppressive Presence : -2 Intimidation",
        "Contaminated Lab : -2 Medicine",
        "Wild Leylines : -2 Occultism",
        "Disruptive Audience : -2 Performance"
    ])

    function selectBiome(type) {
        if(type === "Chases") {
            selectedBiome = chasesBiomeData[selectedBiomeName] || []
        } else if(type === "Infiltration") {
            selectedBiome = infiltrationBiomeData[selectedBiomeName] || []
        } else if(type === "Research") {
            selectedBiome = researchBiomeData[selectedBiomeName] || []
        }
    }

    function generateDC() {
        if(partyLvl <=2) {
            currentDC = partyLvl + 15
        } else if(partyLvl >=3 && partyLvl <=6) {
            currentDC = partyLvl + 17
        } else if(partyLvl >=7 && partyLvl <=14) {
            currentDC = partyLvl + 19
        } else if(partyLvl >=15) {
            currentDC = partyLvl + 21
        }  
    }
    
    function generateSteps() {
        let modificator = 0
        if(currentThreat.threat === "Very easy") {
            modificator = 2
        } else if(currentThreat.threat === "Easy") {
            modificator = 1
        } else if(currentThreat.threat === "Hard") {
            modificator = -1
        } else if(currentThreat.threat === "Very hard") {
            modificator = -2
        }
        currentSteps = (partySize -1) + modificator
    }

    function generatePreparation() {

    }

    function generateObstacle(type) {
        if (!selectedBiome || selectedBiome.length === 0) {
        console.warn("Biome not selected or empty")
        return
    }
        if (partyLvl <0 || partyLvl > 30) {
        console.warn("Invalid party Level")
        return
    }
        if (partySize <0 || partySize > 10) {
        console.warn("Invalid party Size")
        return
    }
        generateDC()       
        currentGeneralTraits = []
        currentSpecificTraits = []
        if(type === "prep") {
            const randomIndex = Math.floor(Math.random() * preparationActivities.length)
            currentObstacle = preparationActivities[randomIndex]
        } else if(type === "research") {
            const randomIndex = Math.floor(Math.random() * selectedBiome.length)
            currentObstacle = selectedBiome[randomIndex]
        } else {
            const randomBiomeIndex = Math.floor(Math.random() * selectedBiome.length)
            currentObstacle = selectedBiome[randomBiomeIndex]
        }
        const randomThreatIndex = Math.floor(Math.random() * threat_lvl.length)
        currentThreat = threat_lvl[randomThreatIndex]
        console.log(currentThreat.threat)
        generateSteps()
        // Generate positive trait
        const randomGenPosTraitChance = Math.floor(Math.random() * 10 + 1)
        if (randomGenPosTraitChance >= 7 && randomGenPosTraitChance <= 9) {
            const randomGenPosTraitIndex = Math.floor(Math.random() * generalPositiveTraits.length)
            currentGeneralTraits.push(generalPositiveTraits[randomGenPosTraitIndex])
        } else if (randomGenPosTraitChance === 10) {
            const randomGenPosTraitIndex1 = Math.floor(Math.random() * generalPositiveTraits.length)
            const randomGenPosTraitIndex2 = Math.floor(Math.random() * generalPositiveTraits.length)
            currentGeneralTraits.push(generalPositiveTraits[randomGenPosTraitIndex1])
            currentGeneralTraits.push(generalPositiveTraits[randomGenPosTraitIndex2])
        }
        // Generate negative trait
        const randomGenNegativeTraitChance = Math.floor(Math.random() * 10 + 1)
        if (randomGenNegativeTraitChance >= 7 && randomGenNegativeTraitChance <= 9) {
            const randomGenNegativeTraitIndex = Math.floor(Math.random() * generalNegativeTraits.length)
            currentGeneralTraits.push(generalNegativeTraits[randomGenNegativeTraitIndex])
        } else if (randomGenNegativeTraitChance === 10) {
            const randomGenNegativeTraitIndex1 = Math.floor(Math.random() * generalNegativeTraits.length)
            const randomGenNegativeTraitIndex2 = Math.floor(Math.random() * generalNegativeTraits.length)
            currentGeneralTraits.push(generalPositiveTraits[randomGenNegativeTraitIndex1])
            currentGeneralTraits.push(generalPositiveTraits[randomGenNegativeTraitIndex2])
        }
        // Generate Positive Specific trait
        const randomSpecPosTraitChance = Math.floor(Math.random() * 10 + 1)
        if (randomSpecPosTraitChance >= 7 && randomSpecPosTraitChance <= 9) {
            const randomSpecPosTraitIndex = Math.floor(Math.random() * specificPositiveTraits.length)
            currentSpecificTraits.push(specificPositiveTraits[randomSpecPosTraitIndex])
        } else if (randomSpecPosTraitChance === 10) {
            const randomSpecPosTraitIndex1 = Math.floor(Math.random() * specificPositiveTraits.length)
            const randomSpecPosTraitIndex2 = Math.floor(Math.random() * specificPositiveTraits.length)
            currentSpecificTraits.push(specificPositiveTraits[randomSpecPosTraitIndex1])
            currentSpecificTraits.push(specificPositiveTraits[randomSpecPosTraitIndex2])
        }
        // Generate Negative Specific trait
        const randomSpecNegativeTraitChance = Math.floor(Math.random() * 10 + 1)
        if (randomSpecNegativeTraitChance >= 7 && randomSpecNegativeTraitChance <= 9) {
            const randomSpecNegativeTraitIndex = Math.floor(Math.random() * specificNegativeTraits.length)
            currentSpecificTraits.push(specificNegativeTraits[randomSpecNegativeTraitIndex])
        } else if (randomSpecNegativeTraitChance === 10) {
            const randomSpecNegativeTraitIndex1 = Math.floor(Math.random() * specificNegativeTraits.length)
            const randomSpecNegativeTraitIndex2 = Math.floor(Math.random() * specificNegativeTraits.length)
            currentSpecificTraits.push(specificNegativeTraits[randomSpecNegativeTraitIndex1])
            currentSpecificTraits.push(specificNegativeTraits[randomSpecNegativeTraitIndex2])
        }
    }

    async function copyObstacle() {
    if (!currentObstacle) return;

    const text = `
        ${currentObstacle.name}
        ${currentObstacle.description}

        Threat: ${currentThreat?.threat}
        Steps: ${currentSteps}

        General Traits:
        ${currentGeneralTraits.length ? currentGeneralTraits.map(t => `- ${t}`).join("\n") : "- None"}

        Specific Traits:
        ${currentSpecificTraits.length ? currentSpecificTraits.map(t => `- ${t}`).join("\n") : "- None"}
    `.trim();

    try {
        // Create temporary textarea
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Make it invisible but accessible
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        // Try to copy
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            console.log("Copied successfully");
        } else {
            throw new Error("Copy command failed");
        }
    } catch (err) {
        console.error("Failed to copy:", err);
        alert("Could not copy to clipboard. Please copy the text manually.");
    }
}

    function generateAvantage(mod) {
        // Generate positive trait
        let randomGenPosTraitChance = 0
        if(mod = "auto"){
            randomGenPosTraitChance = 9
        } else {
            randomGenPosTraitChance = Math.floor(Math.random() * 10 + 1)
        }
        if (randomGenPosTraitChance >= 7 && randomGenPosTraitChance <= 9) {
            const randomGenPosTraitIndex = Math.floor(Math.random() * generalPositiveTraits.length)
            currentGeneralTraits.push(generalPositiveTraits[randomGenPosTraitIndex])
        } else if (randomGenPosTraitChance === 10) {
            const randomGenPosTraitIndex1 = Math.floor(Math.random() * generalPositiveTraits.length)
            const randomGenPosTraitIndex2 = Math.floor(Math.random() * generalPositiveTraits.length)
            currentGeneralTraits.push(generalPositiveTraits[randomGenPosTraitIndex1])
            currentGeneralTraits.push(generalPositiveTraits[randomGenPosTraitIndex2])
        }
    }

    function generateComplication(mod) {
        // Generate negative trait
        let randomGenNegativeTraitChance = 0
        if(mod = "auto"){
            randomGenNegativeTraitChance = 9
        } else {
            randomGenNegativeTraitChance = Math.floor(Math.random() * 10 + 1)
        }
        if (randomGenNegativeTraitChance >= 7 && randomGenNegativeTraitChance <= 9) {
            const randomGenNegativeTraitIndex = Math.floor(Math.random() * generalNegativeTraits.length)
            currentGeneralTraits.push(generalNegativeTraits[randomGenNegativeTraitIndex])
        } else if (randomGenNegativeTraitChance === 10) {
            const randomGenNegativeTraitIndex1 = Math.floor(Math.random() * generalNegativeTraits.length)
            const randomGenNegativeTraitIndex2 = Math.floor(Math.random() * generalNegativeTraits.length)
            currentGeneralTraits.push(generalPositiveTraits[randomGenNegativeTraitIndex1])
            currentGeneralTraits.push(generalPositiveTraits[randomGenNegativeTraitIndex2])
        }
    }

    function selectSystem(type) {
        selectedSystem = type
        selectedBiomeName = null
        currentObstacle = null
        partyLvl = null
        partySize = null
    }

</script>

<main in:slide={{axis:"y", easing:sineOut}}>
    <div class="main-nav" >
        <button onclick={() => selectSystem("Chases")} class="{selectedSystem === "Chases" ? "button-dark" : "button"}">Chases</button>
        <button onclick={() => selectSystem("Infiltration")} class="{selectedSystem === "Infiltration" ? "button-dark" : "button"}">Infiltration</button>
        <button onclick={() => selectSystem("Research")} class="{selectedSystem === "Research" ? "button-dark" : "button"}">Research</button>
        <!-- <button onclick={() => selectSystem("Influence")} class="{selectedSystem === "Influence" ? "button-dark" : "button"}">Influence</button> -->
    </div>
    <!-- Chases UI -->
    {#if selectedSystem}
        <div class="chases-nav">
            <div class="selectors">
                <label for="selectBiome" class="text-white">Filter by Biome</label>
                <select name="selectBiome" id="selectBiome" bind:value={selectedBiomeName} onchange={() => selectBiome(selectedSystem)} class="text-white w-full sm:w-auto border-2 border-pf-yellow-light rounded">
                    <option value={null}>All</option>
                    {#each biomes as biome}
                        <option value={biome}>{biome}</option>
                    {/each}
                </select>
                <label for="partySize" class="text-white">Party Size</label>
                <input type="number" name="partySize" id="partySize" bind:value={partySize} class="text-white border-2 border-pf-yellow-light rounded w-12 pl-1">
                <label for="partyLvl" class="text-white">Party Level</label>
                <input type="number" name="partyLvl" id="partyLvl" bind:value={partyLvl} class="text-white border-2 border-pf-yellow-light rounded w-12 pl-1">
            </div>
            <!-- Chases options -->
            {#if selectedBiome && partyLvl && partySize && selectedSystem === "Chases"}    
                <button onclick={generateObstacle}>Generate Obstacle</button>
                <button onclick={() => generateAvantage("auto")}>Generate Avantage</button>
                <button onclick={() => generateComplication("auto")}>Generate Complication</button>          
            {/if}
            <!-- Infiltration options -->
            {#if selectedBiome && partyLvl && partySize && selectedSystem === "Infiltration"}
                <button onclick={() => generateObstacle("prep")}>Generate Preparation</button>
                <button onclick={generateObstacle}>Generate Obstacle</button>
                <button onclick={() => generateAvantage("auto")}>Generate Avantage</button>
                <button onclick={() => generateComplication("auto")}>Generate Complication</button>
            {/if}
            <!-- Research options -->
            {#if selectedBiome && partyLvl && partySize && selectedSystem === "Research"}    
                <button onclick={() => generateObstacle("research")}>Generate Obstacle</button>
                <button onclick={() => generateAvantage("auto")}>Generate Avantage</button>
                <button onclick={() => generateComplication("auto")}>Generate Complication</button>          
            {/if}
        </div>
        {#if currentObstacle}
            <div class="chases">
                <div class="chases-btn"><button onclick={copyObstacle}>Copy Obstacle</button></div>
                <h2>{currentObstacle.name}</h2>
                <h3>Description : {currentObstacle.description}</h3>
                <p><strong>DC : </strong> {currentDC + currentThreat.mod}</p>
                <div class="event-details-grid">
                    <div class="box">
                        <h3>Difficulty : </h3>
                        <p>{currentThreat.threat}</p>
                    </div>
                    <div class="box">
                        <h3>Steps : </h3>
                        <p>{currentSteps}</p>
                    </div>
                    <div class="box">
                        <h3>General Traits:</h3>
                        {#if currentGeneralTraits.length >= 1}
                            {#each currentGeneralTraits as trait}
                                <li>{trait}</li>
                            {/each}
                            
                        {/if} 
                    </div>
                    <div class="box">
                        <h3>Specific Traits:</h3>
                        {#if currentSpecificTraits.length >= 1}
                            {#each currentSpecificTraits as trait}
                                <li>{trait}</li>
                            {/each}
                            
                        {/if} 
                    </div>
                </div>  
            </div>
        {/if}
    {/if}
    
</main>

<style>
    .main-nav {
        padding: 32px 32px 16px;     
        display: flex;
        justify-content: start;
    }
    button {
        background-color: var(--primary-color);
        color: var(--bg-color);
        border: none;
        padding: 16px;
        margin: 16px;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease-out;
        font-weight: bold;
        border: 1px solid var(--primary-color);
    }
    .button-dark {
        background-color: var(--bg-color);
        color: var(--primary-color);
        border: none;
        padding: 16px;
        margin: 16px;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease-out;
        font-weight: bold;
        border: 1px solid var(--primary-color);
    }
    button:hover {
        background-color: var(--bg-color);
        color: var(--primary-color);
    }
    h2, p {
        color: var(--primary-color);
    }

    h2 {
    display: block;
    font-size: 2em;
    padding-bottom: 8px;
    border-bottom: solid 1px var(--primary-color);
    margin-block-end: 0.5em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
    }

    h3 {
    display: block;
    font-size: 1.25em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
    }

    .chases {
        display: flex;
        flex-direction: column;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;    
        background-color: var(--card-bg);
        border-radius: 8px;
        box-shadow: var(--shadow);
        padding: 1.5rem;
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        color: #efd293;
    }

    .chases-btn {
        display: flex;
        justify-content: flex-end;
    }

    .chases-btn button {
        margin: 0;
    }

    .chases p {
        margin-top: 0;
    }

    .chases h3:first-of-type {
        margin-bottom: 0;
    }

    .chases-nav {
        margin-left: 64px;
        margin-bottom: 32px;
    }

    .event-details-grid {
        display: grid;
        grid-template-columns: 0.5fr 0.5fr 1fr 1fr; /* Two equal columns */
        gap: 1.5rem;
        align-items: flex-start;
        margin-top: 1rem;
    }

    .box {
        background-color: #2a2e2f;
        padding: 1rem;
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    li {
        margin-left: 2rem;
    }

    .selectors {
        width: 600px;
        display: flex;
        justify-content: space-around;
        margin-bottom: 16px;
    }

    .event-details-grid h3 {
        margin: 0;
        margin-bottom: 0.25rem; /* optional: add controlled spacing */
    }
    
    .event-details-grid p {
        margin-left: 1rem;
    }
    

</style>