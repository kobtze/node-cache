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
		if (key === thisBefore.head) {
			// no sorting of any kind
			
		} else if (key === thisBefore.tail) {
			// update 'globals'
			thisAfter.tail = lastTail.next;
			// update last tail node
			lastTail.next = null;
			lastTail.prev = lastHeadKey;
			// update last tail's next node
			lastTailsNext.prev = null;
			// update last head node
			lastHead.next = lastTailKey;

		} else if (key === thisBefore.cache[lastHeadKey].prev) {
			// if target node is one before the head
			// target node variables
			let targetNode     = thisAfter.cache[key];
			let targetNodePrev = thisAfter.cache[targetNode.prev];
			let targetNodeNext = thisAfter.cache[targetNode.next];

			// target node becomes first
			targetNode.next = null;
			targetNode.prev = lastHeadKey;

			// the node before the target node
			targetNodePrev.next = lastHeadKey;

			// the node after the target node
			targetNodeNext.next = key;


		} else if (key !== thisBefore.head && key !== thisBefore.tail) {
			// target node variables
			let targetNode     = thisAfter.cache[key];
			let targetNodePrev = thisAfter.cache[targetNode.prev];
			let targetNodeNext = thisAfter.cache[targetNode.next];

			// target node becomes first
			targetNode.next = null;
			targetNode.prev = lastHeadKey;

			// the node before the target node
			targetNodePrev.next = thisBefore.cache[key].next;

			// the node after the target node
			targetNodeNext.prev = thisBefore.cache[key].prev;
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

// let c1 = new Cache(4);
// c1.set('a', 'Hello');
// c1.set('b', 'Hi');
// c1.set('c', 'Shalom');
// c1.set('d', 'Calimera');
// console.log(c1.get('b')); // expected: undefined
// console.log(c1.get('a')); // expected: 'Hello'
// c1.set('e', 'Sayonara');
// console.log(c1.get('c')); // expected: 'Shalom'
// console.log(c1.get('b')); // expected: undefined
// console.dir(c1.toObject()) // expected {d=>a=>e=>c}
// console.dir(c1.toObject()) // expected {a=>c=>d=>b}

let c1 = new Cache(4);
c1.set('a', 'A');
c1.set('b', 'B');
c1.set('c', 'C');
c1.set('d', 'D');
c1.get('a') // b-c-d-a
c1.get('b') // c-d-a-b OK
c1.set('e', 'E'); // d-a-b-e OK
c1.get('c') // d-a-b-e OK
c1.get('b') // d-a-e-b actual: d-b-e-b / d-e-a
console.dir(c1.toObject())
