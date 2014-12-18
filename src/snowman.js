/******************************************************
 * ================
 * The snowman game
 * ================
 *          by Mikko Jakonen
 *
 * A silly little game about a flying snowman. Built
 * on the Phaser HTML5 framework: http://phaser.io
 *****************************************************/

(function(){

    var 
        //settings
        starInterval = 10,
        moveSpeed = 160,
        sinkSpeed = 140,
        
        //game entities
        game,
        music,
        character,
        stars,
        rainbow,
        
        //helper variables
        _t = 0,
        _sinking = true
    ;
    
    
    //Phaser game object
    var Snowman = {

        preload: function() {
            game.load.atlas('sprites', 'assets/walkingsprites.png', 'assets/walkingsprites_data.json');    
            game.load.audio('walking', 'assets/oskari_walking.ogg');
        },
    
        
        //Game setup:
        create: function() {
            //setup stage:
            game.stage.backgroundColor = 0x2C59B2;
            
            //setup player character:
            character = game.add.sprite(300, 300, 'sprites', 'rudolph');
            character.anchor.set(0.5);
            game.add.tween(character).to({x: 320}, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
            
            //setup background stars:
            stars = game.add.group();
            stars.createMultiple(20, 'sprites', 'star', false);
            
            //setup the lovely rainbow:
            rainbow = game.add.group();
            rainbow.createMultiple(3, 'sprites', 'rainbow', true);
            rainbow.setAll('scale.x', 0.3);
            rainbow.setAll('anchor.y', 0.5);
            rainbow.setAll('y', 350);
            rainbow.getAt(0).x = 0;
            rainbow.getAt(1).x = 70;
            rainbow.getAt(2).x = 140;

            //setup background music:
            music = game.add.audio('walking');
            //music.play();
            
            //setup physics:
            game.world.bringToTop(character);
            game.physics.enable(character, Phaser.Physics.ARCADE);
            
            //bind input events:
            game.input.onDown.add(this.mouseDown, this);
            game.input.onUp.add(this.mouseUp, this);
        },
        
        
        update: function() {
            this.makeStars();
            this.makeRainbow();
            
            character.body.velocity.y = -moveSpeed;
            character.rotation = -0.1;
            if(_sinking) {
                character.body.velocity.y = sinkSpeed;
                character.rotation = 0.12;
            }
        },
        
        makeRainbow: function() {
            rainbow.getAt(0).y = rainbow.getAt(1).y;
            rainbow.getAt(1).y = rainbow.getAt(2).y;
            rainbow.getAt(2).y = character.y;
        },
        
        makeStars: function() {
            if(_t++ % starInterval != 0) return;
            
            var star = stars.getFirstExists(false);
            star.rotation = 0;
            star.anchor.set(0.5);
            
            var x = 750;
            var y = game.rnd.integerInRange(0, 700);
            
            star.reset(x, y);
            
            game.add.tween(star).to({x:-50, rotation: -1}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                star.kill();
            });
        },
        
        
        mouseDown: function(e) {
           _sinking = false; 
        },
        
        mouseUp: function(e) {
            _sinking = true;
        }
    };
    
    
    //start the game:
    game = new Phaser.Game(700, 700, Phaser.CANVAS, 'snowman-game', Snowman);
    
})();
