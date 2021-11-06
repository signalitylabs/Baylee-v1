'use strict'

const maxResults = 12;

const fs        = require('fs');
const util      = require('util');
const readdir   = util.promisify(fs.readdir);

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    //Load all the commands inside of their folders
    async load_commands(folder, config, search) {
        var files = await readdir(`./commands/${folder}/`); 
        var build = [];
        
        for(var x = 0; x < files.length; x++) {
            var file  = files[x];
            
            if(file.endsWith('js')) { 
                //Check if command is disabled
                var cmd_disabled = config.cmd_disabled;
                //We're checking for the command name, which is the filename without .js
                if(!cmd_disabled.includes(file.replace('.js', ''))) {
                    //If it's a .js file, let's include it
                    var inc = require(`../../commands/${folder}/${file}`).config;
                    //Setting info.ignore to ture will ignore the file from the help command
                    if(!inc.info.ignore) {
                        var searchText      = search.toLowerCase();
                        var searchTrigger   = inc.info.name.toLowerCase();

                        if(inc.info.tags) {
                            var searchTags      = inc.info.tags;
                        } else {
                            var searchTags      = ``;
                        }
                        
                        if(searchTrigger.includes(searchText) || searchTags.includes(searchText)) {
                            build.push({name: `${inc.info.name}`, value: `Category: ${folder}\n\`bae ${inc.info.trigger}\``, inline: true});
                        }
                    }
                }
            }
        }

        //When we're done we can return what we built
        return build;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;

        //Grab folders defined in this file
        var folders = settings.folders;

        //Check if module is disabled
        var mods_enabled = config.mods_enabled;

        //They have to search for a command, but if they didn't
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        //If their search is too short
        if(args.length < 3) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.tooshort } }); return false; }

        //Parse all the categories
        var embedfields = [];
        for(var a = 0; a < folders.length; a++) {
            var category = folders[a];
            //We're checking for the module name defined in the config
            if(mods_enabled.includes(category.folder)) {
                //If there is hover info for this command, let's add it
                var searchText = await this.load_commands(category.folder, config, args);

                if(searchText.length > 0) {
                    embedfields.push(searchText);
                }
            }
        }

        if(embedfields.length == 0) {
            embedfields.push({name: `Uh oh!`, value: `Can't find any command that matches \`${args}\``, inline: true});
        }

        //Send results to channel
        msg.channel.send({ embed: {
            author: {
                name: `Baylee Command Search`,
                url: `https://baylee.lol`,
                icon_url: `https://i.imgur.com/4h1e0Yw.png`
            },
            color: settings.info.color,
            description: `▫️ [Invite Baylee to Server](https://baylee.lol/invite) ▫️ [Support](https://www.patreon.com/centers) ▫️`,
            fields: embedfields
        }});

        return;
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '👓 Command Search',
        trigger: 'search',
        aliases: [],
        usage: '%trigger%',
        color: 7471359
    },

    error: {
        empty: 'You need to type something to search for',
        tooshort: 'Please type at least 3 letters to search'
    },

    cooldown: {
        seconds: '10'
    },
    
    folders: [
        {
            name: '🖥️ Fun',
            hover: 'Fun games and commands to use',
            folder: 'fun'
        },
        {
            name: '📓 Homework',
            hover: 'Get help with some homework',
            folder: 'homework'
        },
        {
            name: '🐉 Anime',
            hover: 'Everything anime',
            folder: 'anime'
        },
        {
            name: '💰 Money',
            hover: 'Use and earn virtual money',
            folder: 'money'
        },
        {
            name: '🦸🏻‍♂️ Roleplay',
            hover: 'Get in character',
            folder: 'roleplay'
        },
        {
            name: '💩 PFP',
            hover: 'Remix a member\'s profile picture',
            folder: 'pfp'
        },
        {
            name: '🐶 Pets',
            hover: 'A daily dose of awwww',
            folder: 'pets'
        },
        {
            name: '🎮 Games',
            hover: 'Game specific commands',
            folder: 'games'
        },
        {
            name: '📘 Info',
            hover: 'Information about this bot and server',
            folder: 'info'
        },
        {
            name: '🍑 Memes',
            hover: 'Find some memes',
            folder: 'memes',
            compact: true
        },
        {
            name: '✨ Memeify',
            hover: 'Create your own memes',
            folder: 'memeify'
        }
    ] 
}