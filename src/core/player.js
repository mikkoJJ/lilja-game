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

        /**
         * @property {Phaser.Key} cursor key buttons for movement
         */
        this.cursors = game.input.keyboard.createCursorKeys();
        
        /**
         * @property {Phaser.Key} the buttonn used for jumping
         */
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        /**
         * @property {Phaser.Key} the button used for gunning
         */
        this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        
        /**
         * @property {Boolean} wether this sprite is facing right or not [default = true]
         */
        this.facingRight = true;
        
        /**
         * @property {Lilja.Bullets} a special group containing fired bullets.
         */
        this.bullets = new Lilja.Bullets(game, this);
        
        /**
         * @property {Phaser.Sprite} a bang sprite for shooting
         */
        this.bang = game.add.sprite(45, -35, 'sprites', 'bang');
        
        /**
         * @property {Number} a helper timer for jumping
         */
        this._jumpTimer = 0;
        
        
        
        Phaser.Sprite.call(this, game, x, y, 'sprites', 'lilja_stand');
        this.game.add.existing(this);
        
        this.anchor.setTo(0.5, 0.9);
        
        this.game.physics.arcade.enable(this);
        this.body.maxVelocity = 500;
        this.body.width = 40;
        
        this.animations.add('walk', [ 'lilja_walk1', 'lilja_walk2'], 5, true);
        this.animations.add('gun_walk', [ 'lilja_walk1_gun', 'lilja_walk2_gun'], 5, true);
        this.animations.add('stand', [ 'lilja_stand' ], 1, true);
        this.animations.add('stand_gun', [ 'lilja_stand_gun' ], 1, true);
        
        this.shootTimer = this.game.time.create(false);
        this.shootTimer.loop(this.settings.shootInterval, this.shoot, this);
        this.shootTimer.start();
        
        this.addChild(this.bang);
        this.bang.anchor.set(0, 0.5);
        this.bang.scale.x = 0;
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
        shootInterval: 200
    };
    
    
    Lilja.Player.prototype.update = function() {
        Phaser.Sprite.prototype.update.call(this);
        
        var firing = false;
        if (this.fireButton.isDown) firing = true;        
        
        this.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            this.body.velocity.x = -150;
            if (firing) this.animations.play('gun_walk');
            else this.animations.play('walk');
            this.scale.x = -1;
        }
        else if (this.cursors.right.isDown)
        {
            this.body.velocity.x = 150;
            if (firing) this.animations.play('gun_walk');
            else this.animations.play('walk');
            this.scale.x = 1;
        }
        else
        {
            if (firing) this.animations.play('stand_gun');
            else this.animations.play('stand');
        }

        if (this.jumpButton.isDown && this.body.onFloor() && this.game.time.now > this._jumpTimer)
        {
            this.body.velocity.y = -500;
            this._jumpTimer = this.game.time.now + 750;
        }
    };
    
    /**
     * Process shooting the character's weapon. Shoot at a predefined interval.
     */
    Lilja.Player.prototype.shoot = function() {
        if (!this.fireButton.isDown) return;
        this.bullets.make(this.x + 45, this.y - 35);
        //var bang = this.game.add.tween(this.bang.scale).to({ x: 1 }, 50).to({ x: 0 }, 50);
        var bang = this.game.add.tween(this.bang.scale).from({ x: 1 }, 100);
        bang.start();
    };
    
    
    
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
        this.character = character;
        
        Phaser.Group.call(this, game);
        game.add.existing(this);
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
        bulletSpin: 500
    };
    
    
    /**
     * Fire a bullet at the specified location.
     * 
     * @param {Number} x x coordinate of location
     * @param {Number} y y coordinate of location
     */
    Lilja.Bullets.prototype.make = function(x, y) {
        var bullet = this.create(x, y, 'sprites', 'bullet');
        bullet.anchor.set(0.5);
        this.game.physics.arcade.enable(bullet);
        bullet.body.velocity.x = this.settings.bulletSpeed;
        bullet.body.velocity.y = this.game.rnd.between(-this.settings.shootScatter, this.settings.shootScatter);
        bullet.body.angularVelocity = this.settings.bulletSpin;
        bullet.body.allowGravity = false;
    };
    
    /**
     * Update bullets.
     */
    Lilja.Bullets.prototype.update = function() {
        Phaser.Group.prototype.update.call(this);
        
        this.forEach(function(bullet) {
            if (Math.abs(bullet.x - this.character.x) > 1000) bullet.destroy();
        }, this);
    };
    
})();