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

        //If they aren't an admin then we need to ignore them
        if (!msg.member.hasPermission('ADMINISTRATOR')) { return; }

        //Just in case we need to initialize the server's settings
        var guildConfig = await db.getConfig(msg.guild.id);

        switch(args) {
            case 'starboard':
                db.query(`UPDATE guild_settings SET starboard_post = "${msg.channel.id}" WHERE guild = "${msg.guild.id}" LIMIT 1`);
                msg.channel.send({ embed: {
                    color: settings.info.color,
                    description: `You have set <#${msg.channel.id}> to be used for **${args}**. React to any message on this server with :star: and it will be added to this channel`,
                    fields: [{
                        name: 'Step 1',
                        value: `Change @everyone permission to:\n❌ Send Messages ❌ Add Reactions`,
                        inline: true
                    },{
                        name: 'Step 2',
                        value: `Add Baylee with permission to:\n✅ Send Messages ✅ Add Reactions`,
                        inline: true
                    }]
                }});
                break;

            case 'welcome':
                db.query(`UPDATE guild_settings SET welcome_post = "${msg.channel.id}" WHERE guild = "${msg.guild.id}" LIMIT 1`);
                msg.channel.send({ embed: {
                    color: settings.info.color,
                    description: `You have set <#${msg.channel.id}> to be used for **${args}**.`,
                    fields: [{
                        name: 'Step 1',
                        value: `Change @everyone permission to:\n❌ Send Messages`,
                        inline: true
                    },{
                        name: 'Step 2',
                        value: `Add Baylee with permission to:\n✅ Send Messages`,
                        inline: true
                    }]
                }});
                break;
        }

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '⚙️ Set Config',
        trigger: 'set',
        aliases: [],
        usage: '%trigger%',
        color: 65508,
        ignore: true
    },

    cooldown: {
        seconds: '10'
    }
}