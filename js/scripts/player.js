pc.script.create('player', function (context) {
	var player = function (entity) {
		this.entity = entity;
	};

	player.prototype = {

		vel: pc.Vec3.ZERO,
		//speed: 0,
		maxSpeed: 1,
		acceleration: 0.1,
		turnSpeed: 50,

		initialize: function () {
			//console.log(this.entity);
		},

		update: function (dt) {
			if (context.controller.isPressed('left')) {
				this.entity.rotateLocal(0, 0, this.turnSpeed*dt);
			}
			if (context.controller.isPressed('right')) {
				this.entity.rotateLocal(0, 0, -this.turnSpeed*dt);
			}
			if (context.controller.isPressed('up')) {
				this.entity.rotateLocal(-this.turnSpeed*dt, 0, 0);
			}
			if (context.controller.isPressed('down')) {
				this.entity.rotateLocal(this.turnSpeed*dt, 0, 0);
			}

			if (context.controller.isPressed('accelerate')) {
				this.vel.add(this.entity.forward.scale(this.acceleration*dt));
				/*if (this.vel.length > this.maxSpeed) {
					this.vel = this.maxSpeed;
				}*/
			}
			if (context.controller.isPressed('decelerate')) {
				this.vel.add(this.entity.forward.scale(-this.acceleration*dt));
				/*if (this.vel.length > this.maxSpeed) {
					this.vel = this.maxSpeed;
				}*/
			}
			this.entity.translate(this.vel);



		}
	};

	return player;
});