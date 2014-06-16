var canvas = document.getElementById('canvas');

// Create the input controller.
var controller = new pc.input.Controller(document)
controller.registerKeys('left', pc.input.KEY_LEFT);
controller.registerKeys('right', pc.input.KEY_RIGHT);
controller.registerKeys('up', pc.input.KEY_UP);
controller.registerKeys('down', pc.input.KEY_DOWN);
controller.registerKeys('accelerate', pc.input.KEY_A);
controller.registerKeys('decelerate', pc.input.KEY_Z);
controller.disableContextMenu();

// Create the application.
var app = new pc.fw.Application(canvas, {
	controller: controller,
	displayLoader: false,
	scriptPrefix: 'js/scripts/'
});

// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
app.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

// Resize the canvas with the window.
window.onresize = function () {
	app.resizeCanvas();
}

app.context.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

// Create a Entity with a Box model component
var box = new pc.fw.Entity();
app.context.systems.model.addComponent(box, {
	type: 'box',
});

// Add a script to the box.
app.context.systems.script.addComponent(box, {
	scripts: [
		{url: 'spin.js', name: 'spin'}
	]
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
app.context.systems.script.addComponent(light, {
	scripts: [
		{url: 'orbit.js', name: 'orbit'}
	]
});

// Create an Entity with a camera component
/*var camera = new pc.fw.Entity();
app.context.systems.camera.addComponent(camera, {
	clearColor: new pc.Color(0.4, 0.45, 0.5)
});*/


// Create the player entity with camera.
var player = new pc.fw.Entity('player');
app.context.systems.camera.addComponent(player, {
	clearColor: new pc.Color(0.4, 0.45, 0.5)
});
app.context.systems.model.addComponent(player, {
	type: 'box'
});
app.context.systems.script.addComponent(player, {
	scripts: [
		{url: 'player.js', name: 'player'}
	]
});



// Add the new Entities to the hierarchy
app.context.root.addChild(box);
app.context.root.addChild(light);
app.context.root.addChild(player);

player.translate(0, 0, 10);

// Start the update loop.
app.start();