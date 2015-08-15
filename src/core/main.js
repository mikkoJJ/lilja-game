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
            
            this.game.time.advancedTiming = true;
            
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 1400;
            
            Lilja.sfx = this.add.audioSprite('sfx');
            
            //--- level creation -----------------------
            this.level = new Lilja.Level(this.game, 'level01');
            this.level.create();
            
            //---- setup game objects ------------------ 
            
            this.level.createObjects();
            this.player = this.level.player;
            
            //---- debug info ------------------------------
            this.fpsCounter = this.add.text(10, 10, 'aa', { font: '14px VT323', fill: '#000000' });
            this.fpsCounter.fixedToCamera = true;
            
            //--- intro ------------------------------------
            
            this.level.intro();
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
            
            this.level.handleCollisions();
            this.fpsCounter.text = '' + this.game.time.fps + ' FPS'; 
        },
        
        
        shutdown: function(){
            this.level.shutdown();
        }
        
    };
    
})();