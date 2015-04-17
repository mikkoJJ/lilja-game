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
        maxYVelocity = 460,
        accRate = 280,
        deccRate = 220,
        
        //game entities
        character,
        trail,
        
        _running = false
    ;

    /**
     * The main game state.
     */
    Escape.Main = function() {    };

    Escape.Main.prototype = {
        
        //================={Game setup:}=================//

        create: function() {
            //setup stage:
            this.bColor = new tinycolor('#57667f');
            
            ///////////////// setup player character: //////////////////
            
            character = this.game.add.sprite(112, 300, 'sprites', 'player_ship');
            character.anchor.setTo(0, 0.5);
            this.game.add.tween(character.anchor).to({ y: 0.35 }, 600, Phaser.Easing.Linear.None, true, 0, -1, true);
        
            
            ///////////////////// setup the trail //////////////////////
            
            trail = this.add.emitter(0, 0, 10);
            trail.makeParticles('sprites', 'part');
            trail.gravity = 0;
            trail.start(false, 100, 1);
            trail.minParticleSpeed.set(-500, 0);
            trail.maxParticleSpeed.set(-800, 0);
            
            
            ////////////////// setup physics: //////////////////////////
            
            this.game.world.bringToTop(character);
            this.game.physics.enable(character, Phaser.Physics.ARCADE);
            

            /////////////////// bind input events: /////////////////////
            
            _running = true;
        },
                
        
        //================={Updating:}=================//
        
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
            
            var rotationCap = Math.PI / 15;
            if (character.rotation > rotationCap) character.rotation = rotationCap;
            if (character.rotation < -rotationCap) character.rotation = -rotationCap;
            
            this.bColor.spin(2);
            this.stage.backgroundColor = this.bColor.toHex();
        }
    };
    
})();
