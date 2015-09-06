'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CCWCSlideShow = (function (_HTMLElement) {
  _inherits(CCWCSlideShow, _HTMLElement);

  function CCWCSlideShow() {
    _classCallCheck(this, CCWCSlideShow);

    _get(Object.getPrototypeOf(CCWCSlideShow.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CCWCSlideShow, [{
    key: 'setProperties',
    value: function setProperties() {
      /**
       * slides deck
       *
       * @property deck
       * @type string
       */
      this.deck = '';

      /**
       * next slide key mapping
       *
       * @property nextSlideKey
       * @type integer
       */
      this.nextSlideKey = 39; // right arrow key

      /**
       * previous slide key mapping
       *
       * @property previousSlideKey
       * @type integer
       */
      this.previousSlideKey = 37; // left arrow key

      /**
       * toggle timer key mapping
       *
       * @property toggleTimerKey
       * @type integer
       */
      this.toggleTimerKey = 84; // "t" key

      /**
       * timer start time
       *
       * @property timer start time
       * @type Number
       */
      this.timerStartTime = 0;

      /**
       * current slide/chapter
       *
       * @property current slide/chapter
       * @type object
       */
      this.current = { chapter: 0, slide: 0 };

      /**
       * running
       * is slide deck running (being timed)
       * @property running
       * @type boolean
       */
      this.running = false;

      /**
       * slides
       *
       * @property slides
       * @type array
       */
      this.slides = [];
    }
  }, {
    key: 'registerElements',

    /**
     * register dom elements
     */
    value: function registerElements() {
      this.dom = {};
      this.dom.slideviewer = this.root.querySelector('#slideviewer');
      this.dom.slideinfo = this.root.querySelector('.infobar .slides');
      this.dom.runtime = this.root.querySelector('.infobar .runtime');
    }
  }, {
    key: 'init',

    /**
     * ready
     *
     * @method ready
     */
    value: function init() {
      var _this = this;

      this.loadDeck('./deck/manifest.json');
      document.addEventListener('keyup', function (event) {
        return _this.onKeyPress(event);
      });

      setInterval(function () {
        if (_this.running) {
          var duration = Math.floor((new Date().getTime() - _this.timerStartTime) / 1000);
          var totalSeconds = duration;
          var hours = Math.floor(totalSeconds / 3600);
          totalSeconds %= 3600;
          var minutes = Math.floor(totalSeconds / 60);
          var seconds = totalSeconds % 60;
          if (seconds.toString().length == 1) {
            seconds = "0" + seconds;
          }
          if (minutes.toString().length == 1) {
            minutes = "0" + minutes;
          }
          _this.dom.runtime.innerText = hours + ":" + minutes + ":" + seconds;
        }
      }, 1000);
    }
  }, {
    key: 'toggleTimer',

    /**
     * toggle timer
     *
     * @method toggleTimer
     */
    value: function toggleTimer() {
      this.running = !this.running;
      if (this.timerStartTime === 0) {
        this.timerStartTime = new Date().getTime();
      }
    }
  }, {
    key: 'onKeyPress',

    /**
     * on keypress
     * @param event
     */
    value: function onKeyPress(event) {
      switch (event.keyCode) {
        case this.nextSlideKey:
          this.nextSlide();
          break;

        case this.previousSlideKey:
          this.previousSlide();
          break;

        case this.toggleTimerKey:
          this.toggleTimer();
          break;
      }
    }

    /**
     * load chapter in slide deck
     * @param index
     * @param uri
     */
  }, {
    key: 'loadChapter',
    value: function loadChapter(index, name, uri) {
      var _this2 = this;

      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            var chapter = JSON.parse(xmlhttp.responseText);
            chapter.index = index;
            chapter.name = name;
            _this2.chapters.push(chapter);
            _this2.manifest.slideCount += chapter.slides.length;
            _this2.goSlide(0, 0);
          }
        }
      };
      xmlhttp.open("GET", uri, true);
      xmlhttp.send();
    }
  }, {
    key: 'loadDeck',

    /**
     * load deck
     * @param uri of manifest
     */
    value: function loadDeck(uri) {
      var _this3 = this;

      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            _this3.manifest = JSON.parse(xmlhttp.responseText);
            _this3.manifest.slideCount = 0;
            _this3.dom.slideviewer.imgpath = _this3.manifest.baseImagePath;
            _this3.dom.slideviewer.htmltemplatepath = _this3.manifest.baseHTMLTemplatePath;

            _this3.chapters = [];
            for (var c = 0; c < _this3.manifest.content.length; c++) {
              _this3.loadChapter(c, name, _this3.manifest.content[c].file);
            }
          }
        }
      };

      xmlhttp.open("GET", uri, true);
      xmlhttp.send();
    }
  }, {
    key: 'nextSlide',

    /**
     * next slide
     */
    value: function nextSlide() {
      this.current.slide++;
      if (this.current.slide >= this.chapters[this.current.chapter].slides.length) {
        this.current.slide = 0;
        this.current.chapter++;

        if (this.current.chapter >= this.chapters.length) {
          this.current.chapter = 0;
        }
      }
      this.goSlide(this.current.chapter, this.current.slide);
    }
  }, {
    key: 'previousSlide',

    /**
     * previous slide
     */
    value: function previousSlide() {
      this.current.slide--;
      if (this.current.slide < 0) {
        this.current.chapter--;

        if (this.current.chapter < 0) {
          this.current.chapter = this.chapters.length - 1;
        }
        this.current.slide = this.chapters[this.current.chapter].slides.length - 1;
      }
      this.goSlide(this.current.chapter, this.current.slide);
    }
  }, {
    key: 'goSlide',

    /**
     * go to slide
     * @param {int} index of chapter
     * @param {int} index of slide
     */
    value: function goSlide(chapter, slide) {
      var _this4 = this;

      this.current.chapter = chapter;
      this.current.slide = slide;

      var slidecount = slide;
      for (var c = 0; c < chapter; c++) {
        slidecount += this.chapters[c].slides.length;
      }

      this.dom.slideinfo.innerText = slidecount + 1 + ' of ' + this.manifest.slideCount;
      this.dom.slideviewer.clear();
      var sld = this.chapters[chapter].slides[slide];

      if (sld.htmlinclude) {
        this.dom.slideviewer.setHTML(sld.htmlinclude);
      }

      if (sld.text) {
        sld.text.forEach(function (item) {
          _this4.dom.slideviewer.setText(item.html, item.region);
        });
      }

      if (sld.images) {
        sld.images.forEach(function (item) {
          _this4.dom.slideviewer.setImage(item.image, item.region);
        });
      }

      if (sld.background) {
        this.dom.slideviewer.setBackgroundImage(sld.background, sld.backgroundProperties);
      }
    }
  }, {
    key: 'getSlideComponent',

    /**
     * getter for slide element
     *
     * @return slide element
     */
    value: function getSlideComponent(id) {
      return this.dom.slideviewer;
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
      return this.getSlideComponent().getHTMLIncludeElementsByClass(clazz);
    }
  }, {
    key: 'detachedCallback',

    // Fires when an instance was removed from the document.
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
    value: function parseAttributes() {
      if (this.hasAttribute('deck')) {
        this.deck = this.getAttribute('deck');
      }

      if (this.hasAttribute('nextSlideKey')) {
        this.nextSlideKey = parseInt(this.getAttribute('nextSlideKey'));
      }

      if (this.hasAttribute('previousSlideKey')) {
        this.previousSlideKey = parseInt(this.getAttribute('previousSlideKey'));
      }

      if (this.hasAttribute('toggleTimerKey')) {
        this.toggleTimerKey = parseInt(this.getAttribute('toggleTimerKey'));
      }
    }
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
      this.init();
    }
  }]);

  return CCWCSlideShow;
})(HTMLElement);

if (document.createElement('ccwc-slideshow').constructor !== CCWCSlideShow) {
  CCWCSlideShow.prototype.owner = (document._currentScript || document.currentScript).ownerDocument;
  document.registerElement('ccwc-slideshow', CCWCSlideShow);
}
//# sourceMappingURL=ccwc-slideshow.js.map