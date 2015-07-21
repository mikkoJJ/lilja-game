   //////////////////////////////////////////////////////
  //* The Preload state and actions for the ESCAPE GAME!
 //*
//*
(function() {
    
    Lilja = { };

    Lilja.Preloader = function () {

    };

    Lilja.Preloader.prototype = {    
        
          ///////{ create loading screen and setup sates }/////////////////////////
         //
        //
        create: function () {
            this.add.text(this.camera.width, this.camera.height, 'Loading', { font: '24px VT323' });
        },
        
        
          ///////{ Update loading screen }/////////////////////////////////////////
         //
        //
        loadUpdate: function () {
            return;
        },
        
          ///////{ initialize scale }//////////////////////////////////////////////
         //
        //
        init: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.setMinMax(514, 384, 1280, 768);
            this.scale.setScreenSize(true);
            this.scale.windowConstraints.bottom = "visual";
        },
        
          ///////{ define loaded resources }////////////////////////////////////////
         //
        //        
        preload: function () {
            this.game.load.atlasJSONHash('sprites', 'assets/graphics/sprites.png', 'assets/graphics/sprites_data.json');
            this.game.load.json('main_story', 'assets/main_story.json');
            this.game.load.json('dialogues', 'assets/dialogues.json');
            this.game.load.tilemap('level01', 'assets/level01.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('tiles', 'assets/graphics/tiles.png');
            this.game.load.audiosprite('sfx', ['assets/audio/sfx.ogg', 'assets/audio/sfx.mp3'], 'assets/audio/sfx.json');
            this.game.load.audio('leveldrums', ['assets/audio/leveldrums.ogg', 'assets/audio/leveldrums.mp3']);
            this.game.load.audio('intromusic', ['assets/audio/intromusic.ogg', 'assets/audio/intromusic.mp3']);
        },

        
          ///////{ Start the actual game }//////////////////////////////////////////
         //
        //
        update: function () {        
            this.state.start('Main');
        }
    };
    
})();