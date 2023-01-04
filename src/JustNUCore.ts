import { inject, injectable } from "tsyringe";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { VFS } from "@spt-aki/utils/VFS";

@injectable()
export class JustNUCore {
	constructor(
		@inject("DatabaseServer") protected databaseServer: DatabaseServer,
		@inject("JsonUtil") protected jsonUtil: JsonUtil,
		@inject("VFS") protected VFS: VFS
		@inject("WinstonLogger") protected logger: WinstonLogger
	)
	{}
	
	public addTop(modDb, outfitID, topbundlePath, handsbundlePath, handsBaseID): void
	{
		// const
		const database = this.databaseServer.getTables();
		const jsonUtil = this.jsonUtil;
		const VFS = this.VFS;
		
		// add top
		const newTop = jsonUtil.clone(database.templates.customization["5d28adcb86f77429242fc893"]);

		newTop._id = outfitID;
		newTop._name = outfitID;
		newTop._props.Prefab.path = topbundlePath;
		database.templates.customization[outfitID] = newTop;
		
		// add hands
		const newHands = jsonUtil.clone(database.templates.customization[handsBaseID]);

		newHands._id = `${outfitID}Hands`;
		newHands._name = `${outfitID}Hands`;
		newHands._props.Prefab.path = handsbundlePath;
		database.templates.customization[`${outfitID}Hands`] = newHands;
		
		// add suite
		const newSuite = jsonUtil.clone(database.templates.customization["5d1f623e86f7744bce0ef705"]);

		newSuite._id = `${outfitID}Suite`;
		newSuite._name = `${outfitID}Suite`;
		newSuite._props.Body = outfitID;
		newSuite._props.Hands = `${outfitID}Hands`;
		newSuite._props.Side = ["Usec", "Bear", "Savage"];
		database.templates.customization[`${outfitID}Suite`] = newSuite;
		
		// locale
		for (const localeID in database.locales.global)
		{
			// en placeholder
			database.locales.global[localeID][`${newSuite._id} Name`] = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/en.json`))[outfitID].Name
			
			// actual locale
			if (VFS.exists(`${modDb}locales/${localeID}.json`)) {
				database.locales.global[localeID][`${newSuite._id} Name`] = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/${localeID}.json`))[outfitID].Name;
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
	
	public addBottom(modDb, outfitID, bundlePath): void
	{
		// const
		const database = this.databaseServer.getTables();
		const jsonUtil = this.jsonUtil;
		const VFS = this.VFS;
		
		// add Bottom
		const newBottom = jsonUtil.clone(database.templates.customization["5d5e7f4986f7746956659f8a"]);

		newBottom._id = outfitID;
		newBottom._name = outfitID;
		newBottom._props.Prefab.path = bundlePath;
		database.templates.customization[outfitID] = newBottom;
		
		// add suite
		const newSuite = jsonUtil.clone(database.templates.customization["5cd946231388ce000d572fe3"]);

		newSuite._id = `${outfitID}Suite`;
		newSuite._name = `${outfitID}Suite`;
		newSuite._props.Feet = outfitID;
		newSuite._props.Side = ["Usec", "Bear", "Savage"];
		database.templates.customization[`${outfitID}Suite`] = newSuite;
		
		// locale
		for (const localeID in database.locales.global)
		{
			// en placeholder
			database.locales.global[localeID][`${newSuite._id} Name`] = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/en.json`))[outfitID].Name
			
			// actual locale
			if (VFS.exists(`${modDb}locales/${localeID}.json`)) {
				database.locales.global[localeID][`${newSuite._id} Name`] = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/${localeID}.json`))[outfitID].Name;
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

