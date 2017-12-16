/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/bundles/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(2);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4)
__webpack_require__(5)
LazyLoad = __webpack_require__(7)
__webpack_require__(8)


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "{% extends \"base.html\" %} {% block title %} || accueil {% endblock %} {% load render_bundle from webpack_loader %} {% block content %} <div class=bgblock id=bghaut> <div class=skewbar> <div class=inner-content> <h1>Jean-Pierre <br> HALLET</h1> <h1>Céramiste<br> Autodidacte</h1> </div> </div> <div class=imgdiv> {% load static %} <img id=img-jipi src=\"{% static 'img/img-jipi.png' %}\" alt=jeanpierre-hallet> </div> <div class=text-intro> </div> </div> <div class=bgbio> <div class=\"bgblock bg-block-second\"> <div class=biographie> <div class=title-biographie> <h1>Biographie</h1></div> <div class=text-biographie> <h1>Lorem ipsum dolor sit amet.</h1> <h2>Lorem ipsum dolor.</h2> Je n ai suivi aucune formation artistique, et je travaille en autodidacte. Je me revendique amateur, par respect pour ceux qui prennent l art au sérieux A la base, je suis instituteur primaire. Depuis plus de 30 ans j enseigne dans le spécialisé de type 3 et 8. C'est-à-dire à des enfants troublés affectifs, en décrochage scolaire ou ayant des problèmes de dyslexie, dyscalculie, dys… Au cours de ma carrière, j ai eu l occasion d’expérimenter l art à l’école. Au début par la peinture, et au fil du temps, le travail de la terre. Convaincu que l’art à l’école doit dépasser les stéréotypes du collier de nouilles, pour être un réel vecteur d’ expression et de construction de soi, porteur de sens, bien plus que la sacro sainte orthographe, ou les incontournables tables de multiplication. La terre est venue s’imposer à moi tout naturellement, avec une force émotionnelle, tactile. Partir du rien, pour s’exprimer, se dire, s’écrire, et peut être se comprendre, s’apaiser. Un support d’expression idéal pour des enfants déchirés par la vie . S’approprier un processus, des techniques, au service du comprendre . Comprendre qui je suis. Que de ce rien peut naître le beau. Mais pas seulement. C’est aussi ouvrir une porte à l’oser. Se reconnaitre dans la matière, et les éléments Une démarche avant tout instinctive et sensitive. Je laisse le champ libre à cette merveilleuse sensation qu’est l’harmonie des sens. Je me complais dans les formes rondes, moules du sein nourricier. La boule, c’est une certaine idée de l'infini, du mouvement perpétuel, de l'harmonie .C'est le confort du réconfort. Verticalité instable, jeu d'équilibre car reflet de notre combat à rester maître de notre vie. Ainsi naissent les totems Empilées comme le sont nos émotions, petites et grosses, composantes de notre moi, ces boules jaillissent de la mère terre. </div> </div> </div> </div> <div class=full-contact> <div class=contact> <div class=text-contact> <h1>Contacter moi par : </h1> </div> <div class=contactmode> <div data-num=0 class=contactmodebtn id=contactmail>Mail</div> <div data-num=1 class=contactmodebtn id=contacttele>Téléphone</div> <div data-num=2 class=contactmodebtn id=contactface>Facebook</div> </div> </div> <div class=mailteleface> <div data-num=0 data-index=bon class=\"test modeCom\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis quia, quisquam dolorem fugiat ab atque beatae voluptate inventore facilis iste eum, officiis voluptas porro deserunt rerum, officia culpa consectetur, in pariatur accusantium veniam aliquam itaque dolores. Maxime dolore doloremque iusto?</div> <div data-num=1 class=modeCom><br>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo pariatur eligendi cum vel, numquam nostrum ipsa iste, rerum corporis sit doloremque rem itaque quibusdam laboriosam odio, deserunt tempore quis obcaecati eaque fugiat! Placeat aut et dicta, autem, minima veritatis facere!</div> <div data-num=2 class=modeCom>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus unde, reiciendis fugit aperiam accusamus voluptas necessitatibus fugiat iusto doloribus aliquam, esse aut, voluptates officia porro velit illum dicta enim omnis quo incidunt ad corporis saepe. Quasi facere impedit quia asperiores?</div> </div> </div> <div class=oeuvres-lg> <h1 style=text-align:center>Mes oeuvres</h1> <div class=art-block> <div class=art-oeuvre id=art-oeuvre-1> <div class=img></div> <div class=art-text> <h3>Porteur de lumiere</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor error pariatur at officiis necessitatibus illo impedit porro, et tenetur l</p> <div data-num=0 class=btn> Galerie </div> </div> </div> <div class=gal id=gal1> {% load static %} <img class=lazyload src=\"{% static 'img/loading.gif' %}\" data-src=\"{% static 'img/300X600.png' %}\" alt=\"exemple de oeuvre1\"> <img class=lazyload src=\"{% static 'img/loading.gif' %}\" data-src=\"{% static 'img/600X300.png' %}\" alt=\"exemple de oeuvre1\"> <img class=lazyload src=\"{% static 'img/loading.gif' %}\" data-src=\"{% static 'img/300X600.png' %}\" alt=\"exemple de oeuvre1\"> <img class=lazyload src=\"{% static 'img/loading.gif' %}\" data-src=\"{% static 'img/300X600.png' %}\" alt=\"exemple de oeuvre1\"> <img class=lazyload src=\"{% static 'img/loading.gif' %}\" data-src=\"{% static 'img/300X600.png' %}\" alt=\"exemple de oeuvre1\"> <img class=lazyload src=\"{% static 'img/loading.gif' %}\" data-src=\"{% static 'img/300X600.png' %}\" alt=\"exemple de oeuvre1\"> <img class=lazyload src=\"{% static 'img/loading.gif' %}\" data-src=\"{% static 'img/600X300.png' %}\" alt=\"exemple de oeuvre1\"> <img class=lazyload src=\"{% static 'img/loading.gif' %}\" data-src=\"{% static 'img/300X600.png' %}\" alt=\"exemple de oeuvre1\"> </div> </div> <div class=art-block> <div class=art-oeuvre> <div class=img></div> <div class=art-text> <h3>Porteur de lumiere</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor error pariatur at officiis necessitatibus illo impedit porro, et tenetur l</p> <div data-num=1 class=btn> Galerie </div> </div> </div> <div class=gal> Chargement </div> </div> </div> <div class=motDeFin> <h2>Merci de votre visite !</h2> <p>j'espere vous avoir transmis mon amour du travail bien fait</p> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui voluptas iure ipsam aspernatur, omnis delectus!</p> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui voluptas iure ipsam aspernatur, omnis delectus!</p> </div> <div class=footer> <div class=\"left footer-part\"> <ul>Plan du site <li><a href=\"\"></a>Accueil</li> <li><a href=\"\"></a>Biographie</li> <li><a href=\"\"></a>Oeuvre</li> <li><a href=\"\"></a>Contact</li> </ul> </div> <div class=\"right footer-part\"> <ul> <li><a href=https://www.highoncafe.be target=_blank>HighOnCafe.be</a></li> <li>PIQUARD François</li> <li>2017</li> <li>Mentions légales</li> </ul> </div> </div> {% render_bundle 'index' %} {% endblock content %} ";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"minimize":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/sass-loader/lib/loader.js??ref--2-2!./index.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/sass-loader/lib/loader.js??ref--2-2!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "*{box-sizing:border-box}html{background-color:rgba(159,126,92,.2)}body,html{color:#2f2f2f;font-size:16px;margin:0;padding:0;width:100%;height:100%;overflow-x:hidden}.bgblock{background:#9f7e5c;width:100%}#bghaut{margin-bottom:5%;min-height:100%}.skewbar{box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-webkit-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-moz-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.2);background:#ff8000;margin:-15px 0 0;width:100%;height:15%;transform:skewY(3deg)}.skewbar .inner-content{padding:10px;display:flex;justify-content:space-between;transform:skewY(-3deg)}.skewbar .inner-content h1{font-size:1.5em}.skewbar .inner-content h1:nth-child(2){text-align:right}.imgdiv{display:flex;justify-content:center;margin-top:-35px}.imgdiv #img-jipi{z-index:20;height:125px;width:125px;border-radius:50%}.text-intro{box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-webkit-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-moz-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.2);background:#ff8000;margin:0 15px 25px;padding:15px 15px 10px;transform:translateY(50px)}.bg-block-second{margin-top:150px}.bg-block-second .biographie{transform:translateY(15px);box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-webkit-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-moz-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.2);margin:-15px 15px 15px;padding:15px;background:#ff8000}.art-block{width:auto;height:auto;background:#9f7e5c;margin:25px 20px;padding-bottom:10px}.art-block .art-oeuvre{background:#9f7e5c;box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-webkit-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-moz-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.2);display:flex;align-items:center;margin:0 -5px}.art-block .art-oeuvre .img{transform:translateX(-20px);height:300px;width:40%;background-image:url(" + __webpack_require__(13) + ");background-position:50%;background-size:contain;background-repeat:no-repeat}.art-block .art-oeuvre .art-text{width:60%;padding:10px 10px 10px 0;font-weight:300}.art-block .art-oeuvre .art-text .btn{float:right;margin-right:-20px;width:150px;padding:2px;background:#2f2f2f;color:#ff8000;text-align:center;font-size:1.3em}.art-block .gal{color:transparent;max-height:5px;display:none}.art-block .showing{display:flex;flex-direction:row;flex-wrap:wrap;min-height:fit-content;color:rgba(47,47,47,.5);font-size:2em;text-align:center;margin:5px;margin-top:15px;line-height:70px}.art-block .showing img{height:auto;width:50%}.motDeFin{padding:5% 15%}.motDeFin h2{text-align:center;font-size:1.7em;margin:0 -15px}.motDeFin p{font-size:1.3em}@keyframes upanddown{0%{transform:scale(1)}40%{transform:scale(.7)}to{transform:scale(1)}}.footer{box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-webkit-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-moz-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.2);background:#9f7e5c;z-index:1;margin:20px auto;min-width:90%;min-height:150px;padding:10px;display:flex}.footer a{text-decoration:none;color:inherit}.footer .footer-part ul{padding-left:20px;font-size:1.5em;opacity:.9;margin:0;text-decoration:none;list-style:none}.footer .footer-part ul li{font-size:.7em;padding-left:25px}.footer .right{letter-spacing:1px;padding-top:25px;text-align:right;width:50%;margin-right:25px}.footer .right ul,.footer .right ul>li{padding-left:0}@media (min-width:450px){body{display:flex;flex-direction:row;flex-wrap:wrap;padding:0}.hidden-m{display:none}#bghaut{border-radius:5px;max-width:70%;min-width:70%;max-height:fit-content;min-height:80%;margin:40px auto;padding:20px 0;box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-webkit-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-moz-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.2)}#bghaut .text-intro{border-radius:5px;margin:auto;width:80%}#bghaut .skewbar{max-width:60%;transform:translateY(-10px);margin:-20px auto 0}#bghaut .skewbar *{transform:none}.hidden-lg{display:none}.oeuvres-lg{width:40%;margin:auto}.bgbio{position:relative;margin:10% 20%;width:100%}.bgbio .bg-block-second{top:50%;position:sticky;margin:auto}.bgbio .bg-block-second .biographie{position:relative}.full-contact{margin:auto;width:50%;display:flex;justify-content:center;flex-direction:column}.full-contact .mailteleface{z-index:10;position:relative}}.contact{width:auto;min-height:50px;background:#9f7e5c;margin:25px 20px 0;padding-bottom:70px;box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-webkit-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.15);-moz-box-shadow:-15px 0 15px 10px rgba(47,47,47,.15),0 -15px 15px 10px rgba(47,47,47,.15),15px 0 15px 10px rgba(47,47,47,.15),0 15px 15px 10px rgba(47,47,47,.2);display:flex}.contact .text-contact{opacity:.5;line-height:3em;align-items:center;padding:5px 15px;width:60%}.contact .contactmode{font-weight:300;font-size:1em;display:flex;align-items:flex-start;flex-direction:column;margin-top:10px}.contact .contactmode div{float:right;background:#2f2f2f;margin:5px;margin-right:-10px;width:150px;height:35px;line-height:35px;color:#ff8000;text-align:left;padding-left:10px;font-size:1.5em}.mailteleface{height:250px;width:400%;z-index:1;position:relative;margin:15px 0;display:flex;justify-content:flex-end;transition:transform 1s ease-in-out}.mailteleface .modeCom{padding:10px;width:25%;height:100%;color:#ff8000;background:#2f2f2f}.mailteleface .modeCom.showing{animation:upanddown 2s forwards ease-in-out}", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,t){"object"===( false?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=t(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):e.LazyLoad=t()}(this,function(){"use strict";var e={elements_selector:"img",container:window,threshold:300,throttle:150,data_src:"src",data_srcset:"srcset",class_loading:"loading",class_loaded:"loaded",class_error:"error",class_initial:"initial",skip_invisible:!0,callback_load:null,callback_error:null,callback_set:null,callback_processed:null},t=!("onscroll"in window)||/glebot/.test(navigator.userAgent),n=function(e,t){e&&e(t)},o=function(e){return e.getBoundingClientRect().top+window.pageYOffset-e.ownerDocument.documentElement.clientTop},i=function(e,t,n){return(t===window?window.innerHeight+window.pageYOffset:o(t)+t.offsetHeight)<=o(e)-n},s=function(e){return e.getBoundingClientRect().left+window.pageXOffset-e.ownerDocument.documentElement.clientLeft},r=function(e,t,n){var o=window.innerWidth;return(t===window?o+window.pageXOffset:s(t)+o)<=s(e)-n},l=function(e,t,n){return(t===window?window.pageYOffset:o(t))>=o(e)+n+e.offsetHeight},a=function(e,t,n){return(t===window?window.pageXOffset:s(t))>=s(e)+n+e.offsetWidth},c=function(e,t,n){return!(i(e,t,n)||l(e,t,n)||r(e,t,n)||a(e,t,n))},u=function(e,t){var n,o=new e(t);try{n=new CustomEvent("LazyLoad::Initialized",{detail:{instance:o}})}catch(e){(n=document.createEvent("CustomEvent")).initCustomEvent("LazyLoad::Initialized",!1,!1,{instance:o})}window.dispatchEvent(n)},d=function(e,t){return e.getAttribute("data-"+t)},h=function(e,t,n){return e.setAttribute("data-"+t,n)},f=function(e,t){var n=e.parentNode;if("PICTURE"===n.tagName)for(var o=0;o<n.children.length;o++){var i=n.children[o];if("SOURCE"===i.tagName){var s=d(i,t);s&&i.setAttribute("srcset",s)}}},_=function(e,t,n){var o=e.tagName,i=d(e,n);if("IMG"===o){f(e,t);var s=d(e,t);return s&&e.setAttribute("srcset",s),void(i&&e.setAttribute("src",i))}"IFRAME"!==o?i&&(e.style.backgroundImage='url("'+i+'")'):i&&e.setAttribute("src",i)},p="classList"in document.createElement("p"),m=function(e,t){p?e.classList.add(t):e.className+=(e.className?" ":"")+t},g=function(e,t){p?e.classList.remove(t):e.className=e.className.replace(new RegExp("(^|\\s+)"+t+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"")},v=function(t){this._settings=_extends({},e,t),this._queryOriginNode=this._settings.container===window?document:this._settings.container,this._previousLoopTime=0,this._loopTimeout=null,this._boundHandleScroll=this.handleScroll.bind(this),this._isFirstLoop=!0,window.addEventListener("resize",this._boundHandleScroll),this.update()};v.prototype={_reveal:function(e){var t=this._settings,o=function o(){t&&(e.removeEventListener("load",i),e.removeEventListener("error",o),g(e,t.class_loading),m(e,t.class_error),n(t.callback_error,e))},i=function i(){t&&(g(e,t.class_loading),m(e,t.class_loaded),e.removeEventListener("load",i),e.removeEventListener("error",o),n(t.callback_load,e))};"IMG"!==e.tagName&&"IFRAME"!==e.tagName||(e.addEventListener("load",i),e.addEventListener("error",o),m(e,t.class_loading)),_(e,t.data_srcset,t.data_src),n(t.callback_set,e)},_loopThroughElements:function(){var e=this._settings,o=this._elements,i=o?o.length:0,s=void 0,r=[],l=this._isFirstLoop;for(s=0;s<i;s++){var a=o[s];e.skip_invisible&&null===a.offsetParent||(t||c(a,e.container,e.threshold))&&(l&&m(a,e.class_initial),this._reveal(a),r.push(s),h(a,"was-processed",!0))}for(;r.length;)o.splice(r.pop(),1),n(e.callback_processed,o.length);0===i&&this._stopScrollHandler(),l&&(this._isFirstLoop=!1)},_purgeElements:function(){var e=this._elements,t=e.length,n=void 0,o=[];for(n=0;n<t;n++){var i=e[n];d(i,"was-processed")&&o.push(n)}for(;o.length>0;)e.splice(o.pop(),1)},_startScrollHandler:function(){this._isHandlingScroll||(this._isHandlingScroll=!0,this._settings.container.addEventListener("scroll",this._boundHandleScroll))},_stopScrollHandler:function(){this._isHandlingScroll&&(this._isHandlingScroll=!1,this._settings.container.removeEventListener("scroll",this._boundHandleScroll))},handleScroll:function(){var e=this._settings.throttle;if(0!==e){var t=Date.now(),n=e-(t-this._previousLoopTime);n<=0||n>e?(this._loopTimeout&&(clearTimeout(this._loopTimeout),this._loopTimeout=null),this._previousLoopTime=t,this._loopThroughElements()):this._loopTimeout||(this._loopTimeout=setTimeout(function(){this._previousLoopTime=Date.now(),this._loopTimeout=null,this._loopThroughElements()}.bind(this),n))}else this._loopThroughElements()},update:function(){this._elements=Array.prototype.slice.call(this._queryOriginNode.querySelectorAll(this._settings.elements_selector)),this._purgeElements(),this._loopThroughElements(),this._startScrollHandler()},destroy:function(){window.removeEventListener("resize",this._boundHandleScroll),this._loopTimeout&&(clearTimeout(this._loopTimeout),this._loopTimeout=null),this._stopScrollHandler(),this._elements=null,this._queryOriginNode=null,this._settings=null}};var w=window.lazyLoadOptions;return w&&function(e,t){var n=t.length;if(n)for(var o=0;o<n;o++)u(e,t[o]);else u(e,t)}(v,w),v});

/***/ }),
/* 8 */
/***/ (function(module, exports) {



const btnGal = document.getElementsByClassName('btn');
const gal = document.getElementsByClassName('gal');


function LooperGal(item, toMove, classToToggle) {
  for (i = 0; i < item.length; i++) {
    item[i].addEventListener('click', function(e) {
      toMove[this.dataset.num].classList.toggle(classToToggle);
      let galToMove  = ('gal' + (parseInt(this.dataset.num) + 1))
      
      var myLazyLoad = new LazyLoad({
        container: document.getElementById(galToMove)
      });
    })
  }

}
LooperGal(btnGal, gal, 'showing')

const contactmodebtn = document.getElementsByClassName('contactmodebtn')
const modeCom = document.getElementsByClassName('modeCom')

function LooperCont(item, toMove, classToToggle) {

  let previousX = 99
  // item.map(addEventListener('click' ,function(){console.log(hello);} )
  for (i = 0; i < item.length; i++) {
    item[i].addEventListener('click', function(e) {
      // toMove[this.dataset.num].classList.remove(classToToggle);
      let x = parseInt(e.target.dataset.num) + 1;

      if (previousX != x) {
        previousX = x
        Object.keys(document.getElementsByClassName('modeCom')).map(function(i){
          document.getElementsByClassName('modeCom')[i].classList.remove(classToToggle);
        });
        // .classList.remove(classToToggle);
        toMove[this.dataset.num].classList.add(classToToggle);
        toMove[0].parentNode.style.transform = 'translateX(-' + x * 25 + '%)';
      }

    })
  }

}
LooperCont(contactmodebtn, modeCom, 'showing')


/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "oeuvre1.png";

/***/ })
/******/ ]);