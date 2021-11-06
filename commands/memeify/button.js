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
        var filename    = 'button.png';

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
                                left: 45,
                                top: 210,
                                width: 224,
                                height: 180,
                                hcenter: true,
                                vcenter: true,
                                color: `white`
                            },{
                                left: 294,
                                top: 45,
                                width: 262,
                                height: 311,
                                hcenter: true,
                                vcenter: true,
                                color: `white`
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
        name: '🔳 Smash Button',
        trigger: 'button',
        aliases: [],
        tags: ['button'],
        usage: '%trigger% <text>',
        required: 2,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter (2) values separated by a comma. For example `mute, me 2 seconds into the call`'
    }
}