(function() {
    
    /**
     * @constant {Object} Defines the locations of the bosses in each level
     * @static
     * @private
     */ 
    var bossLocations = {
        boss1: { x: 292 * 32, y: 17 * 32 }    
    
    };
    
    /**
     * B O S S
     * -------
     * 
     * Common boss object.
     * @param {Phaser.Game} game  ref to the game object
     * @param {Number}      x     x-position
     * @param {Number}      y     y-position
     * @param {String}      name  name of the boss
     */
    Lilja.Boss = function(game, x, y, name) {
        Phaser.Sprite.call(this, game, x, y, 'sprites', name);  
        
        game.add.existing(this);
    };
    
    Lilja.Boss.prototype = Object.create(Phaser.Sprite.prototype);
    Lilja.Boss.prototype.constructor = Lilja.Boss;
    
  
    /**
     * B O S S 1
     * ---------
     * 
     * The first boss of the game, found in the first level.
     * 
     * @param {Phaser.Game} game ref to the game object
     */
    Lilja.Boss1 = function(game) {
        Lilja.Boss.call(this, game, bossLocations.boss1.x, bossLocations.boss1.y, 'boss1');
    };
    
    Lilja.Boss1.prototype = Object.create(Lilja.Boss.prototype);
    Lilja.Boss1.prototype.constructor = Lilja.Boss1;
    
})();