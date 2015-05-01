(function() {
    
    Escape.Decorator = function(game, x, y, key, sprite, numSprites, interval, storage) {
        
        /** the x position of the spawner */
        this.x = x;
        
        /** the y position of the spawner */
        this.y = y;
        
        /** the key of the sprites to spawn. */
        this.key = key;
        
        /** the base frame name of the sprites to spawn */
        this.sprite = sprite;
        
        /** the interval at which to spawn */
        this.interval = interval ? interval : 5;
        
        /** How many different kinds of sprites are possible */
        this.numSprites = numSprites;
        
        /** reference to the Phaser game */
        this.game = game;
        
        /** the Phaser group used for storing spawned objects */
        this.group = game.add.group();
        
        var amount = storage ? storage : 10;
        
        this.group.createMultiple(amount, key, sprite + 1, false);
        this.group.setAll('anchor.y', 1);
        
        this.__counter = 0;
    };
    
    Escape.Decorator.prototype = {
    
        update: function() {
            
            if ( this.__counter++ % this.interval === 0 ) {
                var decor = this.group.getFirstExists(false);
                decor.reset(this.x, this.y);
                decor.frameName = this.sprite + Math.floor(Math.random() * this.numSprites + 1);
                this.game.add.tween(decor).to({x: -400}, 900, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.kill();
                }, decor);
            }
        }
    
        
    
    };
    
    
})();