"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const JustNUCore_1 = require("./JustNUCore");
class Mod {
    preAkiLoad(container) {
        container.register("JustNUCore", JustNUCore_1.JustNUCore, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
}
module.exports = { mod: new Mod() };
