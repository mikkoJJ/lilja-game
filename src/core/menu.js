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
            },
            controls: {
                name: 'Kontrollit',
                activated: null,
                callback: '_showControls'
            },
            credits: {
                name: 'Krediitit',
                activated: null,
                callback: '_showCredits'
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
            
            this.game.time.events.add(1000, this.showSkeleLogo, this);
        },
        
        /**
         * Show the Skelebot logo.
         */
        showSkeleLogo: function() {
            this.startCredits = this.add.group();
            this.startCredits.alpha = 0;
            
            this.whiteBg = this.add.graphics(0, 0);
            this.whiteBg.beginFill(0xffffff);
            this.whiteBg.drawRect(0, 0, this.camera.width, this.camera.height);
            this.whiteBg.endFill();
            
            this.startCredits.add(this.whiteBg);
            
            this.skelelogo = this.add.image(this.camera.width / 2, this.camera.height / 2, 'sprites', 'skelelogo');
            this.skelelogo.anchor.set(0.5);
            this.startCredits.add(this.skelelogo);
            
            this.add.tween(this.startCredits).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            
            this.game.time.events.add(3000, this.showSeittiLogo, this);
            
            this.sfx.play('lazer');
        },
        
        /**
         * Show the Seitti logo.
         */
        showSeittiLogo: function() {
            this.add.tween(this.startCredits).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true)
                .onComplete.add(function(){ this.skelelogo.frameName = 'seitti'; }, this);
            
            this.add.tween(this.startCredits).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true, 400);
            
            this.game.time.events.add(300, function() { this.sfx.play('introduction'); }, this);
            this.game.time.events.add(3400, this.createNavigation, this);
        },
        
        /**
         * Start navigation.
         */
        createNavigation: function() {
            this.game.world.bringToTop(this.whiteBg);
            this.add.tween(this.startCredits).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true); 
            
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
            
            var _new = this.currentMenu.previous();
            _new.text = '> ' + _new.baseText + ' <';
            
            this.sfx.play('menuselect');
        },
        
        /**
         * Called when down is pressed, navigate the menu.
         */
        _navDown: function(){
            var _old = this.currentMenu.cursor;
            _old.text = _old.baseText;
            
            var _new = this.currentMenu.next(); 
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
            
            if (!this.currentMenu.visible) {
                if (this.creditGroup) {
                    this.creditGroup.destroy();
                    this.currentMenu.visible = true;
                    this.logo.visible = true;
                    
                    this.sfx.play('menuconfirm');
                }
                if (this.controls) {
                    this.controls.destroy();
                    this.currentMenu.visible = true;
                    this.logo.visible = true;
                    
                    this.sfx.play('menuconfirm');
                }
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
        },
        
        _showControls: function() {
            this.currentMenu.visible = false;
            this.logo.visible = false;
            
            this.controls = this.add.image(this.camera.width / 2, this.camera.height / 2, 'sprites', 'controls');
            this.controls.anchor.set(0.5);
        },
        
        /**
         * Show the credits.
         */
        _showCredits: function() {
            this.currentMenu.visible = false;
            this.logo.visible = false;
            
            var credits = this.game.cache.getJSON('credits').credits;
            this.creditGroup = this.add.group();
            this.creditGroup.y = this.camera.height;
            
            var prevHeight = 0;
            for (var i in credits) {
                var what = this.add.text(50, prevHeight, credits[i].what.toUpperCase(), { font: '20px VT323', fill: "#AAAAAA" });
                var who = this.add.text(100, prevHeight + what.height, credits[i].who, { font: '20px VT323', fill: "#FFFFFF" });
                prevHeight += Math.max(what.height, who.height) + 50;
                
                this.creditGroup.add(what);
                this.creditGroup.add(who);
            }
            
            this.add.tween(this.creditGroup).to({ y: -prevHeight }, 40000, Phaser.Easing.Linear.None, true)
                .onComplete.add(function() {
                    this.creditGroup.destroy();
                    this.currentMenu.visible = true;
                    this.logo.visible = true;
                }, this);
        }
        
    };
    

})();