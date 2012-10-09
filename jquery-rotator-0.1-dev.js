
/* jquery-rotator-0.1-dev.js
 * 18-02-2012
 * author: Filip Migdalski (migdalski.net | filip@migdalski.net)
 * This plugin is Open Source Software released under GPL v3
 *
 * This software comes with no guarantees. Use at your own risk.
 */
 
(function( $ ){

	var options;
	var loopInterval=[];
	var from=0;
	
	$.fn.rotate = function(degrees, opt){
	
		this.each(function() { 

		options = $.extend({}, $.fn.rotate.defaults, opt);

		var radd= getRadius(this);			
		
		var object = this;
		var radi = radd;
		
		l1 = 0;t1 = 0;i=1;
	
		degrees = calculateDegrees(degrees, radd);
		
		var nrstep = degrees/(options.speed/40);
		
		width = $(object).width();
		height = $(object).height();
		
		marginl = parseInt($(object).css("margin-left"));
		margint = parseInt($(object).css("margin-top"));
		
		if (Math.abs(nrstep) > 0) {
		 
		
		from= 0;
		
		
		
		clearInterval(loopInterval);
		
		loopInterval = setInterval(function() {	
			if (from++ >= degrees/nrstep) {
				clearInterval ( loopInterval );
				options.after.call();
			}
			else {
				radi +=  nrstep; 
				
				/ * radius correction */
				
				if (++i >= degrees/nrstep)
					radi = radd + degrees;
				
				
				rad = radi * Math.PI * 2 / 360 ;
				
				cosine = (Math.round(Math.cos(rad)*10000)/10000);
				sine = (Math.round(Math.sin(rad)*10000)/10000);
				
				mtrx = "matrix("+cosine+","+sine+","+(-sine)+","+cosine+","+l1+","+t1+")";
				
				if ($.browser.msie) {
					if (parseInt($.browser.version) >= 9) {
						$(object).css("-ms-transform",mtrx);
					}
					else {
						ieTransform = "progid:DXImageTransform.Microsoft.Matrix(M11=" + cosine + ", M12=" + (-sine) + ", M21=" + (sine) + ", M22=" + cosine +", sizingMethod='auto expand')"				
				
						$(object).css("filter",ieTransform);
										
						marginleft = $(object).position().left + ((width - $(object).width())/2);
						margintop = $(object).position().top + ((height - $(object).height())/2);
			
						if ($(object).css("position")=="absolute") {
							$(object).css("margin-left", marginleft+marginl);
							$(object).css("margin-top", margintop+margint);
						}
						
						$(object).css("zoom","1");
						$(object).css("-ms-transform",mtrx);
					}
				}
				else if ($.browser.webkit) {
					$(object).css("-webkit-transform",mtrx); }
				else if ($.browser.opera) {
					$(object).css("-o-transform",mtrx); }
				else if ($.browser.mozilla) {
					$(object).css("-moz-transform",mtrx); }
				else {
					$(object).css("transform",mtrx);}
			}
		},40);	
		
		}
		else {
			radi = radd + degrees;	
		}
		return this;
	});
	}
	
	
	function calculateDegrees(degrees, radd) {
		if (options.value=="absolute") {
			degrees = degrees - radd;
			switch (options.direction) {
				case "short":
					if (Math.abs(degrees) > 180) degrees = 360+degrees;
					break;
				case "long":
					if (Math.abs(degrees) < 180) degrees = 360+degrees;
					break;
				case "right":
					if (radd > degrees)	degrees = 360+degrees;
					break;
				case "left":
					if (radd < degrees)	degrees = degrees-360;
					break;
			}
		}
		return degrees;
	}
	
	function getRadius(object) {
		
		var matrix = 0;
		var radd;
		
		if ($.browser.msie) { matrix = $(object).css("-ms-transform"); }
		else if ($.browser.webkit) { matrix = $(object).css("-webkit-transform"); }
		else if ($.browser.opera) { matrix = $(object).css("-o-transform"); }
		else if ($.browser.mozilla) { matrix = $(object).css("-moz-transform"); }
		else { matrix = $(object).css("transform");}		
		
		if (!matrix || matrix=="none") {
			radd = 0;
		}
		else { 
			if (matrix.indexOf("atrix(")>-1)	{
				temp2 = matrix.substring(matrix.indexOf("atrix(")+6,matrix.indexOf(")"));	
				matrixx = temp2.split(',');
	
				
				var acos = (Math.acos(parseFloat(matrixx[0]))*360/(Math.PI * 2));
				var asin = (Math.asin(parseFloat(matrixx[1]))*360/(Math.PI * 2));
						
				if (matrixx[0] > 0 && matrixx[1] <= 0)
					if (asin < 0)
						radd = asin+360;
					else
						radd = acos;
				if (matrixx[0] > 0 && matrixx[1] > 0) radd = acos;
				if (matrixx[0] <= 0 && matrixx[1] > 0) radd = acos;
				if (matrixx[0] <= 0 && matrixx[1] <=0) radd = (Math.abs(asin)+180);
			}
			else {
				radd = parseInt(matrix.substring(matrix.indexOf("rotate(")+7,matrix.indexOf("deg")));
			}
		}
		return radd;

	}
	

})( jQuery);


$.fn.rotate.defaults = {
	  speed: 500,			// ms
	  direction: "short", 	//"short","long","right","left"
	  value: "relative",	//"absolute", "relative"
	  after: function() {}
};

