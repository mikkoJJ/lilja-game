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
        rainbowInterval = 20,
        moveSpeed = 160,
        sinkSpeed = 140,
        rotateSpeed = 0.03,
        rainbowParts = 7,
        rainbowPartWidth = 43,
        rainbowOffsetY = -15,
        
        //game entities
        game,
        music,
        character,
        stars,
        rainbow,
        
        //helper variables
        _t = 0,
        _sinking = true,
        _targetRotation = 0
    ;
    
    
    //Phaser game object
    var snowman = {
        
        //================={Game setup:}=================//
        
        preload: function() {
            game.load.atlas('sprites', 'assets/walkingsprites.png', 'assets/walkingsprites_data.json');    
            game.load.audio('walking', 'assets/oskari_walking.ogg');
        },
    
        create: function() {
            //setup stage:
            game.stage.backgroundColor = 0x2C59B2;
            
            //setup player character:
            character = game.add.sprite(200, 300, 'sprites', 'snowman');
            character.anchor.setTo(0, 0.5);
            game.add.tween(character).to({x: character.x + 20}, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
            
            //setup background stars:
            stars = game.add.group();
            stars.createMultiple(20, 'sprites', 'star', false);
            
            //setup the lovely rainbow:
            rainbow = game.add.group();
            //rainbow.createMultiple(3, 'sprites', 'rainbow', true);
            
            for(var i=0; i < rainbowParts; i++) {
                var part = rainbow.create(0, 350, 'sprites', 'rainbow');
                part.x = i * rainbowPartWidth;
            }

            //setup background music:
            music = game.add.audio('walking');
            music.play('', 0, 1, true);
            
            //setup physics:
            game.world.bringToTop(character);
            game.physics.enable(character, Phaser.Physics.ARCADE);
            
            //bind input events:
            game.input.onDown.add(this.mouseDown, this);
            game.input.onUp.add(this.mouseUp, this);
        },
        
        
        
        //================={Updating:}=================//
        
        
        update: function() {
            this.makeStars();
            this.makeRainbow();
            
            _t++;
            
            character.body.velocity.y = -moveSpeed;
            //character.rotation = -0.1;
            //_targetRotation = -0.15;
            
            if(_sinking) {
                character.body.velocity.y = sinkSpeed;
              //  character.rotation = 0.1;
                //_targetRotation = 0.42;
            }
            
            //if(_targetRotation < character.rotation) character.rotation -= rotateSpeed;
            //else if(_targetRotation > character.rotation) character.rotation += rotateSpeed;
        },
        
        
        makeRainbow: function() {
            if(_t & rainbowInterval != 0) return; //only update at interval
            
            for(var i=0; i<rainbowParts-1; i++) {
                rainbow.getAt(i).y = rainbow.getAt(i+1).y;
            }
            rainbow.getAt(rainbowParts-1).y = character.y + rainbowOffsetY;
        },
        
        makeStars: function() {
            if(_t % starInterval != 0) return; //only update at interval
            
            var star = stars.getFirstExists(false);
            star.rotation = 0;
            star.anchor.set(0.5);
            
            var x = 750;
            var y = game.world.randomY;
            
            star.reset(x, y);
            
            game.add.tween(star).to({x:-50, rotation: -1}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                star.kill();
            });
        },
        
        
        //================={Input events:}=================//
        
        mouseDown: function(e) {
           _sinking = false; 
        },
        
        mouseUp: function(e) {
            _sinking = true;
        }
    };
    
    
    //start the game:
    game = new Phaser.Game(700, 700, Phaser.CANVAS, 'snowman-game', snowman);
    
})();
