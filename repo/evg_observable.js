(()=>{"use strict";const s=(s,e)=>s.order>e.order?1:s.order<e.order?-1:0,e=(s,e)=>s.order>e.order?-1:s.order<e.order?1:0;function i(s,e){const i=s.indexOf(e);return-1!==i&&(s[i]=s[s.length-1],s.length=s.length-1,!0)}class t{constructor(){this.chainHandlers=[],this.pipeData={isBreakChain:!1,isNeedUnsubscribe:!1,isAvailable:!1,payload:null}}setOnce(){const s=this.pipeData;return this.chainHandlers.push((()=>{this.listener(s.payload),s.isNeedUnsubscribe=!0})),this}unsubscribeByNegative(s){const e=this.pipeData;return this.chainHandlers.push((()=>{e.isAvailable=!0,s(e.payload)||(e.isNeedUnsubscribe=!0)})),this}unsubscribeByPositive(s){const e=this.pipeData;return this.chainHandlers.push((()=>{e.isAvailable=!0,s(e.payload)&&(e.isNeedUnsubscribe=!0)})),this}emitByNegative(s){const e=this.pipeData;return this.chainHandlers.push((()=>{s(e.payload)||(e.isAvailable=!0)})),this}emitByPositive(s){const e=this.pipeData;return this.chainHandlers.push((()=>{s(e.payload)&&(e.isAvailable=!0)})),this}emitMatch(s){const e=this.pipeData;return this.chainHandlers.push((()=>{s(e.payload)==e.payload&&(e.isAvailable=!0)})),this}switch(){return new r(this)}}class r{constructor(s){this.caseCounter=0,this.pipe=s}subscribe(s,e){return this.pipe.subscribe(s,e)}case(s){this.caseCounter++;const e=this.caseCounter,i=this.pipe.pipeData,t=this.pipe.chainHandlers;return t.push((()=>{i.isAvailable=!0,s(i.payload)&&(i.isBreakChain=!0),e!==t.length||i.isBreakChain||(i.isAvailable=!1)})),this}}class n extends t{constructor(s,e){super(),this.isMarkedForUnsubscribe=!1,this.errorHandler=(s,e)=>{console.log(`(Unit of SubscribeObject).send(${s}) ERROR:`,e)},this._order=0,this.isPaused=!1,this.isPipe=!1,this.observable=s,this.isPipe=!!e}subscribe(s,e){var i;return this.listener="next"in(i=s)?s=>i.next(s):i,e&&(this.errorHandler=e),this}unsubscribe(){this.observable&&(this.observable.unSubscribe(this),this.observable=null,this.listener=null,this.chainHandlers.length=0)}send(s){try{this.pipeData.payload=s,this.pipeData.isBreakChain=!1,function(s,e){const i=e.listener;if(!i)return e.unsubscribe();if(!e.observable)return e.unsubscribe();if(!e.isPaused){if(!e.isPipe)return i(s);for(let s=0;s<e.chainHandlers.length;s++){if(e.pipeData.isNeedUnsubscribe=!1,e.pipeData.isAvailable=!1,e.chainHandlers[s](),e.pipeData.isNeedUnsubscribe)return e.unsubscribe();if(!e.pipeData.isAvailable)return;if(e.pipeData.isBreakChain)break}i(e.pipeData.payload)}}(s,this)}catch(e){this.errorHandler(s,e)}}resume(){this.isPaused=!1}pause(){this.isPaused=!0}get order(){return this._order}set order(s){this._order=s}}class h{constructor(s){this.value=s,this.listeners=[],this._isEnable=!0,this._isDestroyed=!1,this.isNextProcess=!1,this.listenersForUnsubscribe=[]}disable(){this._isEnable=!1}enable(){this._isEnable=!0}get isEnable(){return this._isEnable}next(s){if(!this._isDestroyed&&this._isEnable){this.isNextProcess=!0,this.value=s;for(let e=0;e<this.listeners.length;e++)this.listeners[e].send(s);this.isNextProcess=!1,this.listenersForUnsubscribe.length&&this.handleListenersForUnsubscribe()}}stream(s){if(!this._isDestroyed&&this._isEnable)for(let e=0;e<s.length;e++)this.next(s[e])}handleListenersForUnsubscribe(){const s=this.listenersForUnsubscribe.length;for(let e=0;e<s;e++)this.unSubscribe(this.listenersForUnsubscribe[e]);this.listenersForUnsubscribe.length=0}unSubscribe(s){if(!this._isDestroyed){if(this.isNextProcess&&s){const e=s;return!e.isMarkedForUnsubscribe&&this.listenersForUnsubscribe.push(s),void(e.isMarkedForUnsubscribe=!0)}this.listeners&&i(this.listeners,s)}}destroy(){this.value=null,this.unsubscribeAll(),this.listeners=null,this._isDestroyed=!0}unsubscribeAll(){this._isDestroyed||(this.listeners.length=0)}getValue(){if(!this._isDestroyed)return this.value}size(){return this._isDestroyed?0:this.listeners.length}subscribe(s,e){if(!this.isSubsValid(s))return;const i=new n(this,!1);return this.addObserver(i,s,e),i}addObserver(s,e,i){s.subscribe(e,i),this.listeners.push(s)}isSubsValid(s){return!this._isDestroyed&&!!s}pipe(){if(this._isDestroyed)return;const s=new n(this,!0);return this.listeners.push(s),s}get isDestroyed(){return this._isDestroyed}}class a extends n{constructor(s,e){super(s,e)}get order(){return this._order}set order(s){!this.observable||this.observable&&this.observable.isDestroyed?this._order=void 0:(this._order=s,this.observable.sortByOrder())}subscribe(s,e){return super.subscribe(s,e),this}setOnce(){return super.setOnce()}unsubscribeByNegative(s){return super.unsubscribeByNegative(s)}unsubscribeByPositive(s){return super.unsubscribeByPositive(s)}emitByNegative(s){return super.emitByNegative(s)}emitByPositive(s){return super.emitByPositive(s)}emitMatch(s){return super.emitMatch(s)}}const u=window;u.Observable=h,u.Collector=class{constructor(){this.list=[],this._isDestroyed=!1}collect(...s){this._isDestroyed||this.list.push(...s)}unsubscribe(s){this._isDestroyed||(s?.unsubscribe(),i(this.list,s))}unsubscribeAll(){if(!this._isDestroyed)for(;this.list.length>0;)this.unsubscribe(this.list.pop())}size(){return this._isDestroyed?0:this.list.length}destroy(){this.unsubscribeAll(),this.list.length=0,this.list=0,this._isDestroyed=!0}get isDestroyed(){return this._isDestroyed}},u.OrderedObservable=class extends h{constructor(){super(...arguments),this.sortDirection=s}setAscendingSort(){return this.sortDirection=s,this.sortByOrder()}setDescendingSort(){return this.sortDirection=e,this.sortByOrder()}sortByOrder(){return!this._isDestroyed&&(this.listeners.sort(this.sortDirection),!0)}subscribe(s,e){if(!this.isSubsValid(s))return;const i=new a(this,!1);return this.addObserver(i,s,e),i}pipe(){if(this._isDestroyed)return;const s=new a(this,!0);return this.listeners.push(s),s}unSubscribe(s){if(!this._isDestroyed){if(this.isNextProcess&&s){const e=s;return!e.isMarkedForUnsubscribe&&this.listenersForUnsubscribe.push(s),void(e.isMarkedForUnsubscribe=!0)}this.listeners&&function(s,e){const i=s.indexOf(e);-1!==i&&s.splice(i,1)}(this.listeners,s)}}}})();