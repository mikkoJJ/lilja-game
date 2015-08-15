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
     * @extends {Phaser.Sprite}
     * @param {Phaser.Game}  game   reference to the Phaser Game object
     * @param {Number}       x      x position to spawn in
     * @param {Number}       y      y position to spawn in
     * @param {Lilja.Player} player reference to the player object for tracking purposes.
     * @param {Phaser.Group} group  group to add this zombie in
     */
    Lilja.Zombie = function(game, x, y, key) {
        
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
        this.chase = null;
        
        /**
         * @property {String} the zombie type, ie. the base sprite name for this particular dude.
         */
        this.zombieType = 'zombi1';
        
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
         * @property {Phaser.Group} a group in which to spawn projectiles created by some zombies
         */
        this.projectiles = null;
        
        /**
         * @property {Number} a random seed number to create more varying speeds across zombies.
         */
        this._speedBase = game.rnd.between(0, 25);
        
        Phaser.Sprite.call(this, game, x, y, key, this.zombieType + 'a');
        this.game.add.existing(this);
        
        this.anchor.setTo(0.5, 0.9);
        
        this.animations.add('walk', [ this.zombieType + 'a', this.zombieType + 'b', this.zombieType + 'c' ], 3, true);
        this.animations.play('walk');
        
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
        
        this.game.physics.arcade.collide(this.giblets, this.ground, this.gibSplat, null, this);
        
        if ( !this.inCamera ) return;
        
        this.move();
    };
    
    /**
     * Perform movement.
     */
    Lilja.Zombie.prototype.move = function() {
        var delta = this.chase.x - this.x;
        var direction = delta / (Math.abs(delta)); //plus or minus
        
        var speed = this.settings.speed 
                    + this.settings.speedVariance / 2 
                    + Math.sin(this.game.time.totalElapsedSeconds() + this._speedBase ) * this.settings.speedVariance
        ;
        
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
        Lilja.sfx.play('zombiehit');
        
        if ( ++this.hitsTaken >= this.maxHits ) this.die();
    };
    
    /**
     * Die a painful and gory death (again?).
     */
    Lilja.Zombie.prototype.die = function() {
        Lilja.sfx.play('zombiedie');
        this.kill();
        
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
    
    
    
    
    /**
     * M O L O T O V   Z O M B I E
     * ===========================
     * 
     * A zombie that stands in place and throws molotovs at
     * the player.
     * 
     * @extends {Lilja.Zombie}
     * @param {Phaser.Game}  game   reference to the Phaser Game object
     * @param {Number}       x      x position to spawn in
     * @param {Number}       y      y position to spawn in
     * @param {Lilja.Player} player reference to the player object for tracking purposes.
     */
    Lilja.MolotovZombie = function(game, x, y) {
        Lilja.Zombie.call(this, game, x, y, 'sprites');
        
        var attack = this.animations.add('throw', ['zombi2_throw2', 'zombi2', 'zombi2_throw1'], 1, true);
        attack.onLoop.add(this._throw, this);
        this.animations.play('throw');
        
        this.body.immovable = true;
    };
    
    Lilja.MolotovZombie.prototype = Object.create(Lilja.Zombie.prototype);
    Lilja.MolotovZombie.constructor = Lilja.MolotovZombie;
    
    /**
     * Molotov zombie doesn't move.
     */
    Lilja.MolotovZombie.prototype.move = function() {};
    
    /**
     * How fast does the molotov fly (when the player is 500 units away).
     */ 
    Lilja.MolotovZombie.prototype.settings.molotovSpeed = 500;
    
    /**
     * Throw a molotov in the correct position of the animation.
     */
    Lilja.MolotovZombie.prototype._throw = function() {
        if (!this.inCamera) return;
        
        var molotov = this.game.add.sprite(this.x, this.y, 'sprites', 'molotov');
        molotov.anchor.set(0.5);
        molotov.damage = 2;
        molotov.hit = Lilja.MolotovZombie._molotovHit;
        this.projectiles.add(molotov);
        
        var delta = this.chase.x - this.x;
        var direction = delta / (Math.abs(delta));
        
        var speed = this.settings.molotovSpeed * (Math.abs(delta) / 500);
        
        var time = Math.abs(delta) / speed;
        
        this.game.physics.arcade.enable(molotov);
        molotov.body.velocity.x = direction * speed;
        molotov.body.velocity.y = -this.game.physics.arcade.gravity.y * time / 2;
        
        this.scale.x = direction;  
    };
    
    /**
     * Called when a molotov hits a target. This refers to the molotov itself.
     * 
     * @static
     * @private
     * @param {Object} target the target that the molotov hit.
     */
    Lilja.MolotovZombie._molotovHit = function(target) {
        if ( this._exploded ) return;
        this.frameName = 'explosion1';
        this.body.immovable = true;
        this.body.allowGravity = false;
        this._exploded = true;
        this.body.velocity.set(0);
        this.game.time.events.loop(100, function(){ this.visible = !this.visible; }, this);
        this.game.time.events.add(1000, function(){ this.destroy(); }, this);
        Lilja.sfx.play('explosion1');
    };
    
})();