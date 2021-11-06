'use strict'

const mysql     = require('mysql');
const util      = require('util');

/*
    Database Handler
    Allows use of npm mysql in an async way
*/
module.exports = {
    getConnection: () => {
        const conn = mysql.createConnection(process.env.DATABASE_URL, { charset : 'utf8' });
        return {
            query(sql, args) { //Asyncify query command
                return util.promisify(conn.query)
                .call(conn, sql, args);
            },
            async getConfig(guild) { //Grab server config
                var config = await this.query(`SELECT * FROM guild_settings WHERE guild = "${guild}" LIMIT 1`);
                
                /*
                    If there's no config we need to add a default entry into the database

                    This should only happen if someone invites the bot to a server and not through the website
                */
                if(config.length < 1) {
                    await this.query(`INSERT INTO guild_settings (guild, cmd_disabled, cmd_nitro, mods_enabled) VALUES (${guild}, '[]', '[]', '["fun","homework","anime","roleplay","pfp","pets","games","info","memeify","money","starboard","welcome"]')`);
                    var config = await this.query(`SELECT * FROM guild_settings WHERE guild = "${guild}" LIMIT 1`);
                }
                
                if(config.length < 1) {
                    console.error(`DB> Fatal error loading the config for this server`);
                }
                
                return config[0];
            },
            close() {
                return util.promisify(conn.end).call(conn);
            }
        };
    }
}