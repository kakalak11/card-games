System.register("chunks:///_virtual/BetManager.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){var t,r,n,i,a,o,s,u,c;return{setters:[function(e){t=e.applyDecoratedDescriptor,r=e.inheritsLoose,n=e.initializerDefineProperty,i=e.assertThisInitialized},function(e){a=e.cclegacy,o=e._decorator,s=e.Button,u=e.Label,c=e.Component}],execute:function(){var l,h,p,B,b,d,g,y,f;a._RF.push({},"07b14h51OVCmLm+sW4GMCaB","BetManager",void 0);var I=o.ccclass,x=o.property,m=[5,10,50,100,500,1e3,5e3];e("BetManager",(l=I("BetManager"),h=x(s),p=x(s),B=x(u),l((g=t((d=function(e){function t(){for(var t,r=arguments.length,a=new Array(r),o=0;o<r;o++)a[o]=arguments[o];return t=e.call.apply(e,[this].concat(a))||this,n(t,"increaseBetBtn",g,i(t)),n(t,"decreaseBetBtn",y,i(t)),n(t,"betLabel",f,i(t)),t.currIndex=0,t.playerBetAmount=0,t}r(t,e);var a=t.prototype;return a.start=function(){this.betLabel.string=m[this.currIndex].toString(),this.playerBetAmount=m[this.currIndex]},a.resetBet=function(){this.playerBetAmount=m[this.currIndex]},a.onDoubleDown=function(){this.playerBetAmount*=2},a.onIncreaseBet=function(){this.currIndex++,this.currIndex>m.length-1&&(this.currIndex=0),this.betLabel.string=m[this.currIndex].toString(),this.playerBetAmount=m[this.currIndex]},a.onDecreaseBet=function(){this.currIndex--,this.currIndex<0&&(this.currIndex=m.length-1),this.betLabel.string=m[this.currIndex].toString(),this.playerBetAmount=m[this.currIndex]},t}(c)).prototype,"increaseBetBtn",[h],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),y=t(d.prototype,"decreaseBetBtn",[p],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),f=t(d.prototype,"betLabel",[B],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),b=d))||b));a._RF.pop()}}}));

System.register("chunks:///_virtual/BlackJackDealerManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./BlackJackGameManager.ts","./utils.ts","./TimerManager.ts","./CardManager.ts"],(function(e){var a,n,r,t,l,d,i,s,c,o,u,h,f,H,p;return{setters:[function(e){a=e.applyDecoratedDescriptor,n=e.inheritsLoose,r=e.initializerDefineProperty,t=e.assertThisInitialized},function(e){l=e.cclegacy,d=e._decorator,i=e.Node,s=e.Label,c=e.Component},function(e){o=e.BlackJackGameManager,u=e.TURN_DURATION},function(e){h=e.getTotalHandValue,f=e.checkBlackJack},function(e){H=e.TimerManager},function(e){p=e.CardManager}],execute:function(){var g,k,T,v,D,b,M;l._RF.push({},"f3e3ekrxpdH56yfq/KnEgTi","BlackJackDealerManager",void 0);var B=d.ccclass,C=d.property;e("BlackJackDealerManager",(g=B("BlackJackDealerManager"),k=C(i),T=C(s),g((b=a((D=function(e){function a(){for(var a,n=arguments.length,l=new Array(n),d=0;d<n;d++)l[d]=arguments[d];return a=e.call.apply(e,[this].concat(l))||this,r(a,"dealerTable",b,t(a)),r(a,"dealerInfo",M,t(a)),a.dealerHand=[],a.dealerHandValue=0,a._dealerTurn=void 0,a.hasBlackJack=void 0,a}n(a,e);var l=a.prototype;return l.startTurn=function(){this._dealerTurn=!0,this.nextMove()},l.updateHand=function(e){this.dealerHandValue=h(e),this.dealerInfo.string="Dealer value: "+this.dealerHandValue,f(e)?this.hasBlackJack=!0:this.dealerHandValue>21&&(this.dealerInfo.string+="\nDealer are busted !")},l.dealOneCardDealer=function(){var e=this;this.dealerHand.push(o.instance.dealOneCard()),o.instance.loadHand(this.dealerHand,this.dealerTable).then((function(){2==e.dealerHand.length&&e.dealerHand[1].cardNode.getComponent(p).showBackCard(),e.updateHand(e.dealerHand),e._dealerTurn=!1,e.nextMove()}))},l.nextMove=function(){this._dealerTurn?this.dealerHand.length<2?this.dealOneCardDealer():(this.dealerHand[1].cardNode.getComponent(p).showFaceCard(),this.updateHand(this.dealerHand),this.dealerHandValue<17?this.dealerHit():(this.dealerInfo.string+="\nDealer end turn",o.instance.endDealerTurn(!0))):o.instance.endDealerTurn()},l.dealerHit=function(){var e=this;this.dealerHand.push(o.instance.dealOneCard()),o.instance.loadHand(this.dealerHand,this.dealerTable).then((function(){e.updateHand(e.dealerHand),H.instance._scheduleOnce(e.nextMove.bind(e),u)}))},l.reset=function(){this.dealerTable.removeAllChildren(),this.dealerHand=[],this.dealerHandValue=0,this._dealerTurn=!1,this.hasBlackJack=!1,this.dealerInfo.string="Dealer value: 0"},a}(c)).prototype,"dealerTable",[k],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),M=a(D.prototype,"dealerInfo",[T],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),v=D))||v));l._RF.pop()}}}));

