pc.script.create('spin', function (context) {
	var spin = function (entity) {
		this.entity = entity;
	};

	spin.prototype = {

		initialize: function () {

		},

		update: function (dt) {
			//this.entity.rotate(2*dt, 4*dt, 8*dt);

			/*if (context.controller.isPressed('left')) {
				this.entity.translate(-dt, 0, 0);
			};*/

		}
	};

	return spin;
});