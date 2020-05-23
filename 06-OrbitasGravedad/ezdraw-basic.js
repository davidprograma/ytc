var ez = createEZDraw();

let onWindowLoad = function()
{
    ez.setup();
    ez.run();
}

window.addEventListener('load', onWindowLoad);