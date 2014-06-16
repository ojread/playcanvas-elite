pc.script.create('orbit', function (context) {
	var orbit = function (entity) {
		this.entity = entity;
	};

	orbit.prototype = {

		angle: 0,

		initialize: function () {

		},

		update: function (dt) {
			this.angle += dt;
			if (this.angle > 360) {
				this.angle = 0;
			}
			this.entity.setLocalPosition(3 * Math.sin(this.angle), 0, 3 * Math.cos(this.angle));

		}
	};

	return orbit;
});