       //////////////////////////////////////////////////////
      //* =====================
     //*  E S C A P E   G A M E
    //*   =====================
   //*          by Mikko Jakonen
  //*
 //*      A little HTML5 shmup game or something.
//*
(function(){
    
    var
        //game entities
        character,
        trail,
        
        //helper variables
        _running = false
    ;

    Escape.Main = function() {    };

    Escape.Main.prototype = {
        
          ///////{ Game setup }/////////////////////////////////////////
         //
        //
        create: function() {
            this.stage.backgroundColor = 0x550000;
            
            this.fpsCounter = this.add.text(10, 10);
            this.fpsCounter.fontSize = '14px';
            this.fpsCounter.text = '100 FPS';
            this.game.time.advancedTiming = true;
            
            ///////////////// setup player character //////////////////
            
            character = new Escape.Ship(this.game, 112, 300);
            
            ////////////////////////// decor ///////////////////////////
            
            this.backCloudDecor2 = new Escape.Decorator(this.game, this.camera.width + 20, this.camera.height - 140, 'sprites', 'cloud', 1, 180, 3);
            this.backCloudDecor2.speed = 7500;
            this.backCloudDecor2.tint = 0x2D0505;
            this.backCloudDecor2.backRoom = 1500;
            
            this.backCloudDecor1 = new Escape.Decorator(this.game, this.camera.width + 20, this.camera.height - 70, 'sprites', 'cloud', 1, 100, 4);
            this.backCloudDecor1.speed = 6000;
            this.backCloudDecor1.tint = 0x7C0707;
            this.backCloudDecor1.backRoom = 1500;
            
            this.houseDecor3 = new Escape.Decorator(this.game, this.camera.width + 10, this.camera.height - 30, 'sprites', 'house', 1, 90, 4);
            this.houseDecor3.speed = 5500;
            this.houseDecor3.tint = 0x300505;
            
            this.cloudDecor = new Escape.Decorator(this.game, this.camera.width + 20, this.camera.height, 'sprites', 'cloud', 1, 90, 4);
            this.cloudDecor.speed = 5000;
            this.cloudDecor.tint = 0xA50808;
            this.cloudDecor.backRoom = 1500;
            
            this.houseDecor2 = new Escape.Decorator(this.game, this.camera.width + 10, this.camera.height, 'sprites', 'house', 1, 80, 4);
            this.houseDecor2.speed = 2900;
            this.houseDecor2.tint = 0x300505;
            
            this.game.world.bringToTop(character);
            
            this.houseDecor = new Escape.Decorator(this.game, this.camera.width + 10, this.camera.height + 70, 'sprites', 'house', 1, 40, 5);
            this.houseDecor.speed = 2000;
            this.houseDecor.tint = 0x000000;
            
            _running = true;
        },
                
        
          ////////// { Updating } ///////////////////////////////////////
         //
        //
        update: function() {
            
            if(!_running) return;
            
            this.fpsCounter.text = this.game.time.fps;
            
            ///////////////////// updating objects //////////////////////////////////////
            
            this.houseDecor.update();
            this.houseDecor2.update();
            this.houseDecor3.update();
            this.backCloudDecor2.update();
            this.backCloudDecor1.update();
            this.cloudDecor.update();
        }
    };
    
})();