(function () {
	"use strict";
	var CommandEnum = com.dgsprb.quick.CommandEnum;
	var Quick = com.dgsprb.quick.Quick;
	var GameObject = com.dgsprb.quick.GameObject;
	var Scene = com.dgsprb.quick.Scene;

	var gameScene;
	var casinhas = [];

	function createExplosion(x, y) {
		var explosion = new GameObject();
		explosion.setColor("Red");
		explosion.setSolid();
		explosion.setPosition(x, y);
		explosion.max_size = 60;
		explosion.setDelegate({
			"update": function() {
				var center = explosion.getCenter();
				explosion.increase(1, 1);
				explosion.setCenter(center);
				if (explosion.getWidth()>explosion.max_size)
					explosion.expire();
			}
		});
		gameScene.add(explosion);
	}

	function main() {
		Quick.setName("Missile Commander");
		gameScene = new Scene();
		Quick.init(function () { return gameScene });
		var background = new GameObject();
		background.setColor("Black");
		background.setHeight(Quick.getCanvasHeight());
		background.setWidth(Quick.getCanvasWidth());
		gameScene.add(background);
		
		var pointer = Quick.getPointer() 
		var cursor = new GameObject();
		cursor.setColor("Orange");
		cursor.setSize(5);
		cursor.setCenter(cursor.getCenter());
		cursor.setDelegate({
			"update" : function() {
				var position = pointer.getPosition();
				cursor.setPosition(position.getX(), position.getY());
				if (pointer.getPush()) {
					createExplosion(position.getX(), position.getY());
					var meteor = new GameObject();
					meteor.setSize(6);
					meteor.setColor("Yellow");
					meteor.setSolid();
					meteor.setX(Quick.random(Quick.getCanvasWidth())+1);
					meteor.setSpeedToPoint(1, pointer.getPosition());
					meteor.setDelegate({
						"onCollision": function(gameObject) {
							console.log(gameObject);
							meteor.expire();
						}
					});
					gameScene.add(meteor);
				}
			}
		});
		gameScene.add(cursor);
	}
	main();
})();
