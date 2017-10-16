/*0.3*/
;(function($){
	$.fn.navs=function(o){
		this.each(function(){
			var th=$(this),
				data=th.data('navs'),
				_={
					enable:true,
					activeCl:'active',
					chngEv:'click',
					changeEv:'change',
					closeEv:'close',
					backEv:'back',
					onceEv:'once',
					backLink:'a[data-type=back]',
					closeLink:'a[data-type=close]',
					blockSame:true,
					useHash:false,
					hover:true,
					contRetFalse:false,
					preFu:function(){
						_.n=-1
						_.curr=false
						_.li.each(function(n){
							var th=$(this)
							th.data({num:n})
							th.hasClass(_.activeCl)&&(_.n=n,_.hoverIn(_.curr=th,_),_.useHash&&(location.hash=$('a',th).attr('href')))
						})
					},
					refrFu:function(){
						if(!_.enable)
							return false
						_.li.each(function(n){
							var th=$(this)
							th.hasClass(_.activeCl)&&(_.n=n,_.hoverIn(_.curr=th,_))							
						})
						_.li.not(_.curr).each(function(){
							_.hoverOut($(this),_)
						})
					},
					cntrFu:function(){
						_.li.each(function(n){
							var li=$(this)
							$('>a',li)
								.bind(_.chngEv,function(){
									_.chngFu(n)
									if(_.contRetFalse)
										return false
								})									
						})
					},
					hashFu:function(){
						$(window)
							.bind('hashchange',function(){
								if(!_.enable)
									return false
								_.prevHash=_.hash
								;(_.hash=location.hash)
									.slice(0,3)=='#!/'&&_.chngFu(_.hash)
							})
						$('>a',_.li)
							.bind(_.chngEv,function(){
								if(!_.enable)
									return false
							})	
					},
					navFu:function(){
						$(_.backLink)
							.live(_.chngEv,function(){
								if(!_.enable)
									return false
								_.backFu()
								if(_.contRetFalse)
									return false
							})
						$(_.closeLink)
							.live(_.chngEv,function(){
								if(!_.enable)
									return false
								_.closeFu()
								if(_.contRetFalse)
									return false
							})
					},
					chngFu:function(arg){
						if(!_.enable||arg==_.n&&_.blockSame)
							return false						
						_.prev=_.n
						_.li
							.removeClass(_.activeCl)
							.each(function(n){
								var th=$(this)
								typeof arg=='number'&&n==arg&&(_.n=n,th.addClass(_.activeCl))
								typeof arg=='string'&&arg==$('a',th).attr('href')&&(_.n=n,th.addClass(_.activeCl))
								;(typeof arg=='number'&&n==arg&&_.useHash)
									&&(location.hash=$('a',th).attr('href'))
							})
						_.refrFu()
						_.param=arg=='close'||arg=='back'?arg:_.useHash?_.hash:_.n
						_.me.trigger(_.changeEv,_)
						_.me.one(_.changeEv,function(){
							_.me.trigger(_.onceEv,_)
						})
					},
					closeFu:function(){
						_.curr=false
						_.chngFu(-1)
						_.me.trigger(_.closeEv)
						location.hash='#'
					},
					backFu:function(){
						_.chngFu(_.prev)
						_.me.trigger(_.backEv)
					},
					nextFu:function(){
						var n=_.n
						_.chngFu(++n<_.li.length?n:0)
					},
					prevFu:function(){
						var n=_.n
						_.chngFu(--n>=0?n:_.li.length-1)
					},
					hoverFu:function(){
						_.li.each(function(n){
							$('>a',this)
								.bind('mouseenter',function(){
									if(_.enable)
										if(_.hover&&!_.li.eq(n).hasClass(_.activeCl))
											_.hoverIn(_.li.eq(n))
								})
								.bind('mouseleave',function(){
									if(_.enable)
										if(_.hover&&!_.li.eq(n).hasClass(_.activeCl))
											_.hoverOut(_.li.eq(n))
								})
						})
					},
					init:function(){
						_.ul=$('>ul',_.me)
						_.li=$('>li',_.ul)
						_.preFu()
						_.useHash?_.hashFu():_.cntrFu()
						_.navFu()
						_.hoverFu()
						_.hoverOut(_.li)
						_.refrFu()
						if(location.hash.slice(0,3)=='#!/'){
							var hash=location.hash
							location.hash=''
							location.hash=hash
						}
					},
					hoverIn:function(){},
					hoverOut:function(){}
				}
			data?_=data:th.data({navs:_})
			typeof o=='object'&&$.extend(_,o)
			_.me||_.init(_.me=th)
			
			typeof o=='function'&&_.me.bind(_.changeEv,function(){o(_.param,_)})
			typeof o=='boolean'&&(_.enable=o)
			typeof o=='number'&&_.chngFu(o)
			typeof o=='string'&&(o=='prev'||o=='next'||o=='close'||o=='back'?_[o+'Fu']():o.slice(0,3)=='#!/'&&(location.hash=o))
		})
		return this
	}
	
	$.fn.tabs=function(o){
		this.each(function(){
			var th=$(this)
				data=th.data('tabs'),
				_={
					enable:true,
					blockSame:true,
					changeEv:'change',
					duration:800,
					easing:'linear',
					preFu:function(){
						_.li.hide()
					},
					showFu:function(){
						_.next
							.css({opacity:0})
							.show()
							.stop()
							.animate({
								opacity:1
							},{
								duration:_.duration,
								easing:_.easing
							})
					},
					hideFu:function(){
						_.li.hide()
					},
					nextFu:function(){
						var n=_.n
					_.chngFu(++n<_.li.length?n:0)
					},
					prevFu:function(){
						var n=_.n
						_.chngFu(--n>=0?n:_.li.length-1)
					},
					navFu:function(str){
						if(_.prevStr==str)
							return false
						_.prevStr=str
						_.li.each(function(i){
							var th=$(this)
							if(th.attr('id')==str.slice(3))
								_.next=th,
								_.prev=_.n,
								_.n=i,
								_.hideFu(),
								_.showFu()
						})						
					},
					closeFu:function(){
						if(_.prevStr=='close')
							return false
						_.n=-1
						_.prevStr='close'
						_.hideFu()
					},
					backFu:function(){
						_.chngFu(_.prev)
					},
					chngFu:function(arg){
						if(!_.enable||arg==_.n&&_.blockSame)
							return false
						var fu=function(){
							_.prev=_.n
							_.n=arg
							_.next=_.li.eq(arg)
							_.hideFu(_)
							_.showFu(_)
							_.me.trigger(_.changeEv,_)
						}
						$.when(_.li).then(fu)
					},
					init:function(){
						_.ul=$('>ul',_.me)
						_.li=$('>li',_.ul)
						_.preFu()
					}
				}
			data?_=data:th.data({tabs:_})
			typeof o=='object'&&$.extend(_,o)
			_.me||_.init(_.me=th)
			
			typeof o=='function'&&_.me.bind(_.changeEv,function(){o(_.n,_)})
			typeof o=='boolean'&&(_.enable=o)
			typeof o=='number'&&_.chngFu(o)
			typeof o=='string'&&(o=='prev'||o=='next'||o=='close'||o=='back'?_[o+'Fu']():_.navFu(o))
		})
		return this
	}
})(jQuery)