class Mod
{
    constructor()
    {
		Logger.info("Loading: JustNU - Core");
		
		globalThis.JustNUCore = require("./src/justnucore.js")
    }
}

module.exports.Mod = new Mod();