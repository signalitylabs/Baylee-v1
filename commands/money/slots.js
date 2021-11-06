'use strict'

const moneyClass  = require(`./../../classes/money.js`);
const money       = new moneyClass();

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

        var balance = await money.getBalance(msg.author.id);
        var bet     = await money.parseAmount(msg, args, 'wallet');
        if(!bet) { return false; }

        var message = `**<@${msg.author.id}> just lost $${Number(bet).toLocaleString(undefined, { minimumFractionDigits: 2 })}**`;

        const slotsEmojis   = [':gem:', ':lemon:', ':bell:', ':peach:'];
        const slotMax       = 9;
        const slotLines     = {};
        //1 2 3
        //4 5 6
        //7 8 9
        const slotWinners   = ['123', '456', '789', '159', '357', '147', '258', '369'];

        //fill the slots 
        for(var i = 1; i <= slotMax; i++) {
            slotLines[i] = slotsEmojis[Math.floor(Math.random() * slotsEmojis.length)];
        }

        //check for winner
        var wins    = 0;
        var winner  = false;
        for(var a = 0; a  < slotWinners.length; a++) {
            var winners = slotWinners[a];
            winners = winners.split('');

            for(var x = 1; x < slotMax; x++) {
                if(slotLines[winners[0]] == slotLines[winners[1]] && slotLines[winners[0]] == slotLines[winners[2]]) {
                    winner = true;
                }
            }

            if(winner) {
                wins++;
                winner = false;
            }
        }

        const multiplyer    = ((Math.floor(Math.random() * (75 - 15) ) + 15) * .01) + (wins * 0.1);
        const percentage    = Math.round(multiplyer*100);
        var winnings        = bet * multiplyer;
        winnings            = winnings.toFixed(2);
        
        if(wins > 0) {
            message = `**<@${msg.author.id}> just won ${percentage}% and got $${winnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}**`;
            var balance = await money.addWallet(msg.author.id, winnings);
        } else {
            var balance = await money.takeWallet(msg.author.id, bet);
        }

        msg.channel.send({ embed: {
            title: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
            color: settings.info.color,
            thumbnail: { url: settings.info.thumbnail },
            description: `${message}\n\n${slotLines[1]}▪️${slotLines[2]}▪️${slotLines[3]}\n${slotLines[4]}▪️${slotLines[5]}▪️${slotLines[6]}\n${slotLines[7]}▪️${slotLines[8]}▪️${slotLines[9]}`,
            footer: {
                text: `💸 Your new balance is $${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            }
        }});

        return true;

    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '🎰 Slots',
        trigger: 'slots',
        aliases: [],
        usage: '%trigger% <amount>',
        color: 2336037,
        thumbnail: 'https://i.imgur.com/j5xh3OE.png'
    },

    cooldown: {
        seconds: '10'
    }
}