System.register("chunks:///_virtual/BlackJackGameManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./BlackJackDealerManager.ts","./ToastManager.ts","./utils.ts","./TimerManager.ts","./BlackJackPlayerManager.ts"],(function(e){var a,t,r,n,i,o,s,l,c,u,h,d,p,f,w,g,m,y,b,v,T,k,B;return{setters:[function(e){a=e.applyDecoratedDescriptor,t=e.inheritsLoose,r=e.initializerDefineProperty,n=e.assertThisInitialized},function(e){i=e.cclegacy,o=e._decorator,s=e.Node,l=e.Prefab,c=e.Button,u=e.Size,h=e.resources,d=e.SpriteFrame,p=e.error,f=e.instantiate,w=e.Sprite,g=e.UITransform,m=e.Component},function(e){y=e.BlackJackDealerManager},function(e){b=e.ToastManager},function(e){v=e.getDeck,T=e.shuffle},function(e){k=e.TimerManager},function(e){B=e.BlackJackPlayerManager}],execute:function(){var M,D,S,P,z,J,C,_,G,N,R,Y,x,F,H,L;i._RF.push({},"2dad6voBrdLPpEe9NYJHrTr","BlackJackGameManager",void 0);var O=o.ccclass,U=o.property,I=e("TURN_DURATION",.5);e("BlackJackGameManager",(M=O("BlackJackGameManager"),D=U(s),S=U(l),P=U(c),z=U(s),J=U(s),C=U(b),M(((L=function(e){function a(){for(var a,t=arguments.length,i=new Array(t),o=0;o<t;o++)i[o]=arguments[o];return a=e.call.apply(e,[this].concat(i))||this,r(a,"cardTable",N,n(a)),r(a,"cardPrefab",R,n(a)),r(a,"gameStartButton",Y,n(a)),r(a,"dealer",x,n(a)),r(a,"player",F,n(a)),r(a,"toast",H,n(a)),a.cardDeck=[],a.playerTurn=void 0,a.cardSize=new u(68,100),a}t(a,e);var i=a.prototype;return i.onLoad=function(){var e,t;a.instance=this,this.dealer=null==(e=this.dealer)?void 0:e.getComponent(y),this.player=null==(t=this.player)?void 0:t.getComponent(B)},i.start=function(){},i.gameStart=function(){var e=v().concat(v()).concat(v());T(e),this.cardDeck=e,this.gameStartButton.interactable=!1,this.playerTurn=!0,this.player.onGameStart(),this.nextMove()},i.nextMove=function(){this.playerTurn?this.player.startTurn():this.dealer.startTurn()},i.dealOneCard=function(){if(0!=this.cardDeck.length)return this.cardDeck.pop()},i.endDealerTurn=function(e){this.playerTurn=!0,e?this.showResult():k.instance._scheduleOnce(this.nextMove.bind(this),I)},i.endPlayerTurn=function(){this.playerTurn=!1,k.instance._scheduleOnce(this.nextMove.bind(this),I)},i.showResult=function(){var e,a=this.player.playerHandValue,t=this.dealer.dealerHandValue,r=this.player.hasBlackJack,n=this.dealer.hasBlackJack,i=t>21;a>21?i?(this.toast.showToast("Draw !!","draw"),e="draw"):(this.toast.showToast("You have lost","lose"),e="lose"):i?(this.toast.showToast("You have won","win"),e="win"):r?n?(this.toast.showToast("Draw !!","draw"),e="draw"):(this.toast.showToast("You have won","win"),e="win"):a>t?(this.toast.showToast("You have won","win"),e="win"):a===t?(this.toast.showToast("Draw !!","draw"),e="draw"):(this.toast.showToast("You have lost","lose"),e="lose"),this.player.endGame(e),this.gameStartButton.interactable=!0},i.onGameRestart=function(){this.dealer.reset(),this.player.reset(),this.gameStart()},i.loadHand=function(e,a){var t=this,r=[];return e.forEach((function(e){var n=e.value,i=e.suit;if(!e.cardNode){var o="card"+(i[0].toUpperCase()+i.substring(1))+"s_"+n;r.push(new Promise((function(r,n){h.load("cards/"+i+"/"+o+"/spriteFrame",d,(function(i,o){if(i)return n(p(i.message));var s=f(t.cardPrefab);s.getComponent(w).spriteFrame=o,s.getComponent(g).setContentSize(t.cardSize),e.cardNode=s,e.cardNode.setParent(a),r(e)}))})))}})),Promise.all(r).then((function(){return e}))},a}(m)).instance=void 0,N=a((G=L).prototype,"cardTable",[D],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),R=a(G.prototype,"cardPrefab",[S],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),Y=a(G.prototype,"gameStartButton",[P],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),x=a(G.prototype,"dealer",[z],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),F=a(G.prototype,"player",[J],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),H=a(G.prototype,"toast",[C],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),_=G))||_));i._RF.pop()}}}));

