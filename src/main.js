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
        moveSpeed = 160,
        maxYVelocity = 360,
        accRate = 250,
        deccRate = 190,
        
        //game entities
        character,
        trail,
        
        //y velocity:
        _vy = 0,
        _running = false
    ;

    Escape.Main = function() {

    };

    Escape.Main.prototype = {
        
        //================={Game setup:}=================//

        create: function() {
            //setup stage:
            this.game.stage.backgroundColor = 0x000000 + 0x0000ff;//0x2C59B2;
            
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
            console.log(character.body.velocity.y);
            
            
            /*if(_sinking) {
                character.body.velocity.y = sinkSpeed;
            }*/
            
            //this.game.physics.arcade.collide(character, coins, this.collisionHandler, null, this);
        }
    };
    
})();
