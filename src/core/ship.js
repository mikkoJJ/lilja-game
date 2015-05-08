    /////////////////////////////////////////////////////////
   //* The player's ship game object is defined in this file.
  //*  Instantiate Escape.Ship to put the player in the world.
 //*
//*
(function() {
    
    var 
        //ship movement settings
        maxYVelocity = 460,
        accRate = 480,
        deccRate = 420
    ;
    
    /**
     * Escape.Ship
     * -----------
     * The player ship object.
     * 
     * @class Escape.Ship
     * @extends Phaser.Sprite
     * @param {Phaser.Game} game reference to the game object
     * @param {Number}      x    x position to create the ship in
     * @param {Number}      y    y position to create the ship in
     */
    Escape.Ship = function(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'sprites', 'player_ship');
        
        this._color = new tinycolor('#FFFFFF');
        
        this.anchor.setTo(0, 0.5);
        this.game.add.tween(this.anchor).to({ y: 0.35 }, 600, Phaser.Easing.Linear.None, true, 0, -1, true);
        
        this.game.physics.arcade.enable(this);
        
        this.game.add.existing(this);
    };
    
    Escape.Ship.prototype = Object.create(Phaser.Sprite.prototype);
    Escape.Ship.constructor = Escape.Ship;
    
    
    /**
     * Updates the sprite. Handles moving and shooting and other stuff.
     */
    Escape.Ship.prototype.update = function() {
        
        Phaser.Sprite.prototype.update.call(this);
    
        ////////////////////// steering and handling ////////////////////////////////

        var _acc = 0; 

        if ( this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ) {
            if ( Math.abs(this.body.velocity.y) < maxYVelocity ) _acc = -accRate;
        }
        else if ( this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ) { 
            if ( Math.abs(this.body.velocity.y) < maxYVelocity ) _acc = accRate;
        }
        else {
            if ( this.body.velocity.y > 0 ) _acc = -deccRate;
            if ( this.body.velocity.y < 0 ) _acc = deccRate;
        }

        this.body.acceleration.y = _acc;
        this.rotation = this.body.velocity.y / 1000;


        ////////////////////// color effect on the this ////////////////////////

        var color = new tinycolor(this._color.toString());
        color.darken( Math.floor((this.y / this.game.camera.height) * 80));
        this.tint = parseInt('0x' + color.toHex());
    };
    
    
})();