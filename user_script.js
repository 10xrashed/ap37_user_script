(function script() {
  'use strict';
   // ============================================================================
   // CONFIGURATION - DRACULA THEME
  // ============================================================================
  var config = {
    colors: {
      background: '#282a36',
      currentLine: '#44475a',
      foreground: '#f8f8f2',
      comment: '#6272a4',
      cyan: '#8be9fd',
      green: '#50fa7b',
      orange: '#ffb86c',
      pink: '#ff79c6',
      purple: '#bd93f9',
      red: '#ff5555',
      yellow: '#f1fa8c'
    },
    chars: {
      horizontal: '─',
      vertical: '│',
      topLeft: '┌',
      topRight: '┐',
      bottomLeft: '└',
      bottomRight: '┘',
      bullet: '▸',
      scroll: '█'
    }
  };

  // ============================================================================
  // GLOBAL STATE
  // ============================================================================
  var state = {
    screenWidth: 0,
    screenHeight: 0,
    keyboardVisible: false,
    searchQuery: '',
    selectedAppIndex: 0
  };
 // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  var utils = {
    print: function(x, y, text, color) {
      color = color || config.colors.foreground;
      ap37.print(x, y, text, color);
    },

    clearLine: function(y, x1, x2) {
      x1 = x1 || 0;
      x2 = x2 || state.screenWidth;
      this.print(x1, y, ' '.repeat(x2 - x1), config.colors.background);
    },

    clearArea: function(x1, y1, x2, y2) {
      for (var y = y1; y <= y2; y++) {
        this.clearLine(y, x1, x2);
      }
    },

    leftPad: function(str, length, char) {
      str = str.toString();
      char = char || ' ';
      if (str.length >= length) return str;
      return new Array(length - str.length + 1).join(char) + str;
    },

    rightPad: function(str, length, char) {
      str = str.toString();
      char = char || ' ';
      if (str.length >= length) return str;
      return str + new Array(length - str.length + 1).join(char);
    },

    centerText: function(text, width) {
      var padding = Math.floor((width - text.length) / 2);
      return ' '.repeat(Math.max(0, padding)) + text;
    },

    truncate: function(str, maxLength, suffix) {
      suffix = suffix || '...';
      if (str.length <= maxLength) return str;
      return str.substring(0, maxLength - suffix.length) + suffix;
    },

    drawBox: function(x, y, width, height, title, color) {
      color = color || config.colors.purple;
      var c = config.chars;
      
      this.print(x, y, c.topLeft + c.horizontal.repeat(width - 2) + c.topRight, color);
      
      if (title) {
        var titleText = ' ' + title + ' ';
        var titleX = x + Math.floor((width - titleText.length) / 2);
        this.print(titleX, y, titleText, config.colors.cyan);
      }

      for (var i = 1; i < height - 1; i++) {
        this.print(x, y + i, c.vertical, color);
        this.print(x + width - 1, y + i, c.vertical, color);
      }

      this.print(x, y + height - 1, c.bottomLeft + c.horizontal.repeat(width - 2) + c.bottomRight, color);
    }
  };

  String.prototype.repeat = function(n) {
    return new Array(Math.max(0, n) + 1).join(this);
  };
  // ============================================================================
  // SCREEN MANAGER
  // ============================================================================
  var screen = {
    init: function() {
      ap37.setTextSize(10);
      state.screenWidth = ap37.getScreenWidth();
      state.screenHeight = ap37.getScreenHeight();
      this.clear();
    },

    clear: function() {
      for (var i = 0; i < state.screenHeight; i++) {
        utils.clearLine(i);
      }
    }
  };
  // ============================================================================
  // HEADER MODULE
  // ============================================================================
  var header = {
    height: 5,
    
    draw: function() {
      var w = state.screenWidth;
      
      utils.drawBox(0, 0, w, 3, 'AP37 TERMINAL');
      
      utils.print(2, 1, '10xRashed', config.colors.pink);
      
      var d = ap37.getDate();
      var time = utils.leftPad(d.hour, 2, '0') + ':' + utils.leftPad(d.minute, 2, '0');
      var battery = 'BAT:' + utils.leftPad(ap37.getBatteryLevel(), 3, ' ') + '%';
      var rightText = battery + ' ' + time;
      utils.print(w - rightText.length - 2, 1, rightText, config.colors.green);
      
      utils.drawBox(0, 3, w, 2, null, config.colors.purple);
      this.updateSearch();
    },
    
    updateSearch: function() {
      var w = state.screenWidth;
      var prompt = state.keyboardVisible ? '> ' : '[TAP HERE] ';
      var displayText = prompt + (state.searchQuery || '');
      displayText = utils.truncate(displayText, w - 4);
      displayText = utils.rightPad(displayText, w - 2, ' ');
      
      var color = state.searchQuery ? config.colors.yellow : config.colors.comment;
      utils.print(1, 3, displayText, color);
    },
    
    onTouch: function(x, y) {
      if (y === 3) {
        if (!state.keyboardVisible) {
          keyboard.show();
        }
        return true;
      }
      return false;
    }
  };
  // ============================================================================
  // FOOTER MODULE
  // ============================================================================
  var footer = {
    height: 3,
    buttonWidth: 10,
    
    draw: function() {
      var w = state.screenWidth;
      var startY = state.screenHeight - this.height;
      
      utils.clearArea(0, startY, w, state.screenHeight - 1);
      
      utils.drawBox(0, startY, w, this.height, null, config.colors.purple);
      
      var buttonText = state.keyboardVisible ? '[HIDE KB]' : '[SHOW KB]';
      var buttonX = Math.floor((w - this.buttonWidth) / 2);
      
      this._buttonX1 = buttonX;
      this._buttonY1 = startY + 1;
      this._buttonX2 = buttonX + this.buttonWidth - 1;
      this._buttonY2 = startY + 1;
      
      utils.print(buttonX, startY + 1, buttonText, config.colors.orange);
    },
    
    onTouch: function(x, y) {
      if (y === this._buttonY1 && x >= this._buttonX1 && x <= this._buttonX2) {
        if (state.keyboardVisible) {
          keyboard.hide();
        } else {
          keyboard.show();
        }
        return true;
      }
      return false;
    }
  };
 // ============================================================================
  // APP LIST MODULE - HORIZONTAL LAYOUT
  // ============================================================================
  var appList = {
    apps: [],
    filtered: [],
    topMargin: header.height,
    bottomMargin: footer.height,
    appsPerLine: 0,
    
    getVisibleHeight: function() {
      var keyboardHeight = state.keyboardVisible ? keyboard.height : 0;
      return state.screenHeight - this.topMargin - this.bottomMargin - keyboardHeight;
    },

    init: function() {
      this.apps = ap37.getApps();
      this.sortApps();
      this.filter();
      this.draw();
      
      var self = this;
      ap37.setOnAppsListener(function() {
        self.apps = ap37.getApps();
        self.sortApps();
        self.filter();
        self.draw();
      });
    },

    sortApps: function() {
      this.apps.sort(function(a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
    },

    filter: function() {
      var query = state.searchQuery.toLowerCase();
      
      if (query === '') {
        this.filtered = this.apps.slice();
      } else {
        this.filtered = this.apps.filter(function(app) {
          return app.name.toLowerCase().indexOf(query) !== -1;
        });
      }
      
      if (state.selectedAppIndex >= this.filtered.length) {
        state.selectedAppIndex = Math.max(0, this.filtered.length - 1);
      }
    },

    draw: function() {
      var w = state.screenWidth;
      var startY = this.topMargin;
      var visibleHeight = this.getVisibleHeight();
      
      utils.clearArea(0, startY, w, startY + visibleHeight - 1);
      
      utils.drawBox(0, startY, w, visibleHeight, 
        'APPS [' + this.filtered.length + '/' + this.apps.length + ']',
        config.colors.purple);
      
      var appWidth = 18;
      if (appWidth < 3) appWidth = 3;

      var appsPerLine = Math.floor((w - 2) / appWidth);
      if (appsPerLine === 0) appsPerLine = 1;

      var x = 1;
      var y = startY + 1;
      
      for (var i = 0; i < this.filtered.length; i++) {
        var app = this.filtered[i];
        
        if (x + appWidth > w - 1) {
          x = 1;
          y += 1;
          
          if (y >= startY + visibleHeight - 1) {
            break;
          }
        }
        
        var isSelected = i === state.selectedAppIndex;
        var prefix = isSelected ? config.chars.bullet : ' ';
        var color = isSelected ? config.colors.pink : config.colors.foreground;
        
        app._touchY = y;
        app._touchX1 = x;
        app._touchX2 = x + appWidth - 1;
        
        var displayName = utils.truncate(app.name, appWidth - 3);
        var text = prefix + ' ' + displayName;
        
        utils.print(x, y, text, color);
        
        x += appWidth;
      }
    },

    onTouch: function(x, y) {
      for (var i = 0; i < this.filtered.length; i++) {
        var app = this.filtered[i];
        if (app._touchY === y && x >= app._touchX1 && x <= app._touchX2) {
          state.selectedAppIndex = i;
          this.draw();
          
          setTimeout(function() {
            ap37.openApp(app.id);
          }, 100);
          return true;
        }
      }
      return false;
    },

    search: function(query) {
      state.searchQuery = query;
      this.filter();
      this.draw();
      header.updateSearch();
    }
  };

  // ============================================================================
  // KEYBOARD MODULE - QWERTY LAYOUT
  // ============================================================================
  var keyboard = {
    layouts: {
      normal: [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'bksp'],
        ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', 'enter'],
        ['123', 'space', 'space', 'space', 'space', 'space', 'close']
      ],
      shift: [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'bksp'],
        ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '!', 'enter'],
        ['123', 'space', 'space', 'space', 'space', 'space', 'close']
      ],
      numbers: [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['-', '/', ':', ';', '(', ')', '&', '@', ',', 'bksp'],
        ['#+=', '.', ',', '?', '!', '\'', '"', '+', '=', 'enter'],
        ['ABC', 'space', 'space', 'space', 'space', 'space', 'close']
      ],
      symbols: [
        ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
        ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', 'bksp'],
        ['123', '.', ',', '?', '!', '\'', '"', '-', '/', 'enter'],
        ['ABC', 'space', 'space', 'space', 'space', 'space', 'close']
      ]
    },
    
    currentLayout: 'normal',
    height: 15,
    keyHeight: 3,
    keys: [],
    
    init: function() {
    },

    show: function() {
      state.keyboardVisible = true;
      this.draw();
      appList.draw();
      header.updateSearch();
      footer.draw();
    },

    hide: function() {
      state.keyboardVisible = false;
      var topY = state.screenHeight - this.height;
      utils.clearArea(0, topY, state.screenWidth, state.screenHeight - 1);
      appList.draw();
      header.updateSearch();
      footer.draw();
    },

    draw: function() {
      var w = state.screenWidth;
      var h = state.screenHeight;
      var layout = this.layouts[this.currentLayout];
      var startY = h - this.height;
      
      this.keys = [];
      
      utils.clearArea(0, startY, w, h - 1);
      
      utils.drawBox(0, startY, w, this.height, null, config.colors.pink);
      
      var keyWidth = Math.floor((w - 2) / 10);
      var startX = 1;
      
      for (var row = 0; row < layout.length; row++) {
        var y = startY + 1 + (row * this.keyHeight);
        var currentX = startX;
        
        for (var col = 0; col < layout[row].length; col++) {
          var keyLabel = layout[row][col];
          var width = keyWidth;
          
          if (keyLabel === 'space') {
            if (col > 0 && layout[row][col-1] === 'space') {
                continue;
            }
            width = keyWidth * 5;
            keyLabel = '     ';
          }
          
          if (keyLabel === 'close' || keyLabel === '123' || keyLabel === 'ABC' || keyLabel === '#+=') {
            width = keyWidth * 2;
          }

          var displayLabel = keyLabel;
          if (displayLabel === 'bksp') displayLabel = '<-';
          if (displayLabel === 'enter') displayLabel = 'OK';
          if (displayLabel === 'shift') displayLabel = '^';
          if (displayLabel === 'close') displayLabel = 'X';
          
          var keyText = utils.centerText(displayLabel, width);
          utils.print(currentX, y, keyText, config.colors.cyan);
          
          this.keys.push({
            label: keyLabel,
            x1: currentX,
            y1: y,
            x2: currentX + width - 1,
            y2: y + this.keyHeight - 1
          });
          
          currentX += width;
        }
      }
    },

    onTouch: function(x, y) {
      if (!state.keyboardVisible) return false;
      
      for (var i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
        if (x >= key.x1 && x <= key.x2 && y >= key.y1 && y <= key.y2) {
          this.handleKey(key.label);
          return true;
        }
      }
      return false;
    },

    handleKey: function(key) {
      switch (key) {
        case 'bksp':
          if (state.searchQuery.length > 0) {
            state.searchQuery = state.searchQuery.slice(0, -1);
            appList.search(state.searchQuery);
          }
          break;
          
        case 'enter':
          if (appList.filtered.length > 0) {
            var app = appList.filtered[state.selectedAppIndex];
            ap37.openApp(app.id);
          }
          this.hide();
          break;
          
        case 'space':
          state.searchQuery += ' ';
          appList.search(state.searchQuery);
          break;
          
        case 'shift':
          this.currentLayout = this.currentLayout === 'normal' ? 'shift' : 'normal';
          this.draw();
          break;
          
        case '123':
          this.currentLayout = 'numbers';
          this.draw();
          break;
          
        case '#+=':
          this.currentLayout = 'symbols';
          this.draw();
          break;
          
        case 'ABC':
          this.currentLayout = 'normal';
          this.draw();
          break;
          
        case 'close':
          this.hide();
          break;
          
        default:
          state.searchQuery += key;
          appList.search(state.searchQuery);
          
          if (this.currentLayout === 'shift') {
            this.currentLayout = 'normal';
            this.draw();
          }
          break;
      }
    }
  };
  // ============================================================================
  // INPUT HANDLER
  // ============================================================================
  var inputHandler = {
    init: function() {
      ap37.setOnTouchListener(function(x, y) {
        if (header.onTouch(x, y)) return;
        if (keyboard.onTouch(x, y)) return;
        if (footer.onTouch(x, y)) return;
        if (appList.onTouch(x, y)) return;
      });
    }
  };
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  function init() {
    screen.init();
    header.draw();
    footer.draw();
    keyboard.init();
    appList.init();
    inputHandler.init();
    
    setInterval(function() {
      header.draw();
    }, 60000);
  }

  init();
})();
