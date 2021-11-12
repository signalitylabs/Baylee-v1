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

    printDice(dice1, dice2) {
        var settings = module.exports.config;
        var dice = settings.dice;
        var build = '';

        for(var i = 0; i < 5; i++) {
            build = `${build}▪️${dice[dice1][i]}▪️${dice[dice2][i]}▪️\n`
        }

        return build.replace(/o/gi, '◻️').replace(/X/gi, '🔴');
    }

    async onChat(msg, args, config) {
        var settings    = module.exports.config;

        var balance = await money.getBalance(msg.author.id);
        var bet     = await money.parseAmount(msg, args, 'wallet');
        if(!bet) { return false; }

        var server_dice1,server_dice2;
        
        //Calculate if there is a handicap or not
        //Then roll the dice for the server
        var chance = Math.random();
        if (chance < 0.6) { 
            server_dice1      = Math.floor(Math.random() * (6 - 3) ) + 3;
            server_dice2      = Math.floor(Math.random() * (6 - 3) ) + 3;
        } else {
            server_dice1      = Math.floor(Math.random() * 6) + 1;
            server_dice2      = Math.floor(Math.random() * 6) + 1;
        }
        
        //Roll the dice for the player
        const player_dice1      = Math.floor(Math.random() * 6) + 1;
        const player_dice2      = Math.floor(Math.random() * 6) + 1;

        //Combine the dice values
        const server_combined   = server_dice1 + server_dice2;
        const player_combined   = player_dice1 + player_dice2;
        
        //Create a multiplyer and calculate winnings
        const multiplyer    = ((Math.floor(Math.random() * (75 - 15) ) + 15) * .01);
        const percentage    = Math.round(multiplyer*100);
        var winnings        = bet * multiplyer;
        winnings            = winnings.toFixed(2);

        if(player_combined > server_combined) {
            //Congrats, the player won!
            var balance = await money.addWallet(msg.author.id, winnings);
            var message = `<@${msg.author.id}> just won ${percentage}% and got ᕮ${winnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        } else {
            //Ha, player lost
            var balance = await money.takeWallet(msg.author.id, bet);
            var message = `<@${msg.author.id}> just lost ᕮ${Number(bet).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        }

        message     = `**${message}**\nYou rolled a \`\`${player_combined}\`\` and the server rolled a \`\`${server_combined}\`\`\n\n${this.printDice(player_dice1, player_dice2)}`;

        msg.channel.send({ embed: {
            color: settings.info.color,
            thumbnail: { url: settings.info.thumbnail },
            description: `${message}`,
            footer: {
                text: `💸 Your new balance is ᕮ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            }
        }});

        return true;

    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '🎲 Dice',
        trigger: 'dice',
        aliases: ['bet'],
        usage: '%trigger% <amount>',
        color: 2336037
    },

    dice: {
        1: ['ooooo', 'ooooo', 'ooXoo', 'ooooo', 'ooooo'],
        2: ['ooooo', 'oooXo', 'ooooo', 'oXooo', 'ooooo'],
        3: ['ooooo', 'oooXo', 'ooXoo', 'oXooo', 'ooooo'],
        4: ['ooooo', 'oXoXo', 'ooooo', 'oXoXo', 'ooooo'],
        5: ['ooooo', 'oXoXo', 'ooXoo', 'oXoXo', 'ooooo'],
        6: ['ooooo', 'oXoXo', 'oXoXo', 'oXoXo', 'ooooo']
    },

    cooldown: {
        seconds: '10',
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``'
    },

    error: {
        broke: 'You can\'t afford that bet. Try a lesser amount.',
        invalid: 'Please enter a valid amount to bet.',
        link: 'You need to link your Discord account with your Minecraft account. Type ``/discord link`` in game and follow the instructions.'
    }
}