'use strict'

/*
    onGuildCreate
    Events when Baylee joins a new server
*/
module.exports = class {
    constructor(client, db, handlers) {
        client.on('guildCreate', guild => {
            //If we're in Dev Mode we don't need to handle this
            if(process.env.DEV_MODE) { return; }
            
            try {
                const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
                channel.send({
                    embed: {
                        color: 65508,
                        description: `Hey, I'm Baylee

                                        Get started with \`bae help\`. Just so you know, all of my commands will start with \`bae\`.
                                        
                                        If you want to support development then please check out my [Patreon page](https://www.patreon.com/centers).

                                        Features:
                                        
                                        **What's a :star: Starboard?**
                                        A Starboard shows all of the posts in Discord that have been reacted to with a :star:. Members can then vote on the best posts.

                                        **How to Create a Starboard**
                                        To create a Starboard, make a new channel and use command \`bae set starboard\`.

                                        **How to set Welcome Channel**
                                        Welcome all new members who join. Create a new channel and use command  \`bae set welcome\`. 

                                        Need help with Baylee's commands or want to report a bug? [Join our support server](https://discord.gg/Rps2KTm)`
                    }
                });
            } catch(e) {
                console.error(e);
            }
        });
    }
}