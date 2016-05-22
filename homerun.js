( function() {

    "use strict";

    var HomeRun;

    HomeRun = function( oApp ) {
        var game = this;

        this.app = oApp;
        this.time = {
            "start": null, // temps de départ
            "current": null // temps actuel
        };
        this.background = {  // BACKGROUND
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
        this.play = {  // BACKGROUND
            "frame": {
                "sx": 0, // Position X PHOTOSHOP
                "sy": 820, // Position Y PHOTOSHOP
                "sw": 150, // WIDTH
                "sh": 150, // HEIGHT
                "dx": 500, // Position X dans le jeu
                "dy": 300, // Position Y dans le jeu
                "dw": 150, // taille
                "dh": 150 // taille
            },
            "draw": function() {
                game._drawSpriteFromFrame( this.frame );
            }
        };
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

        this.homer = {
            "frame": [
                {
                    "sx": 0,
                    "sy": 684,
                    "sw": 150,
                    "sh": 89,
                    "dx": game.app.width /2,
                    "dy": game.app.height -500,
                    "dw": 65,
                    "dh": 89
                },
                {
                    "sx": 120,
                    "sy": 684,
                    "sw": 65,
                    "sh": 89
                },
                {
                    "sx": 240,
                    "sy": 684,
                    "sw": 65,
                    "sh": 89
                }
            ],
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
        this.start = function() {
            // setup events // Les évenements ne doivent être appelé qu'une seule fois.
            if ( !this.eventsSetted ) {
                this.eventsSetted = true;
            }
            // reset some variables
            this.time.start = Date.now();
            // launch animation
            this.animate();
        };

        this.animate = function() {
            this.time.current = Date.now();
            this.animationRequestID = window.requestAnimationFrame( this.animate.bind( this ) );
            this.app.context.clearRect( 0, 0, this.app.width, this.app.height ); // effacer le canvas qui se répête
            this.background.draw(); // Dessiner le background
            this.ground.update(); //Dessiner et animer la route
            this.homer.update();


        };
        // A FAIRE EN PREMIER
        this.spriteSheet = new Image(); // Charger le sprite.
        this.spriteSheet.addEventListener( "load", this.start.bind( this ) );
        this.spriteSheet.src = "./ressources/sprite2.png";
    };
    window.HomeRun = HomeRun; // accessible depuis l'extérieur
} )();
