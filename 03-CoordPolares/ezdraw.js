//'use strict;'
// EZDraw


let createEZDraw = function(canvasElementId) {
    let ez = {};

    let dbg = console.log;
    //let dbg = function(){};
    
    let xmin, xmax, ymin, ymax;

    let def_linewidthfactor = 0.002;
    let def_linecolor = '#444';
    let def_fillcolor = '#CCC';

    let lineactive, fillactive;

    ez.canvas = null;

    ez.pixelScale = Math.min(2, window.devicePixelRatio || 1);

    ez.yup = true;

    let ctx = null;
    let deltatime = 0.016;
    let prevmillis = 0;
    let idanim = null;
    let linecap = 'round';

    ez.canvasElementId = (typeof(canvasElementId) === 'undefined') ? 'ezdraw' : canvasElementId;

    ez.setup = function()
    {
        ez.canvas = document.getElementById(ez.canvasElementId);

        ctx = ez.canvas.getContext('2d');

        setDefaults();
    }

    ez.ctx = function() {
        return ctx;
    }

    let setDefaults = function()
    {
        xmin = ymin = -1000;
        xmax = ymax = 1000;
        xform();

        lineactive = fillactive = true;
        ctx.strokeStyle = def_linecolor;
        ctx.fillStyle = def_fillcolor;
    }

    ez.xlimits = function(x1,x2)
    {
        // make sure x1 <= x2
        if (x1 > x2) { let t = x1; x1 = x2; x2 = t; }
        if (x1 == xmin && x2 == xmax) return;
        xmin = x1;
        xmax = x2;
        xform();
    }

    ez.ylimits = function(y1,y2)
    {
        // make sure y1 <= y2
        if (y1 > y2) { let t = y1; y1 = y2; y2 = t; }
        if (y1 == ymin && y2 == ymax) return;
        ymin = y1;
        ymax = y2;
        xform();
    }

    let defaultLineWidth = 1;

    let xform = function()
    {
        let dbgxform = false;
        if (dbgxform) dbg('xform');

        // canvas dimensions
        let cw = ez.canvas.width;
        let ch = ez.canvas.height;
        if (dbgxform) dbg("cw, ch", cw, ch);

        // margin per-one-age
        let margpon = 0.03;

        // available dimensions and aspect
        let aw = cw * (1 - margpon);
        let ah = ch * (1 - margpon);
        let aa = cw / ch;
        if (dbgxform) dbg("aw, ah, aa", aw, ah, aa);

        // world dimensions
        let ww = xmax - xmin;
        let wh = ymax - ymin;
        let wa = ww / wh;
        if (dbgxform) dbg("ww, wh, wa", ww, wh, wa);

        // viewport dimensions
        let vx, vy, vw, vh;

        // transform parameters: translation and scale
        let tx = 0, ty = 0, sx = 1, sy = 1;

        if (aa > wa)
        {
            vh = ah;
            vw = vh * wa;
        }
        else
        {
            vw = aw;
            vh = vw / wa;
        }

        vx = 0.5 * (cw - vw);
        vy = 0.5 * (ch - vh);
        if (dbgxform) dbg("vx, vy, vw, vh", vx, vy, vw, vh);

        sx = vw / ww;
        sy = vh / wh;

        if (ez.yup)
            sy = -sy;

        tx = vx-xmin * sx;
        ty = vy-ymin * sy;

        if (ez.yup)
            ty += vh;

        ctx.setTransform(sx, 0, 0, sy, tx, ty);

        let wwh = Math.max(ww,wh);
        defaultLineWidth = wwh * def_linewidthfactor;
        ez.linewidth(defaultLineWidth);
    }

    ez.resize = function(w, h)
    {
        ez.width = w;
        ez.height = h;
        ez.canvas.width = ez.width;
        ez.canvas.height = ez.height;

        xform();
        if (idanim == null)
            ez.run();
    }

    ez.clear = function(color)
    {
        // kludgy but effective
        ctx.fillStyle = color;
        let dx = xmax - xmin;
        let dy = ymax - ymin;
        ctx.rect(xmin - dx, ymin - dy, 3*dx, 3*dy);
        ctx.fill();
        ctx.fillStyle = def_fillcolor;
    }

    ez.draw = function()
    {
        let msg = '';
        msg += 'please define a ez.draw function.\n';
        msg += 'example: \n';
        msg += 'ez.draw() {\n';
        msg += '    // do something\n';
        msg += '}';
        alert(msg);
    }

    let drawFrame = function(timemillis)
    {
        //dbg(prevmillis, timemillis);
        // if (timemillis > 500) return;

        deltatime = 0.001 * (timemillis - prevmillis);
        prevmillis = timemillis;

        idanim = null;
        // dbg('next'); dbg(deltatime);
        try {
            ez.draw();
        }
        catch(e) {
            ez.onCodeException(e);
        }
    }

    ez.redraw = function()
    {
        idanim = requestAnimationFrame(drawFrame);
    }

    ez.linewidth = function(value)
    {
        if (value > 0)
            ctx.lineWidth = value;
        else
            ctx.lineWidth = 1e-30;
    }

    ez.linecolor = function(value)
    {
        if (value)
        {
            ctx.strokeStyle = value;
            lineactive = true;
        }
        else
        {
            ctx.strokeStyle = def_linecolor;
            lineactive = false;
        }
    }

    ez.linecap = function(value)
    {
        if (value == 'butt' || value == 'round' || value == 'square')
            linecap = value;
    }

    ez.fillcolor = function(value)
    {
        if (value)
        {
            ctx.fillStyle = value;
            fillactive = true;
        }
        else
        {
            fillactive = false;
        }
    }

    let drawPrimitive = function()
    {
        if (fillactive) {
            ctx.fill();
        }

        if (lineactive) {
            ctx.stroke();
        }
    }

    let drawLinePrimitive = function()
    {
        if (lineactive) {
            ctx.stroke();
        }
    }

    ez.circle = function(x, y, r)
    {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI);
        ctx.closePath();
        drawPrimitive();
    }

    ez.circseg = function(x, y, r, a1, a2)
    {
        ctx.beginPath();
        ctx.arc(x, y, r, a1, a2);
        ctx.closePath();
        drawPrimitive();
    }

    ez.circsect = function(x, y, r, a1, a2)
    {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, a1, a2);
        ctx.lineTo(x, y)
        ctx.closePath();
        drawPrimitive();
    }
    
    ez.line = function(x1, y1, x2, y2)
    {
        ctx.beginPath();
        ctx.lineCap = linecap;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        drawLinePrimitive();
    }

    ez.rect = function(x1, y1, x2, y2)
    {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.closePath();
        drawPrimitive();
    }

    ez.polyline = function(coords)
    {
        let pairs = parseInt(coords.length/2);
        if (pairs < 2)
            return;

        ctx.beginPath();
        ctx.lineCap = linecap;
        ctx.moveTo(coords[0], coords[1]);
        for (let p = 1; p < pairs; p++)
        {
            let x = coords[2*p+0];
            let y = coords[2*p+1];
            ctx.lineTo(x, y);
        }
        drawLinePrimitive();
    }

    ez.polygon = function(coords)
    {
        let pairs = parseInt(coords.length/2);
        if (pairs < 2)
            return;

        ctx.beginPath();
        ctx.moveTo(coords[0], coords[1]);
        for (let p = 1; p < pairs; p++)
        {
            let x = coords[2*p+0];
            let y = coords[2*p+1];
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        drawPrimitive();
    }

    ez.drawlimits = function() {
        ez.linewidth(defaultLineWidth);
        ez.linecolor('black');
        ez.line(xmin,ymin,xmax,ymin);
        ez.line(xmax,ymin,xmax,ymax);
        ez.line(xmin,ymax,xmax,ymax);
        ez.line(xmin,ymin,xmin,ymax);
    }

    ez.drawaxes = function() {
        ez.linewidth(defaultLineWidth);
        ez.linecolor('red');
        ez.line(0,0,xmax,0);
        ez.linecolor('green');
        ez.line(0,0,0,ymax);
        ez.linecolor('black');
        ez.line(xmin,0,0,0);
        ez.line(0,ymin,0,0);
    }

    ez.run = function()
    {
        cancelAnimationFrame(idanim);
        prevmillis = performance.now();
        idanim = requestAnimationFrame(drawFrame);
    }

    ez.deltatime = function() { return deltatime; }

    ez.onCodeException = function(e)
    {
        console.log(e);
    }

    let runFullCode = function(fullcode)
    {
        // console.log(fullcode);
        try {
            eval(fullcode);
            ez.run();
        }
        catch(e) {
            ez.onCodeException(e);
        }
    }

    let function_prolog = '(function(){';
    let trycatch_prolog = 'try {';
    let ez_subst_prolog = '';
    let imp_draw_prolog = 'function _implicit_draw(){setDefaults();'
    let imp_draw_epilog = ';if(typeof(draw)==="function"){draw();ez.draw=draw;}}';
    let ez_subst_epilog = ';ez.draw=_implicit_draw;'
    let trycatch_epilog = '}catch(e){ez.onCodeException(e)}'
    let function_epilog = '})();';

    let ez_subst_list = [
        'ctx',
        'clear',
        'xlimits',
        'ylimits',
        'linewidth',
        'linecap',
        'linecolor',
        'fillcolor',
        'line',
        'rect',
        'circle',
        'circseg',
        'circsect',
        'polyline',
        'polygon',
        'drawlimits',
        'drawaxes',
        'deltatime',
        'redraw',
    ];
    for (let i = 0; i < ez_subst_list.length; i++) {
        let word = ez_subst_list[i];
        ez_subst_prolog += 'let ' + word + '=ez.' + word + ';';
    }

    ez.runCode = function(code)
    {
        let fullcode = '';
        fullcode += function_prolog;
        fullcode += trycatch_prolog;
        fullcode += code;
        fullcode += trycatch_epilog;
        fullcode += function_epilog;
        runFullCode(fullcode);
    }

    ez.runSimplifiedCode = function(code)
    {
        if (code.length == 0) code = "clear('#444');";
        let fullcode = '';
        fullcode += function_prolog;
        fullcode += trycatch_prolog;
        fullcode += ez_subst_prolog;
        fullcode += imp_draw_prolog;
        fullcode += code + '\n';
        fullcode += imp_draw_epilog;
        fullcode += ez_subst_epilog;
        fullcode += trycatch_epilog;
        fullcode += function_epilog;
        runFullCode(fullcode);
    }

    ez.onResize = function()
    {
        parent = ez.canvas.parentNode;
        width = parent.clientWidth;
        height = parent.clientHeight;

        ez.canvas.style.width = width + "px";
        ez.canvas.style.height = height + "px";
        ez.canvas.width = width * ez.pixelScale;
        ez.canvas.height = height * ez.pixelScale;

        xform();
        if (idanim == null)
            ez.run();
    }

    window.addEventListener("resize", ez.onResize, true);

    return ez;
}
