pc.script.create('planet', function (context) {
	var planet = function (entity) {
		this.entity = entity;
	};

	planet.prototype = {

		initialize: function () {


		// Create a shader that renders primitives with a solid red color
		/*var shaderDefinition = {
		    attributes: {
		        aPosition: pc.gfx.SEMANTIC_POSITION
		    },
		    vshader: document.getElementById('vertexShader').textContent,
		    fshader: document.getElementById('fragmentShader').textContent
		};

		var shader = new pc.gfx.Shader(context.graphicsDevice, shaderDefinition);
		*/



			// Start with a plane.

			
			noise.seed(Math.random());
			


			// Sphere algorithm taken from pc.scene.procedural.
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

			// Calc the position of each lat/lan point.
			for (lat = 0; lat <= latitudeBands; lat++) {
				theta = lat * Math.PI / latitudeBands;
				sinTheta = Math.sin(theta);
				cosTheta = Math.cos(theta);
				for (lon = 0; lon <= longitudeBands; lon++) {
					phi = (lon * 2 * Math.PI / longitudeBands - Math.PI / 2);

					// Raise point randomly.
					//var rand = Math.random() * 0.05 + 1;
					var rand = 1;//noise.simplex2(lat, lon) * 0.05 + 1;

					sinPhi = Math.sin(phi);
					cosPhi = Math.cos(phi);
					x = cosPhi * sinTheta * rand;
					y = cosTheta * rand;
					z = sinPhi * sinTheta * rand;
					u = 1 - lon / longitudeBands;
					v = 1 - lat / latitudeBands;

					// Need to finish modifying positions before pushing out.
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
			

			// Create the shader from the definition
			/*var shader = new pc.gfx.Shader(gd, shaderDefinition);

			// Create a new material and set the shader
			var material = new pc.scene.Material();
			material.setShader(this.shader);

			// Set the initial parameters
			material.setParameter('uTime', 0);
			material.setParameter('uDiffuseMap', this.diffuseTexture);
			*/



			var meshInstance = new pc.scene.MeshInstance(node, mesh, material);
			var model = new pc.scene.Model();
			model.graph = node;
			model.meshInstances = [ meshInstance ];
			this.entity.addChild(node);
			context.scene.addModel(model);


			//material.setShader(shader);

			/*var url = 'assets/test.png';
			context.assets.loadFromUrl(url, 'texture').then(function (results) {
				var texture = results.resource;
				var asset = results.asset;

				material.diffuseMap = texture;
				material.diffuseMapTiling = new pc.Vec2(0,0);

				material.heightMap = texture;

				context.scene.addModel(model);
			});*/

			/*var heightMap = new pc.gfx.Texture(device);
			heightMap.load([
				'asset/test.png',
				'asset/test.png',
				'asset/test.png',
				'asset/test.png',
				'asset/test.png',
				'asset/test.png'
			]);
			//material.heightMap = 
			*/

		},

		update: function (dt) {

		},

		getHeight: function () {
			
		}
	};

	return planet;
});



var shaderDefinition = {
    // Define the attributes variables that pull data from vertex buffers. [http://developer.playcanvas.com/engine/api/stable/symbols/pc.gfx.html]
    attributes: {
        aPosition: pc.gfx.SEMANTIC_POSITION, // vertex position
        aUv0: pc.gfx.SEMANTIC_TEXCOORD0 // UV texture co-ordinate
    },
    vshader: [
        // attributes are supplied to vertex shaders from vertex buffers
        // aPosition is the current vertex position
        // aUv0 is the UV co-ordinate at the current vertex
        "attribute vec3 aPosition;",
        "attribute vec2 aUv0;",
        "",
        // uniforms are supplied to both vertex and fragment shaders
        // matrix_model is the Model Matrix
        // matrix_viewProjection is the View Projection Matrix
        "uniform mat4 matrix_model;",
        "uniform mat4 matrix_viewProjection;",
        "",
        // varyings are variables that are set in the vertex and used in the fragment shader
        // vUv0 is the UV co-ordinate at the current vertex
        "varying vec2 vUv0;",
        "",
        // The main function in the vertex shader is called once for every vertex
        "void main(void)",
        "{",
        // pass the UV co-ordinate on to the fragment shader
        "    vUv0 = aUv0;",
        // Transform the vertex into screen space
        "    gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);",
        "}"
    ].join("\n"),
    fshader: [
        "precision " + gd.precision + " float;",
        "",
        // This is the UV co-ordinate from the vertex shader
        "varying vec2 vUv0;",
        "",
        // These uniforms are set in the main program
        // The diffuse map is the color texture that is applied to the model
        "uniform sampler2D uDiffuseMap;",
        // The height map is the cloud texture that we're using for the special effect
        "uniform sampler2D uHeightMap;",
        // This is an incrementing/decrementing value between 0-1
        "uniform float uTime;",
        "",
        // The main function in the fragment shader is called once for every pixel that could be rendered using this shader
        "void main(void)",
        "{",
        // Use the texture2D function to pull the color out of the height map at this pixel.
        // The height map is greyscale so we can use the 'red' value to get a value between 0-1 at this pixel.
        "    vec4 height = texture2D(uHeightMap, vUv0).r;",
        // By default we use the color from the diffuse texture at this pixel
        "    vec4 color = texture2D(uDiffuseMap, vUv0);",
        // When the heightmap pixel is less than the time value skip the rendering of this pixel.
        "    if (height < uTime) {",
        "      discard;",
        "    }",
        // This adds an blue border close to the areas where we discard the pixel
        "    if (height < (uTime + 0.04)) {",
        "      color = vec4(0, 0.2, 1, 1.0);",
        "    }",
        // Finally output the color of the pixel
        "    gl_FragColor = color;",
        "}"
    ].join("\n")
};
