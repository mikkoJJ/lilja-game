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
            
            this.fpsCounter = this.add.text(10, 10);
            this.fpsCounter.fontSize = '14px';
            this.fpsCounter.text = '100 FPS';
            this.game.time.advancedTiming = true;
            
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 1000;
            
            //---- tilemap setup ---------------------------
            
            this.map = this.add.tilemap('level01');
            this.map.addTilesetImage('tileset', 'tiles');
            this.layerBg = this.map.createLayer('bg');
            this.layerBg.resizeWorld();
            this.layerTerrain = this.map.createLayer('terrain');
            this.map.setCollision(1, true, this.layerTerrain);
            
            //---- setup player character ------------------ 
            
            this.player = new Lilja.Player(this.game, 112, 300);
            
            //---- other game objects ----------------------
    
            //--- curtain -------------------------
            
            /*
            this.curtain = this.add.graphics(0, 0);
            this.curtain.beginFill(0x000000);
            this.curtain.drawRect(0, 0, this.camera.width, this.camera.height);
            this.curtain.endFill();
            */
            
            //--- dialogue test --------------------
            
            this.dialogue = new Escape.DialogueManager(this.game);
        },
        
          ////////// { Updating } /////////////////////////////////////////////////////////////////
         //
        //
        update: function() {
            if(!this._running) return;
            
            this.game.physics.arcade.collide(this.player, this.layerTerrain);
            this.fpsCounter.text = this.game.time.fps;
        }
        
    };
    
})();