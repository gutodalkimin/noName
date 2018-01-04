;(function(window){'use strict';var docElem=window.document.documentElement,support={animations:Modernizr.cssanimations},animEndEventNames={'WebkitAnimation':'webkitAnimationEnd','OAnimation':'oAnimationEnd','msAnimation':'MSAnimationEnd','animation':'animationend'},animEndEventName=animEndEventNames[Modernizr.prefixed('animation')];function getViewportH(){var client=docElem['clientHeight'],inner=window['innerHeight'];if(client<inner)
return inner;else
return client;}
function scrollY(){return window.pageYOffset||docElem.scrollTop;}
function getOffset(el){var offsetTop=0,offsetLeft=0;do{if(!isNaN(el.offsetTop)){offsetTop+=el.offsetTop;}
if(!isNaN(el.offsetLeft)){offsetLeft+=el.offsetLeft;}}while(el=el.offsetParent)
return{top:offsetTop,left:offsetLeft}}
function inViewport(el,h){var elH=el.offsetHeight,scrolled=scrollY(),viewed=scrolled+ getViewportH(),elTop=getOffset(el).top,elBottom=elTop+ elH,h=h||0;return(elTop+ elH*h)<=viewed&&(elBottom- elH*h)>=scrolled;}
function extend(a,b){for(var key in b){if(b.hasOwnProperty(key)){a[key]=b[key];}}
return a;}
function GridItem(el){this.el=el;this.anchor=el.querySelector('.listLink');this.image=el.querySelector('img');this.desc=el.querySelector('h3');}
GridItem.prototype.addCurtain=function(){if(!this.image){this.curtain=document.createElement('div');this.curtain.className='curtain';this.curtain.style.background='rgb(204,24,30)';}
else{this.curtain=document.createElement('div');this.curtain.className='curtain';var rgb=new ColorFinder(function favorHue(r,g,b){return(Math.abs(r-g)*Math.abs(r-g)+ Math.abs(r-b)*Math.abs(r-b)+ Math.abs(g-b)*Math.abs(g-b))/65535*50+1;
}).getMostProminentColor(this.image);if(rgb.r&&rgb.g&&rgb.b){this.curtain.style.background='rgb('+rgb.r+','+rgb.g+','+rgb.b+')';}}
this.anchor.appendChild(this.curtain);}
GridItem.prototype.changeAnimationDelay=function(time){if(this.curtain){this.curtain.style.WebkitAnimationDelay=time+'ms';this.curtain.style.animationDelay=time+'ms';}
if(this.image){this.image.style.WebkitAnimationDelay=time+'ms';this.image.style.animationDelay=time+'ms';}
if(this.desc){this.desc.style.WebkitAnimationDelay=time+'ms';this.desc.style.animationDelay=time+'ms';}}
function GridScrollFx(el,options){this.el=el;this.options=extend({},this.options);extend(this.options,options);this._init();}
GridScrollFx.prototype.options={minDelay:0,maxDelay:500,viewportFactor:0}
GridScrollFx.prototype._init=function(){var self=this,items=[];[].slice.call(this.el.children).forEach(function(el,i){var item=new GridItem(el);items.push(item);});this.items=items;this.itemsCount=this.items.length;this.itemsRenderedCount=0;this.didScroll=false;imagesLoaded(this.el,function(){classie.add(self.el,'loaded');new Masonry(self.el,{itemSelector:'li',isFitWidth:true,transitionDuration:0});self.items.forEach(function(item){if(inViewport(item.el)){++self.itemsRenderedCount;classie.add(item.el,'shown');}
else{item.addCurtain();item.changeAnimationDelay(Math.random()*(self.options.maxDelay- self.options.minDelay)+ self.options.minDelay);}});var onScrollFn=function(){if(!self.didScroll){self.didScroll=true;setTimeout(function(){self._scrollPage();},200);}
if(self.itemsRenderedCount===self.itemsCount){window.removeEventListener('scroll',onScrollFn,false);}}
window.addEventListener('scroll',onScrollFn,false);window.addEventListener('resize',function(){self._resizeHandler();},false);});}
GridScrollFx.prototype._scrollPage=function(){var self=this;this.items.forEach(function(item){if(!classie.has(item.el,'shown')&&!classie.has(item.el,'animate')&&inViewport(item.el,self.options.viewportFactor)){++self.itemsRenderedCount;if(!item.curtain){classie.add(item.el,'shown');return;};classie.add(item.el,'animate');var onEndAnimationFn=function(ev){if(support.animations){this.removeEventListener(animEndEventName,onEndAnimationFn);}
classie.remove(item.el,'animate');classie.add(item.el,'shown');};if(support.animations){item.curtain.addEventListener(animEndEventName,onEndAnimationFn);}
else{onEndAnimationFn();}}});this.didScroll=false;}
GridScrollFx.prototype._resizeHandler=function(){var self=this;function delayed(){self._scrollPage();self.resizeTimeout=null;}
if(this.resizeTimeout){clearTimeout(this.resizeTimeout);}
this.resizeTimeout=setTimeout(delayed,1000);}
window.GridScrollFx=GridScrollFx;})(window);