import {Persist, Persistor} from '../../main/ts/persist';
import * as assert from 'assert';
import * as sinon from 'sinon';

class Foo {
	
	@Persist
	member1: string;
	
	@Persist
	member2: string;
}

describe ('Persist', function () {

	it ('should have added metadata', function () {
		const metadata = Reflect.getMetadata('PERSIST_STRUCTURE', new Foo());
		assert.ok(metadata);
	});
	
	it ('should have added the name of the class', function () {
		const metadata = Reflect.getMetadata('PERSIST_STRUCTURE', new Foo());
		assert.equal(metadata.name, 'Foo');
	});
	
	it ('should have added the properties', function () {
		const metadata = Reflect.getMetadata('PERSIST_STRUCTURE', new Foo());
		assert.equal(metadata.members.length, 2);
		assert.equal(metadata.members[0], 'member1');
		assert.equal(metadata.members[1], 'member2');
	});
});

describe ('Persistor.persist', function () {
	
	let localStorageMock: typeof localStorage;
	let persistor: Persistor;
	
	beforeEach (function () {
		localStorageMock = <any>{};
		persistor = new Persistor(localStorageMock);
	});
	
	it ('should persist to local storage', function () {
		const setItemSpy = sinon.spy();
		localStorageMock.setItem = setItemSpy;
		const f = new Foo();
		f.member1 = 'bar';
		f.member2 = 'baz';
		persistor.persist(f);
		assert(setItemSpy.alwaysCalledWithMatch('Foo', '{"member1":"bar","member2":"baz"}'));
	});
});

describe ('Persistor.load', function () {
	
	let localStorageMock: typeof localStorage;
	let persistor: Persistor;
	
	beforeEach (function () {
		localStorageMock = <any>{};
		persistor = new Persistor(localStorageMock);
	});
	
	it ('should load data from local storage', function () {
		const getItemMock = sinon.mock().returns('{"member1":"ok","member2":"ko"}');
		localStorageMock.getItem = getItemMock;
		const f = new Foo();
		persistor.load(f);
		assert.equal(f.member1, 'ok');
		assert.equal(f.member2, 'ko');
	});
});
