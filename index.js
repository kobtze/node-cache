'use strict';

class Cache {
	constructor(maxItems) {
		this.maxItems = maxItems;
		this.currentSize = 0;
		this.head = null; // most recently used
		this.tail = null; // least recently used
		this.cache = {};
	}
	set(key, value) {
		// Create a new node (or rewrite it!)
		this.cache[key] = new linkedListNode(value, null, this.head);
		
		// If head exists link to incoming key
		if (this.head)
			this.cache[this.head].next = key;

		// Always update head
		this.head = key;

		// If no tail set it
		if (!this.tail)
			this.tail = key;
		
		// if reached maxItems, destroy tail
		if (++this.currentSize > this.maxItems) {
			// get current tail
			let currentTail = this.tail;
			// update tail to next
			this.tail = this.cache[currentTail].next;
			// remove prev from last node
			this.cache[this.tail].prev = null;
			// delete last tail
			delete this.cache[currentTail];
			// decrease currentSize
			this.currentSize--;
		}
	}
	get(key) {
		if (!this.cache[key])
			return undefined;
		// copy the current state
		let thisBefore    = {...this};
		let thisAfter     = {...this};
		const lastTailKey = thisBefore.tail;
		const lastTailsNextKey = thisBefore.cache[lastTailKey].next;
		const lastHeadKey = thisBefore.head;
		let lastTail      = thisAfter.cache[lastTailKey];
		let lastTailsNext = thisAfter.cache[lastTail.next];
		let lastHead      = thisAfter.cache[lastHeadKey]

		// Always update head
		thisAfter.head = key;
		
		// If key=tail
		if (key === thisBefore.tail) {
			// update 'globals'
			thisAfter.tail = lastTail.next;
			// update last tail node
			lastTail.next = null;
			lastTail.prev = lastHeadKey;
			// update last tail's next node
			lastTailsNext.prev = null;
			// update last head node
			lastHead.next = lastTailKey;
		}
		// else (key!=head && key!=tail)
		if (key !== thisBefore.head && key !== thisBefore.tail) {
			// update last tail
			lastTail.next = thisBefore.cache[lastTailsNextKey].next;
			// update last tail's next
			lastTailsNext.next = null;
			lastTailsNext.prev = thisBefore.head;
			// update last head
			lastHead.next = key;
			lastHead.prev = thisBefore.tail;
		}

		this.cache = thisAfter.cache;
		this.head = thisAfter.head;
		this.tail = thisAfter.tail;	
		return this.cache[key];
	}
	toObject() {
		return this
	}
}

class linkedListNode {
	constructor(value, next, prev) {
		this.value = value;
		this.next = next;
		this.prev = prev;
	}
}

let c1 = new Cache(4);
c1.set('a', 'Hello');
c1.set('b', 'Hi');
c1.set('c', 'Shalom');
c1.set('d', 'Calimera');
console.log(c1.get('a')); // expected: 'Hello'
c1.set('e', 'Sayonara');
console.log(c1.get('c')); // expected: 'Shalom'
console.log(c1.get('b')); // expected: undefined
console.dir(c1.toObject()) // expected {d=>a=>e=>c}