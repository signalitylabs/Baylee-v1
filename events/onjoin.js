'use strict'

const Discord       = require('discord.js');
const Jimp          = require('jimp');

/*
    onJoin
    Listens for when a new person joins the
    discord
*/
module.exports = class {
    constructor(client, db, handlers) {
        client.on('guildMemberAdd', async member => {
            //If we're in Dev Mode we don't need to handle this
            if(process.env.DEV_MODE) { return; }
            
            var config      = await db.getConfig(member.guild.id);

            //Check to see if this module is enabled 
            var mods_enabled = config.mods_enabled;
            if(!mods_enabled.includes('welcome')) { return; }

            //Check if channel was deleted then remove the hook
            const channel = member.guild.channels.cache.find(channel => channel.type === 'text' && channel.id === config.welcome_post)
            if (!channel) {
                console.log(`[!] Removed welcome for ${member.guild.id}`);
                db.query(`UPDATE guild_settings SET welcome_post = "" WHERE guild = "${member.guild.id}" LIMIT 1`);
                return;
            }

            //Load banner and language file
            var post_to = config.welcome_post;
            var welcome_image = config.banner;
            var lang = require('../lang/joins/' + config.banner_msg);

            var member_name = member.user.username;
            var member_id = member.user.id;
            var guild_id = member.guild.id;

            //Send the new person a canned message
            /*
                * TODO: Add canned message to new member that needs to be database managed
            */

            //If a member hasn't upload an avatar, we need to select one
            var avatar = member.user.displayAvatarURL({format:'png',dynamic:false});
            if (!avatar) { avatar = 'https://i.imgur.com/gIIWUGU.jpg'; }

            //Using Jimp to create a welcome image
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

            //Load avatar and resize it
            Jimp.read(avatar).then(member => {
                var user = member.resize(150,150);

                //Load the welcome image as base
                Jimp.read('./assets/images/welcome/' + welcome_image).then(overlay => {
                    overlay = overlay.resize(1024, Jimp.AUTO);
                    
                    //Overlay the welcome image in case there is transparency
                    Jimp.read('./assets/images/welcome/' + welcome_image).then(mentioned => {
                        mentioned.resize(1024, Jimp.AUTO)
                        .composite(user, 437, 33)
                        .composite(overlay, 0, 0);
                        //Add the member's name to the banner
                        mentioned.print(font, 0, 220, {text: `Welcome ${member_name}`, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.AUTO}, 1024, 256)
                        
                        //Grab a random message from the language file
                        var phrase = lang[Math.floor(Math.random()*lang.length)];

                        client.guilds.fetch(guild_id).then(guild => {
                            //Add random message to the banner
                            mentioned.print(font, 0, 280, {text: `${phrase}`, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.AUTO}, 1024, 256)

                            //Process the image and post the result
                            mentioned.getBufferAsync(Jimp.MIME_PNG).then(x => {
                                const attachment = new Discord.MessageAttachment(x, welcome_image);
                                if(post_to) client.channels.fetch(post_to).then(channel => channel.send(`Welcome , <@${member_id}>!`).then(() => { channel.send(attachment) }));
                            });
                        });
                    });
                });
            });
        });
    }
}