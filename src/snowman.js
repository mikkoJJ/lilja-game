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
        starInterval = 300,
        rainbowInterval = 30,
        coinInterval = 5000,
        moveSpeed = 160,
        sinkSpeed = 140,
        starsMoveSpeed = 1000,
        coinMoveSpeed = 90,
        coinSpinSpeed = 10000,
        rotateSpeed = 0.03,
        rainbowParts = 7,
        rainbowPartWidth = 43,
        rainbowOffsetY = -15,
        
        //game entities
        game,
        music,
        character,
        stars,
        coins,
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
            
            //setup object groups:
            stars = game.add.group();
            stars.createMultiple(10, 'sprites', 'star', false);
            
            coins = game.add.group();
            coins.createMultiple(20, 'sprites', 'flake', false);
            
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
            
            game.add.text(20, 20, 'JOTAIN', {font: '50px VT323', fill: 'white', align: 'center'});
            
            //bind input events:
            game.input.onDown.add(this.mouseDown, this);
            game.input.onUp.add(this.mouseUp, this);
            
            game.time.events.loop(starInterval, this.makeStars, this);
            game.time.events.loop(rainbowInterval, this.makeRainbow, this);
            game.time.events.loop(coinInterval, this.makeCoins, this);
        },
        
        
        
        //================={Updating:}=================//
        
        
        update: function() {
            
            character.body.velocity.y = -moveSpeed;
            
            if(_sinking) {
                character.body.velocity.y = sinkSpeed;
            }
            
            coins.forEachAlive(function(coin) {
                if (coin.x < -10) coin.kill();
            }, this);
        },
        
        
        makeRainbow: function() {
            //if(_t & rainbowInterval != 0) return; //only update at interval
            
            for(var i=0; i<rainbowParts-1; i++) {
                rainbow.getAt(i).y = rainbow.getAt(i+1).y;
            }
            rainbow.getAt(rainbowParts-1).y = character.y + rainbowOffsetY;
        },
        
        makeStars: function() {
            //if(_t % starInterval != 0) return; //only update at interval
            
            var star = stars.getFirstExists(false);
            star.rotation = 0;
            star.anchor.set(0.5);
            
            var x = 750;
            var y = game.world.randomY;
            
            star.reset(x, y);
            
            game.add.tween(star).to({x:-50, rotation: -1}, starsMoveSpeed, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                star.kill();
            });
        },
        
        makeCoins: function(){
            var coin = coins.getFirstExists(false);
                        
            var x = 750;
            var y = game.world.randomY;
            
            coin.reset(x, y);
            
            game.add.tween(coin).to({rotation: -Math.PI*4}, coinSpinSpeed, Phaser.Easing.Linear.None, true);
            game.physics.enable(coin, Phaser.Physics.ARCADE);
            coin.body.velocity.x = -coinMoveSpeed;
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
