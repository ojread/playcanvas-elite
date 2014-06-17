pc.script.create('planet', function (context) {
	var planet = function (entity) {
		this.entity = entity;
	};

	planet.prototype = {

		initialize: function () {

			var device = context.graphicsDevice;
			var radius = 0.5;
			var latitudeBands = 64;
			var longitudeBands = 64;
			var lon, lat;
			var theta, sinTheta, cosTheta, phi, sinPhi, cosPhi;
			var first, second;
			var x, y, z, u, v;
			var positions = [];
			var normals = [];
			var uvs = [];
			var indices = [];
			for (lat = 0; lat <= latitudeBands; lat++) {
				theta = lat * Math.PI / latitudeBands;
				sinTheta = Math.sin(theta);
				cosTheta = Math.cos(theta);
				for (lon = 0; lon <= longitudeBands; lon++) {
					phi = (lon * 2 * Math.PI / longitudeBands - Math.PI / 2);
					var rand = Math.random() * 0.05 + 1;
					sinPhi = Math.sin(phi);
					cosPhi = Math.cos(phi);
					x = cosPhi * sinTheta * rand;
					y = cosTheta * rand;
					z = sinPhi * sinTheta * rand;
					u = 1 - lon / longitudeBands;
					v = 1 - lat / latitudeBands;
					positions.push(x * radius, y * radius, z * radius);
					normals.push(x, y, z);
					uvs.push(u, v);
				}
			}
			for (lat = 0; lat < latitudeBands; ++lat) {
				for (lon = 0;lon < longitudeBands;++lon) {
					first = lat * (longitudeBands + 1) + lon;
					second = first + longitudeBands + 1;
					indices.push(first + 1, second, first);
					indices.push(first + 1, second + 1, second);
				}
			}
			var options = {normals:normals, uvs:uvs, indices:indices};
			if (pc.gfx.precalculatedTangents) {
				options.tangents = pc.scene.procedural.calculateTangents(positions, normals, uvs, indices);
			}
			var mesh = (pc.scene.procedural.createMesh(device, positions, options));
			var node = new pc.scene.GraphNode();
			var material = new pc.scene.PhongMaterial();
			material.opacity = 0.5;
			var meshInstance = new pc.scene.MeshInstance(node, mesh, material);
			var model = new pc.scene.Model();
			model.graph = node;
			model.meshInstances = [ meshInstance ];
			this.entity.addChild(node);
			app.context.scene.addModel(model);

		},

		update: function (dt) {

		}
	};

	return planet;
});