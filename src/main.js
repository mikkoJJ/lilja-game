/******************************************************
 * ===========
 * ESCAPE GAME
 * ===========
 *          by Mikko Jakonen
 *
 * A little HTML5 shmup or something.
 *****************************************************/

(function(){
    var 
        //settings
        starInterval = 300,
        rainbowInterval = 30,
        coinInterval = 3000,
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
        music,
        character,
        stars,
        coins,
        rainbow,
        emitter,
        
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

    Escape.Main = function() {

    };

    Escape.Main.prototype = {
        
        //================={Game setup:}=================//

        create: function() {
            //setup stage:
            this.game.stage.backgroundColor = 0x2C59B2;
            
            //setup player character:
            character = this.game.add.sprite(200, 300, 'sprites', 'snowman');
            character.anchor.setTo(0, 0.5);
            this.game.add.tween(character).to({x: character.x + 20}, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
            _idleTween = this.game.add.tween(character).to({y: character.y + 30}, 1200, Phaser.Easing.Linear.None, true, 0, -1, true);
            
            //setup object groups:
            stars = this.game.add.group();
            stars.createMultiple(10, 'sprites', 'star', false);
            
            coins = this.game.add.group();
            coins.createMultiple(20, 'sprites', 'flake', false);
            
            //setup the lovely rainbow:
            rainbow = this.game.add.group();
            //rainbow.createMultiple(3, 'sprites', 'rainbow', true);
            
            for(var i=0; i < rainbowParts; i++) {
                var part = rainbow.create(0, 350, 'sprites', 'rainbow');
                part.x = i * rainbowPartWidth;
            }

            //setup background music:
            music = this.game.add.audio('walking');
            
            //particle setup
            emitter = this.game.add.emitter(0, 0, 100);
            emitter.makeParticles('sprites', 'ding');
            emitter.gravity = 100;
            emitter.setAlpha(1, 0, 2000);
            
            //setup physics:
            this.game.world.bringToTop(character);
            this.game.physics.enable(character, Phaser.Physics.ARCADE);
            
            //menu texts:
            this.setupTexts();

            //bind input events:
            this.game.input.onDown.add(this.mouseDown, this);
            this.game.input.onUp.add(this.mouseUp, this);
            
            this.game.time.events.loop(rainbowInterval, this.makeRainbow, this);
            this.game.time.events.loop(starInterval, this.makeStars, this);
        },
        
        setupTexts: function() {
            var creditStyle = {font: '40px VT323', fill: 'white', align: 'left'};
            var headingStyle = {font: '60px VT323', fill:'white', align: 'center'};
            var gameStyle = {font: '25px VT323', fill:'blue', align: 'center'};
            
            title = this.game.add.text(this.game.world.centerX, 60, 'WALKING IN THE AIR\n THE GAME', headingStyle);
            title.anchor.set(0.5);
            
            instruction = this.game.add.text(this.game.world.centerX, 180, 'HOLD AND RELEASE MOUSE/FINGER TO PLAY', gameStyle);
            instruction.anchor.set(0.5);
            
            credits = this.game.add.text(20, this.game.world.height - 70, 'PROGRAMMING & GRAPHICS: MIKKO JAKONEN\nMUSIC: OSKARI JAKONEN', creditStyle);
            
            soundSetting = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 180, 'MUSIC: ON    ', gameStyle);
            soundSetting.anchor.set(0.5);
            soundSetting.inputEnabled = true;
            
            soundClickArea = new Phaser.Rectangle(soundSetting.x - 20, soundSetting.y - 20, soundSetting.width + 20, soundSetting.height + 20);
        },
        
        
        //start the actual game from the idle menu state:
        startGame: function() {
            _running = true;
            _idleTween.stop();
            if(musicEnabled) music.play('', 0, 1, true);
            
            this.game.time.events.loop(coinInterval, this.makeCoins, this);
            
            this.game.add.tween(title).to({y: -80}, 800, Phaser.Easing.Cubic.Out, true);
            this.game.add.tween(credits).to({y: this.game.world.height + 80}, 800, Phaser.Easing.Cubic.Out, true);
            this.game.add.tween(instruction).to({alpha:0}, 2000, Phaser.Easing.Cubic.Out, true);
            this.game.add.tween(soundSetting).to({alpha:0}, 800, Phaser.Easing.Linear.None, true);
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
            
            this.game.physics.arcade.collide(character, coins, this.collisionHandler, null, this);
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
            var y = this.game.world.randomY;
            
            star.reset(x, y);
            
            this.game.add.tween(star).to({x:-50, rotation: -1}, starsMoveSpeed, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                star.kill();
            });
        },
        
        makeCoins: function(){
            var coin = coins.getFirstExists(false);
            coin.rotation = 0;
            
            var x = 750;
            var y = this.game.world.randomY;
            
            coin.reset(x, y);
            
            this.game.add.tween(coin).to({rotation: -Math.PI*4}, coinSpinSpeed, Phaser.Easing.Linear.None, true);
            this.game.physics.enable(coin, Phaser.Physics.ARCADE);
            coin.body.velocity.x = -coinMoveSpeed;
        },
        
        
        collisionHandler: function(char, coin){
            emitter.x = coin.x;
            emitter.y = coin.y;
            
            emitter.start(true, 800, null, 20);
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
                        soundSetting.text = 'MUSIC: ON    ';
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
    
})();
