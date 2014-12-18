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
        
        //texts:
        title,
        instruction,
        credits,
        soundSetting,
        soundClickArea,
        
        score = 0,
        
        musicEnabled = true,
        
        //helper variables
        _idleTween,
        _running = false,
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
            _idleTween = game.add.tween(character).to({y: character.y + 30}, 1200, Phaser.Easing.Linear.None, true, 0, -1, true);
            
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
            //music.play('', 0, 1, true);
            
            //setup physics:
            game.world.bringToTop(character);
            game.physics.enable(character, Phaser.Physics.ARCADE);
            
            //menu texts:
            this.setupTexts();

            //bind input events:
            game.input.onDown.add(this.mouseDown, this);
            game.input.onUp.add(this.mouseUp, this);
            
            game.time.events.loop(rainbowInterval, this.makeRainbow, this);
            game.time.events.loop(starInterval, this.makeStars, this);
        },
        
        setupTexts: function() {
            var creditStyle = {font: '40px VT323', fill: 'white', align: 'left'};
            var headingStyle = {font: '60px VT323', fill:'white', align: 'center'};
            var gameStyle = {font: '25px VT323', fill:'blue', align: 'center'};
            
            title = game.add.text(game.world.centerX, 60, 'WALKING IN THE AIR\n THE GAME', headingStyle);
            title.anchor.set(0.5);
            
            instruction = game.add.text(game.world.centerX, 180, 'HOLD AND RELEASE MOUSE/FINGER TO PLAY', gameStyle);
            instruction.anchor.set(0.5);
            
            credits = game.add.text(20, game.world.height - 70, 'PROGRAMMING & GRAPHICS: MIKKO JAKONEN\nMUSIC: OSKARI JAKONEN', creditStyle);
            
            soundSetting = game.add.text(game.world.centerX, game.world.centerY + 180, 'MUSIC: ON  :)', gameStyle);
            soundSetting.anchor.set(0.5);
            soundSetting.inputEnabled = true;
            
            soundClickArea = new Phaser.Rectangle(soundSetting.x - 20, soundSetting.y - 20, soundSetting.width + 20, soundSetting.height + 20);
        },
        
        
        //start the actual game from the idle menu state:
        startGame: function() {
            _running = true;
            _idleTween.stop();
            if(musicEnabled) music.play('', 0, 1, true);
            
            game.time.events.loop(coinInterval, this.makeCoins, this);
            
            game.add.tween(title).to({y: -80}, 800, Phaser.Easing.Cubic.Out, true);
            game.add.tween(credits).to({y: game.world.height + 80}, 800, Phaser.Easing.Cubic.Out, true);
            game.add.tween(instruction).to({alpha:0}, 2000, Phaser.Easing.Cubic.Out, true);
            game.add.tween(soundSetting).to({alpha:0}, 800, Phaser.Easing.Linear.None, true);
        },
        
        //================={Updating:}=================//
        
        
        update: function() {
            if(!_running) return;
            
            character.body.velocity.y = -moveSpeed;
            
            if(_sinking) {
                character.body.velocity.y = sinkSpeed;
            }
            
            coins.forEachAlive(function(coin) {
                if (coin.x < -10) coin.kill();
            }, this);
            
            game.physics.arcade.collide(character, coins, this.collisionHandler, null, this);
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
        
        
        collisionHandler: function(char, coin){
            score++;
            coin.kill();
        },
        
        
        //================={Input events:}=================//
        
        mouseDown: function(e) {            
            if(!_running) {
                if(soundClickArea.contains(e.x, e.y)) {
                    if(musicEnabled) {
                        soundSetting.text = 'MUSIC: OFF :(';
                        musicEnabled = false;
                    } else {
                        soundSetting.text = 'MUSIC: ON  :)';
                        musicEnabled = true;
                    }
                    return;
                }
                
                this.startGame();
            }
            _sinking = false; 
        },
        
        mouseUp: function(e) {
            _sinking = true;
        }
    };
    
    
    //start the game:
    game = new Phaser.Game(700, 700, Phaser.CANVAS, 'snowman-game', snowman);
    
})();
