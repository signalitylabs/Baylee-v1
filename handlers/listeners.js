'use strict'

const fs        = require('fs');
const util      = require('util');
const readdir   = util.promisify(fs.readdir);

const dbHandler   = require('../classes/database');
const db          = dbHandler.getConnection();

/*
    Listeners Handler
    Scans the ./listeners folder for .js files to include,
    then returns the listeners information back to the caller
*/
module.exports = {
    async getListeners(client) {
        var listeners = {};
        var count = 1; //For fun, let's count how many files we load
        var files = await readdir(`./listeners/`); 

        /*
            Looping through the folders of /listeners
            Will not add *.js files yet
        */
        for(var x = 0; x < files.length; x++) {
          var file  = files[x];
          
          if(file.endsWith('.js')) { 
            var inc   = require(`./../listeners/${file}`);
            
            listeners[file] = new inc(client, db);
            console.log(`${count}> Loaded listener /listeners/${file}`);
            count++;
          }
        }
        return listeners;
    }
} 