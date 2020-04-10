function rgb4h(h)
{
    var r = 0;
    var g = 0;
    var b = 0;

    if (h < 0) h = 0;
    if (h > 1) h = 1;
    h = h * 6;

    if (h <= 1) {
        r = 1;
        g = h;  // si h = 0, g = 0; si h = 1, g = 1
        b = 0;
    }
    else if (h <= 2) {
        r = 2 - h; // si h = 1, r = 1; si h = 2, r = 0
        g = 1;
        b = 0;
    }
    else if (h <= 3) {
        r = 0;
        g = 1;
        b = h - 2; // si h = 2, b = 0; si h = 3, b = 1;
    }
    else if (h <= 4) {
        r = 0;
        g = 4 - h; // si h = 3, g = 1; si h = 4, g = 0
        b = 1;
    }
    else if (h <= 5) {
        r = h - 4; // si h = 4, r = 0; si h = 5, r = 1
        g = 0;
        b = 1;
    }
    else {
        r = 1;
        g = 0;
        b = 6 - h; // si h = 5, r = 1; si h = 6, r = 0
    }

    return {r:r, g:g, b:b};
}

