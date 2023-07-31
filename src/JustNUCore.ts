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
	
	public addTop(outfitId, topBundlePath, handsBundlePath, handsBaseID, traderId, loyaltyLevel, profileLevel, standing, currencyId, price): void
	{
		// const
		const database = this.databaseServer.getTables();
		const jsonUtil = this.jsonUtil;
		const VFS = this.VFS;
		
		// add top
		const newTop = jsonUtil.clone(database.templates.customization["5d28adcb86f77429242fc893"]);

		newTop._id = outfitId;
		newTop._name = outfitId;
		newTop._props.Prefab.path = topBundlePath;
		database.templates.customization[outfitId] = newTop;
		
		// add hands
		const newHands = jsonUtil.clone(database.templates.customization[handsBaseID]);

		newHands._id = `${outfitId}Hands`;
		newHands._name = `${outfitId}Hands`;
		newHands._props.Prefab.path = handsBundlePath;
		database.templates.customization[`${outfitId}Hands`] = newHands;
		
		// add suite
		const newSuite = jsonUtil.clone(database.templates.customization["5d1f623e86f7744bce0ef705"]);

		newSuite._id = `${outfitId}Suite`;
		newSuite._name = `${outfitId}Suite`;
		newSuite._props.Body = outfitId;
		newSuite._props.Hands = `${outfitId}Hands`;
		newSuite._props.Side = ["Usec", "Bear", "Savage"];
		database.templates.customization[`${outfitId}Suite`] = newSuite;
		
		// set customization seller to true
		database.traders[traderId].base.customization_seller = true;
		
		// check if suits array exists, create it if its not
		if (!database.traders[traderId].suits) {
			database.traders[traderId].suits = [];
		}
		
		// add suite to the trader
		database.traders[traderId].suits.push({
			"_id": outfitId,
			"tid": traderId,
			"suiteId": `${outfitId}Suite`,
			"isActive": true,
			"requirements": {
				"loyaltyLevel": loyaltyLevel,
				"profileLevel": profileLevel,
				"standing": standing,
				"skillRequirements": [],
				"questRequirements": [],
				"itemRequirements": [
					{
						"count": price,
						"_tpl": currencyId
					}
				]
			}
		});
	}
	
	public addBottom(outfitId, bundlePath, traderId, loyaltyLevel, profileLevel, standing, currencyId, price): void
	{
		// const
		const database = this.databaseServer.getTables();
		const jsonUtil = this.jsonUtil;
		const VFS = this.VFS;
		
		// add Bottom
		const newBottom = jsonUtil.clone(database.templates.customization["5d5e7f4986f7746956659f8a"]);

		newBottom._id = outfitId;
		newBottom._name = outfitId;
		newBottom._props.Prefab.path = bundlePath;
		database.templates.customization[outfitId] = newBottom;
		
		// add suite
		const newSuite = jsonUtil.clone(database.templates.customization["5cd946231388ce000d572fe3"]);

		newSuite._id = `${outfitId}Suite`;
		newSuite._name = `${outfitId}Suite`;
		newSuite._props.Feet = outfitId;
		newSuite._props.Side = ["Usec", "Bear", "Savage"];
		database.templates.customization[`${outfitId}Suite`] = newSuite;
		
		// set customization seller to true
		database.traders[traderId].base.customization_seller = true;
		
		// check if suits array exists, create it if its not
		if (!database.traders[traderId].suits) {
			database.traders[traderId].suits = [];
		}
		
		// add suite to the trader
		database.traders[traderId].suits.push({
			"_id": outfitId,
			"tid": traderId,
			"suiteId": `${outfitId}Suite`,
			"isActive": true,
			"requirements": {
				"loyaltyLevel": loyaltyLevel,
				"profileLevel": profileLevel,
				"standing": standing,
				"skillRequirements": [],
				"questRequirements": [],
				"itemRequirements": [
					{
						"count": price,
						"_tpl": currencyId
					}
				]
			}
		});
	}

	public addItemRetexture(itemId, baseItemID, bundlePath, copyAssort, addToBots, weightingMult): void
	{
		// const
		const database = this.databaseServer.getTables();
		const jsonUtil = this.jsonUtil;
		const dbItems = database.templates.items;
		
		
		// copy item from DB, change it's data and add it to database
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
							if (database.traders[trader].assort.items[offer]._tpl === copyItemID && database.traders[trader].assort.items[offer].parentId === "hideout") {
								// skip the offer if its a quest unlock
								if (database.traders[trader].questassort) {
									if (database.traders[trader].questassort.success[offer]) {
										continue;
									}
								}
								
								
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
}