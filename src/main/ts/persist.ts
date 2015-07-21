const PERSIST_STRUCTURE = 'PERSIST_STRUCTURE';

interface PersistedStructure {
	name: string;
	members: string[];
}

interface PersistedMap {
	[key: string]: any;
}

export function Persist (target: Object, propertyKey: string) {
	initMetadata(target);
	addMemberToMetadata(target, propertyKey);
}

export class Persistor {
	
	constructor (private _localStorage: typeof localStorage) {}
	
	persist (target: any): void {
		this._localStorage.setItem(getMetadata(target).name, JSON.stringify(objectToDataToPersist(target)));
	}
	
	load (target: any): void {
		const persistedData: PersistedMap = JSON.parse(this._localStorage.getItem(getMetadata(target).name));
		Object.keys(persistedData).forEach(key => {
			target[key] = persistedData[key];
		});
	}
}

function getMetadata(target: any): PersistedStructure {
	return Reflect.getMetadata(PERSIST_STRUCTURE, target);
}

function initMetadata(target: any): void {
	if (!Reflect.hasMetadata(PERSIST_STRUCTURE, target)) {
		const className = (<any>target.constructor).name;
		Reflect.defineMetadata(PERSIST_STRUCTURE, {name: className, members: []}, target);
	}
}

function addMemberToMetadata(target: any, memberName: string): void {
	getMetadata(target).members.push(memberName);
}

function objectToDataToPersist(target: any): PersistedMap {
	return getMetadata(target).members.reduce((prev: PersistedMap, key: string) => {
			prev[key] = target[key];
			return prev;
		}, <PersistedMap>{});
}
