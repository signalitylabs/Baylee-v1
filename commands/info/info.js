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
        var client      = this.client;

        //Basic information about the server we're on
        msg.guild.members.fetch().then(members => {
            var online = members.filter(member => member.presence.status !== 'offline').size;

            msg.channel.send({ embed: {
                color: settings.info.color,
                author: {
                name: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
                icon_url: settings.info.icon,
                },
                fields: [{
                    name: 'People Online',
                    value: online,
                    inline: true
                },{
                    name: 'Server Region',
                    value: msg.guild.region,
                    inline: true
                },{
                    name: 'Total Members',
                    value: msg.guild.memberCount,
                    inline: true
                },{   
                    name: 'Total Channels',
                    value: msg.guild.channels.cache.size,
                    inline: true
                },{
                    name: 'Founded On',
                    value: msg.guild.createdAt.toLocaleString(),
                    inline: true
                },{
                    name: 'Bot Birthday',
                    value: client.user.createdAt.toLocaleString(),
                    inline: true
                }]
            }});

            return true;
        });
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '📰 Server Info',
        trigger: 'info',
        aliases: [],
        usage: '%trigger%',
        color: 7471359,
        icon: 'https://i.imgur.com/QkEKTYy.png',
        thumbnail: 'https://i.imgur.com/wSUTtgF.png'
    },

    cooldown: {
        seconds: '10'
    }
}