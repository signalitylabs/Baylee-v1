'use strict'

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings    = module.exports.config;
        var db          = this.db;
        
        try {
            //Grab mention
            var mention     = msg.mentions.members.first();

            if (!mention) {
                /*
                    If no mention, then search the guild for a playername

                    It matches whole names only. baylee won't find users named bigbayleebot.
                */
                if(args) {
                    var user    = await msg.channel.guild.members.fetch({ query: args, limit: 1 });
                    var user_id = user.first().id;
                } else {
                    var user_id = msg.author.id;
                }
            } else {
                var user_id = mention.id;
            } 

            //Load the member
            var member = await msg.channel.guild.members.fetch(user_id);
            //And their roles
            const roles = member.roles.cache.map(role => role.id);

            var inventory   = await db.query(`SELECT itm.name, itm.emoji, itm.image, itm.description, itm.namespace, itm.type, inv.quantity FROM inventory AS inv INNER JOIN items AS itm ON inv.itemid = itm.itemid WHERE itm.type = "Collectable" AND inv.userid = "${msg.author.id}" LIMIT 1`);
        
            var collectables = [];
            if(inventory.length > 0) {
                for(var x = 0; x < inventory.length; x++) {
                    collectables.push(inventory[x].emoji);
                }
            }

            /*
                Building a rather large embed to show off all of the player info.

                This is pretty much self explainatory
            */
            msg.channel.send({ embed: {
                color: settings.info.color,
                title: `${member.displayName}'s profile`,
                thumbnail: {
                    url: `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`
                },
                fields: [{
                    name: `Collectables:`,
                    value: `${collectables.join(' ')}`
                },{
                    name: `**Status**`,
                    value: `${member.presence !== null && member.presence.status !== null ? member.presence.status : "Offline"}`
                },{
                    name: `**Roles**`,
                    value: `<@&${roles.length ? roles.join('>, <@&') : ''}>`
                },{
                    name: `**Dates**`,
                    value: `__Joined Server__: ${member.joinedAt.toDateString()}`
                }],
                footer: {
                    icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                    text: `Searched by ${msg.author.tag}`
                }
            }});

            return true;

            //We outtie 9000
        } catch(err) {
            console.log(err);
            //We probably couldn't find the person they were searching for
            if(args) {
                msg.channel.send({ embed: { color: settings.info.color, description: settings.error.noresults }});
                return false;
            }

            //If args aren't set that means they didn't select someone
            if(!args) {
                msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty }});
                return false;
            }
        }
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '🧐 Profile',
        trigger: 'profile',
        aliases: [],
        usage: '%trigger% <user>',
        color: 3080142
    },

    cooldown: {
        seconds: '10'
    },

    error: {
        empty: 'You need to mention another person',
        noresults: 'Can\'t find anyone by that name'
    }
}