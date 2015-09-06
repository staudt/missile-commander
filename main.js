(function () {
	"use strict";
	var CommandEnum = com.dgsprb.quick.CommandEnum;
	var Quick = com.dgsprb.quick.Quick;
	var GameObject = com.dgsprb.quick.GameObject;
	var Scene = com.dgsprb.quick.Scene;

	var gameScene;
	var buildings = [];	// use tiles intead?

	function fireMissile(targetX, targetY) {
		var target = new GameObject();
		target.setPosition(targetX, targetY);
		target.setColor("White");
		target.setSize(3);
		target.setExpiration(60);
		gameScene.add(target);
		var missile = new GameObject();
		missile.setPosition(Quick.getCanvasCenterX(), Quick.getCanvasHeight()-20);
		missile.setColor("Red");
		missile.targetX = targetX;
		missile.targetY = targetY;
		missile.setSolid();
		missile.setSize(4);
		missile.setExpiration(60);
		missile.setSpeedToPoint(10, target);
		missile.setDelegate({
			"update": function() {
				if (missile.getY()<=missile.targetY) {
					missile.expire();
					target.expire();
					createExplosion(missile.targetX, missile.targetY);
				}
			},
			"onCollision": function(gameObject) {
				if (gameObject.hasTag("meteor")) {
					gameObject.expire();
					missile.expire();
					createExplosion(missile.getX(), missile.getY());
				}
			}
		});
		gameScene.add(missile);
	}

	function createExplosion(x, y) {
		var explosion = new GameObject();
		explosion.setColor("Red");
		explosion.setSolid();
		explosion.addTag("explosion");
		explosion.setPosition(x, y);
		explosion.setExpiration(70);
		explosion.setDelegate({
			"update": function() {
				var center = explosion.getCenter();
				explosion.increase(1, 1);
				explosion.setCenter(center.getX(), center.getY());
			}
		});
		gameScene.add(explosion);
	}

	function createMeteor() {
		var meteor = new GameObject();
		meteor.setSize(6);
		meteor.setColor("Yellow");
		meteor.setSolid();
		meteor.addTag("meteor");
		meteor.setX(Quick.random(Quick.getCanvasWidth())+1);
		var target = buildings[Quick.random(buildings.length-1)].getCenter();
		meteor.setSpeedToPoint(Quick.random(2)+1, target);
		meteor.setExpiration(1000);
		meteor.setDelegate({
			"onCollision": function(gameObject) {
				if (gameObject.hasTag("building")) {
					gameObject.expire();
					meteor.expire();
					createExplosion(gameObject.getX(), gameObject.getY());
				} else if (gameObject.hasTag("explosion")) {
					meteor.expire();
				} else if (gameObject.hasTag("meteor")) {
					meteor.bounceX();
				}
			},
			"update": function() {
				if (Quick.random(6)==0) {
					var trail = new GameObject();
					trail.setSize(4);
					trail.setColor("Gray");
					trail.setPosition(meteor.getX(), meteor.getY());
					trail.setExpiration(40);
					meteor.setLayerIndex(0);
					gameScene.add(trail);
				}
				if (meteor.getY() > Quick.getCanvasHeight())
					meteor.expire();
			},
			"offBoundary": function() {
				meteor.expire();
			}
		});
		gameScene.add(meteor);

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

		for (var i=0; i<7; i++) {
			var building  = new GameObject();
			building.setSize(20);
			building.setColor(i==3 ? "Orange" : "Green");
			building.setSolid();
			building.addTag("building");
			building.setPosition((Quick.getCanvasWidth()/8)*(i+1), Quick.getCanvasHeight()-20);
			gameScene.add(building);
			buildings.push(building);
		}
		
		var pointer = Quick.getPointer() 
		var cursor = new GameObject();
		cursor.setColor("Orange");
		cursor.setSize(5);
		cursor.setCenter(cursor.getCenter());
		cursor.setDelegate({
			"update" : function() {
				var position = pointer.getPosition();
				cursor.setPosition(position.getX(), position.getY());
				if (pointer.getPush())
					//createExplosion(position.getX(), position.getY());
					fireMissile(position.getX(), position.getY());
				if (Quick.random(30)==0)
					createMeteor()
			}
		});
		gameScene.add(cursor);
	}
	main();
})();
