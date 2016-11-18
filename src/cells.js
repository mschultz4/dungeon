"use strict";


const TREE = {
	type: "tree",
	display: function () { return '\u1F534'; },
	weapon: null,
	health: null,
	block: true
};


const EMPTY = {
	type: 'empty',
	display: function () { return ''; },
	weapon: null,
	health: null,
	block: false
};


const PLAYER = {
	type: 'player',
	display: function () { return 'P'; },
	weapon: { name: 'sword', strength: 10 },
	health: 10,
	level: 1,
	currentPosition: { y: 10, x: 15 },
	collectItem: function (item) {
    	switch (item.type) {
        	case 'heart':
            	this.health = this.health < 10 ? this.health + 1 : this.health;
            	break;
        	case 'weapon':
            	this.weapon = item.weapon;
            	break;
    	}
	},
	fight: function(monster) {
    	let result = true;


    	while (this.health > 0 && monster.health > 0) {
        	monster.health -= Math.floor(Math.random() * this.weapon.strength);


        	if (monster.health > 0) {
            	this.health -= Math.floor(Math.random() * monster.weapon.strength);
        	}
    	}
    	return this.health > 0 ? true : false;
	}
}
const HEART = {
	type: 'heart',
	display: function () { return 'h'; },
	block: false
};


const AXE = {
	type: 'weapon',
	display: function () { return 'a'; },
	block: false,
	weapon: { name: 'axe', strength: 4 }
};


const BAT = {
	type: 'weapon',
	display: function () { return 'b'; },
	weapon: { name: 'bat', strength: 3 },
	block: false
};


/*module.exports = {
	getTree: () =>  TREE,
	getPlayer: () => player,
	getRandom: getRandom
}*/


function getRandom() {
	let i = Math.ceil(Math.random() * 100);


	if (i < 5) return getMonster();
	if (i >= 10 && i < 20) return TREE;
	if (i >= 20 && i < 25) return HEART;
	if (i >= 25 && i < 28) return BAT;
	if (i >= 28 && i < 33) return AXE;
	if (i >= 33 && i < 38) return HEART;


	return EMPTY;
}


function getMonster() {
	return {
    	type: "monster",
    	display: function () { return this.health > 0 ? 'm' : 'Q'; },
    	weapon: { name: 'claws', strength: Math.ceil(Math.random() * 10) },
    	health: 10,
    	block: true
	};
}
