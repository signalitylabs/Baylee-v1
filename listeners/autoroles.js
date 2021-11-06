'use strict'

/*
    Auto roles
    Automatically adds/removes role if player clicks on a 
    reaction from a specific channel

    TODO: Needs re-write to work with mysql so configs can be updated
*/
module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    onReaction(reaction, user) {
        //disabling for now
        return; 
        var settings   = module.exports.config;
        var hooks      = settings.hooks

        for(var h in hooks) {
            var x = hooks[h];
            if(x.listen_to !== reaction.message.channel.id ) { return; }
            
            var roles = x.roles[0];
            for(var id in roles) {
                if(reaction.emoji.name == roles[id]) {
                    reaction.message.guild.members.cache.filter(members => (members.id === user.id))
                    .map(member => member.roles.add(id));
                }
            }
            
        }

    }

    onReactionRemove(reaction, user) {
        //disabling for now
        return; 
        var settings    = module.exports.config;
        var hooks       = settings.hooks
    
        for(var h in hooks) {
            var x = hooks[h];
            if(x.listen_to != reaction.message.channel.id ) { return; }
            
            var roles = x.roles[0];
            for(var id in roles) {
                if(reaction.emoji.name == roles[id]) {
                    reaction.message.guild.members.cache.filter(members => (members.id === user.id))
                    .map(member => member.roles.remove(id));
                }
            }
        }
    }
} 

/*
    Module settings
*/
module.exports.config = {
    info: {
        ignore: true
    },
    
    hooks: 
    [{
        listen_to: "594436768443531275",
        roles: [{
            "730585731080257587": "📰",
            "730585802534289439": "📅",
            "730585884998500422": "🤑"
        }]
    }]
}