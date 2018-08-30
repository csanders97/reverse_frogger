// Get a random point on the screen
function getRandomPointOnScreen()
{
    var randPos = {
        x: Math.random() * SCREEN_WIDTH,
        y: 10, 
    };

    return randPos;
};

// Are two actors colliding with each other?
function areActorsColliding(actor1, actor2)
{
    var distance = getDistance(actor1, actor2);

    // If the distance is closer than our radii
    if(distance < (actor1.boundsRadius + actor2.boundsRadius))
    {
        return true;
    }

    return false;
};

// Get the distance between two positions (must be an object in {x: ?, y: ?} format)
function getDistance(pos1, pos2)
{
    // We use the pythagorean theorem to determine the distance between two points,
    // where C is the distance
    //
    //       Point 1 |
    //               v
    //              /|
    //             / |
    //          C /  | 
    //           /   | B
    //          /    |    
    //         /_____|
    //         ^  A    
    // Point 2 |

	// To get the distance, we need to find the length of sides A and B

    // pos1.x - pos2.x gets us the length of one side of the triangle (the A)
    // We'll square it here
    var aSqrd = Math.pow((pos1.x - pos2.x), 2);

    // pos1.y - pos2.y gets us the length of the other side (the B)
	// We'll 
    var bSqrd = Math.pow((pos1.y - pos2.y), 2);

    // Now we get c, using the pytahgorean theorem
    var distance = Math.sqrt(aSqrd + bSqrd);

    return distance;
}