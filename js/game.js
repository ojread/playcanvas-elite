var game = {

	angle: 0,
	box: null,

	init: function () {
		var canvas = document.getElementById('canvas');

		// Create the app and start the update loop
		var app = new pc.fw.Application(canvas);
		app.start();

		// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
		app.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
		app.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

		// Resize canvas with the window.
		window.onresize = function() {
			app.resizeCanvas();
		};

		app.context.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

		// Create a Entity with a Box model component
		this.box = new pc.fw.Entity();
		app.context.systems.model.addComponent(this.box, {
			type: 'box',
		});

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
		var camera = new pc.fw.Entity();
		app.context.systems.camera.addComponent(camera, {
			clearColor: new pc.Color(0.4, 0.45, 0.5)
		});

		// Add the new Entities to the hierarchy
		app.context.root.addChild(this.box);
		app.context.root.addChild(light);
		app.context.root.addChild(camera);

		// Move the camera 10m along the z-axis
		camera.translate(0, 0, 10);

		// Set an update function on the app's update event
		//var angle = 0;
		app.on('update', function (delta) {
			//game.update();

			//console.log(this.angle);
			this.angle += delta;
			if (this.angle > 360) {
				this.angle = 0;
			}

			// Move the light in a circle
			//light.setLocalPosition(3 * Math.sin(this.angle), 0, 3 * Math.cos(this.angle));

			// Rotate the box
			if (this.box) {
				this.box.setEulerAngles(this.angle*2, this.angle*4, this.angle*8);
				//console.log(this.box);
			}

		});
	},

	update: function (delta) {
		//console.log(this.angle);
		this.angle += delta;
		if (this.angle > 360) {
			this.angle = 0;
		}

		// Move the light in a circle
		//light.setLocalPosition(3 * Math.sin(this.angle), 0, 3 * Math.cos(this.angle));

		// Rotate the box
		if (this.box) {
			this.box.setEulerAngles(this.angle*2, this.angle*4, this.angle*8);
			//console.log(this.box);
		}
	}
};

window.onload = function () {
	//game = new Game();
	game.init();
}