exampleCode = `function init(system) {
    let lim = 1.5;
    xlimits(-lim, lim);    // horiz limits for drawing
    ylimits(-lim, lim);    //  vert limits for drawing
    
    let sun = new Body();  // 'Sun'
    sun.color = "#FE4";    // color
    sun.r = 0.05;          // radius
    // using defaults for other sun parameters
    
    let mars = new Body(); // 'Mars' body
    mars.px = 1;           // initial position, x component
    mars.vy = 0.85;         // initial position, y component
    mars.r = 0.02;         // radius
    mars.m = 0.000001;     // mass
    mars.color = "#951";   // color
    
    system.add(sun);               // add Sun to system
    system.add(mars);              // add Mars to system
}

class Body {
    constructor() {
        this.px = this.py = 0; // position
        this.vx = this.vy = 0; // velocity
        this.ax = this.ay = 0; // acceleration
        this.m = 1;            // mass
        this.r = 0.1;          // radius
        this.color = 'white';  // color
    }
    update(dt) {
        this.vx += this.ax * dt;  // acceleration affects...
        this.vy += this.ay * dt;  // ...velocity;
        this.px += this.vx * dt;  // velocity affects...
        this.py += this.vy * dt;  // ...position
    }
    draw() {
        linecolor(null);                  // no line        
        fillcolor(this.color);            // fill color
        circle(this.px, this.py, this.r); // circle
    }
}

class BodySystem {
    constructor() {
        this.bodies = [];  // array of bodies
        this.G = 1;        // gravitation constant
    }
    add(body) {
        this.bodies.push(body); // add body to array
    }
    update(dt) {
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
        body1.ax += ux * a1;  // body 1 acc, x component
        body1.ay += uy * a1;  // body 1 acc, y component
        body2.ax += -ux * a2; // body 2 acc, x component
        body2.ay += -uy * a2; // body 2 acc, y component
    }
    draw() {
        for (let i = 0; i < this.bodies.length; i++)
            this.bodies[i].draw();
    }
}

let system = new BodySystem(); // Body System
init(system);

function draw() {               // draw function for ezdraw
    clear('black');             // paint it black
    system.draw();              // draw body system
    system.update(deltatime()); // update positions in body system
    redraw();                   // request redraw
}
`;
