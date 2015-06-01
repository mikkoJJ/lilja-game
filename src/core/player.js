    /////////////////////////////////////////////////////////
   //* The player's ship game object is defined in this file.
  //*  Instantiate Escape.Ship to put the player in the world.
 //*
//*
(function() {

    /**
     * PLAYER
     * ------
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
         * @property {Boolean} wether this sprite is facing right or not [default = true]
         */
        this.facingRight = true;
        
        /**
         * @property {Number} a helper timer for jumping
         */
        this._jumpTimer = 0;
        
        
        Phaser.Sprite.call(this, game, x, y, 'sprites', 'lilja_stand');
        
        this.game.add.existing(this);
        
        this.anchor.setTo(0.5, 0.9);
        
        this.game.physics.arcade.enable(this);
        
        this.body.maxVelocity = 500;
        this.body.collideWorldBounds = true;
        
        this.animations.add('walk', [ 'lilja_walk1', 'lilja_walk2'], 5, true);
        this._gunFrames = ['lilja_walk_gun1', 'lilja_walk_gun2'];
        this.animations.add('stand', [ 'lilja_stand' ], 1, true);
                
    };
    
    Lilja.Player.prototype = Object.create(Phaser.Sprite.prototype);
    Lilja.Player.constructor = Lilja.Player;
    
    /**
     * Set the sprite to face left.
     */
    Lilja.Player.prototype.faceLeft = function() {
        this.scale.x = -1;
        this.facingRight = false;
    };
    
    /**
     * Set the sprite to face right.
     */
    Lilja.Player.prototype.faceRight = function() {
        this.scale.x = 1;
        this.facingRight = true;
    };
    
    
    Lilja.Player.prototype.update = function() {
        Phaser.Sprite.prototype.update.call(this);
        
        this.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            this.body.velocity.x = -150;
            this.animations.play('walk');
            this.scale.x = -1;
        }
        else if (this.cursors.right.isDown)
        {
            this.body.velocity.x = 150;
            this.animations.play('walk');
            this.scale.x = 1;
        }
        else
        {
            this.animations.play('stand');
           /* if (facing != 'idle')
            {
                //this.animations.stop();

                if (facing == 'left')
                {
                    this.frame = 0;
                }
                else
                {
                    this.frame = 5;
                }

                facing = 'idle';
            }*/
        }

        if (this.jumpButton.isDown && this.body.onFloor() && this.game.time.now > this._jumpTimer)
        {
            this.body.velocity.y = -500;
            this._jumpTimer = this.game.time.now + 750;
        }
    };
})();