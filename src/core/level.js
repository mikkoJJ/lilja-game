(function() {
    
    /**
     * The level contains all objects contained in a game level (player, bullets, enemies), and
     * handles collision detection and other logic of said objects.
     * 
     * @param {Phaser.Game} game reference to the game object
     * @param {String}      name name of the level, same as the name of the tilemap
     */
    Lilja.Level = function(game, name) {

        /**
         * @property {Phaser.Game} reference to the game object.
         */
        this.game = game;
        
        /**
         * @property {String} the name of this level
         */
        this.name = name;
        
        /** 
         * @property {Phaser.Tilemap} the level tilemap
         */
        this.map = this.game.add.tilemap(name);
        
        /**
         * @property {Phaser.TilemapLayer} the layer containing the whole background
         */
        this.mapLayer = null;
        
        /**
         * @property {Phaser.Group} group containing the enemies
         */
        this.enemies = this.game.add.group();
    };
    
    
    Lilja.Level.prototype = {
        
        /**
         * @property {Object} static settings for the level objects
         */
        settings: {
            zombieID: 9, molotovZombieID: 7, bossID: 1
        },
        
        /**
         * Creates the map. Uses a loaded tileset with the same name given as the 
         * name of this level.
         */
        create: function() {
            this.map.addTilesetImage('tiles', 'tiles');
            
            this.mapLayer = this.map.createLayer('bg');
            this.mapLayer.resizeWorld();
            
            this.map.setCollisionByExclusion([1, 10, 18, 19, 50, 23, 24, 54, 55, 31, 5, 36], true, this.layerBg, true);
            
            this.game.world.sendToBack(this.mapLayer);
            
            /**
             * @property {Phaser.Audio} intro music for the level
             */
            this.introMusic = this.game.add.audio('intromusic');
            
            /**
             * @property {Phaser.Audio} the background music for the level.
             */
            this.bgMusic = this.game.add.audio('levelmusic');
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.6;
        },
        
        /**
         * Populate the map with enemies and get references for other 
         * objects based on the objects in the tilemap. Also creates
         * the player object to be controlled on the level.
         *
         * @see Lilja.Level.settings.zombieID
         */
        createObjects: function() {
            this.player = new Lilja.Player(this.game, 112, this.game.world.height - 64);
            this.player.events.onKilled.add(this.respawn, this);
            
            this.game.camera.y = this.game.world.height - this.game.camera.height;
            
            this.bullets = this.player.bullets;
            this.enemies = this.game.add.group();
            this.projectiles = this.game.add.group();
                
            this.map.createFromObjects('spawnpoints', this.settings.zombieID, 'sprites', 'zombi1a', true, false, 
                                       this.enemies, Lilja.Zombie, true);
            this.map.createFromObjects('spawnpoints', this.settings.molotovZombieID, 'sprites', 'zombi1a', true, false, 
                                       this.enemies, Lilja.MolotovZombie, true);
            this.enemies.setAll('chase', this.player);
            this.enemies.setAll('ground', this.mapLayer);
            this.enemies.setAll('projectiles', this.projectiles);
        },
        
        /**
         * Handle collisions between objects and the level map.
         */
        handleCollisions: function() {
            this.game.physics.arcade.collide(this.player, this.enemies, this._playerEnemyCollision, this._playerEnemyProcess, this);
            this.game.physics.arcade.collide(this.bullets, this.mapLayer, this._bulletWallCollision, null, this);
            this.game.physics.arcade.collide(this.bullets, this.enemies, this._bulletEnemyCollision, null, this);
            this.game.physics.arcade.collide(this.projectiles, this.player, this._playerEnemyCollision, null, this);
            this.game.physics.arcade.collide(this.projectiles, this.mapLayer, this._bulletWallCollision, null, this);
            this.game.physics.arcade.collide(this.player, this.mapLayer);
            this.game.physics.arcade.collide(this.enemies, this.mapLayer);
            this.game.physics.arcade.collide(this.giblets, this.mapLayer);
        },
        
        /**
         * Remake the level. Called when the player dies.
         */
        respawn: function() {
            var black = this.game.add.graphics(0, 0);
            black.beginFill(0x000000);
            black.drawRect(0, 0, this.game.world.width, this.game.world.height);
            black.endFill();
            
            var _doRespawn = function() {
                Lilja.skipIntro = true;
                this.game.time.events.add(200, function() { this.game.state.restart(); }, this);
            };
            
            this.game.add.tween(black).from({ y: -this.game.world.height }, 500, Phaser.Easing.Cubic.Out, true)
                .onComplete.add(_doRespawn, this);
        },
        
        /**
         * Show the level intro
         */
        intro: function() {
            if ( Lilja.skipIntro ) {
                this._startMission();
                return;
            }
            this.introMusic.play();
            
            this.player.disableControls = true;
            this.player.animations.play('walk');
            var walk = this.game.add.tween(this.player).from({x: -30 }, 2000, Phaser.Easing.Linear.None, true);
            walk.onComplete.add(this._beginIntro, this);
        },
        
        /**
         * Do shutdown actions for the level.
         */
        shutdown: function(){
            this.bgMusic.stop();
            this.introMusic.stop();
        },
        
        /**
         * Called when a bullet or projectile collides with a wall.
         */
        _bulletWallCollision: function(bullet, wall) {
            bullet.hit(wall);
        },
        
        /**
         * Preprocess player and enemy collisions.
         */
        _playerEnemyProcess: function(player, enemy) {
            return !player.invincible;
        },
        
        /**
         * Called when a bullet collides with a wall.
         */
        _playerEnemyCollision: function(player, enemy) {
            player.hit(enemy.damage);
        },
        
        /**
         * Called when a bullet hits an enemy.
         * @param {Phaser.Sprite} bullet the bullet hitting
         * @param {Lilja.Enemy}   enemy  the enemy hit
         */
        _bulletEnemyCollision: function(bullet, enemy) {
            enemy.hit(bullet);
            bullet.hit(enemy);
        },
        
        /**
         * Called when a projectile hits a player. Maybe?
         * @param {Object}   projectile [[Description]]
         * @param {[[Type]]} player     [[Description]]
         */
        _projectilePlayerCollision: function(projectile, player) {
            projectile.hit(player);
            player.hit(projectile.damage);
        },
        
        /**
         * Start the level introduction.
         */
        _beginIntro: function() {
            this.player.animations.play('stand');
            this.dialogue = new Lilja.DialogueManager(this.game);
            this.dialogue.start(this.name + '_intro');
            this.dialogue.onFinished.addOnce(this._startMission, this);
        },
        
        /**
         * Start player involvement and show 'start mission' text.
         * Called after the intro has finished.
         */
        _startMission: function() {
            this.player.disableControls = false;
            this.player._makeHP();
            this.introMusic.stop();
            this.bgMusic.play();
            this._showMissionStartText();
        },
        
        /**
         * Shows a flashing 'mission start' text.
         */
        _showMissionStartText: function() {
            this._flash = this.game.add.text(this.game.camera.width / 2, this.game.camera.height / 2, 
                                             'MISSION START', { font: '32px VT323', fill: '#FFFFFF' });
            this._flash.anchor.set(0.5);
            this._flash.fixedToCamera = true;
            
            this._flashTimer = this.game.time.create(false);
            this._flashTimer.repeat(600, 5, function() { this._flash.visible = !this._flash.visible; }, this);
            this._flashTimer.start();
        }
        
    };
    
})();