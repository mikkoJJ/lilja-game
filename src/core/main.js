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
            this._running = true;
            
            this.stage.backgroundColor = 0x550000;
            
            this.fpsCounter = this.add.text(10, 10);
            this.fpsCounter.fontSize = '14px';
            this.fpsCounter.text = '100 FPS';
            this.game.time.advancedTiming = true;
            
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 1000;
            
            //---- setup player character ------------------ 
            
            this.player = new Lilja.Player(this.game, 112, 300);
            
            //---- other game objects ----------------------
            
            this.floor = this.add.sprite(0, this.camera.height - 50, 'sprites', 'floor');
            this.game.physics.arcade.enable(this.floor);
            this.floor.body.immovable = true;
            this.floor.body.allowGravity = false;
            
            //--- curtain -------------------------
            
            /*
            this.curtain = this.add.graphics(0, 0);
            this.curtain.beginFill(0x000000);
            this.curtain.drawRect(0, 0, this.camera.width, this.camera.height);
            this.curtain.endFill();
            */
            
            //------------- dialogue test ---------------//
            
            this.dialogue = new Escape.DialogueManager(this.game);
        },
        
          ////////// { Updating } /////////////////////////////////////////////////////////////////
         //
        //
        update: function() {
            if(!this._running) return;
            
            this.game.physics.arcade.collide(this.player, this.floor);
            this.fpsCounter.text = this.game.time.fps;
        }
        
    };
    
})();