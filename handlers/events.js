'use strict'

const fs        = require('fs');
const util      = require('util');
const readdir   = util.promisify(fs.readdir);

const dbHandler   = require('../classes/database');
const db          = dbHandler.getConnection();

/*
    Event Handler
    Scans the ./events folder for .js files to include,
    then returns the event information back to the caller
*/
module.exports = {
    async getEvents(client, handlers) {
        var events = {};
        var count = 1; //For fun, let's count how many files we load
        var files = await readdir(`./events/`); 

        /*
            Looping through the folders of /events
            Will not add *.js files yet
        */
        for(var x = 0; x < files.length; x++) {
        var file  = files[x];
        
        if(file.endsWith('.js')) { 
            var inc   = require(`./../events/${file}`);
            
            events[file] = new inc(client, db, handlers);
            console.log(`${count}> Loaded event /events/${file}`);
            count++;
        }
        }
        return events;
    }
}