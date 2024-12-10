System.register("chunks:///_virtual/BetManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Button, Label, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Button = module.Button;
      Label = module.Label;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;

      cclegacy._RF.push({}, "07b14h51OVCmLm+sW4GMCaB", "BetManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var BETS = [5, 10, 50, 100, 500, 1000, 5000];
      var BetManager = exports('BetManager', (_dec = ccclass('BetManager'), _dec2 = property(Button), _dec3 = property(Button), _dec4 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(BetManager, _Component);

        function BetManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "increaseBetBtn", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "decreaseBetBtn", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "betLabel", _descriptor3, _assertThisInitialized(_this));

          _this.currIndex = 0;
          _this.playerBetAmount = 0;
          return _this;
        }

        var _proto = BetManager.prototype;

        _proto.start = function start() {
          this.betLabel.string = BETS[this.currIndex].toString();
          this.playerBetAmount = BETS[this.currIndex];
        };

        _proto.resetBet = function resetBet() {
          this.playerBetAmount = BETS[this.currIndex];
        };

        _proto.onDoubleDown = function onDoubleDown() {
          this.playerBetAmount *= 2;
        };

        _proto.onIncreaseBet = function onIncreaseBet() {
          this.currIndex++;
          if (this.currIndex > BETS.length - 1) this.currIndex = 0;
          this.betLabel.string = BETS[this.currIndex].toString();
          this.playerBetAmount = BETS[this.currIndex];
        };

        _proto.onDecreaseBet = function onDecreaseBet() {
          this.currIndex--;
          if (this.currIndex < 0) this.currIndex = BETS.length - 1;
          this.betLabel.string = BETS[this.currIndex].toString();
          this.playerBetAmount = BETS[this.currIndex];
        };

        return BetManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "increaseBetBtn", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "decreaseBetBtn", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "betLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BlackJackDealerManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BlackJackGameManager.ts', './utils.ts', './TimerManager.ts', './CardManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Label, resources, SpriteFrame, error, instantiate, Sprite, Component, BlackJackGameManager, TURN_DURATION, getTotalHandValue, checkBlackJack, TimerManager, CardManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Label = module.Label;
      resources = module.resources;
      SpriteFrame = module.SpriteFrame;
      error = module.error;
      instantiate = module.instantiate;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      BlackJackGameManager = module.BlackJackGameManager;
      TURN_DURATION = module.TURN_DURATION;
    }, function (module) {
      getTotalHandValue = module.getTotalHandValue;
      checkBlackJack = module.checkBlackJack;
    }, function (module) {
      TimerManager = module.TimerManager;
    }, function (module) {
      CardManager = module.CardManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;

      cclegacy._RF.push({}, "f3e3ekrxpdH56yfq/KnEgTi", "BlackJackDealerManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var BlackJackDealerManager = exports('BlackJackDealerManager', (_dec = ccclass('BlackJackDealerManager'), _dec2 = property(Node), _dec3 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(BlackJackDealerManager, _Component);

        function BlackJackDealerManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "dealerTable", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "dealerInfo", _descriptor2, _assertThisInitialized(_this));

          _this.dealerHand = [];
          _this.dealerHandValue = 0;
          _this._dealerTurn = void 0;
          _this.hasBlackJack = void 0;
          return _this;
        }

        var _proto = BlackJackDealerManager.prototype;

        _proto.startTurn = function startTurn() {
          this._dealerTurn = true;
          this.nextMove();
        };

        _proto.loadHand = function loadHand(hand) {
          var _this2 = this;

          var allPromises = [];
          hand.forEach(function (card) {
            var value = card.value,
                suit = card.suit,
                cardNode = card.cardNode;
            if (cardNode) return;
            var assetName = value + "_" + suit;
            allPromises.push(new Promise(function (resolve, reject) {
              resources.load("face-cards/" + assetName + "/spriteFrame", SpriteFrame, function (err, asset) {
                if (err) return reject(error(err.message));
                var node = instantiate(BlackJackGameManager.instance.cardPrefab);
                node.getComponent(Sprite).spriteFrame = asset;
                card.cardNode = node;
                card.cardNode.setParent(_this2.dealerTable);
                resolve(card);
              });
            }));
          });
          return Promise.all(allPromises).then(function () {
            return hand;
          });
        };

        _proto.updateHand = function updateHand(playerHand) {
          this.dealerHandValue = getTotalHandValue(playerHand);
          this.dealerInfo.string = "Dealer value: " + this.dealerHandValue;
          var isBlackJack = checkBlackJack(playerHand);

          if (isBlackJack) {
            this.hasBlackJack = true;
          } else if (this.dealerHandValue > 21) {
            this.dealerInfo.string += "\nDealer are busted !";
          }
        };

        _proto.dealOneCardDealer = function dealOneCardDealer() {
          var _this3 = this;

          this.dealerHand.push(BlackJackGameManager.instance.dealOneCard());
          this.loadHand(this.dealerHand).then(function () {
            if (_this3.dealerHand.length == 2) {
              _this3.dealerHand[1].cardNode.getComponent(CardManager).showBackCard();
            }

            _this3.updateHand(_this3.dealerHand);

            _this3._dealerTurn = false;

            _this3.nextMove();
          });
        };

        _proto.nextMove = function nextMove() {
          if (this._dealerTurn) {
            if (this.dealerHand.length < 2) {
              this.dealOneCardDealer();
            } else {
              this.dealerHand[1].cardNode.getComponent(CardManager).showFaceCard();
              this.updateHand(this.dealerHand);

              if (this.dealerHandValue < 17) {
                this.dealerHit();
              } else {
                this.dealerInfo.string += "\nDealer end turn";
                BlackJackGameManager.instance.endDealerTurn(true);
              }
            }
          } else {
            BlackJackGameManager.instance.endDealerTurn();
          }
        };

        _proto.dealerHit = function dealerHit() {
          var _this4 = this;

          this.dealerHand.push(BlackJackGameManager.instance.dealOneCard());
          this.loadHand(this.dealerHand).then(function () {
            _this4.updateHand(_this4.dealerHand);

            TimerManager.instance._scheduleOnce(_this4.nextMove.bind(_this4), TURN_DURATION);
          });
        };

        _proto.reset = function reset() {
          this.dealerTable.removeAllChildren();
          this.dealerHand = [];
          this.dealerHandValue = 0;
          this._dealerTurn = false;
          this.hasBlackJack = false;
          this.dealerInfo.string = "Dealer value: 0";
        };

        return BlackJackDealerManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dealerTable", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "dealerInfo", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BlackJackGameManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BlackJackDealerManager.ts', './ToastManager.ts', './utils.ts', './TimerManager.ts', './BlackJackPlayerManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Prefab, Button, Component, BlackJackDealerManager, ToastManager, getDeck, shuffle, TimerManager, BlackJackPlayerManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Prefab = module.Prefab;
      Button = module.Button;
      Component = module.Component;
    }, function (module) {
      BlackJackDealerManager = module.BlackJackDealerManager;
    }, function (module) {
      ToastManager = module.ToastManager;
    }, function (module) {
      getDeck = module.getDeck;
      shuffle = module.shuffle;
    }, function (module) {
      TimerManager = module.TimerManager;
    }, function (module) {
      BlackJackPlayerManager = module.BlackJackPlayerManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3;

      cclegacy._RF.push({}, "2dad6voBrdLPpEe9NYJHrTr", "BlackJackGameManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var TURN_DURATION = exports('TURN_DURATION', 0.5);
      var BlackJackGameManager = exports('BlackJackGameManager', (_dec = ccclass('BlackJackGameManager'), _dec2 = property(Node), _dec3 = property(Prefab), _dec4 = property(Button), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(ToastManager), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(BlackJackGameManager, _Component);

        function BlackJackGameManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "cardTable", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "cardPrefab", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "gameStartButton", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "dealer", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "player", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "toast", _descriptor6, _assertThisInitialized(_this));

          _this.cardDeck = [];
          _this.playerTurn = void 0;
          return _this;
        }

        var _proto = BlackJackGameManager.prototype;

        _proto.onLoad = function onLoad() {
          var _this$dealer, _this$player;

          BlackJackGameManager.instance = this;
          this.dealer = (_this$dealer = this.dealer) == null ? void 0 : _this$dealer.getComponent(BlackJackDealerManager);
          this.player = (_this$player = this.player) == null ? void 0 : _this$player.getComponent(BlackJackPlayerManager);
        };

        _proto.start = function start() {// this.gameStart();
        };

        _proto.gameStart = function gameStart() {
          var deck = getDeck().concat(getDeck()).concat(getDeck());
          shuffle(deck);
          this.cardDeck = deck;
          this.gameStartButton.interactable = false;
          this.playerTurn = true;
          this.player.onGameStart();
          this.nextMove();
        };

        _proto.nextMove = function nextMove() {
          if (this.playerTurn) {
            this.player.startTurn();
          } else {
            this.dealer.startTurn();
          }
        };

        _proto.dealOneCard = function dealOneCard() {
          if (this.cardDeck.length == 0) return;
          return this.cardDeck.pop();
        };

        _proto.endDealerTurn = function endDealerTurn(isFinshed) {
          this.playerTurn = true;

          if (isFinshed) {
            this.showResult();
          } else {
            TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
          }
        };

        _proto.endPlayerTurn = function endPlayerTurn() {
          this.playerTurn = false;

          TimerManager.instance._scheduleOnce(this.nextMove.bind(this), TURN_DURATION);
        };

        _proto.showResult = function showResult() {
          var playerHandValue = this.player.playerHandValue;
          var dealerHandValue = this.dealer.dealerHandValue;
          var playerHasBlackJack = this.player.hasBlackJack;
          var dealerHasBlackJack = this.dealer.hasBlackJack;
          var isPlayerBust = playerHandValue > 21;
          var isDealerBust = dealerHandValue > 21;
          var result;

          if (isPlayerBust) {
            if (isDealerBust) {
              this.toast.showToast("Draw !!", "draw");
              result = "draw";
            } else {
              this.toast.showToast("You have lost", "lose");
              result = "lose";
            }
          } else if (isDealerBust) {
            this.toast.showToast("You have won", "win");
            result = "win";
          } else {
            if (playerHasBlackJack) {
              if (dealerHasBlackJack) {
                this.toast.showToast("Draw !!", "draw");
                result = "draw";
              } else {
                this.toast.showToast("You have won", "win");
                result = "win";
              }
            } else if (playerHandValue > dealerHandValue) {
              this.toast.showToast("You have won", "win");
              result = "win";
            } else if (playerHandValue === dealerHandValue) {
              this.toast.showToast("Draw !!", "draw");
              result = "draw";
            } else {
              this.toast.showToast("You have lost", "lose");
              result = "lose";
            }
          }

          this.player.endGame(result);
          this.gameStartButton.interactable = true;
        };

        _proto.onGameRestart = function onGameRestart() {
          this.dealer.reset();
          this.player.reset();
          this.gameStart();
        };

        return BlackJackGameManager;
      }(Component), _class3.instance = void 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cardTable", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cardPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "gameStartButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "dealer", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "player", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "toast", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BlackJackPlayerManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BlackJackGameManager.ts', './utils.ts', './ToastManager.ts', './BetManager.ts', './WalletManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Button, Label, resources, SpriteFrame, error, instantiate, Sprite, Component, BlackJackGameManager, getTotalHandValue, checkBlackJack, calculateWinnings, ToastManager, BetManager, WalletManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Button = module.Button;
      Label = module.Label;
      resources = module.resources;
      SpriteFrame = module.SpriteFrame;
      error = module.error;
      instantiate = module.instantiate;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      BlackJackGameManager = module.BlackJackGameManager;
    }, function (module) {
      getTotalHandValue = module.getTotalHandValue;
      checkBlackJack = module.checkBlackJack;
      calculateWinnings = module.calculateWinnings;
    }, function (module) {
      ToastManager = module.ToastManager;
    }, function (module) {
      BetManager = module.BetManager;
    }, function (module) {
      WalletManager = module.WalletManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

      cclegacy._RF.push({}, "8888astadlBg6heRjsrSVg2", "BlackJackPlayerManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var BlackJackPlayerManager = exports('BlackJackPlayerManager', (_dec = ccclass('BlackJackPlayerManager'), _dec2 = property(Node), _dec3 = property(Button), _dec4 = property(Button), _dec5 = property(Button), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(ToastManager), _dec9 = property(BetManager), _dec10 = property(WalletManager), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(BlackJackPlayerManager, _Component);

        function BlackJackPlayerManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "playerTable", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "hitButton", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "endButton", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "doubleDownButton", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "handInfo", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "handShoutOut", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "toast", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "playerBet", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "playerWallet", _descriptor9, _assertThisInitialized(_this));

          _this.hasBlackJack = void 0;
          _this.playerHand = [];
          _this.playerHandValue = 0;
          _this.isDoubleDown = void 0;
          return _this;
        }

        var _proto = BlackJackPlayerManager.prototype;

        _proto.start = function start() {
          this.disableButtons();
        };

        _proto.onGameStart = function onGameStart() {
          this.updateWalletOnStart();
        };

        _proto.startTurn = function startTurn() {
          if (this.hasBlackJack) {
            this.onEndTurn();
          } else if (this.playerHand.length <= 1) {
            this.dealOneCardPlayer();
            this.disableButtons();
          } else {
            this.enableButtons();
          }

          console.log(this.playerHand);
        };

        _proto.dealOneCardPlayer = function dealOneCardPlayer() {
          var _this2 = this;

          this.playerHand.push(BlackJackGameManager.instance.dealOneCard()); // this.playerHand.push(debugCards.pop());

          this.loadHand(this.playerHand).then(function () {
            _this2.updateHand(_this2.playerHand);

            BlackJackGameManager.instance.endPlayerTurn();
          });
        };

        _proto.disableButtons = function disableButtons() {
          this.hitButton.interactable = false;
          this.endButton.interactable = false;
          this.doubleDownButton.interactable = false;
        };

        _proto.enableButtons = function enableButtons() {
          this.hitButton.interactable = true;
          this.endButton.interactable = true;
          this.doubleDownButton.interactable = true;
        };

        _proto.updateHand = function updateHand(playerHand) {
          this.playerHandValue = getTotalHandValue(playerHand);
          this.handInfo.string = "Total value: " + this.playerHandValue;
          this.hasBlackJack = checkBlackJack(playerHand);

          if (this.hasBlackJack) {
            this.disableButtons();
            this.handInfo.string += "\nWow! Black Jack !!!";
            this.handShoutOut.string = "BLACK JACK !!!";
            this.toast.showToast("You have hit a black jack !!!", "blackJack");
          } else if (this.playerHandValue > 21) {
            this.handInfo.string += "\nYou are busted !";
            this.onEndTurn();
          }
        };

        _proto.loadHand = function loadHand(hand) {
          var _this3 = this;

          var allPromises = [];
          hand.forEach(function (card) {
            var value = card.value,
                suit = card.suit,
                cardNode = card.cardNode;
            if (cardNode) return;
            var assetName = value + "_" + suit;
            allPromises.push(new Promise(function (resolve, reject) {
              resources.load("face-cards/" + assetName + "/spriteFrame", SpriteFrame, function (err, asset) {
                if (err) return reject(error(err.message));
                var node = instantiate(BlackJackGameManager.instance.cardPrefab);
                node.getComponent(Sprite).spriteFrame = asset;
                card.cardNode = node;
                card.cardNode.setParent(_this3.playerTable);
                resolve(card);
              });
            }));
          });
          return Promise.all(allPromises).then(function () {
            return hand;
          });
        };

        _proto.onHit = function onHit() {
          var _this4 = this;

          this.playerHand.push(BlackJackGameManager.instance.dealOneCard());

          if (this.playerHand.length > 2) {
            this.doubleDownButton.interactable = false;
          }

          this.loadHand(this.playerHand).then(function () {
            _this4.updateHand(_this4.playerHand);
          });
        };

        _proto.onEndTurn = function onEndTurn() {
          this.disableButtons();
          BlackJackGameManager.instance.endPlayerTurn();
        };

        _proto.onDoubleDown = function onDoubleDown() {
          this.isDoubleDown = true;
          this.handShoutOut.string = "DOUBLE DOWN !!!";
          this.playerWallet.subMoney(this.playerBet.playerBetAmount);
          this.playerBet.onDoubleDown();
          this.dealOneCardPlayer();
        };

        _proto.endGame = function endGame(result) {
          this.disableButtons();

          switch (result) {
            case "win":
              var winAmount = this.playerBet.playerBetAmount + calculateWinnings(this.playerBet.playerBetAmount, this.hasBlackJack);
              this.playerWallet.addMoney(winAmount);
              break;

            case "draw":
              this.playerWallet.addMoney(this.playerBet.playerBetAmount);
              break;
          }
        };

        _proto.updateWalletOnStart = function updateWalletOnStart() {
          this.playerBet.resetBet();
          this.playerWallet.subMoney(this.playerBet.playerBetAmount);
        };

        _proto.reset = function reset() {
          this.playerTable.removeAllChildren();
          this.hasBlackJack = false;
          this.isDoubleDown = false;
          this.playerHand = [];
          this.handShoutOut.string = "";
          this.enableButtons();
        };

        return BlackJackPlayerManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "playerTable", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "hitButton", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "endButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "doubleDownButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "handInfo", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "handShoutOut", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "toast", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "playerBet", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "playerWallet", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CardManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Component, GameManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Component = module.Component;
    }, function (module) {
      GameManager = module.GameManager;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;

      cclegacy._RF.push({}, "726e9+L1QNFH60FbTwCUmDA", "CardManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var CardManager = exports('CardManager', (_dec = ccclass('CardManager'), _dec2 = property(Node), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(CardManager, _Component);

        function CardManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "backCard", _descriptor, _assertThisInitialized(_this));

          _this.isSelected = void 0;
          return _this;
        }

        var _proto = CardManager.prototype;

        _proto.start = function start() {
          this.node.on("INIT", this.init, this);
        };

        _proto.init = function init() {
          this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        };

        _proto.onMouseDown = function onMouseDown() {
          this.isSelected = !this.isSelected;
          var pos = this.node.getPosition();

          if (this.isSelected) {
            pos.y = 20;
            GameManager.instance.onSelectCard(this.node);
          } else {
            pos.y = 0;
            GameManager.instance.onUnselectCard(this.node);
          }

          this.node.setPosition(pos);
        };

        _proto.showBackCard = function showBackCard() {
          this.backCard.active = true;
        };

        _proto.isShowingBackCard = function isShowingBackCard() {
          return !!this.backCard.active;
        };

        _proto.showFaceCard = function showFaceCard() {
          this.backCard.active = false;
        };

        _proto.onDestroy = function onDestroy() {
          this.node.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        };

        return CardManager;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "backCard", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/debug-view-runtime-control.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Color, Canvas, UITransform, instantiate, Label, RichText, Toggle, Button, director, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Color = module.Color;
      Canvas = module.Canvas;
      UITransform = module.UITransform;
      instantiate = module.instantiate;
      Label = module.Label;
      RichText = module.RichText;
      Toggle = module.Toggle;
      Button = module.Button;
      director = module.director;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;

      cclegacy._RF.push({}, "b2bd1+njXxJxaFY3ymm06WU", "debug-view-runtime-control", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var DebugViewRuntimeControl = exports('DebugViewRuntimeControl', (_dec = ccclass('internal.DebugViewRuntimeControl'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(DebugViewRuntimeControl, _Component);

        function DebugViewRuntimeControl() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "compositeModeToggle", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "singleModeToggle", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "EnableAllCompositeModeButton", _descriptor3, _assertThisInitialized(_this));

          _this._single = 0;
          _this.strSingle = ['No Single Debug', 'Vertex Color', 'Vertex Normal', 'Vertex Tangent', 'World Position', 'Vertex Mirror', 'Face Side', 'UV0', 'UV1', 'UV Lightmap', 'Project Depth', 'Linear Depth', 'Fragment Normal', 'Fragment Tangent', 'Fragment Binormal', 'Base Color', 'Diffuse Color', 'Specular Color', 'Transparency', 'Metallic', 'Roughness', 'Specular Intensity', 'IOR', 'Direct Diffuse', 'Direct Specular', 'Direct All', 'Env Diffuse', 'Env Specular', 'Env All', 'Emissive', 'Light Map', 'Shadow', 'AO', 'Fresnel', 'Direct Transmit Diffuse', 'Direct Transmit Specular', 'Env Transmit Diffuse', 'Env Transmit Specular', 'Transmit All', 'Direct Internal Specular', 'Env Internal Specular', 'Internal All', 'Fog'];
          _this.strComposite = ['Direct Diffuse', 'Direct Specular', 'Env Diffuse', 'Env Specular', 'Emissive', 'Light Map', 'Shadow', 'AO', 'Normal Map', 'Fog', 'Tone Mapping', 'Gamma Correction', 'Fresnel', 'Transmit Diffuse', 'Transmit Specular', 'Internal Specular', 'TT'];
          _this.strMisc = ['CSM Layer Coloration', 'Lighting With Albedo'];
          _this.compositeModeToggleList = [];
          _this.singleModeToggleList = [];
          _this.miscModeToggleList = [];
          _this.textComponentList = [];
          _this.labelComponentList = [];
          _this.textContentList = [];
          _this.hideButtonLabel = void 0;
          _this._currentColorIndex = 0;
          _this.strColor = ['<color=#ffffff>', '<color=#000000>', '<color=#ff0000>', '<color=#00ff00>', '<color=#0000ff>'];
          _this.color = [Color.WHITE, Color.BLACK, Color.RED, Color.GREEN, Color.BLUE];
          return _this;
        }

        var _proto = DebugViewRuntimeControl.prototype;

        _proto.start = function start() {
          // get canvas resolution
          var canvas = this.node.parent.getComponent(Canvas);

          if (!canvas) {
            console.error('debug-view-runtime-control should be child of Canvas');
            return;
          }

          var uiTransform = this.node.parent.getComponent(UITransform);
          var halfScreenWidth = uiTransform.width * 0.5;
          var halfScreenHeight = uiTransform.height * 0.5;
          var x = -halfScreenWidth + halfScreenWidth * 0.1,
              y = halfScreenHeight - halfScreenHeight * 0.1;
          var width = 200,
              height = 20; // new nodes

          var miscNode = this.node.getChildByName('MiscMode');
          var buttonNode = instantiate(miscNode);
          buttonNode.parent = this.node;
          buttonNode.name = 'Buttons';
          var titleNode = instantiate(miscNode);
          titleNode.parent = this.node;
          titleNode.name = 'Titles'; // title

          for (var i = 0; i < 2; i++) {
            var newLabel = instantiate(this.EnableAllCompositeModeButton.getChildByName('Label'));
            newLabel.setPosition(x + (i > 0 ? 50 + width * 2 : 150), y, 0.0);
            newLabel.setScale(0.75, 0.75, 0.75);
            newLabel.parent = titleNode;

            var _labelComponent = newLabel.getComponent(Label);

            _labelComponent.string = i ? '----------Composite Mode----------' : '----------Single Mode----------';
            _labelComponent.color = Color.WHITE;
            _labelComponent.overflow = 0;
            this.labelComponentList[this.labelComponentList.length] = _labelComponent;
          }

          y -= height; // single

          var currentRow = 0;

          for (var _i = 0; _i < this.strSingle.length; _i++, currentRow++) {
            if (_i === this.strSingle.length >> 1) {
              x += width;
              currentRow = 0;
            }

            var newNode = _i ? instantiate(this.singleModeToggle) : this.singleModeToggle;
            newNode.setPosition(x, y - height * currentRow, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = this.singleModeToggle.parent;
            var textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strSingle[_i];
            this.textComponentList[this.textComponentList.length] = textComponent;
            this.textContentList[this.textContentList.length] = textComponent.string;
            newNode.on(Toggle.EventType.TOGGLE, this.toggleSingleMode, this);
            this.singleModeToggleList[_i] = newNode;
          }

          x += width; // buttons

          this.EnableAllCompositeModeButton.setPosition(x + 15, y, 0.0);
          this.EnableAllCompositeModeButton.setScale(0.5, 0.5, 0.5);
          this.EnableAllCompositeModeButton.on(Button.EventType.CLICK, this.enableAllCompositeMode, this);
          this.EnableAllCompositeModeButton.parent = buttonNode;
          var labelComponent = this.EnableAllCompositeModeButton.getComponentInChildren(Label);
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          var changeColorButton = instantiate(this.EnableAllCompositeModeButton);
          changeColorButton.setPosition(x + 90, y, 0.0);
          changeColorButton.setScale(0.5, 0.5, 0.5);
          changeColorButton.on(Button.EventType.CLICK, this.changeTextColor, this);
          changeColorButton.parent = buttonNode;
          labelComponent = changeColorButton.getComponentInChildren(Label);
          labelComponent.string = 'TextColor';
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          var HideButton = instantiate(this.EnableAllCompositeModeButton);
          HideButton.setPosition(x + 200, y, 0.0);
          HideButton.setScale(0.5, 0.5, 0.5);
          HideButton.on(Button.EventType.CLICK, this.hideUI, this);
          HideButton.parent = this.node.parent;
          labelComponent = HideButton.getComponentInChildren(Label);
          labelComponent.string = 'Hide UI';
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          this.hideButtonLabel = labelComponent; // misc

          y -= 40;

          for (var _i2 = 0; _i2 < this.strMisc.length; _i2++) {
            var _newNode = instantiate(this.compositeModeToggle);

            _newNode.setPosition(x, y - height * _i2, 0.0);

            _newNode.setScale(0.5, 0.5, 0.5);

            _newNode.parent = miscNode;

            var _textComponent = _newNode.getComponentInChildren(RichText);

            _textComponent.string = this.strMisc[_i2];
            this.textComponentList[this.textComponentList.length] = _textComponent;
            this.textContentList[this.textContentList.length] = _textComponent.string;

            var toggleComponent = _newNode.getComponent(Toggle);

            toggleComponent.isChecked = _i2 ? true : false;

            _newNode.on(Toggle.EventType.TOGGLE, _i2 ? this.toggleLightingWithAlbedo : this.toggleCSMColoration, this);

            this.miscModeToggleList[_i2] = _newNode;
          } // composite


          y -= 150;

          for (var _i3 = 0; _i3 < this.strComposite.length; _i3++) {
            var _newNode2 = _i3 ? instantiate(this.compositeModeToggle) : this.compositeModeToggle;

            _newNode2.setPosition(x, y - height * _i3, 0.0);

            _newNode2.setScale(0.5, 0.5, 0.5);

            _newNode2.parent = this.compositeModeToggle.parent;

            var _textComponent2 = _newNode2.getComponentInChildren(RichText);

            _textComponent2.string = this.strComposite[_i3];
            this.textComponentList[this.textComponentList.length] = _textComponent2;
            this.textContentList[this.textContentList.length] = _textComponent2.string;

            _newNode2.on(Toggle.EventType.TOGGLE, this.toggleCompositeMode, this);

            this.compositeModeToggleList[_i3] = _newNode2;
          }
        };

        _proto.isTextMatched = function isTextMatched(textUI, textDescription) {
          var tempText = new String(textUI);
          var findIndex = tempText.search('>');

          if (findIndex === -1) {
            return textUI === textDescription;
          } else {
            tempText = tempText.substr(findIndex + 1);
            tempText = tempText.substr(0, tempText.search('<'));
            return tempText === textDescription;
          }
        };

        _proto.toggleSingleMode = function toggleSingleMode(toggle) {
          var debugView = director.root.debugView;
          var textComponent = toggle.getComponentInChildren(RichText);

          for (var i = 0; i < this.strSingle.length; i++) {
            if (this.isTextMatched(textComponent.string, this.strSingle[i])) {
              debugView.singleMode = i;
            }
          }
        };

        _proto.toggleCompositeMode = function toggleCompositeMode(toggle) {
          var debugView = director.root.debugView;
          var textComponent = toggle.getComponentInChildren(RichText);

          for (var i = 0; i < this.strComposite.length; i++) {
            if (this.isTextMatched(textComponent.string, this.strComposite[i])) {
              debugView.enableCompositeMode(i, toggle.isChecked);
            }
          }
        };

        _proto.toggleLightingWithAlbedo = function toggleLightingWithAlbedo(toggle) {
          var debugView = director.root.debugView;
          debugView.lightingWithAlbedo = toggle.isChecked;
        };

        _proto.toggleCSMColoration = function toggleCSMColoration(toggle) {
          var debugView = director.root.debugView;
          debugView.csmLayerColoration = toggle.isChecked;
        };

        _proto.enableAllCompositeMode = function enableAllCompositeMode(button) {
          var debugView = director.root.debugView;
          debugView.enableAllCompositeMode(true);

          for (var i = 0; i < this.compositeModeToggleList.length; i++) {
            var _toggleComponent = this.compositeModeToggleList[i].getComponent(Toggle);

            _toggleComponent.isChecked = true;
          }

          var toggleComponent = this.miscModeToggleList[0].getComponent(Toggle);
          toggleComponent.isChecked = false;
          debugView.csmLayerColoration = false;
          toggleComponent = this.miscModeToggleList[1].getComponent(Toggle);
          toggleComponent.isChecked = true;
          debugView.lightingWithAlbedo = true;
        };

        _proto.hideUI = function hideUI(button) {
          var titleNode = this.node.getChildByName('Titles');
          var activeValue = !titleNode.active;
          this.singleModeToggleList[0].parent.active = activeValue;
          this.miscModeToggleList[0].parent.active = activeValue;
          this.compositeModeToggleList[0].parent.active = activeValue;
          this.EnableAllCompositeModeButton.parent.active = activeValue;
          titleNode.active = activeValue;
          this.hideButtonLabel.string = activeValue ? 'Hide UI' : 'Show UI';
        };

        _proto.changeTextColor = function changeTextColor(button) {
          this._currentColorIndex++;

          if (this._currentColorIndex >= this.strColor.length) {
            this._currentColorIndex = 0;
          }

          for (var i = 0; i < this.textComponentList.length; i++) {
            this.textComponentList[i].string = this.strColor[this._currentColorIndex] + this.textContentList[i] + '</color>';
          }

          for (var _i4 = 0; _i4 < this.labelComponentList.length; _i4++) {
            this.labelComponentList[_i4].color = this.color[this._currentColorIndex];
          }
        };

        _proto.onLoad = function onLoad() {};

        _proto.update = function update(deltaTime) {};

        return DebugViewRuntimeControl;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "compositeModeToggle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "singleModeToggle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "EnableAllCompositeModeButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameList.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, director, Component;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      director = module.director;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "c2fb2NdJftCpr2cNq5dtg1A", "GameList", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var GameList = exports('GameList', (_dec = ccclass('GameList'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameList, _Component);

        function GameList() {
          return _Component.apply(this, arguments) || this;
        }

        var _proto = GameList.prototype;

        _proto.onClick = function onClick(evt, sceneName) {
          director.loadScene(sceneName, function (err) {
            if (err) return console.error(err);
            console.log("=== Load scene successfully ===");
          });
        };

        return GameList;
      }(Component)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Prefab, Button, v3, resources, SpriteFrame, error, instantiate, Sprite, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Prefab = module.Prefab;
      Button = module.Button;
      v3 = module.v3;
      resources = module.resources;
      SpriteFrame = module.SpriteFrame;
      error = module.error;
      instantiate = module.instantiate;
      Sprite = module.Sprite;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3;

      cclegacy._RF.push({}, "1c2fea9rnRGBpWL7tnZjo/V", "GameManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var MAX_CARDS = 52;
      var SUITS = ["spade", "diamond", "club", "heart"];
      var VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

      function getDeck() {
        var deckOfCards = [];

        for (var suitIndex = 0; suitIndex < SUITS.length; suitIndex++) {
          for (var valueIndex = 0; valueIndex < VALUES.length; valueIndex++) {
            var cardPower = valueIndex * SUITS.length + suitIndex;
            var card = {
              value: VALUES[valueIndex],
              suit: SUITS[suitIndex],
              cardPower: cardPower
            };
            deckOfCards.push(card);
          }
        } // console.log(deckOfCards.slice().sort((a,b) => a.cardPower - b.cardPower));


        return deckOfCards;
      }

      function shuffle(deck) {
        // for 1000 turns
        // switch the values of two random cards
        for (var i = 0; i < 1000; i++) {
          var location1 = Math.floor(Math.random() * deck.length);
          var location2 = Math.floor(Math.random() * deck.length);
          var tmp = deck[location1];
          deck[location1] = deck[location2];
          deck[location2] = tmp;
        }
      }

      var GameManager = exports('GameManager', (_dec = ccclass('GameManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Prefab), _dec5 = property(Button), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameManager, _Component);

        function GameManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "cardTable", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "playerDeck", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "cardPrefab", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "playHandButton", _descriptor4, _assertThisInitialized(_this));

          _this.playerHand = [];
          _this.selectedHand = [];
          _this.cardDeck = [];
          return _this;
        }

        var _proto = GameManager.prototype;

        _proto.start = function start() {
          GameManager.instance = this;
          this.gameStart();
        };

        _proto.gameStart = function gameStart() {
          var _this2 = this;

          var deck = getDeck();
          shuffle(deck);
          this.cardDeck = deck;
          return this.loadDeck(deck).then(function (resultDeck) {
            var playerHand = [];

            for (var i = 0; i < MAX_CARDS; i++) {
              if (i % 4 == 0) {
                playerHand.push(resultDeck.pop());
              } else {
                var removedCard = resultDeck.pop();
                removedCard.cardNode.destroy();
              }
            }

            _this2.findHandBestCombinations(playerHand);

            playerHand.forEach(function (card) {
              card.cardNode.setParent(_this2.playerDeck);
              card.cardNode.emit("INIT");
              var position = card.cardNode.getPosition();
              card.cardNode.setPosition(v3(position.x, 0, position.z));
            });
            _this2.playerHand = playerHand;
          });
        };

        _proto.loadDeck = function loadDeck(deck) {
          var _this3 = this;

          var allPromises = [];
          deck.forEach(function (card) {
            var value = card.value,
                suit = card.suit;
            var assetName = value + "_" + suit;
            allPromises.push(new Promise(function (resolve, reject) {
              resources.load("face-cards/" + assetName + "/spriteFrame", SpriteFrame, function (err, asset) {
                if (err) return reject(error(err.message));
                var node = instantiate(_this3.cardPrefab);
                node.getComponent(Sprite).spriteFrame = asset;
                card.cardNode = node;
                resolve(card);
              });
            }));
          });
          return Promise.all(allPromises).then(function () {
            return deck;
          });
        };

        _proto.onSelectCard = function onSelectCard(card) {
          var cardInfo = this.playerHand.find(function (_ref) {
            var cardNode = _ref.cardNode;
            return cardNode === card;
          });
          var isSelected = this.selectedHand.find(function (_ref2) {
            var cardNode = _ref2.cardNode;
            return cardNode === card;
          });
          if (!cardInfo || isSelected) return;
          this.selectedHand.push(cardInfo);
          console.log("Selected hand: ", this.selectedHand);
        };

        _proto.onUnselectCard = function onUnselectCard(card) {
          var selectedIndex = this.selectedHand.findIndex(function (_ref3) {
            var cardNode = _ref3.cardNode;
            return cardNode === card;
          });
          if (selectedIndex == -1) return;
          this.selectedHand.splice(selectedIndex, 1);
          console.log("Selected hand: ", this.selectedHand);
        };

        _proto.onPlayHand = function onPlayHand() {
          var _this4 = this;

          if (!this.selectedHand.length) {
            console.log("No selected hand to play");
            return;
          }

          this.selectedHand.forEach(function (card) {
            var cardNode = card.cardNode;
            cardNode.setParent(_this4.cardTable);
          });
          this.selectedHand = [];
          this.playHandButton.interactable = false;
          this.scheduleOnce(this.nextTurn, 1);
        };

        _proto.nextTurn = function nextTurn() {
          this.playHandButton.interactable = true;
          this.cardTable.removeAllChildren();
        };

        _proto.findHandBestCombinations = function findHandBestCombinations(hand) {};

        return GameManager;
      }(Component), _class3.instance = void 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cardTable", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "playerDeck", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cardPrefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "playHandButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./debug-view-runtime-control.ts', './BetManager.ts', './BlackJackDealerManager.ts', './BlackJackGameManager.ts', './BlackJackPlayerManager.ts', './CardManager.ts', './GameList.ts', './GameManager.ts', './TimerManager.ts', './ToastManager.ts', './WalletManager.ts', './utils.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/TimerManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Label, Component;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class, _class2;

      cclegacy._RF.push({}, "56f6aIoY4pIgYNJMBPuOmgt", "TimerManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var TimerManager = exports('TimerManager', (_dec = ccclass('TimerManager'), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(TimerManager, _Component);

        function TimerManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.isTicking = void 0;
          _this._delay = 0;
          _this.label = void 0;
          return _this;
        }

        var _proto = TimerManager.prototype;

        _proto.onLoad = function onLoad() {
          TimerManager.instance = this;
          this.label = this.getComponent(Label);
        };

        _proto._scheduleOnce = function _scheduleOnce(callback, delay) {
          TimerManager.instance.startCount(delay);
          return this.scheduleOnce(callback, delay);
        };

        _proto.startCount = function startCount(delay) {
          this.isTicking = true;
          this._delay = delay;
        };

        _proto.stopCount = function stopCount() {
          this.isTicking = false;
        };

        _proto.update = function update(dt) {
          if (!this.isTicking) return;

          if (this._delay > 0) {
            this._delay -= dt;
          } else {
            this._delay = 0;
            this.label.string = "Time: 0";
            return;
          }

          this.label.string = "Time: " + Math.abs(this._delay).toFixed(0);
        };

        return TimerManager;
      }(Component), _class2.instance = void 0, _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ToastManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Color, find, Widget, UITransform, Label, UIOpacity, Sprite, tween, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Color = module.Color;
      find = module.find;
      Widget = module.Widget;
      UITransform = module.UITransform;
      Label = module.Label;
      UIOpacity = module.UIOpacity;
      Sprite = module.Sprite;
      tween = module.tween;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

      cclegacy._RF.push({}, "ce5a2xTwd1NV4U2Pfeh6CtP", "ToastManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var ToastManager = exports('ToastManager', (_dec = ccclass('ToastManager'), _dec2 = property(Color), _dec3 = property(Color), _dec4 = property(Color), _dec5 = property(Color), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(ToastManager, _Component);

        function ToastManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "winColor", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "loseColor", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "drawColor", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "blackJackColor", _descriptor4, _assertThisInitialized(_this));

          _this._originalBottom = 0;
          return _this;
        }

        var _proto = ToastManager.prototype;

        _proto.onLoad = function onLoad() {
          var canvasNode = find("Canvas");
          this.getComponent(Widget).target = canvasNode;
          this._originalBottom = this.getComponent(Widget).bottom;
        };

        _proto.showToast = function showToast(msg, type) {
          var _this2 = this;

          if (msg === void 0) {
            msg = "Your message";
          }

          if (type === void 0) {
            type = "win";
          }

          var height = this.getComponent(UITransform).contentSize.height;
          var widgetComponent = this.getComponent(Widget);
          this.getComponentInChildren(Label).string = msg;
          this.getComponent(UIOpacity).opacity = 255;
          if (this[type + "Color"]) this.getComponent(Sprite).color = this[type + "Color"];

          if (widgetComponent) {
            widgetComponent.bottom = -height;
            tween(widgetComponent).to(0.5, {
              bottom: this._originalBottom
            }, {
              easing: "backOut"
            }).delay(2).to(0.5, {
              bottom: -height
            }, {
              easing: "backIn"
            }).call(function () {
              _this2.getComponent(UIOpacity).opacity = 0;
            }).start();
          }
        };

        return ToastManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "winColor", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color("#1BAA00");
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loseColor", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color("#AA1400");
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "drawColor", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color("#00A6CF");
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "blackJackColor", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color("#00A6CF");
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/utils.ts", ['cc', './CardManager.ts'], function (exports) {
  var cclegacy, Canvas, CardManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Canvas = module.Canvas;
    }, function (module) {
      CardManager = module.CardManager;
    }],
    execute: function () {
      exports({
        calculateWinnings: calculateWinnings,
        checkBlackJack: checkBlackJack,
        getCanvasNode: getCanvasNode,
        getDeck: getDeck,
        getTotalHandValue: getTotalHandValue,
        shuffle: shuffle
      });

      cclegacy._RF.push({}, "940e81NIclJi7AnRDj7zfcJ", "utils", undefined);

      var MAX_CARDS = exports('MAX_CARDS', 52);
      var SUITS = exports('SUITS', ["spade", "diamond", "club", "heart"]);
      var VALUES = exports('VALUES', ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]);

      function getDeck() {
        var deckOfCards = [];

        for (var suitIndex = 0; suitIndex < SUITS.length; suitIndex++) {
          for (var valueIndex = 0; valueIndex < VALUES.length; valueIndex++) {
            var card = {
              value: VALUES[valueIndex],
              suit: SUITS[suitIndex],
              numberValue: Number(VALUES[valueIndex]) || 10
            };
            deckOfCards.push(card);
          }
        }

        return deckOfCards;
      }

      function getTotalHandValue(playerHand) {
        return playerHand.reduce(function (acc, curr) {
          if (!curr.cardNode) {
            debugger;
            return;
          }

          if (curr.cardNode.getComponent(CardManager).isShowingBackCard()) return acc;
          return acc + curr.numberValue;
        }, 0);
      }

      function checkBlackJack(playerHand) {
        if (playerHand.length > 2) return;
        var hasRoyalOr10;
        var hasAce;
        playerHand.forEach(function (card) {
          if (card.value == "A") {
            hasAce = true;
          } else if (!Number(card.value) || card.value == 10) {
            hasRoyalOr10 = true;
          }
        });
        return hasRoyalOr10 && hasAce;
      }

      function shuffle(deck) {
        // for 1000 turns
        // switch the values of two random cards
        for (var i = 0; i < 1000; i++) {
          var location1 = Math.floor(Math.random() * deck.length);
          var location2 = Math.floor(Math.random() * deck.length);
          var tmp = deck[location1];
          deck[location1] = deck[location2];
          deck[location2] = tmp;
        }
      }

      var canvasNode;

      function getCanvasNode(node) {
        if (canvasNode) return canvasNode;
        var _node = node;

        while (!_node.getComponent(Canvas)) {
          _node = node.parent;
        }

        canvasNode = _node;
        return _node;
      }

      function calculateWinnings(betAmount, isBlackjack) {
        if (isBlackjack) {
          return betAmount * 1.5; // 3:2 payout for blackjack
        } else {
          return betAmount; // 1:1 payout for regular win
        }
      }

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/WalletManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Label, Animation, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Label = module.Label;
      Animation = module.Animation;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;

      cclegacy._RF.push({}, "0abddZcn6ZNd4hA1Nk7G7JO", "WalletManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var PREFIX = "Wallet: ";
      var WalletManager = exports('WalletManager', (_dec = ccclass('WalletManager'), _dec2 = property(Node), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(WalletManager, _Component);

        function WalletManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "amountEffect", _descriptor, _assertThisInitialized(_this));

          _this.playerWalletAmount = 100000;
          _this.label = void 0;
          _this.ledger = "";
          return _this;
        }

        var _proto = WalletManager.prototype;

        _proto.start = function start() {
          var _this2 = this;

          this.label = this.getComponent(Label);
          this.label.string = PREFIX + this.playerWalletAmount.toString();
          this.node.on(Node.EventType.MOUSE_DOWN, function () {
            return console.log(_this2.ledger);
          }, this);
        };

        _proto.addMoney = function addMoney(value) {
          if (value === void 0) {
            value = 0;
          }

          this.playerWalletAmount += value;
          this.label.string = PREFIX + this.playerWalletAmount.toString();
          this.ledger += "+ " + value + "\n";
          this.showEffect(value);
        };

        _proto.subMoney = function subMoney(value) {
          if (value === void 0) {
            value = 0;
          }

          this.playerWalletAmount -= value;
          this.label.string = PREFIX + this.playerWalletAmount.toString();
          this.ledger += "- " + value + "\n";
          this.showEffect(value * -1);
        };

        _proto.showEffect = function showEffect(value) {
          this.amountEffect.getComponent(Label).string = value.toString();
          this.amountEffect.getComponent(Animation).play();
        };

        return WalletManager;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "amountEffect", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});
//# sourceMappingURL=index.js.map