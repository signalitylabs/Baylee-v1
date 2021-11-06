'use strict'

const Discord       = require('discord.js');
const Jimp      = require('jimp');
const { e } = require('mathjs');

module.exports = class {
    checkInputs(args, required) {
        //check string to see if enough arguments are supplied
        if(!args || !required) { 
            //something went wrong
            return false;
        }

        //They give anything to include that meme
        if(!args.includes(',') && required > 1) { return false; }
        //If they didn't give us enough arguments
        if(args.split(',').length < required) { return false; }

        return true;
    }

    async createMeme(msg, params, attributes) {
        try {
            var settings    = module.exports.config;
            var words       = settings.replace;
            //load values we need for this function
            var filename    = params.filename;
            var input       = params.input; //args
            var required    = params.required;

            //Make sure text passed validation
            var validation = this.checkInputs(input, required);

            if(!validation) { return false; }

            if(attributes.length < 1) { return false; }

            //Load the font we're going to use
            const font_b = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            const font_w = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

            const font_large_b = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
            const font_large_w = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

            //Load watermark
            var watermarkfile = 'watermark_b.png';
            if(params.watermark == 'white') {
                var watermarkfile = 'watermark_w.png';
            }

            var watermark   = await Jimp.read(`./assets/images/other/${watermarkfile}`)
            .then(async image => { return await image.resize(140, Jimp.AUTO); });

            //Load the meme
            var meme = await Jimp.read(`./assets/images/memeify/${filename}`).then(async (meme) => {
                //Resize to 600 max with with an automatic height
                await meme.resize(600, Jimp.AUTO);

                //Loop through the text for the meme
                for(var x = 0; x < attributes.length; x++) {
                    var attr = attributes[x];

                    var text = `${input.split(',')[x]} `;

                    for (var i = 0; i < words.length; i++) {
                        var word = words[i];
                        var regEx = new RegExp(word, `ig`);
                        text = text.replace(regEx, '*****');
                    }

                    text = text.replace(`’`, `'`)
                    .replace(`<-->`, `,`);
                    
                    //we have to manually make shadow
                    if(attr.shadow) {
                        if(attr.largefont == true) {
                            var selectedFont = (attr.color == `white`) ? font_large_b: font_large_w;
                        } else {
                            var selectedFont = (attr.color == `white`) ? font_b: font_w;
                        }

                        await meme.print(selectedFont, (attr.left+3), (attr.top+3), {
                            text: text, 
                            alignmentX: (attr.hcenter == true) ? Jimp.HORIZONTAL_ALIGN_CENTER: Jimp.HORIZONTAL_ALIGN_LEFT, 
                            alignmentY: (attr.vcenter == true) ? Jimp.VERTICAL_ALIGN_MIDDLE: Jimp.VERTICAL_ALIGN_TOP
                        }, attr.width, attr.height);
                    }

                    if(attr.largefont == true) {
                        var selectedFont = (attr.color == `white`) ? font_large_w: font_large_b;
                    } else {
                        var selectedFont = (attr.color == `white`) ? font_w: font_b;
                    }

                    await meme.print(selectedFont, attr.left, attr.top, {
                        text: text, 
                        alignmentX: (attr.hcenter == true) ? Jimp.HORIZONTAL_ALIGN_CENTER: Jimp.HORIZONTAL_ALIGN_LEFT, 
                        alignmentY: (attr.vcenter == true) ? Jimp.VERTICAL_ALIGN_MIDDLE: Jimp.VERTICAL_ALIGN_TOP
                    }, attr.width, attr.height);
                }

                //Add watermark
                await meme.composite(watermark, (meme.bitmap.width-(watermark.bitmap.width+5)), (meme.bitmap.height-(watermark.bitmap.height+5)));

                return await meme.getBufferAsync(Jimp.MIME_PNG);
            });

            //Return the processed image
            const attachment    = new Discord.MessageAttachment(meme, filename);
            msg.channel.send(attachment);

            return true;
        } catch(e) {
            console.error(e);
            return false;
        }
    }
}

/*
    Module settings
    These are words we are blocking that we don't allow
*/
module.exports.config = {
    replace: ['nigger','niggers','faggot','faggots','f4g','fagg0t','fag','fags','n1gr','nigg3r','niiger','nigur','niigr','nig nog','nègre','negro','nègro','negre','pédé','neger','chink','chinks','chinky','cholos','kyke','kike']
}