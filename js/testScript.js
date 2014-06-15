pc.script.create('testScript', function (context) {
	var ScriptObject = function (entity) {
		this.entity = entity;
	};

	ScriptObject.prototype = {

		initialize: function () {
			console.log('script', this);
		},

		update: function (dt) {
			this.entity.translate(dt, 0, 0);
		}
	};

	return ScriptObject;
});