System.register("chunks:///_virtual/BlackJackPlayerManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./BlackJackGameManager.ts","./utils.ts","./ToastManager.ts","./BetManager.ts","./WalletManager.ts"],(function(t){var a,e,n,l,i,r,o,s,u,h,c,d,p,y,b,B,f;return{setters:[function(t){a=t.applyDecoratedDescriptor,e=t.inheritsLoose,n=t.initializerDefineProperty,l=t.assertThisInitialized},function(t){i=t.cclegacy,r=t._decorator,o=t.Node,s=t.Button,u=t.Label,h=t.Component},function(t){c=t.BlackJackGameManager},function(t){d=t.getTotalHandValue,p=t.checkBlackJack,y=t.calculateWinnings},function(t){b=t.ToastManager},function(t){B=t.BetManager},function(t){f=t.WalletManager}],execute:function(){var g,k,w,H,m,D,M,T,J,v,O,W,z,P,S,A,C,I,V,L,E;i._RF.push({},"8888astadlBg6heRjsrSVg2","BlackJackPlayerManager",void 0);var G=r.ccclass,_=r.property;t("BlackJackPlayerManager",(g=G("BlackJackPlayerManager"),k=_(o),w=_(s),H=_(s),m=_(s),D=_(u),M=_(u),T=_(b),J=_(B),v=_(f),g((z=a((W=function(t){function a(){for(var a,e=arguments.length,i=new Array(e),r=0;r<e;r++)i[r]=arguments[r];return a=t.call.apply(t,[this].concat(i))||this,n(a,"playerTable",z,l(a)),n(a,"hitButton",P,l(a)),n(a,"endButton",S,l(a)),n(a,"doubleDownButton",A,l(a)),n(a,"handInfo",C,l(a)),n(a,"handShoutOut",I,l(a)),n(a,"toast",V,l(a)),n(a,"playerBet",L,l(a)),n(a,"playerWallet",E,l(a)),a.hasBlackJack=void 0,a.playerHand=[],a.playerHandValue=0,a.isDoubleDown=void 0,a}e(a,t);var i=a.prototype;return i.start=function(){this.disableButtons()},i.onGameStart=function(){this.updateWalletOnStart()},i.startTurn=function(){this.hasBlackJack?this.onEndTurn():this.playerHand.length<=1?(this.dealOneCardPlayer(),this.disableButtons()):this.enableButtons(),console.log(this.playerHand)},i.dealOneCardPlayer=function(){var t=this;this.playerHand.push(c.instance.dealOneCard()),c.instance.loadHand(this.playerHand,this.playerTable).then((function(){t.updateHand(t.playerHand),c.instance.endPlayerTurn()}))},i.disableButtons=function(){this.hitButton.interactable=!1,this.endButton.interactable=!1,this.doubleDownButton.interactable=!1},i.enableButtons=function(){this.hitButton.interactable=!0,this.endButton.interactable=!0,this.doubleDownButton.interactable=!0},i.updateHand=function(t){this.playerHandValue=d(t),this.handInfo.string="Total value: "+this.playerHandValue,this.hasBlackJack=p(t),this.hasBlackJack?(this.disableButtons(),this.handInfo.string+="\nWow! Black Jack !!!",this.handShoutOut.string="BLACK JACK !!!",this.toast.showToast("You have hit a black jack !!!","blackJack")):this.playerHandValue>21&&(this.handInfo.string+="\nYou are busted !",this.onEndTurn())},i.onHit=function(){var t=this;this.playerHand.push(c.instance.dealOneCard()),this.playerHand.length>2&&(this.doubleDownButton.interactable=!1),c.instance.loadHand(this.playerHand,this.playerTable).then((function(){t.updateHand(t.playerHand)}))},i.onEndTurn=function(){this.disableButtons(),c.instance.endPlayerTurn()},i.onDoubleDown=function(){this.isDoubleDown=!0,this.handShoutOut.string="DOUBLE DOWN !!!",this.playerWallet.subMoney(this.playerBet.playerBetAmount),this.playerBet.onDoubleDown(),this.dealOneCardPlayer()},i.endGame=function(t){switch(this.disableButtons(),t){case"win":var a=this.playerBet.playerBetAmount+y(this.playerBet.playerBetAmount,this.hasBlackJack);this.playerWallet.addMoney(a);break;case"draw":this.playerWallet.addMoney(this.playerBet.playerBetAmount)}},i.updateWalletOnStart=function(){this.playerBet.resetBet(),this.playerWallet.subMoney(this.playerBet.playerBetAmount)},i.reset=function(){this.playerTable.removeAllChildren(),this.hasBlackJack=!1,this.isDoubleDown=!1,this.playerHand=[],this.handShoutOut.string="",this.enableButtons()},a}(h)).prototype,"playerTable",[k],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),P=a(W.prototype,"hitButton",[w],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),S=a(W.prototype,"endButton",[H],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),A=a(W.prototype,"doubleDownButton",[m],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),C=a(W.prototype,"handInfo",[D],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),I=a(W.prototype,"handShoutOut",[M],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),V=a(W.prototype,"toast",[T],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),L=a(W.prototype,"playerBet",[J],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),E=a(W.prototype,"playerWallet",[v],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),O=W))||O));i._RF.pop()}}}));

