// function Actor(nameString, x, y, r)
// {
//     this.name = nameString;
//     this.pos = { x: x, y: y};

//     this.boundsRadius = r;

//     if(DEBUG) {
//         this.debugShape = new createjs.Shape();
//         this.debugShape.graphics.beginStroke('#f00').drawCircle(0, 0, this.boundsRadius);
//         this.debugShape.x = this.pos.x;
//         this.debugShape.y = this.pos.y;
//         app.stage.addChild(this.debugShape);
//     }
// }
// Actor.prototype.update = function(dt) {
//     if (DEBUG) {
//         this.debugShape.x = this.pos.x;
//         this.debugShape.y = this.pos.y;
//     }
// };

// function spriteActor(parent, nameString, x, y, r, imageID)
// {
//     Actor.call(this, nameString, x, y, r);
//     app.image = new createjs.Bitmap(app.assets.getResult(imageID));
//     app.image.scale = 0.19;
//     app.image.regX = app.image.getBounds().width / 2;
//     app.image.regY = app.image.getBounds().height / 2;

//     app.image.x = this.pos.x;
//     app.image.y = this.pos.y;
// }
// spriteActor.prototype = Object.create(Actor.prototype);
// spriteActor.prototype.constructor = spriteActor;
// spriteActor.prototype.update = function(dt) {
//     app.image.x = this.pos.x;
//     app.image.y = this.pos.y;
//     Actor.prototype.update.call(this, dt);
// }

// // A player actor that inherits from spriteActor
// function playerActor(parent, x, y, imageID)
// {
//     spriteActor.call(this, parent, "playerActor", x, y, 40, imageID);
//     // this.image.gotoAndPlay("walk");
//     this.update = function(dt) {
//         app.stars.forEach(function(entry) {
//             if(areActorsColliding(this, entry)) {
//                 createjs.Sound.play( 'sizzle', {duration: 2000} );
//                 entry.onCollect();
//                 app.playerScore.text = 'Bacon Score: ' + app.score;
//                 app.stage.update();
//             }
//         }, this);
//         spriteActor.prototype.update.call(this, dt);
//     }
// }
// playerActor.prototype = Object.create(spriteActor.prototype);
// playerActor.prototype.constructor = playerActor;