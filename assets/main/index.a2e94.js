window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1d9c7bITm1H64wHNDzgaQ6U", "Game");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        starPrefab: {
          default: null,
          type: cc.Prefab
        },
        maxStarDuration: 0,
        minStarDuration: 0,
        ground: {
          default: null,
          type: cc.Node
        },
        player: {
          default: null,
          type: cc.Node
        },
        scoreDisplay: {
          default: null,
          type: cc.Label
        },
        LimitTime: {
          default: null,
          type: cc.Label
        }
      },
      onLoad: function onLoad() {
        this.groundY = this.ground.y + this.ground.height / 2;
        this.timer = 0;
        this.starDuration = 0;
        this.spawnNewStar();
        this.score = 0;
      },
      spawnNewStar: function spawnNewStar() {
        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent("Star").game = this;
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
      },
      getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        var randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50;
        var maxX = this.node.width / 2 - 30;
        randX = 2 * (Math.random() - .5) * maxX;
        return cc.v2(randX, randY);
      },
      gainScore: function gainScore() {
        this.score += 1;
        this.scoreDisplay.string = "Score: " + this.score;
      },
      gameOver: function gameOver() {
        this.player.stopAllActions();
        cc.director.loadScene("game");
      },
      start: function start() {},
      update: function update(dt) {
        this.LimitTime.string = "Limit: " + Math.round(this.starDuration - this.timer);
        if (this.timer > this.starDuration) {
          this.gameOver();
          return;
        }
        this.timer += dt;
      }
    });
    cc._RF.pop();
  }, {} ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9c4a8aTz9VBMKfjhos231Rt", "Player");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        MainCamera: {
          default: null,
          type: cc.Node
        }
      },
      runJumpAction: function runJumpAction() {
        var jumpUp = cc.tween().by(this.jumpDuration, {
          y: this.jumpHeight
        }, {
          easing: "sineOut"
        });
        var jumpDown = cc.tween().by(this.jumpDuration, {
          y: -this.jumpHeight
        }, {
          easing: "sineIn"
        });
        var tween = cc.tween().then(jumpUp).then(jumpDown);
        return cc.tween().repeatForever(tween);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.a:
          this.accLeft = true;
          break;

         case cc.macro.KEY.d:
          this.accRight = true;
        }
      },
      onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.a:
          this.accLeft = false;
          break;

         case cc.macro.KEY.d:
          this.accRight = false;
        }
      },
      onLoad: function onLoad() {
        var JumpAction = this.runJumpAction();
        cc.tween(this.node).then(JumpAction).start();
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
      },
      start: function start() {},
      update: function update(dt) {
        this.accLeft ? this.xSpeed -= this.accel * dt : this.accRight && (this.xSpeed += this.accel * dt);
        Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
        if (Math.abs(this.node.x + this.xSpeed * dt + 39) >= this.MainCamera.width / 2 - 39) {
          this.accRight = -this.accRight;
          this.accLeft = -this.accLeft;
          this.xSpeed = -this.xSpeed;
        }
        this.node.x += this.xSpeed * dt;
      }
    });
    cc._RF.pop();
  }, {} ],
  Star: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b355EGgbdPtYZnr4GdO8KX", "Star");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        pickRadius: 0,
        width: 60
      },
      getStarWidth: function getStarWidth() {
        return this.node.width;
      },
      getPlayerDistance: function getPlayerDistance() {
        var playerPosx = this.game.player.x + 39;
        var playerPosy = this.game.player.y + 33.5;
        var Subx = (this.node.x - playerPosx) * (this.node.x - playerPosx);
        var Suby = (this.node.y - playerPosy) * (this.node.y - playerPosy);
        var dist = Math.sqrt(Subx + Suby);
        return dist;
      },
      onPicked: function onPicked() {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
      },
      start: function start() {},
      update: function update() {
        if (this.getPlayerDistance() < this.pickRadius) {
          this.onPicked();
          return;
        }
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Game", "Player", "Star" ]);