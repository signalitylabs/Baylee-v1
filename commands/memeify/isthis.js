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
        var filename    = 'isthis.png';

        //Pass meme variables to class
        var meme    = await memeify.createMeme(msg,
                        {
                            filename: filename,
                            input: args,
                            required: 3,
                            watermark: `black`
                        },
                        [
                            {
                                left: 14,
                                top: 32,
                                width: 280,
                                height: 81,
                                hcenter: true,
                                vcenter: true,
                                color: `white`,
                                shadow: true
                            },{
                                left: 379,
                                top: 80,
                                width: 216,
                                height: 87,
                                hcenter: true,
                                vcenter: true,
                                color: `white`,
                                shadow: true
                            },{
                                left: 5,
                                top: 514,
                                width: 592,
                                height: 81,
                                hcenter: true,
                                vcenter: true,
                                color: `white`,
                                shadow: true
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
        name: '🦋 Is this?',
        trigger: 'isthis',
        aliases: [],
        tags: ['fighbird'],
        usage: '%trigger% <text>',
        required: 3,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter (3) values separated by a comma. For example\n`high school tv drama, 28 year old actor, is this a teenager?`'
    }
}