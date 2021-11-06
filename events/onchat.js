'use strict'

const cooldownHandler   = require('../classes/cooldown');
const cooldowns         = new cooldownHandler();

/*
    onChat
    Listens for all chat events, checks for command triggers, and passes
    chat message to other modules
*/
module.exports = class {
    constructor(client, db, handlers) {
        client.on('message', async (msg) => {
            if(msg.author.id === client.user.id) { return; } //ignore our own messages
            if(!msg.guild) { return; }

            //If we're in Dev Mode then only look in the testing channel
            if(process.env.DEV_MODE) {
                if(msg.channel.id !== process.env.DEV_CHANNEL) { return; }
            }

            //If we need to ignore a channel, let's do it
            if(process.env.CHANNEL_IGNORE) {
                if(msg.channel.id == process.env.CHANNEL_IGNORE) { return; }
            }
            
             //localize modules
            var classes     = handlers.classes;
            var listeners   = handlers.listeners;

            /*
                Handle classes
                Mostly just chat commands. Classes are restricted to specific
                triggers and are only called upon if their trigger
                is mentioned
            */

            if(classes) {
                //Loop through all the classes
                var keys = Object.keys(classes);
                for(var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    if(typeof classes[key].getConfig == 'function') {
                        var cmdsettings = classes[key].getConfig(); //Grabs class specific settings
                        var phrase      = msg.content.toLowerCase(); //Full phrase of what the user typed
                        var trigger     = cmdsettings.info.trigger;
                        var aliases     = cmdsettings.info.aliases;

                        //We're going to assume there is no trigger here
                        var hasTrigger  = false;

                        if(trigger) {
                            //Does it start with bae? Then it's for us.
                            if(phrase.startsWith(`bae `)) {
                                //Remove bae from the start
                                phrase = phrase.substring(4);
                                /*
                                    Chat commands use arguments but can also overlap.
                                    Example: `bae anime` and `bae animememe`

                                    So to make sure we're using the right command, we need
                                    to check the last character of the string. If it's 
                                    a letter that means it's an overlapped command
                                    and it's not okay to run.
                                */
                                if(phrase.startsWith(trigger)) {
                                    //Seeing if it's an exact match
                                    var nextchar = phrase.substring(trigger.length).charAt(0);
                                    if(!nextchar.match(/^[a-z]+$/)) {
                                        //We found our trigger!
                                        hasTrigger = true;
                                        //Set the arguments that's going to be sent to the onChat function
                                        var args   = msg.content.substring(trigger.length+4).trim();
                                    }
                                } else {
                                    //Check the aliases (if we have any)
                                    if(aliases && aliases.length > 0) {
                                        for(var a = 0; a < aliases.length; a++) {
                                            var alias = aliases[a];
                                            if(phrase.startsWith(alias)) {
                                                //Seeing if it's an exact match
                                                var nextchar = phrase.substring(alias.length+4).charAt(0);
                                                if(!nextchar.match(/^[a-z]+$/)) {
                                                    //We found our trigger!
                                                    hasTrigger = true;
                                                    //Set the arguments that's going to be sent to the onChat function
                                                    var args   = msg.content.substring(alias.length+4).trim();
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //We're done processing the triggers. If we found one, let's continue
                            if(hasTrigger) {
                                //See if class has an onChat function to match it's trigger
                                if(typeof classes[key].onChat == 'function') {    
                                    //Query the database and grab the config
                                    var config      = await db.getConfig(msg.guild.id);

                                    //Check if module is disabled
                                    var mods_enabled = config.mods_enabled;
                                    //We're checking for the module name defined in the config
                                    if(!mods_enabled.includes(cmdsettings.info.module)) { return; }

                                    //Check if command is disabled
                                    var cmd_disabled = config.cmd_disabled;
                                    //We're checking for the command name, which is the filename without .js
                                    if(cmd_disabled.includes(key.replace('.js', ''))) { return; }

                                    //Check if command is nitro only
                                    var cmd_nitro = config.cmd_nitro;
                                    //We're checking for the module name, which is the filename without .js
                                    if(cmd_nitro.includes(key.replace('.js', ''))) {
                                        //Grab the member and load their info
                                        var member = await msg.guild.members.fetch(msg.author.id);
                                        //If they aren't nitro then tell them
                                        if(!member.premiumSince) {
                                            msg.channel.send({ embed: {
                                                title: `Oops, you can't do that`,
                                                color: 9240831,
                                                description: 'Sorry, but you need to be a Nitro booster to use this command',
                                                footer: {
                                                    text: '💡 Nitro boosters get extra commands'
                                                }
                                            }});

                                            //Exits the whole damn thing
                                            return;
                                        }
                                    }

                                    //Did we make it this? Let's check if cooldown is active
                                    var cooldown = await cooldowns.hasCooldown(msg, key, cmdsettings);
                                    if(cooldown) {
                                        cooldowns.notify(msg, key, cmdsettings);
                                    } else {
                                        var onchat = await classes[key].onChat(msg, args, config);
                                        if(!onchat) cooldowns.resetCooldown(msg);
                                    }

                                }
                                return;
                            }
                        }

                    }
                }
            }

            /*
                Handle listeners
                Listeners aren't bound to the same limits as classes. They are
                actively called on every chat command without limits
            */
            if(listeners) {
                //Loop through all the listeners
                var keys = Object.keys(listeners);
            
                for(var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if(typeof listeners[key].onChatHook == 'function') {
                        listeners[key].onChatHook(msg);
                    }
                }
            }
        });
    }
}