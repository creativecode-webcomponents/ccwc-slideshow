class CCWCSlide extends HTMLElement {
  setProperties() {
    /**
     * text regions
     *
     * @property txtRegions
     * @type array
     */
      this.txtRegions = [ 'header', 'footer', 'left', 'right', 'center' ];

    /**
     * image regions
     *
     * @property imgRegions
     * @type array
     */
      this.imgRegions = [ 'center', 'center_full' ];

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
  };

  registerElements() {
    this.dom = {};
    this.dom.background = this.root.querySelector('#background');
    this.dom.htmlinclude = this.root.querySelector('#htmlinclude');
  };

  /**
   * getter for slide element
   *
   * @param {string} class name
   * @return {array}
   */
  getHTMLIncludeElementsByClass(clazz) {
    return this.dom.htmlinclude.getElementsByClassName(clazz);
  };

  /**
   * sets the html content of the slide via an HTML template
   *
   * @method set html template
   * @param {String} template file
   * @param {object} background properties
   */
  setHTML(template) {
    this.loadResource(this.htmltemplatepath + '/' + template, () => this.onHTMLReceived);
  };

  /**
   * on HTML callback for templates
   *
   * @method onHTMLRecieved
   * @param {String} data
   */
  onHTMLReceived(data) {
    this.dom.htmlinclude.innerHTML = data;
    this.executeScripts(this.dom.htmlinclude);
  };

  /**
   * sets the background image of the slide
   *
   * @method set background image
   * @param {String} img
   * @param {object} background properties
   */
  setBackgroundImage(img, props) {
    if (!props) { props = {}; }
    if (!props.bounds) { props.bounds = "contain"; }

    this.dom.background.style["background-size"] = props.bounds;
    this.dom.background.style.backgroundImage="url(" + this.resolveImage(img, this.imgpath) + ")";
  };

  /**
   * set image
   *
   * @method set image
   * @param {String} img
   * @param {String} named region
   */
  setImage(img, region ) {
    var elem = this.root.querySelector('#' + region + '_img');
    elem.style.backgroundImage = "url(" + this.resolveImage(img, this.imgpath) + ")";
    this.removeClass(elem, 'hidden');
  };

  /**
   * set text
   *
   * @method set text
   * @param {String} text
   * @param {String} named region
   */
  setText(text, region ) {
    var elem = this.root.querySelector('#' + region + '_txt');
    elem.innerHTML = text;
    this.removeClass(elem, 'hidden');
  };


  /**
   * clear slide
   *
   * @method clear
   */
  clear() {
    this.clearBackgroundImage();
    this.clearText();
    this.clearImages();
    this.clearHTMLTemplate();
  };

  /**
   * clear text
   *
   * @method clear all text in regions
   */
  clearText() {
    this.txtRegions.forEach( rg => {
      var elem = this.root.querySelector('#' + rg + '_txt');
      elem.innerHTML = "";
      this.addClass(elem, 'hidden');
    });
  };

  /**
   * clear images
   *
   * @method clear all images in regions
   */
  clearImages() {
    var self = this;
    this.imgRegions.forEach( rg => {
      var elem = this.root.querySelector('#' + rg + '_img');
      elem.style.backgroundImage = null;
      this.addClass(elem, 'hidden');
    });
  };

  /**
   * clear background image
   *
   * @method clear background image
   */
  clearBackgroundImage() {
    this.dom.background.style.backgroundImage = null;
  };

  /**
   * clear html template
   *
   * @method clear html template
   */
  clearHTMLTemplate() {
    this.dom.htmlinclude.innerHTML = "";
  };

  /**
   * add a class to an element
   *
   * @method addClass
   * @param {object} element
   * @param {string} class
   */
  addClass(elem, cls) {
    var classes = elem.getAttribute('class');
    var clist = classes.split(' ');
    if (clist.indexOf(cls) < 0) {
      clist.push(cls);
      elem.setAttribute('class', clist.join(' '));
    }
  };

  /**
   * add a class to an element
   *
   * @method addClass
   * @param {object} element
   * @param {string} class
   */
  removeClass(elem, cls) {
    var classes = elem.getAttribute('class');
    var clist = classes.split(' ');
    if (clist.indexOf(cls) >= 0) {
      clist.splice(clist.indexOf(cls), 1)
      elem.setAttribute('class', clist.join(' '));
    }
  };

  /**
   * resolve an image
   *
   * @method resolve image
   * @param {string} img
   * @param {string} base path
   */
  resolveImage(img, base) {
    if (img.substr(0, 4) == "http") {
      return img;
    }
    if (img.substr(0, 4) == "file") {
      return img;
    }

    return base + "/" + img;
  };

  /**
   * load a resource (whether through local filesystem or AJAX)
   *
   * @method loadResource
   * @param {string} resource
   * @param {function} callback
   */
  loadResource(resource, cb) {
    var self = this;
    var response;
    var fs = require('fs');

    if (fs) { // are we using node?
      response = fs.readFileSync(resource);
      cb.apply(self, [response]);
      return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200) {
          response = xmlhttp.responseText;
        } else {
          response = '<span>Slide Content is missing, please check your path</span>';
        }
        cb.apply(self, [response]);
      }
    };
    //xmlhttp.open("GET", "slides/htmlincludes/" + template, true);
    xmlhttp.open("GET", resource, true);
    xmlhttp.send();
  };

  /**
   * execute scripts on loaded HTML
   *
   * @method executeScripts
   * @param {object} node
   */
  executeScripts(node) {
    if ( node.nodeName == "SCRIPT" ) {
      var script = document.createElement("script");
      script.text = node.innerHTML;
      node.parentNode.replaceChild(script, node);
    } else {
      var i = 0;
      var children = node.childNodes;
      while ( i < children.length) {
        this.executeScripts( children[i] );
        i++;
      }
    }
    return node;
  }


  // Fires when an instance was removed from the document.
  detachedCallback() {};

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback(attr, oldVal, newVal) {};

  /**
   * parse attributes on element
   */
  parseAttributes() {};


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
  };

}

if (document.createElement('ccwc-slide').constructor !== CCWCSlide) {
  CCWCSlide.prototype.owner = (document._currentScript || document.currentScript).ownerDocument;
  document.registerElement('ccwc-slide', CCWCSlide);
}
