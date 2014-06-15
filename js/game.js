function init() {

	var canvas = document.getElementById('canvas');

	// Create the app object.
	var app = new pc.fw.Application(canvas, {
		displayLoader: true
	});

	// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
	app.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
	app.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

	window.onresize = function () {
		app.resizeCanvas();
	}

	app.context.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

	// Create a Entity with a Box model component
	var box = new pc.fw.Entity();
	app.context.systems.model.addComponent(box, {
		type: 'box',
	});
	/*app.context.systems.model.addComponent(box, {
		type: 'capsule',
		rotation: new pc.Quat(1, 1, 1, 1)
	});*/

	console.log(box);

	// Create an Entity with a point light component and a sphere model component.
	var light = new pc.fw.Entity();
	app.context.systems.light.addComponent(light, {
		type: 'point',
		color: new pc.Color(1, 0, 0),
		radius: 10
	});
	app.context.systems.model.addComponent(light, {
		type: 'sphere'
	});
	// Scale the sphere down to 0.1m
	light.setLocalScale(0.1, 0.1, 0.1);

	// Create an Entity with a camera component
	/*var camera = new pc.fw.Entity();
	app.context.systems.camera.addComponent(camera, {
		clearColor: new pc.Color(0.4, 0.45, 0.5)
	});*/


	// Create the player entity with camera.
	var player = new pc.fw.Entity();
	app.context.systems.camera.addComponent(player, {
		clearColor: new pc.Color(0.4, 0.45, 0.5)
	});
	app.context.systems.model.addComponent(player, {
		type: 'box'
	});



	// Add the new Entities to the hierarchy
	app.context.root.addChild(box);
	app.context.root.addChild(light);
	app.context.root.addChild(player);

	player.translate(0, 0, 10);

	// Get input.
	var keyboard = new pc.input.Keyboard(document);
	var mouse = new pc.input.Mouse(document);
	//var gamepads = new pc.input.GamePads();

	//var pads = gamepads.poll();
	//console.log('pads', pads);

	// I think controller is a general input device.
	//var controller = new pc.input.Controller(document)
	//contollrer.registerKeys('fire', pc.input.KEY_LEFT);
	

	// Set an update function on the app's update event
	var angle = 0;
	var speed = 2;
	var turnSpeed = 50;
	app.on('update', function (dt) {
		angle += dt;
		if (angle > 360) {
			angle = 0;
		}

		// Move the light in a circle
		light.setLocalPosition(3 * Math.sin(angle), 0, 3 * Math.cos(angle));

		// Rotate the box
		box.setEulerAngles(angle*2, angle*4, angle*8);

		if (keyboard.isPressed(pc.input.KEY_LEFT)) {
			//player.translate(-speed*dt, 0, 0);
			player.rotateLocal(0, 0, -turnSpeed*dt)
		}
		if (keyboard.isPressed(pc.input.KEY_RIGHT)) {
			//player.translate(speed*dt, 0, 0);
			player.rotateLocal(0, 0, turnSpeed*dt)
		}
		if (keyboard.isPressed(pc.input.KEY_UP)) {
			//player.translate(-speed*dt, 0, 0);
			player.rotateLocal(-turnSpeed*dt, 0, 0)
		}
		if (keyboard.isPressed(pc.input.KEY_DOWN)) {
			//player.translate(speed*dt, 0, 0);
			player.rotateLocal(turnSpeed*dt, 0, 0)
		}
	});

	// Start the update loop.
	app.start();

}

function update(dt) {

}

window.onload = init;