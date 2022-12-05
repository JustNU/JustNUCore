import { inject, injectable } from "tsyringe";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { VFS } from "@spt-aki/utils/VFS";

@injectable()
export class JustNUCore {
	constructor(
		@inject("DatabaseServer") protected databaseServer: DatabaseServer,
		@inject("JsonUtil") protected jsonUtil: JsonUtil,
		@inject("VFS") protected VFS: VFS
	)
	{}
	
	public addTop(modDb: string, outfitID: string, topbundlePath: string, handsbundlePath: string, handsBaseID: string): void
	{
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
		for (const localeID in database.locales.global)
        {
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
	
	public addBottom(modDb: string, outfitID: string, bundlePath: string): void
	{
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
		for (const localeID in database.locales.global)
        {
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
	
	/*
	static AddItemRetexture(db, ItemBase, NewItemID, bundlePath)
    {
        // create item
		let NewItem = jsonUtil.clone(database.templates.items[ItemBase]);

        NewItem._id = NewItemID;
        NewItem._name = NewItemID;
        NewItem._props.Prefab.path = bundlePath;
        database.templates.items[NewItemID] = NewItem;
		
        // handbook
        let ItemHandbook = jsonUtil.clone(database.templates.handbook.Items.find((item) =>
        {
            return item.Id === ItemBase;
        }));

        ItemHandbook.Id = NewItem._id;
        database.templates.handbook.Items.push(ItemHandbook);
		
		// locale
		for (const localeID in database.locales.global)
        {
			// en placeholder
			database.locales.global[localeID].templates[NewItemID] = jsonUtil.deserialize(VFS.readFile(`${db}locales/en.json`))[NewItemID];
			
			// actual locale
			if (VFS.exists(`${db}locales/${localeID}.json`)) {
				database.locales.global[localeID].templates[NewItemID] = jsonUtil.deserialize(VFS.readFile(`${db}locales/${localeID}.json`))[NewItemID];
			}
        }
		
		//database.locales.global["en"].templates[NewItemID] = jsonUtil.deserialize(VFS.readFile(`${db}locales/en.json`))[NewItemID];
		
		// add item to the ragfair
        database.traders["ragfair"].assort.items.push({
            "_id": `${NewItemID}_ragfairOffer`,
            "_tpl": NewItemID,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999999
            }
        });
		
		// add purchase cost
        database.traders["ragfair"].assort.barter_scheme[`${NewItemID}_ragfairOffer`] = [
            [
            {
                "count": NewItem._props.CreditsPrice,
                "_tpl": "5449016a4bdc2d6f028b456f"
            }]
        ]
		
		// add trader standing requirement
        database.traders.ragfair.assort.loyal_level_items[`${NewItemID}_ragfairOffer`] = 1;
		
		// update filters/conflicts
		let dbItems = database.templates.items;
		
		for (const item in dbItems) {
			const itemConflictId = dbItems[item]._props.ConflictingItems;
			
			for (const itemInConflicts in itemConflictId) {
				let itemInConflictsFiltersId = itemConflictId[itemInConflicts];
					
				if (itemInConflictsFiltersId === ItemBase) {
					itemConflictId.push(NewItemID);
				}
			}
			
			for (const slots in dbItems[item]._props.Slots) {
				const slotsId = dbItems[item]._props.Slots[slots]._props.filters[0].Filter;
				
				for (const itemInFilters in slotsId) {
					let itemInFiltersId = slotsId[itemInFilters]
					
					if (itemInFiltersId === ItemBase) {
						slotsId.push(NewItemID);
					}
				}
			}
		}
    }
	
	static createTraderOffer(ItemID, TraderID, MoneyID, TraderPrice, TraderLvl)
    {
        // add item to the trader
        database.traders[TraderID].assort.items.push(
        {
            "_id": `${ItemID}_${TraderID}_${MoneyID}_${TraderPrice}_${TraderLvl}_offer`,
            "_tpl": ItemID,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999
            }
        });

        // add purchase cost
        database.traders[TraderID].assort.barter_scheme[`${ItemID}_${TraderID}_${MoneyID}_${TraderPrice}_${TraderLvl}_offer`] = [
            [
            {
                "count": TraderPrice,
                "_tpl": MoneyID
            }]
        ]

        // add trader loyalty requirement
        database.traders[TraderID].assort.loyal_level_items[`${ItemID}_${TraderID}_${MoneyID}_${TraderPrice}_${TraderLvl}_offer`] = TraderLvl;
    }
	
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
	
	static CopyTradeOffers(originalId, newItemId)
    {
		for (const trader in database.traders) {
			if (trader !== "ragfair") {
				for (const offer in database.traders[trader].assort.items) {
					if (database.traders[trader].assort.items[offer]._tpl === originalId && database.traders[trader].assort.items[offer].parentId === "hideout" ) {
						let newOffer = jsonUtil.clone(database.traders[trader].assort.items[offer]);
						newOffer._id = `${database.traders[trader].assort.items[offer]._id}_${newItemId}_${trader}`;
						newOffer._tpl = newItemId;
						database.traders[trader].assort.items.push(newOffer)
						
						let newPrice = jsonUtil.clone(database.traders[trader].assort.barter_scheme[database.traders[trader].assort.items[offer]._id]);
						database.traders[trader].assort.barter_scheme[`${database.traders[trader].assort.items[offer]._id}_${newItemId}_${trader}`] = newPrice;
						
						let newLoaylty = jsonUtil.clone(database.traders[trader].assort.loyal_level_items[database.traders[trader].assort.items[offer]._id]);
						database.traders[trader].assort.loyal_level_items[`${database.traders[trader].assort.items[offer]._id}_${newItemId}_${trader}`] = newLoaylty;
					}
				}
			}
		}
    }
	
	*/
}