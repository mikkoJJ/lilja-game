       //////////////////////////////////////////////////////
      //* =====================
     //*  E S C A P E   G A M E
    //*   =====================
   //*          by Mikko Jakonen
  //*
 //*      A little HTML5 shmup game or something.
//*
(function(){
    var 
        //ship movement settings
        maxYVelocity = 460,
        accRate = 480,
        deccRate = 420,
        
        //how many houses to keep in reserve
        houseStore = 10,
        //the house sprite names
        houses = [ 'house1', 'house2', 'house3', 'house4' ],
        //how often to spawn houses
        houseInterval = 5,
        
        //game entities
        character,
        trail,
        
        //helper variables
        _running = false,
        _houseCounter = 0
    ;

    Escape.Main = function() {    };

    Escape.Main.prototype = {
        
          ///////{ Game setup }/////////////////////////////////////////
         //
        //
        create: function() {
            
            this.bColor = new tinycolor('#57667f');
            
            ///////////////// setup player character //////////////////
            
            character = this.game.add.sprite(112, 300, 'sprites', 'player_ship');
            character.anchor.setTo(0, 0.5);
            this.game.add.tween(character.anchor).to({ y: 0.35 }, 600, Phaser.Easing.Linear.None, true, 0, -1, true);
            character.tint = 0xffaaaa;
        
            
            ///////////////////// setup the trail //////////////////////
            
            trail = this.add.emitter(0, 0, 10);
            trail.makeParticles('sprites', 'part');
            trail.gravity = 0;
            trail.start(false, 100, 1);
            trail.minParticleSpeed.set(-500, 0);
            trail.maxParticleSpeed.set(-800, 0);
            
            
            //////////////////// setup physics //////////////////////////
            
            this.game.world.bringToTop(character);
            this.game.physics.enable(character, Phaser.Physics.ARCADE);
            

            ////////////////////////// decor ///////////////////////////
            
            this.floorGroup = this.add.group();  
            this.floorGroup.createMultiple(houseStore, 'sprites', 'house1', false);
            
            ////////////////////////// input events ///////////////////////////
            
            this.shootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.shootKey.onDown.add(this.shoot, this);
            
            this.lasers = this.add.group();
            this.lasers.enableBody = true;
            this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
            this.lasers.createMultiple(5, 'sprites', 'lazer', false);
            
            
            _running = true;
        },
                
        
          ////////// { Updating } ///////////////////////////////////////
         //
        //
        update: function() {
            if(!_running) return;
            
            trail.x = character.x;
            trail.y = character.y;
            
            var _acc = 0; 
            
            if ( this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ) {
                if ( Math.abs(character.body.velocity.y) < maxYVelocity ) _acc = -accRate;
            }
            else if ( this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ) { 
                if ( Math.abs(character.body.velocity.y) < maxYVelocity ) _acc = accRate;
            }
            else {
                if ( character.body.velocity.y > 0 ) _acc = -deccRate;
                if ( character.body.velocity.y < 0 ) _acc = deccRate;
            }
            
            character.body.acceleration.y = _acc;
            character.rotation = character.body.velocity.y / 1000;
            
            this.bColor.spin(2);
            this.stage.backgroundColor = this.bColor.toHex();
            
            if ( _houseCounter++ % houseInterval === 0 ) {
                var house = this.floorGroup.getFirstExists(false);
                house.reset(this.camera.width + 10, this.camera.height - 100);
                house.frameName = houses[Math.floor(Math.random() * houses.length)];
                house.scale.set(2);
                this.add.tween(house).to({x: -50}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.kill();
                }, house);
            }
            
            this.lasers.forEachAlive(function(laser) {
                if (laser.x > this.camera.width + 10)
                    laser.kill();
            }, this);
        },
        
        shoot: function() {
            var lazer = this.lasers.getFirstExists(false);
            lazer.reset(character.x, character.y);
            lazer.body.velocity.x = 900;
            //this.game.add.tween(lazer).to({x: 1000}, 300, null, true);
        }
    };
    
})();