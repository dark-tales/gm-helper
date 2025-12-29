# GM_helper
A tool for pf2e gamemaster to generate story hooks/characters/items/buildings and manage traveling/settlements/subsystems
# Disclaimer 
This is my first attempt at building a web app. It was made for my personal campaigns, but I wanted to make it available to other GM. Although it is intended for Pathfinder 2e, it may work for other systems. However DC's,iItems and skill check might not be accurate. Also some AI was use to reformat/debug the code, restyle the UI to be responsive (I was lazy to do it myself) and generate the database entries. Otherwise the main idea and logic was made by me.     
# Features
Generate/modify/save the following 
-Plot hook with Potential Outcomes, Plot Twist and Potential Loot determined by biomes and types
-Characters with ancestries, background, personality traits and narrative arc
-Item description with location and quest status
-Building description with sensory info

Manage traveling with a timer and conversation starter
Generate and manage settlements with a strain subsystem
Most of the UI is responsive 
# Prerequisites
Node.js (v18 or higher)
Npm (v9 or higher)
MongoDB for included collections
# Installation 
Clone/download repo
Install dependencies with npm install
Install MongoDB and add collections from db_collections
If your don't use the app locally, Replace Environment Variables inside client/.env AND server/.env from localhost to your actual API server URL.
Update Campaign Name (Optional) Edit src/routes/+page.svelte and change this line to your campaign name : let campaign = "YOUR CAMPAIGN"
# Running the app in dev mode 
From /client : npm run dev
From /server : node server.js
# Running the app in production mode 
From /client : npm run build
Then serve build and mongo as a service (with pm2 for instance)
# Usage 
## Story Hooks
Click "Get one random hook" or filter by Type/Biome
Review the generated hook (type, biome, difficulty, description)
Add notes and track event status
Click "Save Hook" to add to history
Use "Save and Delete" to move from database to history
### Filters:
- Type: Physical, Discovery, Environmental, Investigation, Ambush, Magical, Social, Uncategorized
- Biome: Aquatic, Arctic, Astral, Desert, Forest, Swamp, Mountain, Plains, Subterranean, Urban, Uncategorized
## Characters
Filter by Ancestry Rarity and specific Ancestry
Generate random characters or create custom ones
Track physical/psychological traits, backgrounds, and secrets
Set NPC attitude (Hostile, Unfriendly, Indifferent, Friendly, Helpful)
Save to history with notes
### Ancestry Rarities:
Common: Dwarf, Elf, Gnome, Goblin, Halfling, Human
- Uncommon: Amurrun, Azarketi, Fetchling, Hobgoblin, Iruxi, Kholo, Kitsune, Kobold, Nagaji, Tengu, Tripkee, Vanara, Ysoki
- Rare: Anadi, Android, Automaton, Conrasu, Fleshwarp, Ghoran, Goloma, Kashrishi, Poppet, Shisk, Shoony, Skeleton, Sprite, Strix, Vishkanya
- Versatile: Aiuvarin, Beastkin, Changeling, Dhampir, Dromaar, Geniekin, Nephilim
## Buildings
Filter by building type (Social, Commercial, Religious, etc.)
Generate random building with full sensory details
Track if building has been found/visited
Review exterior, interior, materials, and atmospheric details
Save with custom notes
### Building Types: 
21 categories including Social, Residential, Commercial, Industrial, Religious, Magical, Military, Administrative, Utility, Criminal, Academic, Hospitality, Civic, Ruin, Containment, Medical, Agricultural, Transit, Obscure, Cultural, Resource
## Items
Filter by item type (28 categories available)
Generate or create custom items
Track location and hiding place
Mark search status and whether item is found
Review item history and tips for discovery
### Item Categories: 
Adventuring Gear, Alchemical Items, Armor, Artifacts, Consumables, Weapons, Worn Items, and 21 more categories
## Adding Custom Content
To add new hooks/characters/items/buildings:
Click "Add new [type] to database" button
Fill out comprehensive form
Submit to add to generation pool
Or add directly to history without database entry
## History Management
All generated components support history:
View History: Click "Show History" button
Search History: Sort by date (newest first)
Edit Entry: Click "Details" → "Edit"
Delete Entry: Click "Details" → "Delete"
Persistent Storage: All history saved to database via API
## Image example of Storyhook generation  
![Storyhook image](https://github.com/dark-tales/gm-helper/blob/main/img/storyhook.png)
## Travel
Select timer duration:
10 minutes (in game): Inventory review prompt
1 hour (in game): Merchant encounter prompt
8 hours (in game): Conversation starter for roleplay

Set encounter chances (None, Low, Medium, High):

Combat Encounters: Generates random monsters with difficulty
Non-Combat Encounters: Story hooks, NPCs, or buildings

Start timer and track party activities
Generate encounters manually or wait for timer completion
Timer includes +/- 1 minute adjustment buttons
## Settlement 
Select or generate region/settlement
Manage settlement attributes (Population, Stability, Resources, Reputation, Morale, Culture) from 0 to 20 and generate Strain if under/over 10 
Strain level should apply bonus/penalty to PC social interaction while in the settlement  
Generate events to modify settlement attributes
### Events Categories: 
- Events : events that automatically modify attributes
- Opportunity : event with a cost and skill check over time to gain attributes
- Dilemma : event with a moral choice that affect attributes (usually the morally acceptable choice give less attributes benefit)
- Rumor : simple rumor generator with type, location, contact, believability and twist. 
## Subsystem
Generate obstacle with difficulty, steps and traits for non combat encounter
### Subsystem Categories:
- Chases : Run from an enemy before they catch on and vice-versa 
- Infiltration : Run through obstacle without raising the alarm 
- Research : Obstacle to find information  
