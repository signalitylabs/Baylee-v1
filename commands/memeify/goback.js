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
        var filename    = 'goback.png';

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
                                top: 12,
                                width: 261,
                                height: 194,
                                hcenter: true,
                                vcenter: true,
                                color: `black`
                            },{
                                left: 14,
                                top: 194,
                                width: 261,
                                height: 233,
                                hcenter: true,
                                vcenter: true,
                                color: `black`
                            },{
                                left: 14,
                                top: 443,
                                width: 261,
                                height: 155,
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
        name: '🤚 Go Back',
        trigger: 'goback',
        aliases: [],
        tags: ['button'],
        usage: '%trigger% <text>',
        required: 3,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter (3) values separated by a comma. For example\n`me as a kid wanting to grow up, me as a teenager, me as an adult`'
    }
}