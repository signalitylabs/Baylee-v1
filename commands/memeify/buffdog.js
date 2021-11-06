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
        var filename    = 'buffdog.png';

        //Pass meme variables to class
        var meme    = await memeify.createMeme(msg,
                        {
                            filename: filename,
                            input: args,
                            required: 2,
                            watermark: `black`
                        },
                        [
                            {
                                left: 12,
                                top: 435,
                                width: 303,
                                height: 141,
                                hcenter: true,
                                vcenter: true,
                                color: `black`
                            },{
                                left: 326,
                                top: 435,
                                width: 263,
                                height: 141,
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
        name: '🦮 Buff/Crying Dog',
        trigger: 'buffdog',
        aliases: [],
        tags: ['doge'],
        usage: '%trigger% <text>',
        required: 2,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter (2) values separated by a comma. For example `teens in anime, teens in real life`'
    }
}