'use strict'

/*
    Cooldown Handler
    Checks if the user has a cooldown on a command
*/
module.exports = class {
    resetCooldown(msg) {
      this.cooldowns[msg.author.id] = {};
    }

    async notify(msg, key, cmdsettings) {
      var settings        = module.exports.config;

      var timestamp       = new Date().getTime();
      var timeCurrent     = new Date(timestamp);
    
      //Initialize cooldowns and player if they haven't been
      if(!this.cooldowns) { this.cooldowns = {}; } 
      if(!this.cooldowns[msg.author.id]) { this.cooldowns[msg.author.id] = {}; }
      var userCooldown    = this.cooldowns[msg.author.id];

      //Checking if cooldown has expired
      if(userCooldown[key] > timeCurrent) {
          //Cooldown is still active
          var timeleft    = ((userCooldown[key] - timeCurrent) / 1000);
          var description = settings.info.notice.replace(`%seconds%`, timeleft).replace(`%cooldown%`, cmdsettings.cooldown.seconds);

          //Let the person know their cooldown is still active
          msg.channel.send({ embed: {
              title: settings.info.title,
              color: settings.info.color,
              description: `${description} ${this.cooldownSuffix} ${settings.info.premium.no}`,
              footer: {
                text: settings.info.footer
              }
          }});
          return true;
      }
    }

    async hasCooldown(msg, key, cmdsettings) {
      var seconds         = ((cmdsettings.cooldown) ? cmdsettings.cooldown.seconds: 30) * 1000;
      var cooldownSuffix  = '';

      try {
        //check if command is immune to cooldowns
        if(cmdsettings.cooldowns.ignore) {
          return false;
        }
      } catch(e) { }

      this.cooldownSuffix = '';
      
      var member = await msg.guild.members.fetch(msg.author.id);
      
      if(member.premiumSince) {
        var cooldownSaved = 20;
        seconds = seconds - Math.round(seconds *(cooldownSaved/100));

        this.cooldownSuffix = ' but your cooldown is ``'+(seconds/1000)+'s`` for being a Nitro booster.';
      }

      //Set cooldown for just 1 person
      if(msg.author.id == '148287587272884225') {
        var cooldownSaved = 90; //90% off of cooldown, limited time offer!
        seconds = seconds - Math.round(seconds *(cooldownSaved/100));

        this.cooldownSuffix = ' but your cooldown is ``'+(seconds/1000)+'s`` for being Centers.';
      }
      /*
        TODO: Needs to handl multiserver cooldowns for selected roles (saved in db)
        TODO: Add premium check for lower cooldowns

        var offsetTime      = 0;
        var offsetRank      = '';

        if(!member.premiumSince) {
        
        }
        
        var offsets     = config.cooldown_offset;
        var offsetKeys  = Object.keys(offsets);

        for(var i = 0; i < offsetKeys.length; i++) {
          var offsetKey = offsetKeys[i];
          if(msg.member.roles.cache.some(role => role.id === offsetKey)) {
            var savings = offsets[offsetKey];
            if(savings > offsetTime) {
              offsetTime = savings;
              offsetRank = offsetKey;
            }
          }
        }
        
        if(offsetTime > 0) {
          seconds = seconds - Math.round(seconds *(offsetTime/100));

          cooldownSuffix = ' but your cooldown is ``'+seconds+'s`` for having the <@&'+offsetRank+'> rank.';
        }
      */


    //If they aren't nitro then tell them


      var timestamp       = new Date().getTime();
      var timeCurrent     = new Date(timestamp);
      var timeCooldown    = new Date(timestamp + seconds);
    
      //Initialize cooldowns and player if they haven't been
      if(!this.cooldowns) { this.cooldowns = {}; } 
      if(!this.cooldowns[msg.author.id]) { this.cooldowns[msg.author.id] = {}; }
      var userCooldown    = this.cooldowns[msg.author.id];
    
      try {
        //If player doesn't have a cooldown throw an error
        if(!userCooldown[key]) { throw true; }

        //Checking if cooldown has expired
        if(userCooldown[key] < timeCurrent) {
            //Expired, let's update the cooldown time and exit
            delete this.cooldowns[msg.author.id][key];
            this.cooldowns[msg.author.id][key] = timeCooldown;
            return false;
        } else {
            //Cooldown is still active
            return true;
        }
      } catch(e) {
        //if there is an error, set a cooldown
        this.cooldowns[msg.author.id][key]=timeCooldown;
        return false;
      }
    }
}

/*
    Module settings
*/
module.exports.config = {
    info: {
        title: 'Slow down there cowboy',
        color: 65419,
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``',
        premium: {
          no: '\n\n[Get Premium for lower cooldowns](https://www.patreon.com/centers)',
          yes: '\n\nThanks for supporting Baylee with Premium'
        },
        footer: '💡 Nitro boosters and other roles may have lower cooldowns'
    },
}