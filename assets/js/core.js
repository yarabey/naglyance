$(document).ready(function(){
	var menu = $('ul.main-menu'),
		menu_items = $('li', menu);
	var maxCompatible = {length: 0, el: null};
	for(var i=0; i<menu_items.length; i++){
		var el = menu_items[i],
			href = $('a', el).attr('href');
		if (window.location.pathname.indexOf(href) === 0){
			if (maxCompatible.length < href.length){
				maxCompatible.length = href.length;
				maxCompatible.el = el;
			}
		}
	}
	if (maxCompatible.el)
		$(maxCompatible.el).addClass('active');

	$('*[data-toggle="tooltip"]').tooltip();
});

var app = {};
app.require = function(s){
	var paths = s.split('.');
	var currentObject = app;
	for(var i = 0, max = paths.length; i < max; i++){
		var el = paths[i];
		if (currentObject[el] == null){
			currentObject[el] = {};
			currentObject[el].require = app.require.bind(currentObject[el]);
		}
		currentObject = currentObject[el];
	}
	return currentObject;
};

(function(app){

	var utils = app.require('utils'),
		loading = app.require('utils.loading'),
		classes = app.require('utils.Classes');

	utils.extend = function(cl){
		var F = function() {};
		F.prototype = cl.prototype;
		var Obj = new F();
		Obj.proto = function() {
			return cl.prototype;
		}
		return Obj;
	};

	utils.request = function(utl, data, method, callback){
		if (method.toLowerCase() === 'get'){
			$.getJSON(utl, data,function(response){
				if (!response.status){
					callback(response.error);
					return;
				}
				var data = response.response;
				callback(null, data);
			}).error(function(jqXHR, textStatus){
				callback(textStatus);
			});
		}else{
			$.ajax({
				url: utl,
				type: method,
				data: data,
				dataType: "json"
			}).done(function(response){
					if (!response.status){
						callback(response.error);
						return;
					}
					var data = response.response;
					callback(null, data);
				}).fail(function(jqXHR, textStatus){ callback(textStatus); });
		}
	};

	utils.getFormData = function(form){
		var input, type, names, value, target, temp, model = {},
			inputs = $("input, textarea, select", form);
		inputs.each(function() {
			input = $(this);
			type = input.attr("type");
			switch(type) {
				case "checkbox":
					value = input.is(':checked') ? true : false;
					break;
				case "radio":
					if(input.attr("checked")) value = input.val();
					else return;
					break;
				default :
					value = input.val();
					break;
			}
			names = input.attr("name").split(".");
			var namesMaxIndex = names.length - 1;
			target = model;
			names.forEach(function(name, i) {
				if(i === namesMaxIndex) {
					target[name] = value;
				} else {
					temp = target[name];
					if(temp) target = temp;
					else target = target[name] = {};
				}
			});
		});
		return model;
	};

	utils.showError = function(err){
		var text = "";
		if (typeof err === "object"){
			if (err.code) text += "#" + err.code + " ";
			if (err.title) text += "'" + err.title + "' ";
			if (err.message) text += err.message;
		}else{
			text = err;
		}
		noty({type: "error", text: text, timeout: 5*1000, layout: 'topRight'});
	};

	utils.showSuccess = function(message){
		noty({type: "success", text: message, timeout: 2*1000, layout: 'topRight'});
	};

	loading.show = function(message){
		message = message || "загрузка...";
		return noty({type: "alert", text: message, layout: 'topRight'});
	};

	var Events = function (){
		this.events = [];
	};

	Event.prototype.on = function(event, callback){
		if (!this.events) this.events = [];
		this.events[event] = this.events[event] || [];
		if ( this.events[event] ) {
			this.events[event].push(callback);
		}
	};

	Event.prototype.off = function(event, callback){
		if (!this.events) this.events = [];
		if ( this.events[event] ) {
			var listeners = this.events[event];
			for ( var i = listeners.length-1; i>=0; --i ){
				if ( listeners[i] === callback ) {
					listeners.splice( i, 1 );
					return true;
				}
			}
		}
		return false;
	};

	Event.prototype.trigger = function(event, data){
		if (!this.events) this.events = [];
		if (! Array.isArray(data)) data = [data];
		if ( this.events[event] ) {
			var listeners = this.events[event], len = listeners.length;
			while ( len-- ) {
				listeners[len].apply(this, data);
			}
		}
	};

	classes.Event = Event;

})(app);
