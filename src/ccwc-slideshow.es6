class CCWCSlideShow extends HTMLElement {
  setProperties() {
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
  };

  /**
   * register dom elements
   */
  registerElements() {
    this.dom = {};
    this.dom.slideviewer = this.root.querySelector('#slideviewer');
    this.dom.slideinfo = this.root.querySelector('.infobar .slides');
    this.dom.runtime = this.root.querySelector('.infobar .runtime');
  };


  /**
   * ready
   *
   * @method ready
   */
   init() {
    this.loadDeck('./deck/manifest.json');
    document.addEventListener('keyup', event => this.onKeyPress(event) );

    setInterval( () => {
      if (this.running) {
        var duration = Math.floor((new Date().getTime() - this.timerStartTime) / 1000);
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
        this.dom.runtime.innerText = hours + ":" + minutes + ":" + seconds;
      }
    }, 1000);
  };

  /**
   * toggle timer
   *
   * @method toggleTimer
   */
  toggleTimer() {
    this.running = !this.running;
    if (this.timerStartTime === 0) {
      this.timerStartTime = new Date().getTime();
    }
  };

  /**
   * on keypress
   * @param event
   */
  onKeyPress(event) {
    switch(event.keyCode) {
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
  loadChapter(index, name, uri) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          var chapter = JSON.parse(xmlhttp.responseText);
          chapter.index = index;
          chapter.name = name;
          this.chapters.push(chapter);
          this.manifest.slideCount += chapter.slides.length;
          this.goSlide(0, 0);
        }
      }
    };
    xmlhttp.open("GET", uri, true);
    xmlhttp.send();
  };

  /**
   * load deck
   * @param uri of manifest
   */
  loadDeck(uri) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          this.manifest = JSON.parse(xmlhttp.responseText);
          this.manifest.slideCount = 0;
          this.dom.slideviewer.imgpath = this.manifest.baseImagePath;
          this.dom.slideviewer.htmltemplatepath = this.manifest.baseHTMLTemplatePath;

          this.chapters = [];
          for (var c = 0; c < this.manifest.content.length; c++) {
            this.loadChapter(c, name, this.manifest.content[c].file);
          }
        }
      }
    };

    xmlhttp.open("GET", uri, true);
    xmlhttp.send();
  };

  /**
   * next slide
   */
  nextSlide() {
    this.current.slide ++;
    if (this.current.slide >= this.chapters[this.current.chapter].slides.length) {
      this.current.slide = 0;
      this.current.chapter ++;

      if (this.current.chapter >= this.chapters.length) {
        this.current.chapter = 0;
      }
    }
    this.goSlide(this.current.chapter, this.current.slide);
  };

  /**
   * previous slide
   */
  previousSlide() {
    this.current.slide --;
    if (this.current.slide < 0) {
      this.current.chapter --;

      if (this.current.chapter < 0) {
        this.current.chapter = this.chapters.length - 1;
      }
      this.current.slide = this.chapters[this.current.chapter].slides.length - 1;
    }
    this.goSlide(this.current.chapter, this.current.slide);
  };

  /**
   * go to slide
   * @param {int} index of chapter
   * @param {int} index of slide
   */
  goSlide(chapter, slide) {
    this.current.chapter = chapter;
    this.current.slide = slide;

    var slidecount = slide;
    for (var c = 0; c < chapter; c++) {
      slidecount += this.chapters[c].slides.length;
    }

    this.dom.slideinfo.innerText = (slidecount + 1) + ' of ' + this.manifest.slideCount;
    this.dom.slideviewer.clear();
    var sld = this.chapters[chapter].slides[slide];

    if (sld.htmlinclude) {
      this.dom.slideviewer.setHTML(sld.htmlinclude);
    }

    if (sld.text) {
      sld.text.forEach( item => {
        this.dom.slideviewer.setText(item.html, item.region);
      });
    }

    if (sld.images) {
      sld.images.forEach( item => {
        this.dom.slideviewer.setImage(item.image, item.region);
      });
    }

    if (sld.background) {
      this.dom.slideviewer.setBackgroundImage(sld.background, sld.backgroundProperties);
    }
  };

  /**
   * getter for slide element
   *
   * @return slide element
   */
  getSlideComponent(id) {
    return this.dom.slideviewer;
  };

  /**
   * getter for slide element
   *
   * @param {string} class name
   * @return {array}
   */
  getHTMLIncludeElementsByClass(clazz) {
    return this.getSlideComponent().getHTMLIncludeElementsByClass(clazz);
  };

  // Fires when an instance was removed from the document.
  detachedCallback() {};

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback(attr, oldVal, newVal) {};

  /**
   * parse attributes on element
   */
  parseAttributes() {
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
  };


  // Fires when an instance of the element is created.
  createdCallback() {
    this.setProperties();
    this.parseAttributes();
  };

  // Fires when an instance was inserted into the document.
  attachedCallback() {
    let template = this.owner.querySelector('template');
    let clone = document.importNode(template.content, true);
    this.root = this.createShadowRoot();
    this.root.appendChild(clone);
    this.registerElements();
    this.init();
  };
}

if (document.createElement('ccwc-slideshow').constructor !== CCWCSlideShow) {
  CCWCSlideShow.prototype.owner = (document._currentScript || document.currentScript).ownerDocument;
  document.registerElement('ccwc-slideshow', CCWCSlideShow);
}
