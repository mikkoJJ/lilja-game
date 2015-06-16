   /////////////////////////////////////////////////////////
  //* The enemy game objects are defined here
 //*  along with some helper stuff.
//*
(function() {

    /**
     * Z O M B I E
     * ===========
     * 
     * The main bad guys of the game. They can slowly shuffle
     * towards the player very menacingly.
     * 
     * @extends Phaser.Sprite
     * @param {Phaser.Game}  game   reference to the Phaser Game object
     * @param {Number}       x      x position to spawn in
     * @param {Number}       y      y position to spawn in
     * @param {Lilja.Player} player reference to the player object for tracking purposes.
     * @param {Phaser.Group} group  group to add this zombie in
     */
    Lilja.Zombie = function(game, x, y, player, group) {
        
        /**
         * @property {Boolean} wether this sprite is facing right or not [default = true]
         */
        this.facingRight = true;        
        
        /**
         * @property {Phaser.Emitter} a particle emitter for a blood splatter effect.
         */
        this.splatter = game.add.emitter(0, 0, 50);
        
        /**
         * @property {Phaser.DisplayObject} chase this object around.
         */
        this.chase = player;
        
        /**
         * @property {String} the zombie type, ie. the base sprite name for this particular dude.
         */
        this.zombieType = 'zombie1';
        
        /**
         * @property {Number} how many times has this zombie been hit.
         */
        this.hitsTaken = 0;
        
        /**
         * @property {Number} how many hits the zombie can take before dying.
         */
        this.maxHits = this.settings.hits;
        
        /**
         * @property {Lilja.Giblets} giblets for gibbing.
         */
        this.giblets = game.add.emitter(0, 0, 25);
        
        /**
         * @property {Phaser.TilemapLayer} reference to the ground layer for gib collision.
         */
        this.ground = null;
        
        /**
         * @property {Number} a random seed number to create more varying speeds across zombies.
         */
        this._speedBase = game.rnd.between(0, 25);
        
        Phaser.Sprite.call(this, game, x, y, 'sprites', this.zombieType);
        this.game.add.existing(this);
        group.add(this);
        
        this.anchor.setTo(0.5, 0.9);
        
        this.game.physics.arcade.enable(this);
        this.body.maxVelocity = 500;
        this.body.width = 40;
        
        this.splatter.makeParticles('sprites', 'splatter');
        this.splatter.gravity = -1000;
        
        this.giblets.makeParticles('sprites', 'gib', 60, true);
        this.giblets.enableBody = true;
        this.giblets.physicsBodyType = Phaser.Physics.ARCADE;
        this.giblets.setXSpeed(-300, 300);
        this.giblets.setYSpeed(-550, -200);
    };
    
    Lilja.Zombie.prototype = Object.create(Phaser.Sprite.prototype);
    Lilja.Zombie.constructor = Lilja.Zombie;
    
    
    /**
     * Enemy settings
     */
    Lilja.Zombie.prototype.settings = {
        /**
         * Default shuffling speed
         */
        speed: 25,
        
        /**
         * How much does the speed vary
         */
        speedVariance: 20,
        
        /**
         * How many hits until a zombie dies by default.
         */
        hits: 3
    };
    
    /**
     * Update the Zombie AI.
     */
    Lilja.Zombie.prototype.update = function() {
        Phaser.Sprite.prototype.update.call(this);
        
        var direction = (this.chase.x - this.x) / (Math.abs(this.chase.x - this.x)); //plus or minus
        
        var speed = this.settings.speed 
                    + this.settings.speedVariance / 2 
                    + Math.sin(this.game.time.totalElapsedSeconds() + this._speedBase ) * this.settings.speedVariance
        ;
        
        this.game.physics.arcade.collide(this.giblets, this.ground, this.gibSplat, null, this);
        
        this.body.velocity.x = direction * speed;
        this.scale.x = direction;
    };
    
    /**
     * Called by the main state when this zombie is hit
     * (with a bullet).
     */
    Lilja.Zombie.prototype.hit = function(bullet) {
        this.splatter.x = bullet.x;
        this.splatter.y = bullet.y;
        
        this.splatter.start(true, 200, null, 5);
        Lilja.sfx.play('splat');
        
        if ( ++this.hitsTaken >= this.maxHits ) this.die();
    };
    
    /**
     * Die a painful and gory death (again?).
     */
    Lilja.Zombie.prototype.die = function() {
        Lilja.sfx.play('bigsplat');
        
        this.splatter.x = this.x;
        this.splatter.y = this.y;
        this.splatter.start(true, 400, null, 25);
        
        this.giblets.x = this.x;
        this.giblets.y = this.y;
        this.giblets.start(true, 1000, null, 20);
        
        this.alpha = 0;
        
        this.game.time.events.add(4000, this.destroy, this);
    };
    
    
    /**
     * Called when a gib hits the ground. Create a little gib splatter
     * where the hit occurred.
     */
    Lilja.Zombie.prototype.gibSplat = function(gib, ground) {
        if ( gib.y > ground.top ) return;
        var x = Phaser.Math.clamp(gib.x, ground.left, ground.right);
        var spl = this.game.add.image(x, ground.top, 'sprites', 'smallsplat');
        spl.anchor.set(0.5, 1);
        gib.kill();
    };
    
})();