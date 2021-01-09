$fn=100;

difference()
{
union()
{

translate([8.5,3.5,0]) cylinder(10.5,1,1.1);
translate([8.5,3.5,0]) cylinder(8.5,2,2);
translate([0,3.5,4.25]) rotate([-25,0,0])scale([10.5,9.5,2]) cube(1);

translate([66.5,3.5,0]) cylinder(10.5,1,1.1);
translate([66.5,3.5,0]) cylinder(8.5,2,2);
translate([64.5,3.5,4.25]) rotate([-25,0,0])scale([10.5,9.5,2]) cube(1);

translate([34,10.5,0]) scale([8,3.0,6]) cube(1);
translate([34,10.0,0]) scale([8,3.5,4]) cube(1);
translate([30,12.0,0]) scale([16,1.5,6]) cube(1);

translate([47,0,3.25]) rotate([-25,0,0])scale([7,6.5,1.5]) cube(1);

difference()
{
    scale([75,13.5,10.5]) cube(1);
    union()
    {
        translate([-10,2,2])scale([95,15.5,10.5]) cube(1);
        translate([5,-5,2]) scale([65,10,10.5]) cube(1);
    }
}

translate([0,0,0]) scale([4,3,10.5]) cube(1);
translate([71,0,0]) scale([4,3,10.5]) cube(1);

translate([0,0,0]) scale([3,4,10.5]) cube(1);
translate([72,0,0]) scale([3,4,10.5]) cube(1);

translate([-3,3.5,0]) scale([6,2,10.5]) cube(1);
translate([72,3.5,0]) scale([6,2,10.5]) cube(1);

translate([-3,-2,0]) scale([6,2,10.5]) cube(1);
translate([72,-2,0]) scale([6,2,10.5]) cube(1);

difference()
{
    translate([4,0,0]) scale([67,1,8.5]) cube(1);
    union()
    {
        translate([29,-1.0,2]) scale([18,3,8.5]) cube(1);
        translate([12,-1,2]) scale([8.5,3,8.5]) cube(1);
        translate([54,-1,4.5]) scale([10.5,3,8.5]) cube(1);
        translate([22.25,0.5,2]) scale([4,3,8.5]) cube(1);
    }
}

translate([22.25,0.5,2]) scale([4,3,0.5]) cube(1);
translate([22.25,0.5,2]) scale([4,1.5,1]) cube(1);

translate([0,-1,0]) scale([72,1.5,2]) cube(1);
translate([6.75,-1,0]) scale([2,1.5,8.5]) cube(1);
translate([23.75,-1,0]) scale([2,1.5,8.5]) cube(1);
translate([49.5,-1,0]) scale([2,1.5,8.5]) cube(1);
translate([67,-1,0]) scale([2,1.5,8.5]) cube(1);

} // end union

translate([-5,-0.05,-1]) scale([85,2.5,2.7]) cube(1);
} // end difference

