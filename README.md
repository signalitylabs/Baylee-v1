    / $$$$$$$$                     /$$                    
    | $$__  $$                    | $$                    
    | $$  \ $$  /$$$$$$  /$$   /$$| $$  /$$$$$$   /$$$$$$ 
    | $$$$$$$  |____  $$| $$  | $$| $$ /$$__  $$ /$$__  $$
    | $$__  $$  /$$$$$$$| $$  | $$| $$| $$$$$$$$| $$$$$$$$
    | $$  \ $$ /$$__  $$| $$  | $$| $$| $$_____/| $$_____/
    | $$$$$$$/|  $$$$$$$|  $$$$$$$| $$|  $$$$$$$|  $$$$$$$
    |_______/  \_______/ \____  $$|__/ \_______/ \_______/
                            | $$$ |                       
                        | $$$$$$ /                        
                        \______/       

  [![Discord](https://img.shields.io/discord/753770820358373487.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/Rps2KTm)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=bayleebot_v1&metric=ncloc)](https://sonarcloud.io/dashboard?id=bayleebot_v1)

  ## About Baylee

  Baylee is based on a bot I originally created for my Minecraft server, [The Outpost](https://playoutpost.com). This version of Baylee is a bit different, but her essense is still in this project.

  Baylee has fun commands that can be used on any Discord server like a very rough madlib based language engine, pet commands, games, and ways to remix your friend's avatars.

  ## Copyright Notice

  Baylee is the copyright and intellectual property of Adam "Centers" Parker. Baylee's source code ("bot") is released under the [BSD 3-Clause License license](LICENSE). This means any redistribution of this bot, in part or in whole, must retain the copyright notice found in [the license](LICENSE). Projects based on this source code cannot use the copyrighted name of Baylee unless it is to give credit.
  
  ## Trigger Warning
  
  I am using arrays to remove common words and phrases that trolls use on Discord. Because of that, you will see some ugly words such as the n-word in this document. I do not condone using words like that, but it is needed to stop the bot from accidentially using them.

  ## Features

  - [Over 200 commands](/commands)
  - [Dynamic help menu](/commands/info/help.js) based on structure of the commands folder and config inside the child .js files.
  - [Command handler automatically loads all commands and checks for conflicts](/handlers/classes.js)
  - [Command search enginge](/commands/info/search.js)
  - Simple handlers for automatically loading [events](/handlers/events.js) and [listeners](/handlers/listeners.js)
  - [Asynchronous database integration](/classes/database.js)
  - [Reddit integration](/classes/fetch.js) with caching
  - [Bad word blocker](/listeners/badwords.js)
  - Semi-working [YouTube integration](/classes/music.js) with a [play command](/commands/music/play.js) (debug mode only)
  - [Dynamic image generation](/classes/memeify.js)
  - [Reaction roles](/listeners/autoroles.js) (disabled)
  - [Madlib based conversation engine](/lang/listeners/conversation.json)
  - [Starboard to pin the server's best messages](/listeners/starboard.js). This is disabled when DEV_MODE is on.
  - [Welcome image to greet every new member](/events/onjoin.js). This is disabled when DEV_MODE is on.

  ## Getting Started

  1. [Download, install, and setup Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  2. Sign up for a [Discord developer account](https://discord.com/developers/applications/) to [create a bot](https://discord.com/developers/docs/intro) and generate a bot token.
  3. [Create a Google developer account](https://console.developers.google.com/apis/credentials) and [generate an API key](https://developers.google.com/youtube/registering_an_application) for YouTube integration.
  4. [Create a database](https://dev.to/prisma/how-to-setup-a-free-postgresql-database-on-heroku-1dc1) and import the [database structure](structure.sql).
  5. Setup all of the environmental variables provided in the [next section](#environmental-variables).
  6. Invite the bot to your Discord server
  ```https://discord.com/oauth2/authorize?client_id={BOT-ID}&scope=bot&permissions={PERMISSIONS}&redirect_uri={REDIRECT}```
  7. Start the bot up and read her welcome message she sends on Discord.
  8. (Optional) [Host your bot on Heroku for free](https://shiffman.net/a2z/bot-heroku/).

  ## Environmental Variables

  * **DEV_MODE** ```true/false``` ```Default: false```
    - Tells the bot if it is in developer mode or not. This will enable an experimental YouTube command by default, but you can add more dev mode only commands.
  * **DEV_CHANNEL** ```channel ID```
    - Restrict bot commands to only 1 channel. This is for people running multiple versions of the bot on a single server.
  * **BOT_TOKEN** ```Discord token ID```
    - [discord.com/developers/applications/](https://discord.com/developers/applications/)
  * **DATABASE_URL** ```Fully qualified authenticated URL```
    - Adds all of the current commands into a database and handles Money commands.
  * **LOADER_DATABASE** ```allow/ignore``` ```Default: allow```
    - If commands should be inserted into the database as they are loaded.
  * **YOUTUBE_API** ```API key```
    - For the unfinished YouTube integration.
  * **GIPHY_API** ```API key```
    - Used to pull GIFs off of [GIPHY](https://developers.giphy.com/).

  ## Database

  Originally the bot connected to a front-end site that managed these settings. Since that code isn't included in this project, you will need to manually edit some of these tables. 
  
  ### Discord Settings
  
  ```Table: guild_settings```

  The bot will look for your Discord server's config in the database. If it can't find it, then the bot will automatically generate this for you  in [/classes/database.js](/classes/database.js).

  * Disable any command  ```Column: cmd_disabled```
  * Disable any command module ```Column: mods_enabled```
  * Bind commands to Nitro boosting ```Column: cmd_nitro```

  ### Inventory Items
  
  ```Table: items```

  These items can be bought or given to players. This feature wasn't really fleshed out so there's still a lot to do with it.

  Example of item:
  ```
  name: Legendary Croissant
  namespace: croissant
  emoji: <a:legendarycroissant:758539468499845181>
  image: https://i.imgur.com/bs8IU38.gif
  description: Gift for joining before November 5th 2020.
  forsale: 0
  type: Collectable
  ```

  ### Cooldowns
```Table: money_cooldowns```

  Any cooldowns longer than a couple of minutes are saved in this table. This way cooldowns can be preserved between bot sessions. If you want to remove your cooldown (for testing purposes), find your discord user id and delete the record.

  ### Misc

  ```Table: commands``` During bot startup this table will be populated with a list of modules, commands, and each command's config. This is disabled when DEV_MODE is on.

  ```Table: inventory``` Inventory links discord user id to item id 

  ```Table: money_balance``` Holds discord user id with their wallet and bank balance 
  
  ## Resources

  #### Recommended VSCode Extensions

  * [Better Comments](https://marketplace.visualstudio.com/items?itemName=OmarRwemi.BetterComments)
  * [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)
  * [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow)

  #### Developer Links

  * [baylee.lol](https://baylee.lol)
  * [github.com/bayleebot](https://github.com/bayleebot)
  * [github.com/thecenters](https://github.com/thecenters)
  * [thecenters.me](https://thecenters.me)

