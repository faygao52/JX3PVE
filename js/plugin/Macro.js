//Macro systax
H.ready(['jquery'], function(){

	if ( ![].indexOf ){
		Array.prototype.indexOf = function( value ){
			var j = -1;
			for ( var i = 0 ; i < this.length ; i++ ){
				if ( value === this[i] ){
					j = i;
					break;
				}
			}
			return j;
		};
		Array.prototype.lastIndexOf = function( value ){
			var j = -1;
			for ( var i = this.length - 1 ; i > -1 ; i-- ){
				if ( value === this[i] ){
					j = i;
					break;
				}
			}
			return j;
		};
	};

	var Sytax = function(target, data){
		this.target = jQuery(target); //document.getElementById(target);
		this.content = data;
		this.install();
	}

	function trim(strings){
		return strings.replace(/^\s+/, '').replace(/\s+$/, '');
	}

	Sytax.prototype.splits = function(){
		var arrays = this.content.split('\n');
		this.lines = [];
		for ( var i = 0 ; i < arrays.length ; i++ ){
			this.lines.push(this.language(arrays[i]));
		}
		//this.target.innerHTML = '<ol>' + this.lines.join('') + '</ol>';
		this.target.html('<ol>' + this.lines.join('') + '</ol>')
	}

	Sytax.prototype.condition = function(s){
		var h = '',
			keys = ['<', '>', '=', '&', ';', '|', '(', ')', '[', ']', ':', '~', ',', '+', '-', '%', '*', '/', '!'];
			
		for ( var i = 0 ; i < s.length ; i++ ){
			var t = s.charAt(i);
			if ( keys.indexOf(t) > -1 ){
				h += '<span class="sytax-key">' + t + '</span>';
			}else{
				h += t;
			}
		}
		
		h = h.replace(/(v)\_([^\s\<\>\=\&\;\|\(\)\[\]\:\~\,\+\-\%\*\/\!]+)/ig, '<span class="sytax-condition">$1_$2</span>');
		
		return h;
	}

	Sytax.prototype.params = function(s){
		return s.replace(/v\_([^\s\<\>\=\&\;\|\(\)\[\]\:\~\,\+\-\%\*\/\!]+)/, '<span class="sytax-param">v_$1</span>')
			.replace(/\,/g, '<span class="sytax-key">,</span>')
			.replace(/(tip)(\_\d)?\:/ig, '<span class="sytax-key">$1$2:</span>')
			.replace(/(icon)(\_\d)?\:/ig, '<span class="sytax-key">$1$2:</span>')
	}

	Sytax.prototype.language = function(strings){
		if ( !/^\#/.test(trim(strings)) ){
			var cmd = strings.indexOf('--'),
				cmdstring = '';
				
			if ( cmd > -1 ){
				cmdstring = strings.substring(cmd);
				strings = strings.substring(0, cmd);
				if ( trim(strings).length === 0 ){
					strings = cmdstring;
					cmdstring = '';
					if ( trim(strings).length === 0 ){
						strings = '';
					}
				}
			}
		}
		
		var tstring = trim(strings), 
			h = '', 
			that = this;
			
		if ( /^\#/.test(tstring) ){
			var system = /(\s+)?#([^\s]+)\s(.+)/.exec(strings);
			var a1 = system[1] ? system[1] : '';
			var a2 = system[2];
			var a3 = system[3];
			h += '<li><pre>' + a1 + '<span class="sytax-system sytax-system-' + a2.toLowerCase() + '">#' + a2 + '</span> <span class="sytax-system-string">' + that.params(a3) + '</span></pre></li>';
		}
		else if ( /^\-\-/.test(tstring) ){
			h += '<li><pre><span class="sytax-comment">' + strings + '</span></pre></li>';
		}
		else{
			var keyword = /(\s+)?\/([^\s\[]+)(\s?\[([^\]]+)\])?(\s?(.+))?/.exec(strings);
			if ( keyword ){
				var b1 = keyword[1] ? keyword[1] : '';
				var b2 = keyword[2];
				var b3 = keyword[4];
				var b4 = keyword[6];
				h += '<li><pre>';
				h += b1;
				h += '<span class="sytax-keyword sytax-keyword-' + b2.toLowerCase() + '">/' + b2 + '</span>';
				if ( keyword[3] ){
					h += ' ';
					h += '<span class="sytax-key">[</span>';
					h += '<span class="sytax-condition">' + that.condition(b3) + '</span>';
					h += '<span class="sytax-key">]</span>';
				}
				if ( keyword[5] ){
					h += ' ';
					h += '<span class="sytax-skill-name">' + that.condition(b4) + '</span>';
				}
				if ( cmdstring && cmdstring.length > 0 ){
					h += ' ';
					h += '<span class="sytax-comment">' + cmdstring + '</span>';
				}
				h += '</pre></li>';
			}else{
				h += '<li><pre>' + strings + ( cmdstring && cmdstring.length > 0 ? cmdstring : '' ) + '</pre></li>';
			}
		}
		return h;
	}

	Sytax.prototype.install = function(){
		this.splits();
	}

	window.Macro = Sytax;

})


