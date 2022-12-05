"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JustNUCore = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
const VFS_1 = require("C:/snapshot/project/obj/utils/VFS");
let JustNUCore = class JustNUCore {
    constructor(databaseServer, jsonUtil, VFS) {
        this.databaseServer = databaseServer;
        this.jsonUtil = jsonUtil;
        this.VFS = VFS;
    }
    addTop(modDb, outfitID, topbundlePath, handsbundlePath, handsBaseID) {
        // const
        const database = this.databaseServer.getTables();
        const jsonUtil = this.jsonUtil;
        const VFS = this.VFS;
        // add top
        let newTop = jsonUtil.clone(database.templates.customization["5d28adcb86f77429242fc893"]);
        newTop._id = outfitID;
        newTop._name = outfitID;
        newTop._props.Prefab.path = topbundlePath;
        database.templates.customization[outfitID] = newTop;
        // add hands
        let newHands = jsonUtil.clone(database.templates.customization[handsBaseID]);
        newHands._id = `${outfitID}Hands`;
        newHands._name = `${outfitID}Hands`;
        newHands._props.Prefab.path = handsbundlePath;
        database.templates.customization[`${outfitID}Hands`] = newHands;
        // add suite
        let newSuite = jsonUtil.clone(database.templates.customization["5d1f623e86f7744bce0ef705"]);
        newSuite._id = `${outfitID}Suite`;
        newSuite._name = `${outfitID}Suite`;
        newSuite._props.Body = outfitID;
        newSuite._props.Hands = `${outfitID}Hands`;
        newSuite._props.Side = ["Usec", "Bear", "Savage"];
        database.templates.customization[`${outfitID}Suite`] = newSuite;
        // locale
        for (const localeID in database.locales.global) {
            // en placeholder
            database.locales.global[localeID].templates[`${outfitID}Suite`] = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/en.json`))[outfitID];
            // actual locale
            if (VFS.exists(`${modDb}locales/${localeID}.json`)) {
                database.locales.global[localeID].templates[`${outfitID}Suite`] = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/${localeID}.json`))[outfitID];
            }
        }
        // add suite to the ragman
        database.traders["5ac3b934156ae10c4430e83c"].suits.push({
            "_id": outfitID,
            "tid": "5ac3b934156ae10c4430e83c",
            "suiteId": `${outfitID}Suite`,
            "isActive": true,
            "requirements": {
                "loyaltyLevel": 0,
                "profileLevel": 0,
                "standing": 0,
                "skillRequirements": [],
                "questRequirements": [],
                "itemRequirements": [
                    {
                        "count": 0,
                        "_tpl": "5449016a4bdc2d6f028b456f"
                    }
                ]
            }
        });
    }
    addBottom(modDb, outfitID, bundlePath) {
        // const
        const database = this.databaseServer.getTables();
        const jsonUtil = this.jsonUtil;
        const VFS = this.VFS;
        // add Bottom
        let newBottom = jsonUtil.clone(database.templates.customization["5d5e7f4986f7746956659f8a"]);
        newBottom._id = outfitID;
        newBottom._name = outfitID;
        newBottom._props.Prefab.path = bundlePath;
        database.templates.customization[outfitID] = newBottom;
        // add suite
        let newSuite = jsonUtil.clone(database.templates.customization["5cd946231388ce000d572fe3"]);
        newSuite._id = `${outfitID}Suite`;
        newSuite._name = `${outfitID}Suite`;
        newSuite._props.Feet = outfitID;
        newSuite._props.Side = ["Usec", "Bear", "Savage"];
        database.templates.customization[`${outfitID}Suite`] = newSuite;
        // locale
        for (const localeID in database.locales.global) {
            // en placeholder
            database.locales.global[localeID].templates[`${outfitID}Suite`] = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/en.json`))[outfitID];
            // actual locale
            if (VFS.exists(`${modDb}locales/${localeID}.json`)) {
                database.locales.global[localeID].templates[`${outfitID}Suite`] = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/${localeID}.json`))[outfitID];
            }
        }
        // add suite to the ragman
        database.traders["5ac3b934156ae10c4430e83c"].suits.push({
            "_id": outfitID,
            "tid": "5ac3b934156ae10c4430e83c",
            "suiteId": `${outfitID}Suite`,
            "isActive": true,
            "requirements": {
                "loyaltyLevel": 0,
                "profileLevel": 0,
                "standing": 0,
                "skillRequirements": [],
                "questRequirements": [],
                "itemRequirements": [
                    {
                        "count": 0,
                        "_tpl": "5449016a4bdc2d6f028b456f"
                    }
                ]
            }
        });
    }
};
JustNUCore = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(1, (0, tsyringe_1.inject)("JsonUtil")),
    __param(2, (0, tsyringe_1.inject)("VFS")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseServer !== "undefined" && DatabaseServer) === "function" ? _a : Object, typeof (_b = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _b : Object, typeof (_c = typeof VFS_1.VFS !== "undefined" && VFS_1.VFS) === "function" ? _c : Object])
], JustNUCore);
exports.JustNUCore = JustNUCore;