System.register("chunks:///_virtual/CardManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameManager.ts"],(function(e){var t,n,i,o,a,r,s,c,d;return{setters:[function(e){t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized},function(e){a=e.cclegacy,r=e._decorator,s=e.Node,c=e.Component},function(e){d=e.GameManager}],execute:function(){var u,h,l,p,f;a._RF.push({},"726e9+L1QNFH60FbTwCUmDA","CardManager",void 0);var C=r.ccclass,v=r.property;e("CardManager",(u=C("CardManager"),h=v(s),u((f=t((p=function(e){function t(){for(var t,n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return t=e.call.apply(e,[this].concat(a))||this,i(t,"backCard",f,o(t)),t.isSelected=void 0,t}n(t,e);var a=t.prototype;return a.start=function(){this.node.on("INIT",this.init,this)},a.init=function(){this.node.on(s.EventType.MOUSE_DOWN,this.onMouseDown,this)},a.onMouseDown=function(){this.isSelected=!this.isSelected;var e=this.node.getPosition();this.isSelected?(e.y=20,d.instance.onSelectCard(this.node)):(e.y=0,d.instance.onUnselectCard(this.node)),this.node.setPosition(e)},a.showBackCard=function(){this.backCard.active=!0},a.isShowingBackCard=function(){return!!this.backCard.active},a.showFaceCard=function(){this.backCard.active=!1},a.onDestroy=function(){this.node.off(s.EventType.MOUSE_DOWN,this.onMouseDown,this)},t}(c)).prototype,"backCard",[h],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),l=p))||l));a._RF.pop()}}}));

