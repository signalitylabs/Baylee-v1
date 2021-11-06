'use strict'

/*
    onReaction
    Listens for all reactions from raw packets. Passes them
    over to the reaction handler (onReact)
*/
module.exports = class {
    constructor(client, db, handlers) {
        var classes     = handlers.classes;
        var listeners   = handlers.listeners;
        /*
            Listen to all Discord packets, filters them, and 
            tries to direct them to commands
        */
        client.on('raw', async packet => {
            //Make sure we only listen for reaction add & remove
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
            
            client.channels.fetch(packet.d.channel_id).then(async channel => {
                //If there's no message id then there is nothing for us to do here
                if (await !channel.messages.fetch(packet.d.message_id)) return;
            
                channel.messages.fetch(packet.d.message_id).then(async message => {
                    //Grab the emoji (normal or custom) and try to load it
                    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    const reaction = await message.reactions.cache.get(emoji);
                    
                    //Pass the reaction to the handler
                    if (packet.t === 'MESSAGE_REACTION_ADD') {
                        client.emit('onReact', 'add', reaction, await client.users.fetch(packet.d.user_id));
                    }
                    if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                        client.emit('onReact', 'remove', reaction, await client.users.fetch(packet.d.user_id));
                    }
                });
            });
        });

        //Handle reactions
        client.on('onReact', async (action, reaction, user) => {
            if(!reaction) { return; } // If there's no reaction, there's nothing for us to do
            /*
                Handle classes
                Classes largely govern themselves when it comes to reactions.
            */
            if(classes) {
                var ckeys = Object.keys(classes);
                for(var i = 0; i < ckeys.length; i++) {
                    var key = ckeys[i];
            
                    //If a class has a function for reactions, pass it to them
                    if(typeof classes[key].onReactionRemove == 'function') {
                        if(action == 'remove') { classes[key].onReactionRemove(reaction, user); }
                    }
                    if(typeof classes[key].onReaction == 'function') {
                        if(action == 'add') { classes[key].onReaction(reaction, user); }
                    }
                }
            }

            /*
                Handle listeners
                Listeners largely govern themselves when it comes to reactions.
            */
            if(listeners) {
                var lkeys = Object.keys(listeners);
                for(var i = 0; i < lkeys.length; i++) {
                    var key = lkeys[i];
            
                    //If a listener has a function for reactions, pass it to them
                    if(typeof listeners[key].onReactionRemove == 'function') {
                        if(action == 'remove') { listeners[key].onReactionRemove(reaction, user); }
                    }
                    if(typeof listeners[key].onReaction == 'function') {
                        if(action == 'add') { listeners[key].onReaction(reaction, user); }
                    }
                }
            }
        });
    };
}