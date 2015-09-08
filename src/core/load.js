   //////////////////////////////////////////////////////
  //* The Preload state and actions for the ESCAPE GAME!
 //*
//*
(function() {

    Lilja.Preloader = function () {

    };

    Lilja.Preloader.prototype = {    
        
          ///////{ create loading screen and setup sates }/////////////////////////
         //
        //
        create: function () {
        },
        
        
          ///////{ Update loading screen }/////////////////////////////////////////
         //
        //
        loadUpdate: function () {
            this.loadText.text = 'Loading: ' + this.game.load.progress + '&';
        },
        
          ///////{ initialize scale }//////////////////////////////////////////////
         //
        //
        init: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.setMinMax(514, 384, Lilja.gameWidth, Lilja.gameHeight);
            this.scale.windowConstraints.bottom = "visual";
        },
        
          ///////{ define loaded resources }////////////////////////////////////////
         //
        //        
        preload: function () {
            this.game.load.atlasJSONHash('sprites', 'assets/graphics/sprites.png', 'assets/graphics/sprites_data.json');
            this.game.load.json('level_meta', 'assets/level_meta.json');
            this.game.load.json('credits', 'assets/credits.json');
            this.game.load.tilemap('level01', 'assets/level01.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('tiles', 'assets/graphics/tiles.png');
            this.game.load.audiosprite('sfx', ['assets/audio/sfx.ogg', 'assets/audio/sfx.mp3'], 'assets/audio/sfx.json');
            this.game.load.audio('leveldrums', ['assets/audio/leveldrums.ogg', 'assets/audio/leveldrums.mp3']);
            this.game.load.audio('intromusic', ['assets/audio/intromusic.ogg', 'assets/audio/intromusic.mp3']);
            this.game.load.audio('menumusic', ['assets/audio/darkmenu.ogg', 'assets/audio/darkmenu.mp3']);
            
            this.loadText = this.add.text(this.camera.width / 2, this.camera.height /2, 'Loading', { font: '24px VT323' });
        },

        
          ///////{ Start the actual game }//////////////////////////////////////////
         //
        //
        update: function () {        
            this.state.start('Menu');
        }
    };
    
})();