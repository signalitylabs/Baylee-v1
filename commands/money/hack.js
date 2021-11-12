'use strict'

const moneyClass  = require(`./../../classes/money.js`);
const money       = new moneyClass();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
        var db = this.db;
        var doHack = false;

        var canHack    = await money.parseAmount(msg, '500', 'wallet')
        if(!canHack) { return false; }

        var cooldown    = await db.query(`SELECT type, expiration, now() AS current FROM money_cooldowns WHERE type = "${settings.info.trigger}" AND userid = "${msg.author.id}" LIMIT 1`);
        var prize       = Math.floor(Math.random() * (400 - 5) ) + 100;

        if(cooldown.length == 0) {
            //No cooldown yet so let's set one and give them some coins
            db.query(`INSERT INTO money_cooldowns (userid, type) VALUES("${msg.author.id}", "${settings.info.trigger}")`);
            doHack = true;
        } else {
            //Calculate the differences between the time
            var timeCurrent     = new Date(cooldown[0].current);
            var timeExpiration  = new Date(cooldown[0].expiration);
            var timeDiff        = (timeCurrent - timeExpiration)/1000;

            var days        = Math.floor(timeDiff / (3600 * 24));
            var hours       = Math.floor(timeDiff / (60 * 60));
            var minutes     = Math.floor(timeDiff / 60);
            var seconds     = Math.floor(timeDiff);

            if(minutes >= 30) {
                db.query(`UPDATE money_cooldowns SET expiration = now() WHERE type = "${settings.info.trigger}" AND userid = "${msg.author.id}"`);
                doHack = true;
            } else {
                //Nope, not time yet
                var displayHours      = hours - (days*24);
                var displayMinutes    = minutes - (hours*60);
                var displaySeconds    = seconds - (minutes * 60);

                var cooldown    = `${29-displayMinutes}m ${59-displaySeconds}s`;
                
                msg.channel.send({ embed: {
                    color: settings.info.color,
                    description: `<@${msg.author.id}> ${settings.messages.cooldown.replace('%time%', cooldown)}`
                } });

                return true;
            }
        }

        if(doHack) { 
            //Calculate if they are a winner or not
            var chance     = Math.random();
            if (chance < 0.5) { 
                //win
                var balance     = await money.addWallet(msg.author.id, prize);
                var message     = settings.messages.success;
            } else {
                //loss
                var balance     = await money.takeWallet(msg.author.id, prize);
                var message     = settings.messages.fail;
            }

            message = message.replace('%balance%', balance.toLocaleString(undefined, { minimumFractionDigits: 2 }))
            .replace('%prize%', prize.toLocaleString(undefined, { minimumFractionDigits: 2 }));
    
            msg.channel.send({ embed: {
                color: settings.info.color,
                title: `**Processing Hack Command...**`
            } }).then(async (post) => {
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Logging account information**`,
                    description: `Progress [░░░░░░░░░░░] 0%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Uploading malware to server.**`,
                    description: `Progress [░░░░░░░░░░░] ${getRandomInt(1, 10)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Uploading malware to server..**`,
                    description: `Progress [░░░░░░░░░░░] ${getRandomInt(10, 20)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Uploading malware to server...**`,
                    description: `Progress [░░░░░░░░░░░] ${getRandomInt(20, 30)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Upload complete**`,
                    description: `Progress [▓▓▓▓░░░░░░░] ${getRandomInt(30, 40)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Gathering ip addresses**`,
                    description: `Progress [▓▓▓▓▓░░░░░░] ${getRandomInt(40, 50)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Initiating brute force attack**`,
                    description: `Progress [▓▓▓▓▓▓░░░░░] ${getRandomInt(50, 60)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Brute force running.**`,
                    description: `Progress [▓▓▓▓▓▓▓░░░░] ${getRandomInt(60, 70)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Brute force running..**`,
                    description: `Progress [▓▓▓▓▓▓▓▓░░░] ${getRandomInt(70, 80)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Brute force running...**`,
                    description: `Progress [▓▓▓▓▓▓▓▓▓░░] ${getRandomInt(80, 90)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Credentials found, logging in.**`,
                    description: `Progress [▓▓▓▓▓▓▓▓▓▓░] ${getRandomInt(90, 99)}%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Credentials found, logging in..**`,
                    description: `Progress [▓▓▓▓▓▓▓▓▓▓▓] 100%`
                }});
    
                await post.edit({ embed: {
                    color: settings.info.color,
                    title: `**Credentials found, logging in...**`,
                    description: ``
                }});
                
                await post.edit({ embed: {
                    color: settings.info.color,
                    thumbnail: { url: settings.info.thumbnail },
                    description: `<@${msg.author.id}> ${message}`,
                    footer: {
                        text: `💸 Your new balance is ᕮ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    }
                } });
            });
        }
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '📟 Hack',
        trigger: 'hack',
        aliases: [],
        usage: '%trigger%',
        thumbnail: 'https://i.imgur.com/B4eMHs4.png',
        color: 2336037,
        cooldown: 'Don\'t be greedy, you need to wait ``%time%`` before you can do this again'
    },

    messages: {
        success: 'Your hack was successful. You walk away with ``$%prize%``',
        fail: 'You got busted by the cops! You bribed them with ``$%prize%`` to not go to jail',
        cooldown: 'Don\'t be greedy, you need to wait ``%time%`` before you can do this again'
    },

    cooldown: {
        seconds: '30'
    }
}