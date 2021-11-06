'use strict'

const dbHandler   = require('./database');
const db          = dbHandler.getConnection();

module.exports = class {

    async parseAmount(msg, input, source) {
        var balance = await this.getBalance(msg.author.id);

        if(source == 'bank') {
            var withdrawFrom = balance.bank;
        } else {
            var withdrawFrom = balance.wallet;
        }

        switch(input) {
            case 'half':
            case '1/2':
                var amount = withdrawFrom / 2;
                break;
            case 'all':
            case 'everything':
            case 'max':
            case 'yeet':
                var amount = withdrawFrom;
                break;
            case 'third':
            case 'a third':
            case '1/3':
                var amount = withdrawFrom / 3;
                break;
            case 'fourth':
            case 'a fourth':
            case '1/4':
                var amount = withdrawFrom / 4;
                break;
            default:
                var amount  = parseFloat(input.replace(/[^0-9\.]/g, '')).toFixed(2);
                break;
        }

        if(isNaN(amount) || amount < 0.01) {
            msg.channel.send({ embed: {
                color: 2336037,
                description: `<@${msg.author.id}> Try entering some actual numbers`
            }});
            return false;
        }

        if(amount > withdrawFrom) {
            msg.channel.send({ embed: {
                color: 2336037,
                description: `<@${msg.author.id}> You need to have $${amount} in your wallet to do this`
            }});
            return false;
        }
        
        return amount;
    }

    async addWallet(userid, amount) {
        var balance = await this.getBalance(userid);
        if(!balance) { return false; }
        
        var total = parseFloat(balance.wallet) + parseFloat(amount);

        await db.query(`UPDATE money_balance SET wallet = "${total}" WHERE userid = "${userid}"`);
        return total;
    }

    async takeWallet(userid, amount) {
        var balance = await this.getBalance(userid);
        if(!balance) { return false; }
        
        var total = parseFloat(balance.wallet) - parseFloat(amount);

        await db.query(`UPDATE money_balance SET wallet = "${total}" WHERE userid = "${userid}"`);
        return total;
    }

    async addBank(userid, amount) {
        var balance = await this.getBalance(userid);
        if(!balance) { return false; }
        
        var total = parseFloat(balance.bank) + parseFloat(amount);

        await db.query(`UPDATE money_balance SET bank = "${total}" WHERE userid = "${userid}"`);
        return total;
    }

    async takeBank(userid, amount) {
        var balance = await this.getBalance(userid);
        if(!balance) { return false; }
        
        var total = parseFloat(balance.bank) - parseFloat(amount);

        await db.query(`UPDATE money_balance SET bank = "${total}" WHERE userid = "${userid}"`);
        return total;
    }

    async getBalance(userid) {
        try {
            //Grab the player's balance
            var balance = await db.query(`SELECT wallet, bank FROM money_balance WHERE userid = "${userid}" LIMIT 1`);

            if(balance.length == 0) {
                //If there's no balance for this player we need to set one for them
                await db.query(`INSERT INTO money_balance (userid) VALUES("${userid}")`);
                var balance = await db.query(`SELECT * FROM money_balance WHERE userid = "${userid}"`);
            }

            return balance[0];
        } catch(e) {
            //something went wrong
            console.warn(`money.js> ${e}`);
            return false;
        }
    }
}