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
    async load_commands(folder, config, page) {
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
                    if(!inc.info.ignore) build.push({name: inc.info.name, trigger: inc.info.trigger, usage: inc.info.usage, hover: inc.info.hover});
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
        var folderName = args.split(' ')[0];
        var folderArg = args.split(' ')[1];

        if(folderArg) {
            var pageNumber = parseFloat(folderArg.replace(/[^1-9\.]/g, '')).toFixed(0);
        }

        if(!pageNumber || isNaN(pageNumber)) { pageNumber = 1; }

        //Get the starting number of the help folder
        var startingNumber = (pageNumber * maxResults) - maxResults;

        //Get the ending number
        var endingNumber = startingNumber + maxResults;

        //Grab folders defined in this file
        var folders = settings.folders;
        
        //Search for a specific folder
        var category    = folders.filter(function (f) { return f.folder == folderName });
        category        = category[0];

        if(category) {
            //Check if module is disabled
            var mods_enabled = config.mods_enabled;
            //If the module isn't enabled, abort!
            if(!mods_enabled.includes(category.folder)) { return false; }

            var embedfields     = [];

            if(folderArg == 'all' || category.compact) {
                var commands        = await this.load_commands(category.folder, config, 0);
                var triggerList     = [];
                //Load the commands under this module
                for(var i = 0; i < commands.length; i++) {
                    var usage   = commands[i].usage.replace('%trigger%', `bae ${commands[i].trigger}`);
    
                    triggerList.push('`'+commands[i].trigger+'`');
                }
                
                //Send results to channel
                msg.channel.send({ embed: {
                    author: {
                        name: `Baylee`,
                        url: `https://baylee.lol`,
                        icon_url: `https://i.imgur.com/4h1e0Yw.png`
                    },
                    color: settings.info.color,
                    fields: embedfields,
                    description: `${triggerList.join(', ')}\n\nAll commands start with \`bae\``,
                    footer: {
                        text: `There are ${commands.length} commands under ${category.folder} | Page 1 of 1`
                    }
                }});
            } else {
                var commands        = await this.load_commands(category.folder, config, pageNumber);
    
                var pageTotal       = Math.ceil(commands.length/maxResults);
    
                if( endingNumber > commands.length ) { endingNumber = commands.length; }
                //Load the commands under this module
                for(var i = startingNumber; i < endingNumber; i++) {
                    var usage   = commands[i].usage.replace('%trigger%', `bae ${commands[i].trigger}`);
    
                    //If there is hover info for this command, let's add it
                    var hover = '';
                    if(commands[i].hover) {
                        hover = `[hover for info](http://baylee.lol "${commands[i].hover}")\n`;
                    }
                    //Build field entry for command
                    embedfields.push({
                        name: commands[i].name,
                        value: `${hover}\`${usage}\``,
                        inline: true
                    });
                }

                //Send results to channel
                msg.channel.send({ embed: {
                    author: {
                        name: `Baylee`,
                        url: `https://baylee.lol`,
                        icon_url: `https://i.imgur.com/4h1e0Yw.png`
                    },
                    description: (pageTotal > 1) ? `Type \`bae help ${category.folder} all\` for all ${category.folder} commands`: ``,
                    color: settings.info.color,
                    fields: embedfields,
                    footer: {
                        text: `There are ${commands.length} commands under ${category.folder} | Page ${pageNumber} of ${pageTotal}`
                    }
                }});
            }


            return true;
        } else {
            //Check if module is disabled
            var mods_enabled = config.mods_enabled;

            //Parse all the categories
            var embedfields = [];
            for(var a = 0; a < folders.length; a++) {
                category = folders[a];
                //We're checking for the module name defined in the config
                if(mods_enabled.includes(category.folder)) {
                    //If there is hover info for this command, let's add it
                    if(category.hover) {
                        var hover = `\n[hover for info](http://baylee.lol "${category.hover}")\n`;
                    }

                    embedfields.push({
                        name: category.name,
                        value: `\`bae ${settings.info.trigger} ${category.folder}\`${hover}`,
                        inline: true
                    });
                }
            }

            //Send results to channel
            msg.channel.send({ embed: {
                author: {
                    name: `Baylee`,
                    url: `https://baylee.lol`,
                    icon_url: `https://i.imgur.com/4h1e0Yw.png`
                },
                color: settings.info.color,
                description: `**Tip**: You can use \`bae search\` to find commands. Try searching for Among Us!
                
                                ▫️ [Invite Baylee to Server](https://baylee.lol/invite) ▫️ [Support](https://www.patreon.com/centers) ▫️`,
                fields: embedfields
            }});

            return true;
        }
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '🤔 Command Help',
        trigger: 'help',
        aliases: [],
        usage: '%trigger%',
        color: 7471359
    },

    cooldown: {
        seconds: '3'
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