	public addItemRetexture(modDb, itemId, baseItemID, bundlePath, copyAssort, addToBots, weightingMult): void
	{
		// const
		const database = this.databaseServer.getTables();
		const jsonUtil = this.jsonUtil;
		const VFS = this.VFS;
		const dbItems = database.templates.items;
		const enLocale = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/en.json`));
		
		// copy item from DB, change it's values and add it to database
		const newItem = jsonUtil.clone(dbItems[baseItemID]);
		newItem._id = itemId;
		newItem._name = itemId;
		newItem._props.Prefab.path = bundlePath;
		dbItems[itemId] = newItem;
		
		// copy handbook entry, change its Id, add it to handbook
		const newItemHandbook = jsonUtil.clone(database.templates.handbook.Items.find((item) => {return item.Id === baseItemID}));
		newItemHandbook.Id = itemId;
		database.templates.handbook.Items.push(newItemHandbook);
		
		// add it to prices json for flea pricing
		if (database.templates.prices[baseItemID]) {
			const newPrice = jsonUtil.clone(database.templates.prices[baseItemID];
			database.templates.prices[itemId] = newPrice;
		}
		
		// locale
		for (const localeID in database.locales.global)
		{
			// en placeholder
			database.locales.global[localeID][`${itemId} Name`] = enLocale[itemId].Name;
			database.locales.global[localeID][`${itemId} ShortName`] = enLocale[itemId].ShortName;
			database.locales.global[localeID][`${itemId} Description`] = enLocale[itemId].Description;
			
			// actual locale
			if (VFS.exists(`${modDb}locales/${localeID}.json`)) {
				const actualLocale = jsonUtil.deserialize(VFS.readFile(`${modDb}locales/${localeID}.json`));

				if (actualLocale[itemId]) {
					database.locales.global[localeID][`${itemId} Name`] = actualLocale[itemId].Name;
					database.locales.global[localeID][`${itemId} ShortName`] = actualLocale[itemId].ShortName;
					database.locales.global[localeID][`${itemId} Description`] = actualLocale[itemId].Description;
				}
			}
		}
		
		// update filters/conflicts
		this.updateFilters(itemId, baseItemID);
		
		// trader offers
		if (copyAssort) {
			this.copyTradeOffers(itemId, baseItemID);
		}
		
		// bot changes
		if (addToBots) {
			this.copyBotItemWeighting(itemId, baseItemID, weightingMult);
		}
	}
	
	public updateFilters(itemId, copyItemID): void
	{
		// const
		const database = this.databaseServer.getTables();
		
		for (const item in database.templates.items) {
			
			// handle conflicts
			const itemConflictId = database.templates.items[item]._props.ConflictingItems;
			
			for (const itemInConflicts in itemConflictId) {
				const itemInConflictsFiltersId = itemConflictId[itemInConflicts];
					
				if (itemInConflictsFiltersId === copyItemID) {
					itemConflictId.push(itemId);
				}
			}
			
			// handle filters
			for (const slots in database.templates.items[item]._props.Slots) {
				const slotsId = database.templates.items[item]._props.Slots[slots]._props.filters[0].Filter;
				
				for (const itemInFilters in slotsId) {
					const itemInFiltersId = slotsId[itemInFilters]
					
					if (itemInFiltersId === copyItemID) {
						slotsId.push(itemId);
					}
				}
			}
		}
	}
	
	public copyTradeOffers(itemId, copyItemID): void
	{
		// const
		const database = this.databaseServer.getTables();
		const jsonUtil = this.jsonUtil;
		
		for (const trader in database.traders) {
			if (trader !== "ragfair") {
				if (database.traders[trader].assort) {
					if (database.traders[trader].assort.items) {
						for (const offer in database.traders[trader].assort.items) {
							if (database.traders[trader].assort.items[offer]._tpl === copyItemID && database.traders[trader].assort.items[offer].parentId === "hideout" ) {
								// copy original offer, change its id and tpl, and push to assorts
								const newOffer = jsonUtil.clone(database.traders[trader].assort.items[offer]);
								newOffer._id = `${database.traders[trader].assort.items[offer]._id}_${itemId}_${trader}`;
								newOffer._tpl = itemId;
								database.traders[trader].assort.items.push(newOffer)
								
								// copy price
								const newPrice = jsonUtil.clone(database.traders[trader].assort.barter_scheme[database.traders[trader].assort.items[offer]._id]);
								database.traders[trader].assort.barter_scheme[`${database.traders[trader].assort.items[offer]._id}_${itemId}_${trader}`] = newPrice;
								
								// copy loyalty level
								const newLoaylty = jsonUtil.clone(database.traders[trader].assort.loyal_level_items[database.traders[trader].assort.items[offer]._id]);
								database.traders[trader].assort.loyal_level_items[`${database.traders[trader].assort.items[offer]._id}_${itemId}_${trader}`] = newLoaylty;
							}
						}
					}
				}
			}
		}
	}
	
	public copyBotItemWeighting(itemId, copyItemID, weightingMult): void
	{
		// const
		const database = this.databaseServer.getTables();
		const jsonUtil = this.jsonUtil;
		
		for (const bot in database.bots.types) {
			
			// add to equipment slots
			for (const slot in database.bots.types[bot].inventory.equipment) {
				if (database.bots.types[bot].inventory.equipment[slot][copyItemID]) {
					database.bots.types[bot].inventory.equipment[slot][itemId] = Math.round(database.bots.types[bot].inventory.equipment[slot][copyItemID] * weightingMult);
				}
			}
			
			// add to loot
			for (const lootSlot in database.bots.types[bot].inventory.items) {
				if (database.bots.types[bot].inventory.items[lootSlot].includes(copyItemID)) {
					database.bots.types[bot].inventory.items[lootSlot].push(itemId);
				}
			}
			
			// add to mods
			for (const modItem in database.bots.types[bot].inventory.mods) {
				// push to inv.mods.slot if its an attachment
				for (const modSlot in database.bots.types[bot].inventory.mods[modItem]) {
					if (database.bots.types[bot].inventory.mods[modItem][modSlot].includes(copyItemID)) {
						database.bots.types[bot].inventory.mods[modItem][modSlot].push(itemId);
					}
				}
				
				// add to inv.mods if it can have mods
				if (database.bots.types[bot].inventory.mods[copyItemID]) {
					database.bots.types[bot].inventory.mods[itemId] = jsonUtil.clone(database.bots.types[bot].inventory.mods[copyItemID]);
				}
			}
		}
	}
	
	public createTraderOffer(itemId, traderID, moneyID, traderPrice, traderLvl): void
	{
		// const
		const database = this.databaseServer.getTables();
		
		// add item to the trader
		database.traders[traderID].assort.items.push(
		{
			"_id": `${itemId}_${traderID}_${moneyID}_${traderPrice}_${traderLvl}_offer`,
			"_tpl": itemId,
			"parentId": "hideout",
			"slotId": "hideout",
			"upd":
			{
				"UnlimitedCount": true,
				"StackObjectsCount": 999999
			}
		});

		// add purchase cost
		database.traders[traderID].assort.barter_scheme[`${itemId}_${traderID}_${moneyID}_${traderPrice}_${traderLvl}_offer`] = [
			[
				{
					"count": traderPrice,
					"_tpl": moneyID
				}
			]
		];

		// add trader loyalty requirement
		database.traders[traderID].assort.loyal_level_items[`${itemId}_${traderID}_${moneyID}_${traderPrice}_${traderLvl}_offer`] = traderLvl;
	}
	/*
	
	static createBotSpawnPoint(spawnPointName, xCoordinate, yCoordinate, zCoordinate, map, botZoneName, RequiresCordFix = true) 
	{
		let correctYCoordinate = yCoordinate
		
		// gotta do some math cuz coords from screenshots have incorrect Y coord
		if (RequiresCordFix) {
			correctYCoordinate = (yCoordinate - 1.5);
		}
		
		let spawnPoint = {
			"Id": `${spawnPointName}-${map}-${botZoneName}-BOT`,
			"Position": {
				"x": xCoordinate,
				"y": correctYCoordinate,
				"z": zCoordinate
			},
			"Rotation": 0,
			"Sides": [
				"Savage"
			],
			"Categories": [
				"Bot"
			],
			"Infiltration": "",
			"DelayToCanSpawnSec": 4,
			"ColliderParams": {
				"_parent": "SpawnSphereParams",
				"_props": {
					"Center": {
						"x": 0,
						"y": 0,
						"z": 0
					},
					"Radius": 20
				}
			},
			"BotZoneName": botZoneName
		}
		
		database.locations[map].base.SpawnPointParams.push(spawnPoint)
	}
	
	static createSpawnPoint(spawnPointName, xCoordinate, yCoordinate, zCoordinate, rotation, map, RequiresCordFix = true) 
	{
		let correctYCoordinate = yCoordinate
		
		// gotta do some math cuz coords from screenshots have incorrect Y coord
		if (RequiresCordFix) {
			correctYCoordinate = (yCoordinate - 1.5);
		}
		
		let spawnPoint = {
			"Id": `${spawnPointName}-${map}`,
			"Position": {
				"x": xCoordinate,
				"y": correctYCoordinate,
				"z": zCoordinate
			},
			"Rotation": rotation,
			"Sides": [
				"All"
			],
			"Categories": [
				"Player"
			],
			"Infiltration": "",
			"DelayToCanSpawnSec": 4,
			"ColliderParams": {
				"_parent": "SpawnSphereParams",
				"_props": {
					"Center": {
						"x": 0,
						"y": 0,
						"z": 0
					},
					"Radius": 20
				}
			}
		}
		
		database.locations[map].base.SpawnPointParams.push(spawnPoint)
	}
	
	*/
}