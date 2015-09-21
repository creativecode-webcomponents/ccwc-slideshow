'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CCWCSlide = (function (_HTMLElement) {
  _inherits(CCWCSlide, _HTMLElement);

  function CCWCSlide() {
    _classCallCheck(this, CCWCSlide);

    _get(Object.getPrototypeOf(CCWCSlide.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CCWCSlide, [{
    key: 'setProperties',
    value: function setProperties() {
      /**
       * text regions
       *
       * @property txtRegions
       * @type array
       */
      this.txtRegions = ['header', 'footer', 'left', 'right', 'center'];

      /**
       * image regions
       *
       * @property imgRegions
       * @type array
       */
      this.imgRegions = ['center', 'center_full'];

      /**
       * image base path
       *
       * @property imgpath
       * @type string
       */
      this.imgpath = "";

      /**
       * html template base path
       *
       * @property htmltemplatepath
       * @type string
       */
      this.htmltemplatepath = "";
    }
  }, {
    key: 'registerElements',
    value: function registerElements() {
      this.dom = {};
      this.dom.background = this.root.querySelector('#background');
      this.dom.htmlinclude = this.root.querySelector('#htmlinclude');
      this.dom.webframe = this.root.querySelector('#webframe');
    }
  }, {
    key: 'getHTMLIncludeElementsByClass',

    /**
     * getter for slide element
     *
     * @param {string} class name
     * @return {array}
     */
    value: function getHTMLIncludeElementsByClass(clazz) {
      return this.dom.htmlinclude.getElementsByClassName(clazz);
    }
  }, {
    key: 'setHTML',

    /**
     * sets the html content of the slide via an HTML template
     *
     * @method set html template
     * @param {String} template file
     * @param {object} background properties
     */
    value: function setHTML(template) {
      var _this = this;

      this.loadResource(this.htmltemplatepath + '/' + template, function (data) {
        return _this.onHTMLReceived(data);
      });
    }
  }, {
    key: 'setIFrame',

    /**
     * sets the html content of the slide via an HTML template
     * @param {String} uri
     */
    value: function setIFrame(opts) {
      this.dom.webframe.setAttribute('src', opts.url);

      if (opts.width) {
        this.dom.webframe.setAttribute('width', opts.width);
      }

      if (opts.height) {
        this.dom.webframe.setAttribute('height', opts.height);
      }
      this.removeClass(this.dom.webframe, 'hidden');
    }
  }, {
    key: 'onHTMLReceived',

    /**
     * on HTML callback for templates
     *
     * @method onHTMLRecieved
     * @param {String} data
     */
    value: function onHTMLReceived(data) {
      this.dom.htmlinclude.innerHTML = data;
      this.executeScripts(this.dom.htmlinclude);
    }
  }, {
    key: 'setBackgroundImage',

    /**
     * sets the background image of the slide
     *
     * @method set background image
     * @param {String} img
     * @param {object} background properties
     */
    value: function setBackgroundImage(img, props) {
      if (!props) {
        props = {};
      }
      if (!props.bounds) {
        props.bounds = "contain";
      }

      this.dom.background.style["background-size"] = props.bounds;
      this.dom.background.style.backgroundImage = "url(" + this.resolveImage(img, this.imgpath) + ")";
    }
  }, {
    key: 'setImage',

    /**
     * set image
     *
     * @method set image
     * @param {String} img
     * @param {String} named region
     */
    value: function setImage(img, region) {
      var elem = this.root.querySelector('#' + region + '_img');
      elem.style.backgroundImage = "url(" + this.resolveImage(img, this.imgpath) + ")";
      this.removeClass(elem, 'hidden');
    }
  }, {
    key: 'setText',

    /**
     * set text
     *
     * @method set text
     * @param {String} text
     * @param {String} named region
     */
    value: function setText(text, region) {
      var elem = this.root.querySelector('#' + region + '_txt');
      elem.innerHTML = text;
      this.removeClass(elem, 'hidden');
    }
  }, {
    key: 'clear',

    /**
     * clear slide
     *
     * @method clear
     */
    value: function clear() {
      this.clearBackgroundImage();
      this.clearText();
      this.clearImages();
      this.clearHTMLTemplate();
      this.clearIFrame();
    }
  }, {
    key: 'clearIFrame',

    /**
     * clear text
     *
     * @method clear all text in regions
     */
    value: function clearIFrame() {
      this.dom.webframe.setAttribute('src', '');
      this.addClass(this.dom.webframe, 'hidden');
    }
  }, {
    key: 'clearText',

    /**
     * clear text
     *
     * @method clear all text in regions
     */
    value: function clearText() {
      var _this2 = this;

      this.txtRegions.forEach(function (rg) {
        var elem = _this2.root.querySelector('#' + rg + '_txt');
        elem.innerHTML = "";
        _this2.addClass(elem, 'hidden');
      });
    }
  }, {
    key: 'clearImages',

    /**
     * clear images
     *
     * @method clear all images in regions
     */
    value: function clearImages() {
      var _this3 = this;

      var self = this;
      this.imgRegions.forEach(function (rg) {
        var elem = _this3.root.querySelector('#' + rg + '_img');
        elem.style.backgroundImage = null;
        _this3.addClass(elem, 'hidden');
      });
    }
  }, {
    key: 'clearBackgroundImage',

    /**
     * clear background image
     *
     * @method clear background image
     */
    value: function clearBackgroundImage() {
      this.dom.background.style.backgroundImage = null;
    }
  }, {
    key: 'clearHTMLTemplate',

    /**
     * clear html template
     *
     * @method clear html template
     */
    value: function clearHTMLTemplate() {
      this.dom.htmlinclude.innerHTML = "";
    }
  }, {
    key: 'addClass',

    /**
     * add a class to an element
     *
     * @method addClass
     * @param {object} element
     * @param {string} class
     */
    value: function addClass(elem, cls) {
      var classes = elem.getAttribute('class');
      var clist = classes.split(' ');
      if (clist.indexOf(cls) < 0) {
        clist.push(cls);
        elem.setAttribute('class', clist.join(' '));
      }
    }
  }, {
    key: 'removeClass',

    /**
     * add a class to an element
     *
     * @method addClass
     * @param {object} element
     * @param {string} class
     */
    value: function removeClass(elem, cls) {
      var classes = elem.getAttribute('class');
      var clist = classes.split(' ');
      if (clist.indexOf(cls) >= 0) {
        clist.splice(clist.indexOf(cls), 1);
        elem.setAttribute('class', clist.join(' '));
      }
    }
  }, {
    key: 'resolveImage',

    /**
     * resolve an image
     *
     * @method resolve image
     * @param {string} img
     * @param {string} base path
     */
    value: function resolveImage(img, base) {
      if (img.substr(0, 4) == "http") {
        return img;
      }
      if (img.substr(0, 4) == "file") {
        return img;
      }

      return base + "/" + img;
    }
  }, {
    key: 'loadResource',

    /**
     * load a resource (whether through local filesystem or AJAX)
     *
     * @method loadResource
     * @param {string} resource
     * @param {function} callback
     */
    value: function loadResource(resource, cb) {
      var _this4 = this;

      var response;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            response = xmlhttp.responseText;
          } else {
            response = '<span>Slide Content is missing, please check your path</span>';
          }
          cb.apply(_this4, [response]);
        }
      };
      xmlhttp.open("GET", resource, true);
      xmlhttp.send();
    }
  }, {
    key: 'executeScripts',

    /**
     * execute scripts on loaded HTML
     *
     * @method executeScripts
     * @param {object} node
     */
    value: function executeScripts(node) {
      if (node.nodeName == "SCRIPT") {
        var script = document.createElement("script");
        script.text = node.innerHTML;
        node.parentNode.replaceChild(script, node);
      } else {
        var i = 0;
        var children = node.childNodes;
        while (i < children.length) {
          this.executeScripts(children[i]);
          i++;
        }
      }
      return node;
    }

    // Fires when an instance was removed from the document.
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {}
  }, {
    key: 'attributeChangedCallback',

    // Fires when an attribute was added, removed, or updated.
    value: function attributeChangedCallback(attr, oldVal, newVal) {}
  }, {
    key: 'parseAttributes',

    /**
     * parse attributes on element
     */
    value: function parseAttributes() {}
  }, {
    key: 'createdCallback',

    // Fires when an instance of the element is created.
    value: function createdCallback() {
      this.setProperties();
      this.parseAttributes();
    }
  }, {
    key: 'attachedCallback',

    // Fires when an instance was inserted into the document.
    value: function attachedCallback() {
      var template = this.owner.querySelector('template');
      var clone = document.importNode(template.content, true);
      this.root = this.createShadowRoot();
      this.root.appendChild(clone);
      this.registerElements();
    }
  }]);

  return CCWCSlide;
})(HTMLElement);

if (document.createElement('ccwc-slide').constructor !== CCWCSlide) {
  CCWCSlide.prototype.owner = (document._currentScript || document.currentScript).ownerDocument;
  document.registerElement('ccwc-slide', CCWCSlide);
}
//# sourceMappingURL=ccwc-slide.js.map