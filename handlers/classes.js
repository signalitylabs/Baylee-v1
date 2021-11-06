'use strict'

const fs        = require('fs');
const util      = require('util');
const readdir   = util.promisify(fs.readdir);

const dbHandler   = require('../classes/database');
const db          = dbHandler.getConnection();

/*
    Class Handler
    Scans the ./commands folder for .js files to include,
    then returns the class information back to the caller
*/
module.exports = {
    async getClasses(client) {
      var classes = {};
      var count = 1; //For fun, let's count how many files we load
      var folders = await readdir(`./commands/`);

      var triggers = [];

      //Prepare to reinsert all of the modules / commands
      //This really only needs to happen during production
      if(process.env.LOADER_DATABASE !== 'ignore') {
        await db.query('TRUNCATE commands');
      }

      /*
        Looping through the folders of /commands
        Will not add *.js files yet
      */
      for(var i = 0; i < folders.length; i++) {
        var folder = folders[i];
        var files = await readdir(`./commands/${folders[i]}/`); 

        for(var x = 0; x < files.length; x++) {
          var file  = files[x];
          
          if(file.endsWith('.js')) { 
            var inc   = require(`./../commands/${folder}/${file}`);
            
            classes[file] = new inc(client, db);
            
            //Load classes' config info
            var config = classes[file].getConfig();
            //Some classes *might* not have triggers
            if(config.info.trigger) {
              //If the trigger is already loaded, tell the console and exit
              if(triggers.includes(config.info.trigger)) {
                console.error(`${count}> [TRIGGER CONFLICT] Error loading class /commands/${folder}/${file}`);
                process.exit(1);
              }

              if(config.info.aliases) {
                for(var a = 0; a < config.info.aliases.length; a++) {
                  var alias = config.info.aliases[a];
                  if(triggers.includes(alias)) {
                    console.error(`${count}> [ALIAS CONFLICT] Error loading class /commands/${folder}/${file}`);
                    process.exit(1);
                  }

                  triggers.push(alias);
                }
              }
              //Add trigger to the trigger list
              if(process.env.LOADER_DATABASE !== 'ignore') {
                //Wait for the bot to catch up
                await db.query(`INSERT INTO commands (module, command, config) VALUES("${folder}", "${file.replace('.js', '')}", "${JSON.stringify(config.info).replace(/\"/ig,'\\"')}")`);
              }
              triggers.push(config.info.trigger);
            }

            console.log(`${count}> Loaded class /commands/${folder}/${file}`); //Hooray, tell the world!
            count++;
          }
        }    
      }
      return classes;
    }
}