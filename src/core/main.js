         ///////////////////////////////////////////////////////////////////////////////////
        //* ===================================================
       //*  T E R Ä S L I L J A : T H E M O V I E T H E G A M E
      //*   ===================================================
     //*          by Mikko J. Jakonen
    //*
   //*      This is a game meant to be a tie-in for a comic book called Teräslilja
  //*       ja mutanttizombiet. It's a game about shooting mutant zombies.
 //*        This is the main game state file.
//*
(function(){

    Lilja.Main = function() {    };

    Lilja.Main.prototype = {
        
        
          ///////{ Game setup }///////////////////////////////////////////////////////////
         //
        //
        create: function() {
            //---- base setup -------------------------------
            
            this._running = true;
            
            this.fpsCounter = this.add.text(10, 10, 'aa', { font: '14px VT323', fill: '#000000' });
            this.fpsCounter.fixedToCamera = true;
            this.game.time.advancedTiming = true;
            
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 1400;
            
            Lilja.sfx = this.add.audioSprite('sfx');
            
            //---- tilemap setup ---------------------------
            
            /** 
             * @property {Phaser.Tilemap} the level tilemap
             */
            this.map = this.add.tilemap('level01');
            this.map.addTilesetImage('tileset', 'tiles');
            this.layerBg = this.map.createLayer('bg');
            this.layerBg.resizeWorld();
            //this.layerTerrain = this.map.createLayer('terrain');
            this.map.setCollision([2, 3, 4, 5, 6, 8, 9, 10, 11, 12], true, this.layerBg, true);
            
            
            //---- setup game objects ------------------ 
            
            /**
             * @property {Lilja.Player} the player character
             */
            this.player = new Lilja.Player(this.game, 112, this.world.height - 150);
            this.camera.y = this.world.height - this.camera.height;
            
            /**
             * @property {Phaser.Group} the group containing enemies
             */
            this.enemies = this.add.group();
            
            /**
             * @property {Lilja.Bullets} the group containing player bullets
             */
            this.bullets = this.player.bullets;
            
            //---- spawn zombies ---------------------------
            
            this.map.createFromObjects('spawnpoints', 4, 'sprites', null, true, false, this.enemies, Lilja.Zombie, true);
            this.enemies.setAll('chase', this.player);
            this.enemies.setAll('ground', this.layerBg);
            
            //--- intro --------------------
            
            /**
             * @property {Phaser.Audio} intro music for the level
             */
            this.introMusic = this.add.audio('intromusic');
            this.introMusic.play();
            
            /**
             * @property {Phaser.Audio} the background music for the level.
             */
            this.bgMusic = this.add.audio('leveldrums');
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.6;
            
            this.player.disableControls = true;
            this.player.animations.play('walk');
            var walk = this.add.tween(this.player).from({x: -30 }, 2000, Phaser.Easing.Linear.None, true);
            walk.onComplete.add(this._beginIntro, this);
        },  
        
          ////////// { Updating } /////////////////////////////////////////////////////////////////
         //
        //
        update: function() {
            if(!this._running) return;
            
            //move camera around in scenes
            var cameraDeltaX = this.player.x - this.camera.x;
            var cameraDeltaY = this.player.y - this.camera.y;
            if ( cameraDeltaX > this.camera.width ) this.camera.x += this.camera.width;  
            if ( cameraDeltaX < 0 ) this.camera.x -= this.camera.width;
            if ( cameraDeltaY > this.camera.height ) this.camera.y += this.camera.height;
            if ( cameraDeltaY < 0 ) this.camera.y -= this.camera.height;
            
            this.game.physics.arcade.collide(this.player, this.layerBg);
            this.game.physics.arcade.collide(this.player, this.enemies, this._playerEnemyCollision, null, this);
            this.game.physics.arcade.collide(this.enemies, this.layerBg);
            this.game.physics.arcade.collide(this.giblets, this.layerBg);
            this.game.physics.arcade.collide(this.bullets, this.layerBg, this._bulletWallCollision, null, this);
            this.game.physics.arcade.collide(this.bullets, this.enemies, this._bulletEnemyCollision, null, this);
            this.fpsCounter.text = '' + this.game.time.fps + ' FPS'; 
        },
        
        /**
         * Called when a bullet collides with a wall.
         */
        _bulletWallCollision: function(bullet, wall) {
            bullet.hit(wall);
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
         * Start the level introduction.
         */
        _beginIntro: function() {
            this.player.animations.play('stand');
            this.dialogue = new Lilja.DialogueManager(this.game);
            this.dialogue.start('intro');
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
            this._flash = this.add.text(this.camera.width / 2, this.camera.height / 2, 'MISSION START', { font: '32px VT323', fill: '#FFFFFF' });
            this._flash.anchor.set(0.5);
            this._flash.fixedToCamera = true;
            
            this._flashTimer = this.game.time.create(false);
            this._flashTimer.repeat(600, 5, function() { this._flash.visible = !this._flash.visible; }, this);
            this._flashTimer.start();
        }
        
    };
    
})();