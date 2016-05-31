( function() {

    // error not found :Definition for rule 'keyword-spacing' was not found
    
    "use strict";

    var HomeRun;

    HomeRun = function( oApp ) {
        var game = this,  // eslint-disable-line consistent-this
            Donuts;

        this.app = oApp;
        this.time = {
            "start": null, // temps de départ
            "current": null // temps actuel
        };
        // BACKGROUND
        this.background = {
            "frame": {
                "sx": 0, // Position X PHOTOSHOP
                "sy": 0, // Position Y PHOTOSHOP
                "sw": 800, // WIDTH
                "sh": 500, // HEIGHT
                "dx": 0, // Position X dans le jeu
                "dy": 0, // Position Y dans le jeu
                "dw": 800, // taille
                "dh": 500 // taille
            },
            "draw": function() {
                game._drawSpriteFromFrame( this.frame );
            }
        };
        // START
        this.play = {  // Objets affichés avant le début de la partie
            "frames": {
                "ready": {
                    "sx": 821,
                    "sy": 0,
                    "sw": 150,
                    "sh": 150,
                    "dx": game.app.width / 2 - 50,
                    "dy": game.app.height / 2 - 50,
                    "dw": 100,
                    "dh": 100
                },
                "title": {
                    "sx": 821,
                    "sy": 166,
                    "sw": 455,
                    "sh": 150,
                    "dx": 175,
                    "dy": 30,
                    "dw": 455,
                    "dh": 150
                }
            },
            "draw": function() {
                game._drawSpriteFromFrame( this.frames.ready );
                game._drawSpriteFromFrame( this.frames.title );
            }
        };
        // GAME OVER
        this.gameOver = {
            "frames": {
                "title": {
                    "sx": 1105,
                    "sy": 365,
                    "sw": 445,
                    "sh": 67,
                    "dx": game.app.width / 2 - 300,
                    "dy": game.app.height / 2 - 200,
                    "dw": 445,
                    "dh": 67
                },
                "nelson": {
                    "sx": 920,
                    "sy": 331,
                    "sw": 187,
                    "sh": 148,
                    "dx": game.app.width / 2 + 200,
                    "dy": game.app.height / 2 - 200,
                    "dw": 187,
                    "dh": 148
                }
            },
            "draw": function() {
                game._drawSpriteFromFrame( this.frames.title );
                game._drawSpriteFromFrame( this.frames.nelson );
            },
            "drawScore": function( iScore ) {
                oApp.context.font = "bold 30px 'Arial'";
                oApp.context.textAlign = "center";
                oApp.context.fillText( "Votre Score : " + iScore, game.app.width / 2, ( game.app.height ) / 2 - 70 );
            }
        };
        // SOL
        this.ground = {
            "frame": {
                "sx": 0,
                "sy": 526,
                "sw": 1564,
                "sh": 140,
                "dx": game.app.width - 1564,
                "dy": game.app.height - 137,
                "dw": 1564,
                "dh": 140
            },
            "speed": 2,
            "maxOffset": 1564 - game.app.width,
            "draw": function() {
                game._drawSpriteFromFrame( this.frame );
            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = 0;
                }
                this.frame.dx -= this.speed;
                this.draw();
            }
        };
        this.homerRun = {
            "frames": [
                {
                    "sx": 0,
                    "sy": 684,
                    "sw": 104,
                    "sh": 160
                },
                {
                    "sx": 120,
                    "sy": 684,
                    "sw": 104,
                    "sh": 160
                },
                {
                    "sx": 240,
                    "sy": 684,
                    "sw": 104,
                    "sh": 160
                }
            ],
            "init": function() {
               // reset les propriétés
                this.animation = {
                    "maxSteps": this.frames.length,
                    "step": 0
                };
                this.state = {
                    "isInDangerZone": false
                };
                this.score = {
                    "current": 0
                };
                this.position = {
                    "top": 0,
                    "bottom": 0,
                    "right": 0,
                    "left": 0
                };
                this.destinationFrame = {
                    "dx": 350,
                    "dy": game.app.height / 2 + 100,
                    "dw": 124,
                    "dh": 180
                };
            },
            "draw": function( iStep ) {
                var oContext = game.app.context,
                    oFrom = this.frames[ iStep ],
                    oDest = this.destinationFrame;

                oContext.save();
                game.app.context.drawImage(
                    game.spriteSheet,
                    oFrom.sx,
                    oFrom.sy,
                    oFrom.sw,
                    oFrom.sh,
                    oDest.dx,
                    oDest.dy,
                    oDest.dw,
                    oDest.dh
                );
            },
            "update": function( oEvent ) {
                var self = this;

                if ( oEvent ) {
                    if ( oEvent.type === "click" || ( oEvent.type === "keyup" && oEvent.keyCode === 32 ) ) {
                        if ( !game.ended ) {
                            if ( !this.state.acceleration ) {
                                Donuts.generate( 1 );
                                game.started = true;
                                this.state.acceleration = 0.4;
                                this.state.boost = -5;
                            } else {
                                this.state.speed = this.state.boost;
                            }
                        } else {
                            // restart game
                            return game.init();
                        }
                    } else {
                        return;
                    }
                }
                self.position.top = self.destinationFrame.dy + self.destinationFrame.dh / 2;
                self.position.bottom = self.destinationFrame.dy + self.destinationFrame.dh / 2;
                self.position.left = self.destinationFrame.dx + self.destinationFrame.dw / 2;
                self.position.right = self.destinationFrame.dx + self.destinationFrame.dw / 2;


                game.donuts.forEach( function( oDonuts ) {
                    var oPosition = self.position,
                        ooDonuts = oDonuts.frame.donuts;

                    if ( oPosition.left < ooDonuts.dx + ooDonuts.dw && oPosition.left + ( oPosition.right - oPosition.left ) > ooDonuts.dx && oPosition.top < ooDonuts.dy + ooDonuts.dh && ( oPosition.bottom - oPosition.top ) + oPosition.top > ooDonuts.dy ) {
                        game.over();
                    } else {
                        self.state.isInDangerZone = true;
                    }
                } );
                oApp.context.font = "bold 20px 'Arial'";
                oApp.context.textAlign = "right";
                oApp.context.fillText( this.score.current, game.app.width - 10, 30 );
                oApp.context.fillStyle = "white";

            }
        };
        Donuts = function( iDX ) {
            var iPairHeight = Donuts.generateNextPairHeight();

            this.frame = {
                "donuts": {
                    "sx": 827,
                    "sy": 415,
                    "sw": 70,
                    "sh": 69,
                    "dx": iDX,
                    "dy": iPairHeight,
                    "dw": 70,
                    "dh": 69
                }
            };
        };
        Donuts.prototype.draw = function() {
            game._drawSpriteFromFrame( this.frame.donuts );
        };
        Donuts.prototype.update = function() {
            var iPairHeight;

            this.frame.donuts.dx -= game.ground.speed;

            if ( this.frame.donuts.dx < ( this.frame.donuts.dw * -1 ) ) {
                this.frame.donuts.dx = game.app.width;
                iPairHeight = Donuts.generateNextPairHeight();
                this.frame.donuts.dy = iPairHeight;
            }

            this.draw();

        };
        Donuts.lastGeneratedPairHeight = -1 * ( 50 + Math.floor( Math.random() * 250 ) );

        Donuts.generateNextPairHeight = function() {
            var iMultiplier = Math.round( Math.random() ) % 2 ? 1 : -1,
                iMaxGap = 100,
                iNewValue = Donuts.lastGeneratedPairHeight + Math.floor( Math.random() * iMaxGap ) * iMultiplier;

            ( iNewValue > 50 ) && ( iNewValue = 50 );
            ( iNewValue < 400 ) && ( iNewValue = 400 );

            Donuts.lastGeneratedPairHeight = iNewValue;

            return iNewValue;
        };
        Donuts.generate = function( iAmount ) {
            var i = 0,
                iDonutsStartingPosition = 500,
                iDonutsGap = 180;

            for ( ; i < iAmount; i++ ) {
                game.donuts.unshift( new Donuts( iDonutsStartingPosition + ( i * iDonutsGap ) ) );
            }
            Donuts.generateNextPairHeight();
        };

        this._drawSpriteFromFrame = function( oFrame ) { // function pour dessiner les sprites
            this.app.context.drawImage(
                this.spriteSheet,
                oFrame.sx,
                oFrame.sy,
                oFrame.sw,
                oFrame.sh,
                oFrame.dx,
                oFrame.dy,
                oFrame.dw,
                oFrame.dh
            );
        };
        this.init = function() {
            if ( !this.eventsSetted ) {
                this.app.canvas.addEventListener( "click", this.homerRun.update.bind( this.homerRun ) );
                window.addEventListener( "keyup", this.homerRun.update.bind( this.homerRun ) );
                this.eventsSetted = true;
            }
            this.started = false;
            this.ended = false;
            this.donuts = [];
            this.homerRun.init();
            // reset some variables
            this.time.start = Date.now();
            // lancer l'animation
            this.animate();
        };
        this.animate = function() {
            this.time.current = Date.now();
            this.animationRequestID = window.requestAnimationFrame( this.animate.bind( this ) );
            this.app.context.clearRect( 0, 0, this.app.width, this.app.height ); // effacer le canvas qui se répête
            this.background.draw(); // Dessiner le background
            this.ground.update(); // Dessiner et animer la route
            this.homerRun.update();
            if ( this.time.current - this.time.start > 100 ) {
                this.time.start = Date.now();
                ( ++this.homerRun.animation.step < this.homerRun.animation.maxSteps ) || ( this.homerRun.animation.step = 0 ) || ( game.started !== true ) || ( ++this.homerRun.score.current );
            }
            this.donuts.forEach( function( ooDonuts ) {
                ooDonuts.update();
            } );

            this.homerRun.draw( this.homerRun.animation.step );
            // Tant que le jeu ne démarre pas on affiche les objets play
            if ( !game.started ) {
                this.play.draw();
            }
        };
        this.over = function() {
            var iCurrentScore = this.homerRun.score.current;

            window.cancelAnimationFrame( this.animationRequestID );

            this.ended = true;
            game.gameOver.draw();
            game.gameOver.drawScore( iCurrentScore );
        };
        // A FAIRE EN PREMIER
        this.spriteSheet = new Image(); // Charger le sprite.
        this.spriteSheet.addEventListener( "load", this.init.bind( this ) );
        this.spriteSheet.src = "./ressources/sprite2.png";
    };
    window.HomeRun = HomeRun; // accessible depuis l'extérieur
} )();
