'use strict'

const fetchClass    = require(`./../../classes/fetch.js`);
const fetch         = new fetchClass();

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;


        msg.channel.send({ embed: {
            thumbnail: {
                url: 'https://i.imgur.com/ZzPbN6F.png'
            },
            author: {
                name: 'Among Us Guide',
                icon_url: 'https://i.imgur.com/eKIDTlh.png',
            },
            title: `Among Us Beginnger's Guide`,
            description: `**Crewmates**
            Crewmates win by performing simple tasks around the map, or by ejecting all the impostors.

            ✅ Complete your tasks
            ✅ Don't ignore sabotage events
            ✅ Check cameras, door logs, and vitals
            ✅ Observe visual tasks
            ✅ Call an Emegency Meeting if you have discovered vital information
            
            **Impostors**
            Impostors win by killing Crewmates and evading ejections until only a few Crewmates remain.

            ✅ Unlike Crewmates, you can travel with vents
            ✅ Look busy. Have backup tasks in mind to help you blend in
            ✅ Sabotage Crewmates by switching off lights, breaking the Reactor, and sealing doors.
            ✅ Watch out for cameras
            ✅ Report bodies to gain the trust of Crewmates
            ✅ Work with other Impostors
            
            **Dead Bodies**
            When a body is found and reported, it'll pull all players into a meeting for a discussion. Players can then vote on who they think potential impostors are, or skip the vote if they're unsure.`,
            color: settings.info.color
        }});
        
        return true;

    }
}

module.exports.config = {
    info: {
        module: 'games',
        name: '🌓 Among Us Guide',
        trigger: 'auguide',
        aliases: [],
        tags: ['among us'],
        usage: '%trigger%',
        color: 16711687
    },

    cooldown: {
        seconds: '10'
    }
}