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
        
        //game entities
        character,
        trail,
        
        //helper variables
        _running = false
    ;

    Escape.Main = function() {    };

    Escape.Main.prototype = {
        
          ///////{ Game setup }/////////////////////////////////////////
         //
        //
        create: function() {
            
            this.bColor = new tinycolor('#FF0000');
            this.stage.backgroundColor = 0x550000;
            
            ///////////////// setup player character //////////////////
            
            character = this.game.add.sprite(112, 300, 'sprites', 'player_ship');
            character.anchor.setTo(0, 0.5);
            this.game.add.tween(character.anchor).to({ y: 0.35 }, 600, Phaser.Easing.Linear.None, true, 0, -1, true);
            //character.tint = 0xffaaaa;
        
            
            ///////////////////// setup the trail //////////////////////
            /*
            trail = this.add.emitter(0, 0, 10);
            trail.makeParticles('sprites', 'part');
            trail.gravity = 0;
            trail.start(false, 100, 1);
            trail.minParticleSpeed.set(-500, 0);
            trail.maxParticleSpeed.set(-800, 0);
            */

            ////////////////////////// decor ///////////////////////////
            
            this.backCloudDecor2 = new Escape.Decorator(this.game, this.camera.width + 20, this.camera.height - 140, 'sprites', 'cloud', 1, 130, 3);
            this.backCloudDecor2.speed = 5500;
            this.backCloudDecor2.tint = 0x2D0505;
            this.backCloudDecor2.backRoom = 1500;
            
            this.backCloudDecor1 = new Escape.Decorator(this.game, this.camera.width + 20, this.camera.height - 70, 'sprites', 'cloud', 1, 100, 4);
            this.backCloudDecor1.speed = 5000;
            this.backCloudDecor1.tint = 0x7C0707;
            this.backCloudDecor1.backRoom = 1500;
            
            this.cloudDecor = new Escape.Decorator(this.game, this.camera.width + 20, this.camera.height, 'sprites', 'cloud', 1, 90, 5);
            this.cloudDecor.speed = 4500;
            this.cloudDecor.tint = 0xA50808;
            this.cloudDecor.backRoom = 1500;
            
            this.houseDecor2 = new Escape.Decorator(this.game, this.camera.width + 10, this.camera.height, 'sprites', 'house', 2, 60, 5);
            this.houseDecor2.speed = 2900;
            this.houseDecor2.tint = 0x300505;
            
            this.game.world.bringToTop(character);
            
            this.houseDecor = new Escape.Decorator(this.game, this.camera.width + 10, this.camera.height, 'sprites', 'house', 2, 40, 5);
            this.houseDecor.speed = 2000;
            this.houseDecor.tint = 0x000000;
            
            
            
            //////////////////// setup physics //////////////////////////
            
            this.game.physics.enable(character, Phaser.Physics.ARCADE);
            
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
            /*
            trail.x = character.x;
            trail.y = character.y;
            */
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
            
            /*this.bColor.spin(2);
            character.tint = 0xff0000;//this.bColor.toHex();
            this.stage.backgroundColor = this.bColor.toHex();*/
            
            this.houseDecor.update();
            this.houseDecor2.update();
            this.backCloudDecor2.update();
            this.backCloudDecor1.update();
            this.cloudDecor.update();
            
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