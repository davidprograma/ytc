exampleCode = `function init(system)
{
    let lim = 1.5;
    xlimits(-lim, lim);    // horiz limits for drawing
    ylimits(-lim, lim);    //  vert limits for drawing
    
    let csun = '#FE7';
    let cmer = '#999';
    let cven = '#F5A';
    let cear = '#6AF';
    let cmar = '#B61';
    
    sun = new Body();
    sun.px = 0;
    sun.r = 0.05;
    sun.color = csun;

    mer = new Body();
    mer.px = -0.5;
    mer.vy = -1.414;
    mer.r = 0.02;
    mer.m = 0.000001;
    mer.color = cmer;

    ven = new Body();
    ven.py = -0.75;
    ven.vx = 1.15;
    ven.r = 0.03;
    ven.m = 0.000001;
    ven.color = cven;

    ear = new Body();
    ear.px = 1;
    ear.vy = 1;
    ear.r = 0.03;
    ear.m = 0.000001;
    ear.color = cear;

    mar = new Body();
    mar.py = -1.25;
    mar.vx = 0.9;
    mar.r = 0.03;
    mar.m = 0.000001;
    mar.color = cmar;
    
    com = new Body();
    com.px = 0;
    com.py = -0.25;
    com.vx =  2.45;
    com.vy = -1.0;
    com.r = 0.02;
    com.m = 0.0000001;
    com.color = 'white';

    system.add(mer);
    system.add(ven);
    system.add(ear);
    system.add(mar);
    system.add(com);
    system.add(sun);
    system.nreps = 1;
}

class Body {
    constructor() {
        this.px = this.py = 0; // position
        this.vx = this.vy = 0; // velocity
        this.ax = this.ay = 0; // acceleration
        this.m = 1;            // mass
        this.r = 0.1;          // radius
        this.color = 'white';  // color
        this.fixed = false;    // if true, don't update position (for non-heavy suns)
        this.trail = new AngularTrail();
    }
    update(dt) {
        this.vx += this.ax * dt;      // acceleration affects...
        this.vy += this.ay * dt;      // ...velocity;
        if (!this.fixed) {
            this.px += this.vx * dt;  // velocity affects...
            this.py += this.vy * dt;  // ...position
            this.trail.update(this.px, this.py);
        }
    }
    draw() {
        if (!this.fixed)
            this.trail.draw();
        linecolor(null);                  // no line        
        fillcolor(this.color);            // fill color
        circle(this.px, this.py, this.r); // circle
    }
}

class BodySystem {
    constructor() {
        this.bodies = [];  // array of bodies
        this.G = 1;        // gravitation constant
        this.nreps = 1;    // number of repetitions
    }
    add(body) {
        this.bodies.push(body); // add body to array
    }
    update(dt) {
        for (let i = 0; i < this.nreps; i++)
            this.updateOnce(dt / this.nreps);
    }
    updateOnce(dt) {
        // set all accelerations to zero
        for (let i = 0; i < this.bodies.length; i++)
            this.bodies[i].ax = this.bodies[i].ay = 0;
        // calculate accelerations for pairs of bodies
        for (let i = 0; i < this.bodies.length; i++)
            for (let j = i+1; j < this.bodies.length; j++)
                this.calcAcc(this.bodies[i], this.bodies[j]);
        // update velocities and positions for all bodies
        for (let i = 0; i < this.bodies.length; i++)
            this.bodies[i].update(dt);
    }
    calcAcc(body1, body2) {
        let dx = body2.px - body1.px; // distance x component
        let dy = body2.py - body1.py; // distance y component
        let d2 = dx * dx + dy * dy;   // squared distance
        let d = Math.sqrt(d2);        // distance
        let ux = dx / d;              // unitary vector, x comp
        let uy = dy / d;              // unitary vector
        let a1 = this.G * body2.m / d2; // scalar acc, body 1
        let a2 = this.G * body1.m / d2; // scalar acc, body 2
        body1.ax +=  ux * a1;  // body 1 acc, x component
        body1.ay +=  uy * a1;  // body 1 acc, y component
        body2.ax += -ux * a2; // body 2 acc, x component
        body2.ay += -uy * a2; // body 2 acc, y component
    }
    draw() {
        for (let i = 0; i < this.bodies.length; i++)
            this.bodies[i].draw();
    }
}

class AngularTrail
{
    constructor() {
        this.points = [];
        this.angles = [];
        this.color = 'white';
        this.threshold = Math.PI/180;
    }
    calcNewestAngle(px, py)
    {
        let len = this.points.length;
        let p0 = this.points[len-2];
        let p1 = this.points[len-1];
        let v1x = p1[0] - p0[0];
        let v1y = p1[1] - p0[1];
        let v2x = px - p1[0];
        let v2y = py - p1[1];
        let lv1 = Math.sqrt(v1x*v1x + v1y*v1y);
        let lv2 = Math.sqrt(v2x*v2x + v2y*v2y);
        let dot = v1x*v2x + v1y*v2y;
        let cosa = dot / (lv1 * lv2);
        return Math.acos(cosa);
    }
    update(px, py) {
        let len = this.points.length;
        if (len <= 3) {
            this.points.push([px, py])
            this.angles.push(0);
        }
        else {
            let a = this.calcNewestAngle(px, py);
            if (a < this.threshold) {
                this.points.pop();
                this.angles.pop();
                a = this.calcNewestAngle(px, py);
            }
            this.angles.push(this.angles[this.angles.length-1] + a);
            this.points.push([px, py])
        }
        while (Math.abs(this.angles[this.angles.length-1] - this.angles[0]) > 2 * Math.PI) {
            this.points.shift();
            this.angles.shift();
        }
    }
    draw(ez) {
        linecolor(this.color)
        for (let i = 1; i < this.points.length; i++) {
            let p0 = this.points[i-1];
            let p1 = this.points[i];
            let x0 = p0[0], y0 = p0[1];
            let x1 = p1[0], y1 = p1[1];
            let a = (i / this.points.length);
            ctx().globalAlpha = a;
            line(x0, y0, x1, y1);
        }
        ctx().globalAlpha = 1;
    }
}

let system = new BodySystem(); // Body System
init(system);

function draw()                 // draw function for ezdraw
{
    clear('black');             // paint it black
    system.draw();              // draw body system
    system.update(deltatime()); // update positions in body system
    redraw();                   // request redraw
}
`;
