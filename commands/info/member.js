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
            //And what they're doing
            const presence = member.presence.activities[0];
            //Prettyify their activity
            var activity = 'N/A';
            if(presence) activity = `${presence.name !== null ? presence.name : `None`} ${presence.state !== null ? `\`${presence.state}\`` : ``} ${presence.details !== null ? `\`${presence.details}\`` : ``}`

            /*
                Building a rather large embed to show off all of the player info.

                This is pretty much self explainatory
            */
            msg.channel.send({ embed: {
                color: settings.info.color,
                thumbnail: {
                    url: `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`
                },
                fields: [{
                    name: `**Basic Info**`,
                    value: `__Username__: ${member.user.tag}
                            __Nickname__: ${member.displayName}
                            __ID__: ${member.id}
                            __Tag__: <@${member.id}>`
                },{
                    name: `**Status**`,
                    value: `${member.presence !== null && member.presence.status !== null ? member.presence.status : "Offline"}`
                },{
                    name: `**Activites**`,
                    value: `${activity}`
                },{
                    name: `**Roles**`,
                    value: `<@&${roles.length ? roles.join('>, <@&') : ''}>`
                },{
                    name: `**Dates**`,
                    value: `__Joined Server__: ${member.joinedAt.toDateString()}
                            __Joined Discord__: ${member.user.createdAt.toDateString()}`
                }],
                footer: {
                    icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                    text: `Searched by ${msg.author.tag}`
                }
            }});

            return true;

            //We outtie 9000
        } catch(err) {
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
        name: '🧐 Member Profile',
        trigger: 'member',
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