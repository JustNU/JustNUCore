import { DependencyContainer, Lifecycle } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { JustNUCore } from "./JustNUCore";


class Mod implements IPreAkiLoadMod
{
	preAkiLoad(container: DependencyContainer): void { 
		container.register("JustNUCore", JustNUCore, {lifecycle: Lifecycle.Singleton});
	}
}
	
module.exports = {mod: new Mod() }