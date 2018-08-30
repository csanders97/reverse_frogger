var app = {
    socket: null,
    stage: null,
    assets: null,
	// My game object
    myGameObject: null,    
    
    player2: null,
    myGameObjectColor: null,
    myGameObjectColor2: null,
    activePlayer: null,

	// Values to lerp between
	gameObjectPosition: {
		start: {
			x: 20,
			y: 180
		},
		target: {
			x: 150,
			y: 200
		}
    },
	gameObjectPosition2: {
		start: {
			x: 20,
			y: 300
		},
		target: {
			x: 150,
			y: 200
		}
	},
	
	// Lerp timers for both directions
	lerpToTargetTimer: 1,
	lerpMaxTime: 1,

	// Screen Text
	screenText: null,

	mousePos: {x:0, y:0},

    setupCanvas: function() {
        canvas = document.getElementById('game');
        canvas.width = 1200;
        canvas.height = 850;
        canvas.addEventListener('click', function(evt) {
            app.handleMouseDown(evt);
        });
        this.stage = new createjs.Stage(canvas);
    },

    beginLoad: function() {
        manifest = [
            {
                src: 'js/actor.js',
            },
            {
                src: 'js/utils.js'
            },
            {
                src: 'assets/images/NewPiskel.json',
				id: 'frog',
				type: 'spritesheet',
				crossOrigin: true
            },
            {
                src: 'assets/images/car.png',
                id: 'car'
            },
            {
                src: 'assets/images/bg-temp.png',
                id: 'background'
            },
            {
                src: 'assets/sfx/dead.wav',
                id: 'death'
            },
            {
                src: 'assets/sfx/select.wav',
                id: 'select'
            },
            {
                src:'assets/sfx/vrrm.wav',
                id: 'vroom'
            },
            {
                src: 'assets/sfx/frogger.mp3',
                id: 'music'
            }
        ];

        this.assets = new createjs.LoadQueue(true); 

        createjs.Sound.alternateExtensions = ['ogg'];

        this.assets.installPlugin(createjs.Sound);

        this.assets.on('progress', function (event) { console.log(((event.loaded / event.total) * 100) + '%'); });

        this.assets.on('complete', function (event) {
            app.init();
        });

        this.assets.loadManifest(manifest);
    },

    init: function() {
        this.setupCanvas();
        this.socket = io();
        createjs.Sound.play('music');

        var stageBG = new createjs.Bitmap(app.assets.getResult('background'));
        this.stage.addChild(stageBG);

        this.socket.on('newJoin', function(newPlayerID) {
            console.log(newPlayerID + ' has just joined the game');
        });

        this.socket.on('left', function(playerID) {
            console.log(playerID + ' has left the game');
        });


        var score = 0;
        if (!isNaN(Cookies.get('score'))) {
            score = Cookies.get('score');
        }

        var newText = new createjs.Text("Score: " + score, '40px Oswald', '#000000');
        newText.x = 20;
        newText.y = 10;
        this.stage.addChild(newText);

        this.socket.on('updatePosition', function(startX, startY, targetX, targetY, id) {
            app.activePlayer = id;
            if (id == "Player 1") {
                app.gameObjectPosition.start.x = startX;
                app.gameObjectPosition.start.y = startY;
                app.gameObjectPosition.target.x = targetX;
                app.gameObjectPosition.target.y = targetY;
            } else {
                app.gameObjectPosition2.start.x = startX;
                app.gameObjectPosition2.start.y = startY;
                app.gameObjectPosition2.target.x = targetX;
                app.gameObjectPosition2.target.y = targetY;
            }
            app.lerpToTargetTimer = 0;
        });

        this.socket.on('tooMany', function() {
            alert("Sorry, there are too many players so you were disconnected!");
        });

        this.socket.on('new', function(x, y, a, b) {
            app.gameObjectPosition.start.x = x;
            app.gameObjectPosition.start.y = y;
            app.gameObjectPosition.target.x = x;
            app.gameObjectPosition.target.y = y;

            app.gameObjectPosition2.start.x = a;
            app.gameObjectPosition2.start.y = b;
            app.gameObjectPosition2.target.x = a;
            app.gameObjectPosition2.target.y = b;
        });

        // Capture our keyboard inputs and pass them down to our handler functions
        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;
        
        // Set up our mouse
        this.stage.enableMouseOver();

        this.stage.on("stagemousemove", function(event) {
            app.mousePos.x = Math.floor(event.stageX);
            app.mousePos.y = Math.floor(event.stageY);
        });

        // Set up our update loop in the CreateJS Ticker
        createjs.Ticker.addEventListener("tick", this.update);
        createjs.Ticker.framerate = 30;
        
        // Setup our game
        this.resetGame();	

        this.socket.on('players2', function(players) {
            if(players > 1) {
                app.player2();
            }
        });
    },

    handleMouseDown: function(evt) {
        app.socket.emit('playerMove', this.myGameObject.x, this.myGameObject.y, this.mousePos.x, this.mousePos.y, this.player2.x, this.player2.y);
    },

    resetGame: function()
	{
		// Create an object to move around
		this.myGameObject = new createjs.Bitmap(app.assets.getResult('car'));
		this.myGameObject.x = this.gameObjectPosition.start.x;
        this.myGameObject.y = this.gameObjectPosition.start.y;
        this.myGameObject.boundsRadius = 50;

		// Add my game object to the stage
        this.stage.addChild(this.myGameObject);
    },
    
    player2: function() {
        // Create an object to move around
        // this.player2 = new createjs.Sprite(app.assets.getResult('frog'));
        this.player2 = new createjs.Sprite(app.assets.getResult('frog'));
        this.player2.x = this.gameObjectPosition2.start.x;
        this.player2.y = this.gameObjectPosition2.start.y;
        this.player2.boundsRadius = 50;
        this.player2.gotoAndPlay('move');

        // Create a shape to give my game object some visuals
        // var shapeRect2 = new createjs.Shape();
        // this.myGameObjectColor2 = shapeRect2.graphics.beginFill('#478365').command;
        // shapeRect2.graphics.drawRect(0, 0, 100, 100);
        // this.player2.addChild(shapeRect2);

        // // Add my game object to the stage
        this.stage.addChild(this.player2);
    },
	
    // Our game loop
    update: function(event)
    {
        app.stage.update(event);

        // Get our delta time (dt)
		var dt = event.delta / 1000;
		
		// Check our first lerp timer, which counts up
		if(app.lerpToTargetTimer <= app.lerpMaxTime)
		{
			// If the timer is below the max time, increase the timer
			app.lerpToTargetTimer += dt;
			
			// If this timer is above the max, set the next timer to full
			if(app.lerpToTargetTimer > app.lerpMaxTime)
			{
				app.lerpToStartTimer  = app.lerpMaxTime;
			}

			// How far are we into our lerping, OR, what percent of our lerp has occured?
			var percentVal = app.lerpToTargetTimer / app.lerpMaxTime;

			app.updateGameObject(percentVal);
        }

        if (areActorsColliding(app.myGameObject, app.player2)) {
            createjs.Sound.play('death');
            if (!isNaN(Cookies.get('score'))) {
                var score = Cookies.get('score');
                score += 1;
                Cookies.set('score', score);
            }
            else {
                Cookies.set('score', 1);
            }
            app.reloadGame();
        }

        app.socket.on('updatePositionP1', function(newX, newY) {
            app.myGameObject.x = newX;
            app.myGameObject.y = newY
        });

        app.socket.on('updatePositionP2', function(newX, newY) {
            app.player2.x = newX;
            app.player2.y = newY
        });
	},

	// Handles all of the lerping, called from update
	updateGameObject: function(percentVal)
	{
        if(app.activePlayer == "Player 1") {
            // Change the object's position
            this.myGameObject.x = this.lerp(this.gameObjectPosition.start.x, this.gameObjectPosition.target.x, percentVal);
        
            // Update the text displays
            this.updateTextDisplays();
        } else {
            // Change the object's position
            this.player2.x = this.lerp(this.gameObjectPosition2.start.x, this.gameObjectPosition2.target.x, percentVal);
            this.player2.y = this.lerp(this.gameObjectPosition2.start.y, this.gameObjectPosition2.start.y - 100, percentVal);
        }
	},


	// Our actual lerp (linear interpolation) function
	lerp: function(valA, valB, percentVal)
	{
		// Clamp the percentVal
		percentVal = percentVal > 1 ? 1 : percentVal;
		percentVal = percentVal < 0 ? 0 : percentVal;
		return valA * (1 - percentVal) + valB * percentVal;
	},

    reloadGame: function() {
        app.socket.emit('playerMove');
        app.stage.update();
    }
}

app.beginLoad();