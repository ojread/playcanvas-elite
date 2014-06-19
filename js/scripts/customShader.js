pc.script.create('custom_shader', function (context) {
	// Creates a new Custom_shader instance
	var Custom_shader = function (entity) {
		this.entity = entity;

		this.time = 0;
		this.heightMap = null;
		this.shader = null;
	};


	Custom_shader.prototype = {
		// Called once after all resources are loaded and before the first update
		initialize: function () {
			var model = this.entity.model.model;
			var gd = context.graphicsDevice;

			// Save the diffuse map from the original material before we replace it.
			this.diffuseTexture = model.meshInstances[0].material.diffuseMap;

			// A shader definition used to create a new shader.
			var shaderDefinition = {
				attributes: {
					aPosition: pc.gfx.SEMANTIC_POSITION,
					aUv0: pc.gfx.SEMANTIC_TEXCOORD0
				},
				vshader: [
					"attribute vec3 aPosition;",
					"attribute vec2 aUv0;",
					"",
					"uniform mat4 matrix_model;",
					"uniform mat4 matrix_viewProjection;",
					"",
					"varying vec2 vUv0;",
					"",
					"void main(void)",
					"{",
					"    vUv0 = aUv0;",
					"    gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);",
					"}"
				].join("\n"),
				fshader: [
					"precision " + gd.precision + " float;",
					"",
					"varying vec2 vUv0;",
					"",
					"uniform sampler2D uDiffuseMap;",
					"uniform sampler2D uHeightMap;",
					"uniform float uTime;",
					"",
					"void main(void)",
					"{",
					"    float height = texture2D(uHeightMap, vUv0).r;",
					"    vec4 color = texture2D(uDiffuseMap, vUv0);",
					"    if (height < uTime) {",
					"      discard;",
					"    }",
					"    if (height < (uTime+0.04)) {",
					"      color = vec4(0, 0.2, 1, 1.0);",
					"    }",
					"    gl_FragColor = color;",
					"}"
				].join("\n")
			};

			// Create the shader from the definition
			this.shader = new pc.gfx.Shader(gd, shaderDefinition);

			// Create a new material and set the shader
			this.material = new pc.scene.Material();
			this.material.setShader(this.shader);

			// Set the initial parameters
			this.material.setParameter('uTime', 0);
			this.material.setParameter('uDiffuseMap', this.diffuseTexture);

			// Replace the material on the model with our new material
			model.meshInstances[0].material = this.material;


			// Get the "clouds" height map from the assets and set the material to use it
			var asset = context.assets.find("clouds");
			if (asset) {
				context.assets.load(asset).then(function (results) {
					this.heightMap = results[0];
					this.material.setParameter('uHeightMap', this.heightMap);

				}.bind(this));
			}
		},

		// Called every frame, dt is time in seconds since last update
		update: function (dt) {
			this.time += dt;

			// Bounce value of t 0->1->0
			var t = (this.time % 2);
			if (t > 1) {
				t = 1 - (t - 1);
			}

			// Update the time value in the material
			this.material.setParameter('uTime', t);
		}
	};

	return Custom_shader;
});
