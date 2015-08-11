(function() {

    Lilja.Menu = function() {
    };
    
    Lilja.Menu.prototype = {
        
        /**
         * The menu elements.
         */ 
        choices: {
            newgame: {
                name: 'Pelaa',
                activated: null,
                callback: 'start'
            },
            sound: {
                name: 'Äänet: päällä',
                activated: 'Äänet: pois',
                callback: '_setSound'
            }
        },
        
        /**
         * Create the state.
         */
        create: function() {
            this.sfx = this.add.audioSprite('sfx');
            
            this.music = this.add.audio('menumusic');
            this.music.loop = true;
            this.music.volume = 0.6;
            
            this.game.time.events.add(2000, this.showSeittiLogo, this);
        },
        
        /**
         * Show the Seitti logo in the beginning.
         */
        showSeittiLogo: function() {
            this.seitti = this.add.group();
            this.seitti.alpha = 0;
            
            var seittiBg = this.add.graphics(0, 0);
            seittiBg.beginFill(0xffffff);
            seittiBg.drawRect(0, 0, this.camera.width, this.camera.height);
            seittiBg.endFill();
            this.seitti.add(seittiBg);
            this.seittiBg = seittiBg;
            
            var logo = this.add.image(this.camera.width / 2, this.camera.height / 2, 'sprites', 'seitti');
            logo.anchor.set(0.5);
            
            this.seitti.add(logo);
            
            this.add.tween(this.seitti).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);
            this.game.time.events.add(2400, this.createNavigation, this);
            
            this.sfx.play('introduction');
        },
        
        /**
         * Start navigation.
         */
        createNavigation: function() {
            this.game.world.bringToTop(this.seittiBg);
            this.add.tween(this.seitti).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true); 
            
            this.logo = this.add.image(this.camera.width / 2, this.camera.height / 2, 'sprites', 'logo');
            this.logo.anchor.set(0.5);
            
            this.add.tween(this.logo).from({ y: 0 }, 1000, Phaser.Easing.Cubic.Out, true);
            
            this.press = this.add.text(this.camera.width / 2, this.camera.height / 2 + 190, 'Paina välilyöntiä', 
                                       { font: '30px VT323', fill: '#ffffff', align: 'center' });
            this.press.anchor.set(0.5);
            
            this.game.time.events.loop(900, function(){ this.press.visible = !this.press.visible; }, this);
            
            this.navUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.navUp.onDown.add(this._navUp, this);
            this.navDown = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            this.navDown.onDown.add(this._navDown, this);
            this.navEnter = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.navEnter.onDown.add(this._navEnter, this);
            
            this.sfx.play('startup');
            this.music.play();
        },
        
        /**
         * Create a keyboard-navigable menu of choices.
         * @param {Object} choices - a list of the choices in the menu
         */
        createMenu: function(choices) {
            var g = this.add.group();
            var first = true, t, choice, i = 0;
            
            for ( var c in choices ) {
                choice = choices[c];
                
                t = this.add.text(this.camera.width / 2, this.camera.height / 2 + 190 + i++ * 30, choice.name, { fill: '#ffffff', font: '24px VT323' });
                t.anchor.set(0.5);
                t.baseText = choice.name;
                t.inactiveText = choice.name;
                t.activeText = choice.activated;
                t.activated = false;
                t.menuCallback = this[choice.callback];
                g.add(t);
                
                if (first) {
                    t.text = '> ' + t.baseText + ' <';
                    g.cursor = t;
                    first = false;
                }
            }
            
            this.currentMenu = g;
            
            this.sfx.play('menuconfirm');
        },
        
        /**
         * Call to proceed to the actual game.
         */
        start: function() {
            this.music.stop();
            
            var black = this.add.graphics(0, 0);
            black.beginFill(0x000000);
            black.drawRect(0, 0, this.camera.width, this.camera.height);
            black.endFill();
            
            var _begin = function() {
                this.state.start('Main');
            };
            
            this.add.tween(black).from({ y: -this.camera.height }, 500, Phaser.Easing.Cubic.Out, true)
                .onComplete.add(_begin, this);
        },
        
        /**
         * Called when up is pressed, navigate the menu.
         */
        _navUp: function() {
            var _old = this.currentMenu.cursor;
            _old.text = _old.baseText;
            
            var _new = this.currentMenu.next();
            _new.text = '> ' + _new.baseText + ' <';
            
            this.sfx.play('menuselect');
        },
        
        /**
         * Called when down is pressed, navigate the menu.
         */
        _navDown: function(){
            var _old = this.currentMenu.cursor;
            _old.text = _old.baseText;
            
            var _new = this.currentMenu.previous(); 
            _new.text = '> ' + _new.baseText + ' <';
            
            this.sfx.play('menuselect');
        },
        
        /**
         * Called when spacebar is pressed, activate current 
         * menu element.
         */
        _navEnter: function() {
            if (!this.currentMenu) { 
                this.press.destroy();
                this.createMenu(this.choices);
                return;
            }
            
            var choice = this.currentMenu.cursor;
            
            if (choice.activeText) {
                choice.activated = !choice.activated;
                if (choice.activated) {
                    choice.text = '> ' + choice.activeText + ' <';
                    choice.baseText = choice.activeText;
                }
                else { 
                    choice.text = '> ' + choice.inactiveText + ' <';
                    choice.baseText = choice.inactiveText;
                }
            }
            if (choice.menuCallback) choice.menuCallback.call(this);  
            
            this.sfx.play('menuconfirm');
        },
        
        /**
         * Set the game sounds on or off.
         */
        _setSound: function() {
            this.game.sound.mute = !this.game.sound.mute;
        }
        
    };
    

})();