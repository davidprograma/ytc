CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y,   x+w, y+h, r);
	this.arcTo(x+w, y+h, x,   y+h, r);
	this.arcTo(x,   y+h, x,   y,   r);
	this.arcTo(x,   y,   x+w, y,   r);
	this.closePath();
	return this;
}

function genericTouchHandler(f) {
	return function (e) {
		if (e.touches.length == 1) {
			if (f(e.touches[0])) {
				e.preventDefault();
				return false;
			}
		}
	}
}

CanvasRenderingContext2D.prototype.fillEllipse = function (x, y, r) {
	this.beginPath();
	this.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
	this.fill();
}

CanvasRenderingContext2D.prototype.strokeEllipse = function (x, y, r) {
	this.beginPath();
	this.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
	this.stroke();
}

  function genericTouchHandler(f) {
	return function (e) {
		if (e.touches.length == 1) {
			if (f(e.touches[0])) {
				e.preventDefault();
				return false;
			}
		}
	}
}

function lerp(a,b,f) {
	if (f == 0)
		return a;
	else if (f==1)
		return b;

	return a * (1-f) + b * f;
}

document.addEventListener("DOMContentLoaded", function ()
{
	if (window.bc_touch_down_state === undefined)
	{
		window.bc_touch_down_state = false;
		document.addEventListener("touchstart", function(e){
			window.bc_touch_down_state = true;
		}, false);
		document.addEventListener("touchend", function(e){
			window.bc_touch_down_state = false;
		}, false);

		document.addEventListener("touchcancel", function(e){
			window.bc_touch_down_state = false;
		}, false);
	}
	
});

window.Slider = function (container_div, callback, style_prefix, default_value) {
	var container = document.createElement("div");
	container.style.width = "100%";
	container.style.height = "0";
	container.style.position = "relative";
	container.classList.add("slider_container");
	if (style_prefix)
		container.classList.add(style_prefix + "slider_container");

	var left_gutter = document.createElement("div");
	left_gutter.classList.add("slider_left_gutter");
	if (style_prefix)
		left_gutter.classList.add(style_prefix + "slider_left_gutter");

	var right_gutter = document.createElement("div");
	right_gutter.classList.add("slider_right_gutter");
	if (style_prefix)
		right_gutter.classList.add(style_prefix + "slider_right_gutter");

	left_gutter.onclick = mouse_click;
	right_gutter.onclick = mouse_click;

	var knob_container = document.createElement("div");
	knob_container.style.width = "0";
	knob_container.style.height = "0";
	knob_container.style.top = "0"
	knob_container.style.position = "absolute";

	var knob = document.createElement("div");
	knob.classList.add("slider_knob");
	if (style_prefix)
		knob.classList.add(style_prefix + "slider_knob");

	knob.onmousedown = mouse_down;
	knob.ontouchstart = genericTouchHandler(mouse_down);

	container_div.appendChild(container);
	container.appendChild(left_gutter);
	container.appendChild(right_gutter);
	container.appendChild(knob_container);
	knob_container.appendChild(knob);

	window.addEventListener("resize", layout, true);

	var percentage = default_value === undefined ? 0.5 : default_value;

	layout();
	callback (percentage);

	this.set_value = function(p) {
		percentage = p;
		layout();
	}

	function layout() {
		var width = container.getBoundingClientRect().width;

		left_gutter.style.width = width * percentage + "px";
		left_gutter.style.left = "0";

		right_gutter.style.width = (width * (1.0 - percentage)) + "px";
		right_gutter.style.left = width * percentage + "px";

		knob_container.style.left = (width * percentage) + "px"
	}

	var selection_offset;
	
	var move_handler = genericTouchHandler(mouse_move);

	function mouse_down(e) {

		if (window.bc_touch_down_state)
			return false;

		e == e || window.event;
		var knob_rect = knob_container.getBoundingClientRect();
		selection_offset = e.clientX - knob_rect.left - knob_rect.width / 2;

		window.addEventListener("mousemove", mouse_move, false);
        window.addEventListener("mouseup", mouse_up, false);

        window.addEventListener("touchmove", move_handler, false);
        window.addEventListener("touchend", mouse_up, false);
        window.addEventListener("touchcancel", mouse_up, false);


		if (e.preventDefault)
			e.preventDefault();
		return true;
	}

	function mouse_move(e) {
		var container_rect = container.getBoundingClientRect();
		var x = e.clientX - selection_offset - container_rect.left;

		var p = Math.max(0, Math.min(1.0, x / container_rect.width));

		if (percentage != p) {
			percentage = p;
			layout();
			callback (p);
		}

		return true;
	}

	function mouse_up(e) {
        window.removeEventListener("mousemove", mouse_move, false);
        window.removeEventListener("mouseup", mouse_up, false);

        window.removeEventListener("touchmove", move_handler, false);
        window.removeEventListener("touchend", mouse_up, false);
        window.removeEventListener("touchcancel", mouse_up, false);
	}

	function mouse_click(e) {
		var container_rect = container.getBoundingClientRect();
		var x = e.clientX - container_rect.left;

		var p = Math.max(0, Math.min(1.0, x / container_rect.width));

		if (percentage != p) {
			percentage = p;
			layout();
			callback (p);
		}

		return true;
	}
}

