   /////////////////////////////////////////////////////////
  //* The player game object is defined here
 //*  along with some helper objects.
//*
(function() {

    /**
     * P L A Y E R
     * ===========
     * 
     * This class represents the player character in the game.
     * @extends Phaser.Sprite
     * @param {Phaser.Game} game reference to the Phaser Game object
     * @param {Number}      x    x position to spawn in
     * @param {Number}      y    y position to spawn in
     */
    Lilja.Player = function(game, x, y) {
        
        Phaser.Sprite.call(this, game, x, y, 'sprites', 'lilja_stand');
        this.game.add.existing(this);

        /**
         * @property {Phaser.Key} cursor key buttons for movement
         */
        this.cursors = game.input.keyboard.createCursorKeys();
        
        /**
         * @property {Phaser.Key} the buttonn used for jumping
         */
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        /**
         * @property {Phaser.GamepadButton} jump button for the gamepad. Null if not supported.
         */ 
        this.padJumpButton = { isDown: false };
        
        /**
         * @property {Phaser.Key} the button used for gunning
         */
        this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        
        /**
         * @property {Phaser.GamepadButton} fire button for the gamepad. Dummy button if not supported.
         */
        this.padFireButton = { isDown: false };
        
        this.gamePadEnabled = false;
        
        // Setup gamepad controls:
        if ( game.input.gamepad.supported && game.input.gamepad.active && Lilja.gamepad.connected ) {
            console.log('Player gamepad enabled.');
            this.padJumpButton = Lilja.gamepad.getButton(Phaser.Gamepad.XBOX360_A);
            this.padFireButton = Lilja.gamepad.getButton(Phaser.Gamepad.XBOX360_X);
            
            this.gamePadEnabled = true;
        }
        
        /**
         * @property {Boolean} wether this sprite is facing right or not [default = true]
         */
        this.facingRight = true;
        
        /**
         * @property {Lilja.Bullets} a special group containing fired bullets.
         */
        this.bullets = new Lilja.Bullets(game, this);
        
        /**
         * @property {Boolean} set to true to not allow the player to be hit by enemies.
         */
        this.invincible = false;
        
        /**
         * @property {Boolean} set to true to not allow the player to be controlled.
         */
        this.disableControls = false;
        
        /**
         * @property {Number} a helper timer for jumping
         */
        this._jumpTimer = 0;
        
        /**
         * @property {Boolean} this is set to true when the player takes fatal damage.
         */
        this._dead = false;
        
        /**
         * @property {Number} how many hitpoints do we currently have.
         */
        this._hitpoints = this.settings.hitpoints;
        
        
        this.anchor.setTo(0.5, 0.9);
        
        this.game.physics.arcade.enable(this);
        this.body.maxVelocity = 500;
        this.body.width = 40;
        
        this.animations.add('walk', [ 'lilja_walk1', 'lilja_walk2', 'lilja_walk3', 'lilja_walk2'], 5, true);
        this.animations.add('gun_walk', [ 'lilja_walk1_gun', 'lilja_walk2_gun', 'lilja_walk3_gun', 'lilja_walk2_gun'], 5, true);
        this.animations.add('stand', [ 'lilja_stand' ], 1, true);
        this.animations.add('jump', [ 'lilja_jump' ], 1, true);
        this.animations.add('stand_gun', [ 'lilja_stand_gun' ], 1, true);
        this.animations.add('jump_gun', [ 'lilja_jump_gun' ], 1, true);
        
        /**
         * @property {Phaser.Group} group containing the hitpoint ui component.
         */
        this.hitTracker = this.game.add.group();
        
        /**
         * @property {Phaser.Timer} timer that keeps track of shooting.
         */
        this.shootTimer = this.game.time.create(false);
        this.shootTimer.loop(this.settings.shootInterval, this.shoot, this);
        this.shootTimer.start();
        
        /**
         * @property {Phaser.Sprite} a bang sprite for shooting
         */
        this.bang = game.add.sprite(this.settings.shootPoint.x, this.settings.shootPoint.y, 'sprites', 'bang');
        this.addChild(this.bang);
        this.bang.anchor.set(0, 0.5);
        this.bang.scale.x = 0;
        
        /**
         * @property {Phaser.Emitter} emitter for dust particles when jumping
         */
        this.dustTrail = game.add.emitter(0, 0, 15);
        this.dustTrail.makeParticles('sprites', 'dust');
        this.dustTrail.gravity = 0;
        this.dustTrail.setXSpeed(-140, 140);
        this.dustTrail.setYSpeed(-100, -400);
    };
    
    Lilja.Player.prototype = Object.create(Phaser.Sprite.prototype);
    Lilja.Player.constructor = Lilja.Player;
    
    /**
     * Character settings
     */
    Lilja.Player.prototype.settings = {
        /**
         * The interval in milliseconds it takes for the gun to shoot.
         */
        shootInterval: 200,
        
        /**
         * The (absolute) velocity to apply when jumping.
         */
        jumpVelocity: 640,
        
        /**
         * The (absolute) velocity to apply when walking.
         */
        walkVelocity: 190, 
        
        /**
         * How many hitpoints does the player have.
         */
        hitpoints: 10,
        
        /**
         * The point in relation to the player sprite where bullets are
         * shot from.
         */
        shootPoint: { x: 46, y: -40}
    };
    
    /**
     * Updates the player. Calculates movement and other important stuff.
     */
    Lilja.Player.prototype.update = function() {
        Phaser.Sprite.prototype.update.call(this);
        
        var firing = false;
        if ( this.fireButton.isDown || this.padFireButton.isDown ) firing = true;        
        
        if ( this.disableControls ) return;
        this.body.velocity.x = 0;

        var left = this.cursors.left.isDown;
        if ( this.gamePadEnabled ) left = left || Lilja.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1;
        
        var right = this.cursors.right.isDown;
        if ( this.gamePadEnabled ) right = right || Lilja.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1;
        
        if ( left )
        {
            this.body.velocity.x = -this.settings.walkVelocity;
            if (firing) this.animations.play('gun_walk');
            else this.animations.play('walk');
            this.scale.x = -1;
        }
        else if ( right )
        {
            this.body.velocity.x = this.settings.walkVelocity;
            if (firing) this.animations.play('gun_walk');
            else this.animations.play('walk');
            this.scale.x = 1;
        }
        else
        {
            if ( firing ) this.animations.play('stand_gun');
            else this.animations.play('stand');
        }

        if ( !this.body.onFloor() )
        {
            if ( firing ) this.animations.play('jump_gun');
            else this.animations.play('jump');
        }
        else if ( this.jumpButton.isDown || this.padJumpButton.isDown ) {
            this.body.velocity.y = -this.settings.jumpVelocity;
            Lilja.sfx.play('jump1');
            this.dustTrail.x = this.x;
            this.dustTrail.y = this.y;
            this.dustTrail.start(true, 300, null, 6);
        }
    };
    
    /**
     * Process shooting the character's weapon. Shoot at a predefined interval.
     */
    Lilja.Player.prototype.shoot = function() {
        if ( !this.fireButton.isDown && !this.padFireButton.isDown ) return;
        if ( this.disableControls ) return; 
        this.bullets.make(this.x + this.scale.x * this.settings.shootPoint.x, this.y + this.settings.shootPoint.y, this.scale.x);
        var bang = this.game.add.tween(this.bang.scale).from({ x: 1 }, 100);
        bang.start();
    };
    
    /**
     * Called when the player is hit with a damaging attack.
     *
     * @param {Number} [damage=1]   how much damage does the attack do.
     */
    Lilja.Player.prototype.hit = function(damage) {
        if (this.invincible) return;
        damage = damage || 1;
        
        this.hitpoints -= damage;
        
        if ( this.hitpoints <= 0 ) this.die();
        
        if ( ! this._dead ) {
            this.game.time.events.add(1000, this._removeInvincibility, this);
            this.game.time.events.add(400, this._returnControl, this);
        }
        
        this.tint = 0xff0000;
        this.body.velocity.x = -400 * this.scale.x;
        this.body.velocity.y = -300;
        this.invincible = true;
        this.disableControls = true;
        
        
        Lilja.sfx.play('hurt');
    };
    
    
    /**
     * Kill the player.
     */
    Lilja.Player.prototype.die =  function() {
        this.frameName = 'lilja_jump';
        this._dead = true;
        this._explosionLoop = this.game.time.events.loop(160, this._explode, this);
        this.game.time.events.add(1000, this._finalExplode, this);
        this.game.time.events.add(500, this._returnControl, this);
    };
    
    /**
     * Create an explosion on the player.
     */
    Lilja.Player.prototype._explode = function() {
        var ex = this.game.add.image(this.x + this.game.rnd.integerInRange(-30, 30), this.y + this.game.rnd.integerInRange(-40, 40), 
                                     'sprites', 'explosion1');
        ex.anchor.set(0.5);
        
        this.game.add.tween(ex.scale).from({ x: 0, y: 0}, 300, Phaser.Easing.Back.Out, true)
            .onComplete.add(function() { this.destroy(); }, ex);
        
        Lilja.sfx.play('explosion1');
    };
    
    /**
     * Explode into nothing.
     */
    Lilja.Player.prototype._finalExplode = function() {
        var ex = this.game.add.image(this.x + this.game.rnd.integerInRange(-30, 30), this.y + this.game.rnd.integerInRange(-40, 40), 
                                     'sprites', 'explosion1');
        ex.anchor.set(0.5);
        ex.scale.set(3);
        
        this.game.add.tween(ex.scale).from({ x: 0, y: 0}, 300, Phaser.Easing.Back.Out, true)
            .onComplete.add(function() { this.destroy(); }, ex);
        
        Lilja.sfx.play('explosion1');
        this.game.time.events.remove(this._explosionLoop);
        
        this.kill();
    };
    
    
    /**
     * Call to disable invincibility after a hit.
     */
    Lilja.Player.prototype._removeInvincibility = function() {
        this.tint = 0xffffff;
        this.invincible = false;
    };
    
    /**
     * Call to return normal controls after a hit
     */
    Lilja.Player.prototype._returnControl = function() {
        this.disableControls = false;
    };
    
    /**
     * Animates the hitpoint tracker coming in.
     */
    Lilja.Player.prototype._makeHP = function() {
        var hpSprite;
        for (var hp = 0; hp < this.settings.hitpoints; hp++) {
            hpSprite = this.hitTracker.create(10 + 18 * hp, 20, 'sprites', 'hp_full');
            hpSprite.fixedToCamera = true;
            hpSprite.anchor.set(0.5);
            this.game.add.tween(hpSprite.scale).from({x: 0, y: 0 }, 500, Phaser.Easing.Bounce.Out, true, hp * 50);
        }
    };
    
    /**
     * @property {Number} hitpoints the number of hitpoints we currently have.
     * Setting this will update the hitpoint tracker.
     */
    Object.defineProperty(Lilja.Player.prototype, 'hitpoints', {
        get: function() {
            return this._hitpoints;
        },
        set: function(newhp) {
            if (newhp < this._hitpoints) {
                for (var i = this._hitpoints; i > newhp; i--) {
                    if ( i <= 0 ) break;
                    var hpSprite = this.hitTracker.getChildAt(i-1);
                    hpSprite.frameName = 'hp_empty';
                    this.game.add.tween(hpSprite.scale).to({x: 0.3, y: 0.3 }, 200, Phaser.Easing.Back.In, true);
                }
            }
            this._hitpoints = newhp;
        }
    });
    
    
    /**
     * B U L L E T S
     * =============
     * 
     * A group containing the bullets fired by the 
     * player character.
     * 
     * @param {Phaser.Game}  game      reference to the game object
     * @param {Lilja.Player} character reference to the player character object
     *                                 
     */
    Lilja.Bullets = function(game, character) {
        Phaser.Group.call(this, game);
        game.add.existing(this);
        
        this.character = character;
        
        this.createMultiple(10, 'sprites', 'bullet', false);
        this.forEach(function(bullet) {
            bullet.anchor.set(0.5);
            this.game.physics.arcade.enable(bullet);
            bullet.hit = Lilja.bulletHit;
            
            //bullet.body.velocity.y = this.game.rnd.between(-this.settings.shootScatter, this.settings.shootScatter);
            bullet.body.angularVelocity = this.settings.bulletSpin;
            bullet.body.allowGravity = false;
        }, this);
    };
    
    Lilja.Bullets.prototype = Object.create(Phaser.Group.prototype);
    Lilja.Bullets.constructor = Lilja.Bullets;
    
    /**
     * Bullet settings
     */
    Lilja.Bullets.prototype.settings = {    
        /**
         * How much do the shots scatter - higher number for more.
         */
        shootScatter: 150,
        
        /**
         * How fast do the bullets fly.
         */
        bulletSpeed: 900,
        
        /**
         * How fast do the bullets spin.
         */
        bulletSpin: 500,
        
        /**
         * Bounce value for bullets
         */
        bulletBounce: 0.7
    };
    
    /**
     * Fire a bullet at the specified location.
     * 
     * @param {Number} x             x coordinate of location
     * @param {Number} y             y coordinate of location
     * @param {Number} [direction=1] direction to fire bullets, 1=right, -1=left
     */
    Lilja.Bullets.prototype.make = function(x, y, direction) {
        var bullet = this.getFirstExists(false);
        bullet.reset(x, y);
        bullet.frameName = 'bullet';
        bullet.scale.set(1);
        bullet.body.enable = true;
        bullet.body.velocity.x = direction * this.settings.bulletSpeed;
        
        Lilja.sfx.play('shot1');
    };
    
    /**
     * Update bullets.
     */
    Lilja.Bullets.prototype.update = function() {
        Phaser.Group.prototype.update.call(this);
            
        this.forEachAlive(function(bullet) {
            if ( bullet.x > this.game.camera.x + this.game.camera.width || bullet.x < this.game.camera.x ) bullet.kill();
        }, this);
    };
    
    /**
     * Callback to when a bullet hits an enemy.
     * @param {Lilja.Enemy} enemy the enemy hit
     */
    Lilja.bulletHit = function(enemy) {
        this.frameName = 'bang';
        this.body.enable = false;
        this.game.add.tween(this.scale).to({x: 0, y: 0}, 200, Phaser.Easing.Linear.None, true)
            .onComplete.add(function() { this.kill(); }, this);
    };
    
})();