System.register("chunks:///_virtual/debug-view-runtime-control.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){var e,o,i,n,s,l,r,a,g,h,p,c,C,d,m,u,L;return{setters:[function(t){e=t.applyDecoratedDescriptor,o=t.inheritsLoose,i=t.initializerDefineProperty,n=t.assertThisInitialized},function(t){s=t.cclegacy,l=t._decorator,r=t.Node,a=t.Color,g=t.Canvas,h=t.UITransform,p=t.instantiate,c=t.Label,C=t.RichText,d=t.Toggle,m=t.Button,u=t.director,L=t.Component}],execute:function(){var f,M,b,v,T,S,x,E,I;s._RF.push({},"b2bd1+njXxJxaFY3ymm06WU","debug-view-runtime-control",void 0);var A=l.ccclass,y=l.property;t("DebugViewRuntimeControl",(f=A("internal.DebugViewRuntimeControl"),M=y(r),b=y(r),v=y(r),f((x=e((S=function(t){function e(){for(var e,o=arguments.length,s=new Array(o),l=0;l<o;l++)s[l]=arguments[l];return e=t.call.apply(t,[this].concat(s))||this,i(e,"compositeModeToggle",x,n(e)),i(e,"singleModeToggle",E,n(e)),i(e,"EnableAllCompositeModeButton",I,n(e)),e._single=0,e.strSingle=["No Single Debug","Vertex Color","Vertex Normal","Vertex Tangent","World Position","Vertex Mirror","Face Side","UV0","UV1","UV Lightmap","Project Depth","Linear Depth","Fragment Normal","Fragment Tangent","Fragment Binormal","Base Color","Diffuse Color","Specular Color","Transparency","Metallic","Roughness","Specular Intensity","IOR","Direct Diffuse","Direct Specular","Direct All","Env Diffuse","Env Specular","Env All","Emissive","Light Map","Shadow","AO","Fresnel","Direct Transmit Diffuse","Direct Transmit Specular","Env Transmit Diffuse","Env Transmit Specular","Transmit All","Direct Internal Specular","Env Internal Specular","Internal All","Fog"],e.strComposite=["Direct Diffuse","Direct Specular","Env Diffuse","Env Specular","Emissive","Light Map","Shadow","AO","Normal Map","Fog","Tone Mapping","Gamma Correction","Fresnel","Transmit Diffuse","Transmit Specular","Internal Specular","TT"],e.strMisc=["CSM Layer Coloration","Lighting With Albedo"],e.compositeModeToggleList=[],e.singleModeToggleList=[],e.miscModeToggleList=[],e.textComponentList=[],e.labelComponentList=[],e.textContentList=[],e.hideButtonLabel=void 0,e._currentColorIndex=0,e.strColor=["<color=#ffffff>","<color=#000000>","<color=#ff0000>","<color=#00ff00>","<color=#0000ff>"],e.color=[a.WHITE,a.BLACK,a.RED,a.GREEN,a.BLUE],e}o(e,t);var s=e.prototype;return s.start=function(){if(this.node.parent.getComponent(g)){var t=this.node.parent.getComponent(h),e=.5*t.width,o=.5*t.height,i=.1*e-e,n=o-.1*o,s=this.node.getChildByName("MiscMode"),l=p(s);l.parent=this.node,l.name="Buttons";var r=p(s);r.parent=this.node,r.name="Titles";for(var u=0;u<2;u++){var L=p(this.EnableAllCompositeModeButton.getChildByName("Label"));L.setPosition(i+(u>0?450:150),n,0),L.setScale(.75,.75,.75),L.parent=r;var f=L.getComponent(c);f.string=u?"----------Composite Mode----------":"----------Single Mode----------",f.color=a.WHITE,f.overflow=0,this.labelComponentList[this.labelComponentList.length]=f}n-=20;for(var M=0,b=0;b<this.strSingle.length;b++,M++){b===this.strSingle.length>>1&&(i+=200,M=0);var v=b?p(this.singleModeToggle):this.singleModeToggle;v.setPosition(i,n-20*M,0),v.setScale(.5,.5,.5),v.parent=this.singleModeToggle.parent;var T=v.getComponentInChildren(C);T.string=this.strSingle[b],this.textComponentList[this.textComponentList.length]=T,this.textContentList[this.textContentList.length]=T.string,v.on(d.EventType.TOGGLE,this.toggleSingleMode,this),this.singleModeToggleList[b]=v}i+=200,this.EnableAllCompositeModeButton.setPosition(i+15,n,0),this.EnableAllCompositeModeButton.setScale(.5,.5,.5),this.EnableAllCompositeModeButton.on(m.EventType.CLICK,this.enableAllCompositeMode,this),this.EnableAllCompositeModeButton.parent=l;var S=this.EnableAllCompositeModeButton.getComponentInChildren(c);this.labelComponentList[this.labelComponentList.length]=S;var x=p(this.EnableAllCompositeModeButton);x.setPosition(i+90,n,0),x.setScale(.5,.5,.5),x.on(m.EventType.CLICK,this.changeTextColor,this),x.parent=l,(S=x.getComponentInChildren(c)).string="TextColor",this.labelComponentList[this.labelComponentList.length]=S;var E=p(this.EnableAllCompositeModeButton);E.setPosition(i+200,n,0),E.setScale(.5,.5,.5),E.on(m.EventType.CLICK,this.hideUI,this),E.parent=this.node.parent,(S=E.getComponentInChildren(c)).string="Hide UI",this.labelComponentList[this.labelComponentList.length]=S,this.hideButtonLabel=S,n-=40;for(var I=0;I<this.strMisc.length;I++){var A=p(this.compositeModeToggle);A.setPosition(i,n-20*I,0),A.setScale(.5,.5,.5),A.parent=s;var y=A.getComponentInChildren(C);y.string=this.strMisc[I],this.textComponentList[this.textComponentList.length]=y,this.textContentList[this.textContentList.length]=y.string,A.getComponent(d).isChecked=!!I,A.on(d.EventType.TOGGLE,I?this.toggleLightingWithAlbedo:this.toggleCSMColoration,this),this.miscModeToggleList[I]=A}n-=150;for(var D=0;D<this.strComposite.length;D++){var B=D?p(this.compositeModeToggle):this.compositeModeToggle;B.setPosition(i,n-20*D,0),B.setScale(.5,.5,.5),B.parent=this.compositeModeToggle.parent;var w=B.getComponentInChildren(C);w.string=this.strComposite[D],this.textComponentList[this.textComponentList.length]=w,this.textContentList[this.textContentList.length]=w.string,B.on(d.EventType.TOGGLE,this.toggleCompositeMode,this),this.compositeModeToggleList[D]=B}}else console.error("debug-view-runtime-control should be child of Canvas")},s.isTextMatched=function(t,e){var o=new String(t),i=o.search(">");return-1===i?t===e:(o=(o=o.substr(i+1)).substr(0,o.search("<")))===e},s.toggleSingleMode=function(t){for(var e=u.root.debugView,o=t.getComponentInChildren(C),i=0;i<this.strSingle.length;i++)this.isTextMatched(o.string,this.strSingle[i])&&(e.singleMode=i)},s.toggleCompositeMode=function(t){for(var e=u.root.debugView,o=t.getComponentInChildren(C),i=0;i<this.strComposite.length;i++)this.isTextMatched(o.string,this.strComposite[i])&&e.enableCompositeMode(i,t.isChecked)},s.toggleLightingWithAlbedo=function(t){u.root.debugView.lightingWithAlbedo=t.isChecked},s.toggleCSMColoration=function(t){u.root.debugView.csmLayerColoration=t.isChecked},s.enableAllCompositeMode=function(t){var e=u.root.debugView;e.enableAllCompositeMode(!0);for(var o=0;o<this.compositeModeToggleList.length;o++){this.compositeModeToggleList[o].getComponent(d).isChecked=!0}var i=this.miscModeToggleList[0].getComponent(d);i.isChecked=!1,e.csmLayerColoration=!1,(i=this.miscModeToggleList[1].getComponent(d)).isChecked=!0,e.lightingWithAlbedo=!0},s.hideUI=function(t){var e=this.node.getChildByName("Titles"),o=!e.active;this.singleModeToggleList[0].parent.active=o,this.miscModeToggleList[0].parent.active=o,this.compositeModeToggleList[0].parent.active=o,this.EnableAllCompositeModeButton.parent.active=o,e.active=o,this.hideButtonLabel.string=o?"Hide UI":"Show UI"},s.changeTextColor=function(t){this._currentColorIndex++,this._currentColorIndex>=this.strColor.length&&(this._currentColorIndex=0);for(var e=0;e<this.textComponentList.length;e++)this.textComponentList[e].string=this.strColor[this._currentColorIndex]+this.textContentList[e]+"</color>";for(var o=0;o<this.labelComponentList.length;o++)this.labelComponentList[o].color=this.color[this._currentColorIndex]},s.onLoad=function(){},s.update=function(t){},e}(L)).prototype,"compositeModeToggle",[M],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),E=e(S.prototype,"singleModeToggle",[b],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),I=e(S.prototype,"EnableAllCompositeModeButton",[v],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),T=S))||T));s._RF.pop()}}}));

System.register("chunks:///_virtual/GameList.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){var t,o,n,c,r;return{setters:[function(e){t=e.inheritsLoose},function(e){o=e.cclegacy,n=e._decorator,c=e.director,r=e.Component}],execute:function(){var s;o._RF.push({},"c2fb2NdJftCpr2cNq5dtg1A","GameList",void 0);var i=n.ccclass;n.property,e("GameList",i("GameList")(s=function(e){function o(){return e.apply(this,arguments)||this}return t(o,e),o.prototype.onClick=function(e,t){c.loadScene(t,(function(e){if(e)return console.error(e);console.log("=== Load scene successfully ===")}))},o}(r))||s);o._RF.pop()}}}));

System.register("chunks:///_virtual/GameManager.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){var t,n,a,r,o,i,c,l,d,s,u,f,h,p,b,g;return{setters:[function(e){t=e.applyDecoratedDescriptor,n=e.inheritsLoose,a=e.initializerDefineProperty,r=e.assertThisInitialized},function(e){o=e.cclegacy,i=e._decorator,c=e.Node,l=e.Prefab,d=e.Button,s=e.v3,u=e.resources,f=e.SpriteFrame,h=e.error,p=e.instantiate,b=e.Sprite,g=e.Component}],execute:function(){var m,v,y,H,P,N,D,B,M,k,S,T;o._RF.push({},"1c2fea9rnRGBpWL7tnZjo/V","GameManager",void 0);var w=i.ccclass,z=i.property,C=["spade","diamond","club","heart"],x=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];e("GameManager",(m=w("GameManager"),v=z(c),y=z(c),H=z(l),P=z(d),m(((T=function(e){function t(){for(var t,n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o))||this,a(t,"cardTable",B,r(t)),a(t,"playerDeck",M,r(t)),a(t,"cardPrefab",k,r(t)),a(t,"playHandButton",S,r(t)),t.playerHand=[],t.selectedHand=[],t.cardDeck=[],t}n(t,e);var o=t.prototype;return o.start=function(){t.instance=this,this.gameStart()},o.gameStart=function(){var e=this,t=function(){for(var e=[],t=0;t<C.length;t++)for(var n=0;n<x.length;n++){var a={value:x[n],suit:C[t],cardPower:n*C.length+t};e.push(a)}return e}();return function(e){for(var t=0;t<1e3;t++){var n=Math.floor(Math.random()*e.length),a=Math.floor(Math.random()*e.length),r=e[n];e[n]=e[a],e[a]=r}}(t),this.cardDeck=t,this.loadDeck(t).then((function(t){for(var n=[],a=0;a<52;a++){if(a%4==0)n.push(t.pop());else t.pop().cardNode.destroy()}e.findHandBestCombinations(n),n.forEach((function(t){t.cardNode.setParent(e.playerDeck),t.cardNode.emit("INIT");var n=t.cardNode.getPosition();t.cardNode.setPosition(s(n.x,0,n.z))})),e.playerHand=n}))},o.loadDeck=function(e){var t=this,n=[];return e.forEach((function(e){var a=e.value+"_"+e.suit;n.push(new Promise((function(n,r){u.load("face-cards/"+a+"/spriteFrame",f,(function(a,o){if(a)return r(h(a.message));var i=p(t.cardPrefab);i.getComponent(b).spriteFrame=o,e.cardNode=i,n(e)}))})))})),Promise.all(n).then((function(){return e}))},o.onSelectCard=function(e){var t=this.playerHand.find((function(t){return t.cardNode===e})),n=this.selectedHand.find((function(t){return t.cardNode===e}));t&&!n&&(this.selectedHand.push(t),console.log("Selected hand: ",this.selectedHand))},o.onUnselectCard=function(e){var t=this.selectedHand.findIndex((function(t){return t.cardNode===e}));-1!=t&&(this.selectedHand.splice(t,1),console.log("Selected hand: ",this.selectedHand))},o.onPlayHand=function(){var e=this;this.selectedHand.length?(this.selectedHand.forEach((function(t){t.cardNode.setParent(e.cardTable)})),this.selectedHand=[],this.playHandButton.interactable=!1,this.scheduleOnce(this.nextTurn,1)):console.log("No selected hand to play")},o.nextTurn=function(){this.playHandButton.interactable=!0,this.cardTable.removeAllChildren()},o.findHandBestCombinations=function(e){},t}(g)).instance=void 0,B=t((D=T).prototype,"cardTable",[v],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),M=t(D.prototype,"playerDeck",[y],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),k=t(D.prototype,"cardPrefab",[H],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),S=t(D.prototype,"playHandButton",[P],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),N=D))||N));o._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./debug-view-runtime-control.ts","./BetManager.ts","./BlackJackDealerManager.ts","./BlackJackGameManager.ts","./BlackJackPlayerManager.ts","./CardManager.ts","./GameList.ts","./GameManager.ts","./TimerManager.ts","./ToastManager.ts","./WalletManager.ts","./utils.ts"],(function(){return{setters:[null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){}}}));

System.register("chunks:///_virtual/TimerManager.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){var i,e,n,s,a;return{setters:[function(t){i=t.inheritsLoose},function(t){e=t.cclegacy,n=t._decorator,s=t.Label,a=t.Component}],execute:function(){var r,o;e._RF.push({},"56f6aIoY4pIgYNJMBPuOmgt","TimerManager",void 0);var c=n.ccclass;n.property,t("TimerManager",c("TimerManager")(((o=function(t){function e(){for(var i,e=arguments.length,n=new Array(e),s=0;s<e;s++)n[s]=arguments[s];return(i=t.call.apply(t,[this].concat(n))||this).isTicking=void 0,i._delay=0,i.label=void 0,i}i(e,t);var n=e.prototype;return n.onLoad=function(){e.instance=this,this.label=this.getComponent(s)},n._scheduleOnce=function(t,i){return e.instance.startCount(i),this.scheduleOnce(t,i)},n.startCount=function(t){this.isTicking=!0,this._delay=t},n.stopCount=function(){this.isTicking=!1},n.update=function(t){if(this.isTicking){if(!(this._delay>0))return this._delay=0,void(this.label.string="Time: 0");this._delay-=t,this.label.string="Time: "+Math.abs(this._delay).toFixed(0)}},e}(a)).instance=void 0,r=o))||r);e._RF.pop()}}}));

System.register("chunks:///_virtual/ToastManager.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){var o,e,n,r,i,a,l,s,c,p,u,g,C,h,m;return{setters:[function(t){o=t.applyDecoratedDescriptor,e=t.inheritsLoose,n=t.initializerDefineProperty,r=t.assertThisInitialized},function(t){i=t.cclegacy,a=t._decorator,l=t.Color,s=t.find,c=t.Widget,p=t.UITransform,u=t.Label,g=t.UIOpacity,C=t.Sprite,h=t.tween,m=t.Component}],execute:function(){var b,f,w,y,d,v,T,k,z,A,_;i._RF.push({},"ce5a2xTwd1NV4U2Pfeh6CtP","ToastManager",void 0);var B=a.ccclass,I=a.property;t("ToastManager",(b=B("ToastManager"),f=I(l),w=I(l),y=I(l),d=I(l),b((k=o((T=function(t){function o(){for(var o,e=arguments.length,i=new Array(e),a=0;a<e;a++)i[a]=arguments[a];return o=t.call.apply(t,[this].concat(i))||this,n(o,"winColor",k,r(o)),n(o,"loseColor",z,r(o)),n(o,"drawColor",A,r(o)),n(o,"blackJackColor",_,r(o)),o._originalBottom=0,o}e(o,t);var i=o.prototype;return i.onLoad=function(){var t=s("Canvas");this.getComponent(c).target=t,this._originalBottom=this.getComponent(c).bottom},i.showToast=function(t,o){var e=this;void 0===t&&(t="Your message"),void 0===o&&(o="win");var n=this.getComponent(p).contentSize.height,r=this.getComponent(c);this.getComponentInChildren(u).string=t,this.getComponent(g).opacity=255,this[o+"Color"]&&(this.getComponent(C).color=this[o+"Color"]),r&&(r.bottom=-n,h(r).to(.5,{bottom:this._originalBottom},{easing:"backOut"}).delay(2).to(.5,{bottom:-n},{easing:"backIn"}).call((function(){e.getComponent(g).opacity=0})).start())},o}(m)).prototype,"winColor",[f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return new l("#1BAA00")}}),z=o(T.prototype,"loseColor",[w],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return new l("#AA1400")}}),A=o(T.prototype,"drawColor",[y],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return new l("#00A6CF")}}),_=o(T.prototype,"blackJackColor",[d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return new l("#00A6CF")}}),v=T))||v));i._RF.pop()}}}));

System.register("chunks:///_virtual/utils.ts",["cc","./CardManager.ts"],(function(n){var e,r,t;return{setters:[function(n){e=n.cclegacy,r=n.Canvas},function(n){t=n.CardManager}],execute:function(){n({calculateWinnings:function(n,e){return e?1.5*n:n},checkBlackJack:function(n){if(n.length>2)return;var e,r;return n.forEach((function(n){"A"==n.value?r=!0:Number(n.value)&&10!=n.value||(e=!0)})),e&&r},getCanvasNode:function(n){if(a)return a;var e=n;for(;!e.getComponent(r);)e=n.parent;return a=e,e},getDeck:function(){for(var n=[],e=0;e<u.length;e++)for(var r=0;r<o.length;r++){var t={value:o[r],suit:u[e],numberValue:Number(o[r])||10};n.push(t)}return n},getTotalHandValue:function(n){return n.reduce((function(n,e){if(e.cardNode)return e.cardNode.getComponent(t).isShowingBackCard()?n:n+e.numberValue}),0)},shuffle:function(n){for(var e=0;e<1e3;e++){var r=Math.floor(Math.random()*n.length),t=Math.floor(Math.random()*n.length),a=n[r];n[r]=n[t],n[t]=a}}}),e._RF.push({},"940e81NIclJi7AnRDj7zfcJ","utils",void 0);n("MAX_CARDS",52);var a,u=n("SUITS",["spade","diamond","club","heart"]),o=n("VALUES",["2","3","4","5","6","7","8","9","10","J","Q","K","A"]);e._RF.pop()}}}));

System.register("chunks:///_virtual/WalletManager.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){var e,n,o,i,l,a,r,s,c,u;return{setters:[function(t){e=t.applyDecoratedDescriptor,n=t.inheritsLoose,o=t.initializerDefineProperty,i=t.assertThisInitialized},function(t){l=t.cclegacy,a=t._decorator,r=t.Node,s=t.Label,c=t.Animation,u=t.Component}],execute:function(){var h,p,f,g,d;l._RF.push({},"0abddZcn6ZNd4hA1Nk7G7JO","WalletManager",void 0);var y=a.ccclass,m=a.property,b="Wallet: ";t("WalletManager",(h=y("WalletManager"),p=m(r),h((d=e((g=function(t){function e(){for(var e,n=arguments.length,l=new Array(n),a=0;a<n;a++)l[a]=arguments[a];return e=t.call.apply(t,[this].concat(l))||this,o(e,"amountEffect",d,i(e)),e.playerWalletAmount=1e5,e.label=void 0,e.ledger="",e}n(e,t);var l=e.prototype;return l.start=function(){var t=this;this.label=this.getComponent(s),this.label.string=b+this.playerWalletAmount.toString(),this.node.on(r.EventType.MOUSE_DOWN,(function(){return console.log(t.ledger)}),this)},l.addMoney=function(t){void 0===t&&(t=0),this.playerWalletAmount+=t,this.label.string=b+this.playerWalletAmount.toString(),this.ledger+="+ "+t+"\n",this.showEffect(t)},l.subMoney=function(t){void 0===t&&(t=0),this.playerWalletAmount-=t,this.label.string=b+this.playerWalletAmount.toString(),this.ledger+="- "+t+"\n",this.showEffect(-1*t)},l.showEffect=function(t){this.amountEffect.getComponent(s).string=t.toString(),this.amountEffect.getComponent(c).play()},e}(u)).prototype,"amountEffect",[p],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),f=g))||f));l._RF.pop()}}}));

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