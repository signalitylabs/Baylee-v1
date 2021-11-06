'use strict'

const memeifyClass  = require(`./../../classes/memeify.js`);
const memeify       = new memeifyClass();

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
        var filename    = 'rockdriving.png';

        //Pass meme variables to class
        var meme    = await memeify.createMeme(msg,
                        {
                            filename: filename,
                            input: args,
                            required: 2,
                            watermark: `white`
                        },
                        [
                            {
                                left: 249,
                                top: 26,
                                width: 340,
                                height: 98,
                                hcenter: true,
                                vcenter: true,
                                color: `black`
                            },{
                                left: 261,
                                top: 228,
                                width: 330,
                                height: 89,
                                hcenter: true,
                                vcenter: true,
                                color: `black`
                            }
                        ]);
        
        if(!meme) {
            //If there is no meme tell them an error happened
            msg.channel.send({
                embed: {
                    color: settings.info.color,
                    description: settings.error.empty
                }
            });
            
            return false;
        }

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'memeify',
        name: '🚙 Rock Driving',
        trigger: 'rockdriving',
        aliases: [],
        tags: ['the rock', 'rock', 'race to witch mountain'],
        usage: '%trigger% <text>',
        required: 2,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter (2) values separated by a comma. For example `say the name of any wrestler and i bet i can beat him, paper`'
    }
}