var vs = document.getElementById('vertexShader');
console.log('vs', vs);

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

app.context.scene.ambientLight = new pc.Color(0.4, 0.4, 0.4);

// Create a Entity with a Box model component
/*var box = new pc.fw.Entity();
app.context.systems.model.addComponent(box, {
	type: 'box',
});
// Add a script to the box.
app.context.systems.script.addComponent(box, {
	scripts: [
		{url: 'spin.js', name: 'spin'}
	]
});*/


// Create an Entity with a point light component and a sphere model component.
var light = new pc.fw.Entity();
app.context.systems.light.addComponent(light, {
	type: 'point',
	color: new pc.Color(1, 1, 1),
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

// Create a starry skybox.
var skybox = new pc.fw.Entity('skybox');
app.context.assets.loadFromUrl('assets/skybox/stars.png', 'texture').then(
	function (results) {
		var id = results.asset.resourceId;
		app.context.systems.skybox.addComponent(skybox, {
			negx: id,
			negy: id,
			negz: id,
			posx: id,
			posy: id,
			posz: id
		});
	}
);

// Create a plane.
/*var plane = new pc.fw.Entity('plane');
var planeMesh = pc.scene.procedural.createSphere(app.context.graphicsDevice, {
	latitudeBands: 64,
	longitudeBands: 64
});
var node = new pc.scene.GraphNode();
var material = new pc.scene.PhongMaterial();
var meshInstance = new pc.scene.MeshInstance(node, planeMesh, material);
var model = new pc.scene.Model();
model.graph = node;
model.meshInstances = [ meshInstance ];
plane.addChild(node);
app.context.scene.addModel(model);

console.log(pc.scene.procedural.createSphere);

plane.rotate(45, 45, 45);*/



// Create a planet.
var planet = new pc.fw.Entity('planet');
app.context.systems.script.addComponent(planet, {
	scripts: [
		{url: 'planet.js', name: 'planet'}
	]
});


// Add the new Entities to the hierarchy
//app.context.root.addChild(box);
app.context.root.addChild(light);
app.context.root.addChild(player);
app.context.root.addChild(skybox);
//app.context.root.addChild(plane);
app.context.root.addChild(planet);

player.translate(0, 0, 1);

// Start the update loop.
app.start();