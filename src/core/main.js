        ///////////////////////////////////////////////////////////////////////////////////
       //* =====================
      //*  E S C A P E   G A M E
     //*   =====================
    //*          by Mikko Jakonen
   //*
  //*      A little HTML5 shmup game or something. This is the
 //*       main game state.
//*
(function(){
    
    var
        //game entities
        character,
        
        //helper variables
        _running = false
    ;

    Escape.Main = function() {    };

    Escape.Main.prototype = {
        
        
          ///////{ Game setup }///////////////////////////////////////////////////////////
         //
        //
        create: function() {
            
            this.stage.backgroundColor = 0x550000;
            
            this.fpsCounter = this.add.text(10, 10);
            this.fpsCounter.fontSize = '14px';
            this.fpsCounter.text = '100 FPS';
            this.game.time.advancedTiming = true;
            
            //---- setup player character ------------------ 
            
            character = new Escape.Ship(this.game, 112, 300);
            
            //---- decor -----------------------------------
            
            var xOffset = 1300;
            
            this.backCloudDecor2 = new Escape.Decorator(this.game, this.camera.width + xOffset, this.camera.height - 140, 'sprites', 'cloud', 1, 180, 3);
            this.backCloudDecor2.speed = 7500;
            this.backCloudDecor2.tint = 0x2D0505;
            
            this.backCloudDecor1 = new Escape.Decorator(this.game, this.camera.width + xOffset, this.camera.height - 70, 'sprites', 'cloud', 1, 100, 4);
            this.backCloudDecor1.speed = 6000;
            this.backCloudDecor1.tint = 0x7C0707;
            
            this.houseDecor3 = new Escape.Decorator(this.game, this.camera.width + xOffset, this.camera.height - 30, 'sprites', 'house', 1, 90, 4);
            this.houseDecor3.speed = 5500;
            this.houseDecor3.tint = 0x300505;
            
            this.cloudDecor = new Escape.Decorator(this.game, this.camera.width + xOffset, this.camera.height, 'sprites', 'cloud', 1, 90, 4);
            this.cloudDecor.speed = 5000;
            this.cloudDecor.tint = 0xA50808;
            
            this.houseDecor2 = new Escape.Decorator(this.game, this.camera.width + xOffset, this.camera.height, 'sprites', 'house', 1, 80, 4);
            this.houseDecor2.speed = 2900;
            this.houseDecor2.tint = 0x300505;
            
            this.game.world.bringToTop(character);
            
            this.houseDecor = new Escape.Decorator(this.game, this.camera.width + xOffset, this.camera.height + 70, 'sprites', 'house', 1, 40, 5);
            this.houseDecor.speed = 2000;
            this.houseDecor.tint = 0x000000;
            
            
            //--- curtain -------------------------
            
            this.curtain = this.add.graphics(0, 0);
            this.curtain.beginFill(0x000000);
            this.curtain.drawRect(0, 0, this.camera.width, this.camera.height);
            this.curtain.endFill();
            
            //this.curtainUp();
            
            //--- the story scroll ----------------
            
            this.story = this.add.text(this.camera.width / 2, this.camera.height, '', { font: '24px VT323', fill: '#00FF00' });
            this.story.anchor.set(0.5, 0);
            this.story.text = this.game.cache.getJSON('main_story').beginning;
            this.story.wordWrap = true;
            this.story.wordWrapWidth = this.camera.width - 100;
            
            this.add.tween(this.story).to({ y: -1000 }, 1000 * 60 * 2, Phaser.Easing.Linear.none, true)
                .onComplete.add(this.curtainUp, this);
            
            this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onUp.addOnce(this.skipIntro, this);
            
            this.skipText = this.add.text(this.camera.width / 2, 50, '', { font: '28px VT323', fill: '#FFFFFF' });
            this.skipText.anchor.set(0.5, 0);
            this.skipText.text = 'Press <SPACEBAR> to skip the intro';
            
            this.add.tween(this.skipText).from({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 2000);
            
            this.skipText2 = this.add.text(this.camera.width / 2, 100, '', { font: '28px VT323', fill: '#FFFFFF' } );
            this.skipText2.anchor.set(0.5, 0);
            this.skipText2.text = '(You really should skip the intro)';
            
            this.add.tween(this.skipText2).from({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 12000);
            
            _running = true;
            
            //------------- dialogue test ---------------//
            
            this.dialogue = new Escape.DialogueManager(this.game);
        },
                
        
          ////////// { Curtain/Transition control } ////////////////////////////////////////////////
         //
        //
        curtainUp: function() {
            this.add.tween(this.curtain).to({ alpha: 0 }, 1500, Phaser.Easing.Quadratic.Out, true);
        },
        curtainDown: function() {
            this.add.tween(this.curtain).to({ alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true);
        },
        skipIntro: function() {
            this.add.tween(this.story).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(this.curtainUp, this);
            
            this.skipText.visible = false;
            this.skipText2.visible = false;
            this.dialogue.start('beginning1');
        },
        
        
          ////////// { Updating } /////////////////////////////////////////////////////////////////
         //
        //
        update: function() {
            
            if(!_running) return;
            
            this.fpsCounter.text = this.game.time.fps;
            
            this.houseDecor.update();
            this.houseDecor2.update();
            this.houseDecor3.update();
            this.backCloudDecor2.update();
            this.backCloudDecor1.update();
            this.cloudDecor.update();
        }
    };
    
})();