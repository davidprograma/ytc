function drawTriangleMark(ctx, x, y, w, h, color)
{
    var x00 = x;
    var y00 = y;
    var x10 = x + w/2;
    var y10 = y + h;
    var x11 = x - w/2;
    var y11 = y + h;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x00, y00);
    ctx.lineTo(x11, y11);
    ctx.lineTo(x10, y10);
    ctx.closePath();
    ctx.fill();
}

function drawTriangleMark2(ctx, x, y, w, h, color)
{
    var x00 = x;
    var y00 = y;
    var x10 = x + w;
    var y10 = y + h/2;
    var x11 = x + w;
    var y11 = y - h/2;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x00, y00);
    ctx.lineTo(x11, y11);
    ctx.lineTo(x10, y10);
    ctx.closePath();
    ctx.fill();
}

function drawTriangleCircleMark(ctx, cx, cy, r1, r2, pos01, size01, color)
{
    let a0 = 2*Math.PI * pos01;
    let da = 2*Math.PI * size01/2;

    var x00 = cx + r1 * Math.cos(a0);
    var y00 = cy + r1 * Math.sin(a0);
    var x10 = cx + r2 * Math.cos(a0+da);
    var y10 = cy + r2 * Math.sin(a0+da);
    var x11 = cx + r2 * Math.cos(a0-da);
    var y11 = cy + r2 * Math.sin(a0-da);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x00, y00);
    ctx.lineTo(x11, y11);
    ctx.lineTo(x10, y10);
    ctx.closePath();
    ctx.fill();
}

function drawColorWheel(ctx, x, y, r0, r1, steps)
{
    var da = 2 * Math.PI / steps;

    for (var s = 0; s < steps; s++)
    {
        var a0 = da * (s - 0.5);
        var a1 = da * (s + 1.5);

        var x00 = x + r0 * Math.cos(a0);
        var y00 = y - r0 * Math.sin(a0);
        var x01 = x + r0 * Math.cos(a1);
        var y01 = y - r0 * Math.sin(a1);
        var x10 = x + r1 * Math.cos(a0);
        var y10 = y - r1 * Math.sin(a0);
        var x11 = x + r1 * Math.cos(a1);
        var y11 = y - r1 * Math.sin(a1);

        var h = (0.5 + s) / steps;
        var col01 = rgb4h(h);
        var r = parseInt(255.99 * col01.r);
        var g = parseInt(255.99 * col01.g);
        var b = parseInt(255.99 * col01.b);
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.beginPath();
        ctx.moveTo(x00, y00);
        ctx.lineTo(x01, y01);
        ctx.lineTo(x11, y11);
        ctx.lineTo(x10, y10);
        ctx.closePath();
        ctx.fill();
    }
}

function drawColorWheelEx(ctx, x, y, r0, r1, steps) {
    drawColorWheel(ctx, x, y, r0, r1, steps);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r0, 0, 2*Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r1, 0, 2*Math.PI);
    ctx.stroke();
}

function drawColorStripHoriz(ctx, x, y, dx, dy, steps)
{
    var sx = dx / steps;

    for (var s = 0; s < steps; s++)
    {
        var xa = x + sx * (s - 0.5);
        var xb = x + sx * (s + 1.5);
        
        var h = (0.5 + s) / steps;
        var col01 = rgb4h(h);
        var r = parseInt(255.99 * col01.r);
        var g = parseInt(255.99 * col01.g);
        var b = parseInt(255.99 * col01.b);
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(xa, y, xb-xa, dy);
    }
}

function drawColorStripHorizEx(ctx, x, y, w, h, steps) {
    drawColorStripHoriz(ctx, x, y, w, h, steps);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
}

function drawColorStripVert(ctx, x, y, dx, dy, steps)
{
    var sy = dy / steps;

    for (var s = 0; s < steps; s++)
    {
        var ya = y + sy * (s - 0.5);
        var yb = y + sy * (s + 1.5);
        
        var h = (0.5 + s) / steps;
        var col01 = rgb4h(h);
        var r = parseInt(255.99 * col01.r);
        var g = parseInt(255.99 * col01.g);
        var b = parseInt(255.99 * col01.b);
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, ya, dx, yb-ya);
    }
}

function drawColorStripVertEx(ctx, x, y, w, h, steps) {
    drawColorStripVert(ctx, x, y, w, h, steps);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
}

