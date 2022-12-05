"use strict";

class JustNUCore
{
	static AddItemRetexture(db, ItemBase, NewItemID, BundlePath)
    {
        // create item
		let NewItem = JsonUtil.clone(DatabaseServer.tables.templates.items[ItemBase]);

        NewItem._id = NewItemID;
        NewItem._name = NewItemID;
        NewItem._props.Prefab.path = BundlePath;
        DatabaseServer.tables.templates.items[NewItemID] = NewItem;
		
        // handbook
        let ItemHandbook = JsonUtil.clone(DatabaseServer.tables.templates.handbook.Items.find((item) =>
        {
            return item.Id === ItemBase;
        }));

        ItemHandbook.Id = NewItem._id;
        DatabaseServer.tables.templates.handbook.Items.push(ItemHandbook);
		
		// locale
		for (const localeID in DatabaseServer.tables.locales.global)
        {
			// en placeholder
			DatabaseServer.tables.locales.global[localeID].templates[NewItemID] = JsonUtil.deserialize(VFS.readFile(`${db}locales/en.json`))[NewItemID];
			
			// actual locale
			if (VFS.exists(`${db}locales/${localeID}.json`)) {
				DatabaseServer.tables.locales.global[localeID].templates[NewItemID] = JsonUtil.deserialize(VFS.readFile(`${db}locales/${localeID}.json`))[NewItemID];
			}
        }
		
		//DatabaseServer.tables.locales.global["en"].templates[NewItemID] = JsonUtil.deserialize(VFS.readFile(`${db}locales/en.json`))[NewItemID];
		
		// add item to the ragfair
        DatabaseServer.tables.traders["ragfair"].assort.items.push({
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
        DatabaseServer.tables.traders["ragfair"].assort.barter_scheme[`${NewItemID}_ragfairOffer`] = [
            [
            {
                "count": NewItem._props.CreditsPrice,
                "_tpl": "5449016a4bdc2d6f028b456f"
            }]
        ]
		
		// add trader standing requirement
        DatabaseServer.tables.traders.ragfair.assort.loyal_level_items[`${NewItemID}_ragfairOffer`] = 1;
		
		// update filters/conflicts
		let dbItems = DatabaseServer.tables.templates.items;
		
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
        DatabaseServer.tables.traders[TraderID].assort.items.push(
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
        DatabaseServer.tables.traders[TraderID].assort.barter_scheme[`${ItemID}_${TraderID}_${MoneyID}_${TraderPrice}_${TraderLvl}_offer`] = [
            [
            {
                "count": TraderPrice,
                "_tpl": MoneyID
            }]
        ]

        // add trader loyalty requirement
        DatabaseServer.tables.traders[TraderID].assort.loyal_level_items[`${ItemID}_${TraderID}_${MoneyID}_${TraderPrice}_${TraderLvl}_offer`] = TraderLvl;
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
		
		DatabaseServer.tables.locations[map].base.SpawnPointParams.push(spawnPoint)
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
		
		DatabaseServer.tables.locations[map].base.SpawnPointParams.push(spawnPoint)
	}
	
	static AddTop(db, OutfitID, TopBundlePath, HandsBundlePath, handsBaseID)
	{
		// add top
		let NewTop = JsonUtil.clone(DatabaseServer.tables.templates.customization["5d28adcb86f77429242fc893"]);

        NewTop._id = OutfitID;
        NewTop._name = OutfitID;
        NewTop._props.Prefab.path = TopBundlePath;
        DatabaseServer.tables.templates.customization[OutfitID] = NewTop;
		
		// add hands
		let NewHands = JsonUtil.clone(DatabaseServer.tables.templates.customization[handsBaseID]);

        NewHands._id = `${OutfitID}Hands`;
        NewHands._name = `${OutfitID}Hands`;
        NewHands._props.Prefab.path = HandsBundlePath;
        DatabaseServer.tables.templates.customization[`${OutfitID}Hands`] = NewHands;
		
		// add suite
		let NewSuite = JsonUtil.clone(DatabaseServer.tables.templates.customization["5d1f623e86f7744bce0ef705"]);

        NewSuite._id = `${OutfitID}Suite`;
        NewSuite._name = `${OutfitID}Suite`;
		NewSuite._props.Body = OutfitID;
		NewSuite._props.Hands = `${OutfitID}Hands`;
		NewSuite._props.Side = ["Usec", "Bear", "Savage"];
        DatabaseServer.tables.templates.customization[`${OutfitID}Suite`] = NewSuite;
		
		// locale
		for (const localeID in DatabaseServer.tables.locales.global)
        {
            // en placeholder
			DatabaseServer.tables.locales.global[localeID].templates[`${OutfitID}Suite`] = JsonUtil.deserialize(VFS.readFile(`${db}locales/en.json`))[OutfitID];
			
			// actual locale
			if (VFS.exists(`${db}locales/${localeID}.json`)) {
				DatabaseServer.tables.locales.global[localeID].templates[`${OutfitID}Suite`] = JsonUtil.deserialize(VFS.readFile(`${db}locales/${localeID}.json`))[OutfitID];
			}
        }
		
		// add suite to the ragman
		DatabaseServer.tables.traders["5ac3b934156ae10c4430e83c"].suits.push({
			"_id": OutfitID,
			"tid": "5ac3b934156ae10c4430e83c",
			"suiteId": `${OutfitID}Suite`,
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
	
	static AddBottom(db, OutfitID, BundlePath)
	{
		// add Bottom
		let NewBottom = JsonUtil.clone(DatabaseServer.tables.templates.customization["5d5e7f4986f7746956659f8a"]);

        NewBottom._id = OutfitID;
        NewBottom._name = OutfitID;
        NewBottom._props.Prefab.path = BundlePath;
        DatabaseServer.tables.templates.customization[OutfitID] = NewBottom;
		
		// add suite
		let NewSuite = JsonUtil.clone(DatabaseServer.tables.templates.customization["5cd946231388ce000d572fe3"]);

        NewSuite._id = `${OutfitID}Suite`;
        NewSuite._name = `${OutfitID}Suite`;
		NewSuite._props.Feet = OutfitID;
		NewSuite._props.Side = ["Usec", "Bear", "Savage"];
        DatabaseServer.tables.templates.customization[`${OutfitID}Suite`] = NewSuite;
		
		// locale
		for (const localeID in DatabaseServer.tables.locales.global)
        {
            // en placeholder
			DatabaseServer.tables.locales.global[localeID].templates[`${OutfitID}Suite`] = JsonUtil.deserialize(VFS.readFile(`${db}locales/en.json`))[OutfitID];
			
			// actual locale
			if (VFS.exists(`${db}locales/${localeID}.json`)) {
				DatabaseServer.tables.locales.global[localeID].templates[`${OutfitID}Suite`] = JsonUtil.deserialize(VFS.readFile(`${db}locales/${localeID}.json`))[OutfitID];
			}
        }
		
		// add suite to the ragman
		DatabaseServer.tables.traders["5ac3b934156ae10c4430e83c"].suits.push({
			"_id": OutfitID,
			"tid": "5ac3b934156ae10c4430e83c",
			"suiteId": `${OutfitID}Suite`,
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
	
	static CopyTradeOffers(originalId, newItemId)
    {
		for (const trader in DatabaseServer.tables.traders) {
			if (trader !== "ragfair") {
				for (const offer in DatabaseServer.tables.traders[trader].assort.items) {
					if (DatabaseServer.tables.traders[trader].assort.items[offer]._tpl === originalId && DatabaseServer.tables.traders[trader].assort.items[offer].parentId === "hideout" ) {
						let newOffer = JsonUtil.clone(DatabaseServer.tables.traders[trader].assort.items[offer]);
						newOffer._id = `${DatabaseServer.tables.traders[trader].assort.items[offer]._id}_${newItemId}_${trader}`;
						newOffer._tpl = newItemId;
						DatabaseServer.tables.traders[trader].assort.items.push(newOffer)
						
						let newPrice = JsonUtil.clone(DatabaseServer.tables.traders[trader].assort.barter_scheme[DatabaseServer.tables.traders[trader].assort.items[offer]._id]);
						DatabaseServer.tables.traders[trader].assort.barter_scheme[`${DatabaseServer.tables.traders[trader].assort.items[offer]._id}_${newItemId}_${trader}`] = newPrice;
						
						let newLoaylty = JsonUtil.clone(DatabaseServer.tables.traders[trader].assort.loyal_level_items[DatabaseServer.tables.traders[trader].assort.items[offer]._id]);
						DatabaseServer.tables.traders[trader].assort.loyal_level_items[`${DatabaseServer.tables.traders[trader].assort.items[offer]._id}_${newItemId}_${trader}`] = newLoaylty;
					}
				}
			}
		}
    }
}

module.exports = JustNUCore;