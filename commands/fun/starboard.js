'use strict'

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    updateChart(msg, chartType) {
        var settings = module.exports.config;
        var allvotes = this.allvotes;
        var allmsg   = this.allmsg;

        allmsg = Object.keys(allmsg).map(function(key) {
            return [Number(key), allmsg[key]];
        });

        //Grab all of the votes and either pull the top or bottom 3
        allvotes = Object.keys(allvotes).map(function(key) {
            return [Number(key), allvotes[key]];
        }).sort(function (a, b) {
            if(chartType == 'bottom') { return (a[1] < b[1]) ? -1 : 1; }
            if(chartType == 'top') { return (a[1] > b[1]) ? -1 : 1; }
        });

        //Used for rank placement
        var counter = 0;

        for (let i of allvotes) {
            var msgVotes    = i[1];
            var poster      = allmsg.find(o => { return o[0] == i[0] }); //i[0] == message id

            //We're only processing the top 3 votes
            counter++;
            if(counter > 3) { break; }

            //remove the direct post link
            var content = ` `;
            if(poster[1].content) { content = `${poster[1].content}`; }
            content = content.replace(/([])|\[(.*?)\]\(.*?\)/gm, '').trim();

            //if there is content let's add it
            if(content) {
                content = `> ${content}`;
            }

            //Send the message to channel
            msg.channel.send({ embed: {
                color: 12547583,
                description: `\\${settings.placements[counter]} ${poster[1].username} \\${settings.emoji.star} ${msgVotes} points [[link](${poster[1].url})]

                                ${content}`,
                thumbnail: {
                    url: `${poster[1].image}`,
                },
                footer: {
                    text: `Ranked #${counter} by votes`
                }
            } });
        }
    }

    async onChat(msg, args, config) {
        var settings    = module.exports.config;
        //How far back we should look for posts in the Starboard
        var days        = 7;
        //Convert dats into a timestamp
        var timestamp   = new Date().getTime() - (days * 24 * 60 * 60 * 1000);
        //Load starboard channel from config
        var post_to     = config.starboard_post;
        //If there's no channel then escape
        if(!post_to) { return; }

        //Load the channel
        this.client.channels.fetch(post_to).then(channel => {
            //Grab the last 100 messages in this channel
            channel.messages.fetch({ limit: 100 }).then(async messages => {
                this.allmsg         = {};
                this.allvotes       = {};
                var itemsProcessed  = 0;

                //Loop the messages
                await messages.forEach(async (item, index)=> {
                    if(item.createdTimestamp > timestamp) {
                        //Get member name from the footer of the Starboard post
                        var username    = item.embeds[0].footer.text.match(/\w+#\d{4}/i);
                        var reactions   = item.reactions;
                        var thumbnail   = 'https://i.imgur.com/ctI3mga.png';

                        //Calculate a freshness score based off of the ages
                        var age         = (item.createdTimestamp - timestamp) / 1000;
                        age             = (days-1) - (Math.floor(age / 86400));

                        //If there is an image set it as a thumbnail
                        if(item.embeds[0].image) { thumbnail = item.embeds[0].image.url; }

                        //Count all of the downvotes
                        var votes = await reactions.cache.filter(a => a.emoji.name == settings.emoji.downvote).map(reaction => reaction.count)[0];

                        //If there are votes add them to the array
                        if(votes) {
                            this.allmsg[item.id] = {
                                author: item.embeds[0].author.name,
                                username: username,
                                url: item.url,
                                image: thumbnail,
                                content: item.embeds[0].description
                            };

                            this.allvotes[item.id] = votes;
                        }

                        //Count all of the upvotes
                        var addvotes = await reactions.cache.filter(a => a.emoji.name == settings.emoji.upvote).map(reaction => reaction.count)[0];

                        if(addvotes) {
                            if(this.allmsg[item.id]) { 
                                this.allvotes[item.id] = addvotes - votes + age;
                            }
                        }
                    }

                    itemsProcessed++;
                    if(itemsProcessed === messages.size) {
                        this.updateChart(msg, 'top');
                    }
                });
            });
        });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '⭐ Starboard',
        trigger: 'starboard',
        aliases: [],
        tags: ['game'],
        usage: '%trigger%',
        color: 4159422
    },

	emoji: {
		star: '⭐',
		upvote: '👍',
		downvote: '👎'
	},

    placements: {
        1: '🥇',
        2: '🥈',
        3: '🥉'
    },

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'Can\'t find any posts right now, try again later'
    }
}