(function () {
	"use strict";
	var CommandEnum = com.dgsprb.quick.CommandEnum;
	var Quick = com.dgsprb.quick.Quick;
	var GameObject = com.dgsprb.quick.GameObject;
	var Scene = com.dgsprb.quick.Scene;

	var gameScene;
	var casinhas = [];	// use tiles intead?

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

	function createMeteor() {
		var meteor = new GameObject();
		meteor.setSize(6);
		meteor.setColor("Yellow");
		meteor.setSolid();
		meteor.addTag("meteor");
		meteor.setX(Quick.random(Quick.getCanvasWidth())+1);
		var target = casinhas[Quick.random(casinhas.length-1)].getCenter();
		meteor.setSpeedToPoint(Quick.random(2)+1, target);
		meteor.setExpiration(1000);
		meteor.setDelegate({
			"onCollision": function(gameObject) {
				if (gameObject.hasTag("casinha")) {
					gameObject.expire();
					createExplosion(gameObject.getX(), gameObject.getY());
				}
				meteor.expire();
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
			var casinha  = new GameObject();
			casinha.setSize(20);
			casinha.setColor(i==3 ? "Orange" : "Green");
			casinha.setSolid();
			casinha.addTag("casinha");
			casinha.setPosition((Quick.getCanvasWidth()/8)*(i+1), Quick.getCanvasHeight()-20);
			gameScene.add(casinha);
			casinhas.push(casinha);
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
					createExplosion(position.getX(), position.getY());
				if (Quick.random(30)==0)
					createMeteor()
			}
		});
		gameScene.add(cursor);
	}
	main();
})();
