/**
* @class The superclass of all menu containers.
* @constructor
* @extends YAHOO.widget.Overlay
* @base YAHOO.widget.Overlay
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a MenuModule instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuModule = function(p_oElement, p_oConfig) {

    YAHOO.widget.MenuModule.superclass.constructor.call(
        this, 
        p_oElement, 
        p_oConfig
    );

};

YAHOO.extend(YAHOO.widget.MenuModule, YAHOO.widget.Overlay);


// Constants

/**
* Constant representing the CSS class(es) to be applied to the root 
* HTMLDivElement of the MenuModule instance.
* @final
* @type String
*/
YAHOO.widget.MenuModule.prototype.CSS_CLASS_NAME = "yuimenu";


/**
* Constant representing the type of item to instantiate and add when parsing 
* the child nodes (either HTMLLIElement, HTMLOptGroupElement or 
* HTMLOptionElement) of a menu's DOM.  The default 
* is YAHOO.widget.MenuModuleItem.
* @final
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.ITEM_TYPE = null;


/**
* Constant representing the tagname of the HTMLElement used to title 
* a group of items.
* @final
* @type String
*/
YAHOO.widget.MenuModule.prototype.GROUP_TITLE_TAG_NAME = "H6";


// Private properties

/**
* Array of HTMLElements used to title groups of items.
* @private
* @type {Array}
*/
YAHOO.widget.MenuModule.prototype._aGroupTitleElements = null;


/**
* Multi-dimensional array of items.
* @private
* @type {Array}
*/
YAHOO.widget.MenuModule.prototype._aItemGroups = null;


/**
* An array of HTMLUListElements, each of which is the parent node of each 
* items's HTMLLIElement node.
* @private
* @type {Array}
*/
YAHOO.widget.MenuModule.prototype._aListElements = null;


/**
* Reference to the Event utility singleton.
* @private
* @type {YAHOO.util.Event}
*/
YAHOO.widget.MenuModule.prototype._oEventUtil = YAHOO.util.Event;


/**
* Reference to the Dom utility singleton.
* @private
* @type {YAHOO.util.Dom}
*/
YAHOO.widget.MenuModule.prototype._oDom = YAHOO.util.Dom;


/**
* Reference to the item the mouse is currently over.
* @private
* @type {YAHOO.widget.MenuModuleItem}
*/
YAHOO.widget.MenuModule.prototype._oCurrentItem = null;


/** 
* The current state of a MenuModule instance's "mouseover" event
* @private
* @type {Boolean}
*/
YAHOO.widget.MenuModule.prototype._bFiredMouseOverEvent = false;


/** 
* The current state of a MenuModule instance's "mouseout" event
* @private
* @type {Boolean}
*/
YAHOO.widget.MenuModule.prototype._bFiredMouseOutEvent = false;


// Public properties

/**
* Reference to the item that has focus.
* @private
* @type {YAHOO.widget.MenuModuleItem}
*/
YAHOO.widget.MenuModule.prototype.activeItem = null;


/**
* Returns a MenuModule instance's parent object.
* @type {YAHOO.widget.MenuModuleItem}
*/
YAHOO.widget.MenuModule.prototype.parent = null;


/**
* Returns the HTMLElement (either HTMLSelectElement or HTMLDivElement)
* used create the MenuModule instance.
* @type {HTMLSelectElement/HTMLDivElement}
*/
YAHOO.widget.MenuModule.prototype.srcElement = null;


// Events

/**
* Fires when the mouse has entered a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseOverEvent = null;


/**
* Fires when the mouse has left a MenuModule instance.  Passes back the DOM 
* Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseOutEvent = null;


/**
* Fires when the user mouses down on a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseDownEvent = null;


/**
* Fires when the user releases a mouse button while the mouse is over 
* a MenuModule instance.  Passes back the DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseUpEvent = null;


/**
* Fires when the user clicks the on a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.clickEvent = null;


/**
* Fires when the user presses an alphanumeric key.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyPressEvent = null;


/**
* Fires when the user presses a key.  Passes back the DOM Event 
* object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyDownEvent = null;


/**
* Fires when the user releases a key.  Passes back the DOM Event 
* object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyUpEvent = null;


/**
* The MenuModule class's initialization method. This method is automatically 
* called  by the constructor, and sets up all DOM references for 
* pre-existing markup, and creates required markup if it is not already present.
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a MenuModule instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuModule.prototype.init = function(p_oElement, p_oConfig) {

    var Dom = this._oDom;
    var Event = this._oEventUtil;


    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuModuleItem;

    }


    this._aItemGroups = [];
    this._aListElements = [];
    this._aGroupTitleElements = [];


    var oElement;

    if(typeof p_oElement == "string") {

        oElement = document.getElementById(p_oElement);

    }
    else if(p_oElement.tagName) {

        oElement = p_oElement;

    }


    if(oElement) {

        switch(oElement.tagName) {
    
            case "DIV":

                this.srcElement = oElement;

                /* 
                    Note: we don't pass the user config in here yet 
                    because we only want it executed once, at the lowest 
                    subclass level.
                */ 
            
                YAHOO.widget.MenuModule.superclass.init.call(this, oElement);

                this.beforeInitEvent.fire(YAHOO.widget.MenuModule);


                /*
                    Populate the collection of item groups and item
                    group titles
                */

                var oNode = this.body.firstChild;
                var i = 0;

                do {

                    switch(oNode.tagName) {

                        case this.GROUP_TITLE_TAG_NAME:
                        
                            this._aGroupTitleElements[i] = oNode;

                        break;

                        case "UL":

                            this._aListElements[i] = oNode;
                            this._aItemGroups[i] = [];
                            i++;

                        break;

                    }

                }
                while((oNode = oNode.nextSibling));


                /*
                    Apply the "first-of-type" class to the first UL to mimic 
                    the "first-of-type" CSS3 psuedo class.
                */

                if(this._aListElements[0]) {

                    Dom.addClass(this._aListElements[0], "first-of-type");

                }

                this.logger = new YAHOO.widget.LogWriter(this.toString());

                this.logger.log("Source element: " + this.srcElement.tagName);
    
            break;
    
            case "SELECT":
    
                this.srcElement = oElement;
    
    
                /*
                    The source element is not something that we can use 
                    outright, so we need to create a new Overlay
                */
    
                var sId = Dom.generateId();

                /* 
                    Note: we don't pass the user config in here yet 
                    because we only want it executed once, at the lowest 
                    subclass level.
                */ 
            
                YAHOO.widget.MenuModule.superclass.init.call(this, sId); 

                this.beforeInitEvent.fire(YAHOO.widget.MenuModule);

                this.logger = new YAHOO.widget.LogWriter(this.toString());

                this.logger.log("Source element: " + this.srcElement.tagName);

            break;
    
        }

    }
    else {

        /* 
            Note: we don't pass the user config in here yet 
            because we only want it executed once, at the lowest 
            subclass level.
        */ 
    
        YAHOO.widget.MenuModule.superclass.init.call(this, p_oElement);

        this.beforeInitEvent.fire(YAHOO.widget.MenuModule);

        this.logger = new YAHOO.widget.LogWriter(this.toString());

        this.logger.log("No source element found.  " +
            "Created element with id: " + this.id);

    }


    if(this.element) {

        var oEl = this.element;
        var CustomEvent = YAHOO.util.CustomEvent;

        Dom.addClass(oEl, this.CSS_CLASS_NAME);

        // Assign DOM event handlers

        Event.addListener(
                oEl, 
                "mouseover", 
                this._onElementMouseOver, 
                this, 
                true
            );

        Event.addListener(oEl, "mouseout", this._onElementMouseOut, this, true);
        Event.addListener(oEl, "mousedown", this._onDOMEvent, this, true);
        Event.addListener(oEl, "mouseup", this._onDOMEvent, this, true);
        Event.addListener(oEl, "click", this._onElementClick, this, true);
        Event.addListener(oEl, "keydown", this._onDOMEvent, this, true);
        Event.addListener(oEl, "keyup", this._onDOMEvent, this, true);
        Event.addListener(oEl, "keypress", this._onDOMEvent, this, true);


        // Create custom events

        this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);
        this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);
        this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);
        this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);
        this.clickEvent = new CustomEvent("clickEvent", this);
        this.keyPressEvent = new CustomEvent("keyPressEvent", this);
        this.keyDownEvent = new CustomEvent("keyDownEvent", this);
        this.keyUpEvent = new CustomEvent("keyUpEvent", this);


        // Subscribe to Custom Events

        this.beforeRenderEvent.subscribe(this._onBeforeRender, this, true);
        this.renderEvent.subscribe(this._onRender, this, true);
        this.showEvent.subscribe(this._onShow, this, true);
        this.beforeHideEvent.subscribe(this._onBeforeHide, this, true);


        if(p_oConfig) {
    
            this.cfg.applyConfig(p_oConfig, true);
    
        }


        this.cfg.queueProperty("visible", false);


        if(this.srcElement) {

            this._initSubTree();

        }

    }


    this.initEvent.fire(YAHOO.widget.MenuModule);

};


// Private methods

/**
* Iterates the source element's childNodes collection and uses the child 
* nodes to instantiate MenuModule and MenuModuleItem instances.
* @private
*/
YAHOO.widget.MenuModule.prototype._initSubTree = function() {

    var oNode;

    this.logger.log("Searching DOM for items to initialize.");

    switch(this.srcElement.tagName) {

        case "DIV":

            if(this._aListElements.length > 0) {

                this.logger.log("Found " + 
                    this._aListElements.length + " item groups to initialize.");

                var i = this._aListElements.length - 1;

                do {

                    oNode = this._aListElements[i].firstChild;
    
                    this.logger.log("Scanning " + 
                        this._aListElements[i].childNodes.length + 
                        " child nodes for items to initialize.");

                    do {
    
                        switch(oNode.tagName) {
        
                            case "LI":

                                this.logger.log("Initializing " + 
                                    oNode.tagName + " node.");

                                this.addItem(new this.ITEM_TYPE(oNode), i);
        
                            break;
        
                        }
            
                    }
                    while((oNode = oNode.nextSibling));
            
                }
                while(i--);

            }

        break;

        case "SELECT":

            this.logger.log("Scanning " +  this.srcElement.childNodes.length + 
                " child nodes for items to initialize.");

            oNode = this.srcElement.firstChild;

            do {

                switch(oNode.tagName) {

                    case "OPTGROUP":
                    case "OPTION":

                        this.logger.log("Initializing " +  
                            oNode.tagName + " node.");

                        this.addItem(new this.ITEM_TYPE(oNode));

                    break;

                }

            }
            while((oNode = oNode.nextSibling));

        break;

    }

};


/**
* Returns the first enabled item in a menu instance.
* @return Returns a MenuModuleItem instance.
* @type YAHOO.widget.MenuModuleItem
* @private
*/
YAHOO.widget.MenuModule.prototype._getFirstEnabledItem = function() {

    var nGroups = this._aItemGroups.length;
    var oItem;
    var aItemGroup;

    for(var i=0; i<nGroups; i++) {

        aItemGroup = this._aItemGroups[i];
        
        if(aItemGroup) {

            var nItems = aItemGroup.length;
            
            for(var n=0; n<nItems; n++) {
            
                oItem = aItemGroup[n];
                
                if(
                    !oItem.cfg.getProperty("disabled") && 
                    oItem.element.style.display != "none"
                ) {
                
                    return oItem;
                
                }
    
                oItem = null;
    
            }
        
        }
    
    }
    
};


/**
* Determines if the value is one of the supported positions.
* @private
* @param {Object} p_sPosition The object to be evaluated.
* @return Returns true if the position is supported.
* @type Boolean
*/
YAHOO.widget.MenuModule.prototype._checkPosition = function(p_sPosition) {

    if(typeof p_sPosition == "string") {

        var sPosition = p_sPosition.toLowerCase();

        return ("dynamic,static".indexOf(sPosition) != -1);

    }

};


/**
* Adds an item to a group.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the item belongs.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be added.
* @param {Number} p_nItemIndex Optional. Index at which the item 
* should be added.
* @return The item that was added.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype._addItemToGroup = 

    function(p_nGroupIndex, p_oItem, p_nItemIndex) {

        var Dom = this._oDom;
        var oItem;

        if(p_oItem instanceof this.ITEM_TYPE) {

            oItem = p_oItem;     

        }
        else if(typeof p_oItem == "string") {

            oItem = new this.ITEM_TYPE(p_oItem);
        
        }


        if(oItem) {
        
            var nGroupIndex = typeof p_nGroupIndex == "number" ? 
                    p_nGroupIndex : 0;
            
            var aGroup = this._getItemGroup(nGroupIndex);
            
            var oGroupItem;
    

            if(!aGroup) {
    
                aGroup = this._createItemGroup(nGroupIndex);
    
            }


            if(typeof p_nItemIndex == "number") {
    
                var bAppend = (p_nItemIndex >= aGroup.length);            
    

                if(aGroup[p_nItemIndex]) {
        
                    aGroup.splice(p_nItemIndex, 0, oItem);
        
                }
                else {
        
                    aGroup[p_nItemIndex] = oItem;
        
                }
    
    
                oGroupItem = aGroup[p_nItemIndex];
    
                if(oGroupItem) {
    
                    if(bAppend && !oGroupItem.element.parentNode) {
            
                        this._aListElements[nGroupIndex].appendChild(
                            oGroupItem.element
                        );
        
                    }
                    else {
      
        
                        /**
                        * Returns the next sibling of an item in an array 
                        * @param {p_aArray} An array
                        * @param {p_nStartIndex} The index to start searching
                        * the array 
                        * @ignore
                        * @return Returns an item in an array
                        * @type Object 
                        */
                        function getNextItemSibling(p_aArray, p_nStartIndex) {
                
                            return (
                                    p_aArray[p_nStartIndex] || 
                                    getNextItemSibling(
                                        p_aArray, 
                                        (p_nStartIndex+1)
                                    )
                                );
                
                        }
        
        
                        var oNextItemSibling = 
                                getNextItemSibling(aGroup, (p_nItemIndex+1));
        
                        if(oNextItemSibling && !oGroupItem.element.parentNode) {
                
                            this._aListElements[nGroupIndex].insertBefore(
                                    oGroupItem.element, 
                                    oNextItemSibling.element
                                );
            
                        }
        
                    }
        
    
                    oGroupItem.parent = this;
            
                    this._subscribeToItemEvents(oGroupItem);
        
                    this._configureItemSubmenuModule(oGroupItem);
                    
                    this._updateItemProperties(nGroupIndex);
            
                    this.logger.log("Item inserted." + 
                        " Text: " + oGroupItem.cfg.getProperty("text") + ", " + 
                        " Index: " + oGroupItem.index + ", " + 
                        " Group Index: " + oGroupItem.groupIndex);

                    return oGroupItem;
        
                }
    
            }
            else {
        
                var nItemIndex = aGroup.length;
        
                aGroup[nItemIndex] = oItem;
        
        
                oGroupItem = aGroup[nItemIndex];
        
                if(oGroupItem) {
        
                    if(
                        !Dom.isAncestor(
                            this._aListElements[nGroupIndex], 
                            oGroupItem.element
                        )
                    ) {
        
                        this._aListElements[nGroupIndex].appendChild(
                            oGroupItem.element
                        );
        
                    }
        
                    oGroupItem.element.setAttribute("groupindex", nGroupIndex);
                    oGroupItem.element.setAttribute("index", nItemIndex);
            
                    oGroupItem.parent = this;
        
                    oGroupItem.index = nItemIndex;
                    oGroupItem.groupIndex = nGroupIndex;
            
                    this._subscribeToItemEvents(oGroupItem);
        
                    this._configureItemSubmenuModule(oGroupItem);
        
                    if(nItemIndex === 0) {
            
                        Dom.addClass(oGroupItem.element, "first-of-type");
            
                    }

                    this.logger.log("Item added." + 
                        " Text: " + oGroupItem.cfg.getProperty("text") + ", " + 
                        " Index: " + oGroupItem.index + ", " + 
                        " Group Index: " + oGroupItem.groupIndex);
            
                    return oGroupItem;
        
                }
        
            }

        }
    
    };


/**
* Removes an item from a group by index.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the item belongs.
* @param {Number} p_nItemIndex Number indicating the index of the item to  
* be removed.
* @return The item that was removed.
* @type YAHOO.widget.MenuModuleItem
*/    
YAHOO.widget.MenuModule.prototype._removeItemFromGroupByIndex = 

    function(p_nGroupIndex, p_nItemIndex) {

        var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0;
        var aGroup = this._getItemGroup(nGroupIndex);
    
        if(aGroup) {
    
            var aArray = aGroup.splice(p_nItemIndex, 1);
            var oItem = aArray[0];
        
            if(oItem) {
        
                // Update the index and className properties of each member        
                
                this._updateItemProperties(nGroupIndex);
        
                if(aGroup.length === 0) {
        
                    // Remove the UL
        
                    var oUL = this._aListElements[nGroupIndex];
        
                    if(this.body && oUL) {
        
                        this.body.removeChild(oUL);
        
                    }
        
                    // Remove the group from the array of items
        
                    this._aItemGroups.splice(nGroupIndex, 1);
        
        
                    // Remove the UL from the array of ULs
        
                    this._aListElements.splice(nGroupIndex, 1);
        
        
                    /*
                         Assign the "first-of-type" class to the new first UL 
                         in the collection
                    */
        
                    oUL = this._aListElements[0];
        
                    if(oUL) {
        
                        this._oDom.addClass(oUL, "first-of-type");
        
                    }            
        
                }
        
        
                // Return a reference to the item that was removed
            
                return oItem;
        
            }
    
        }
    
    };


/**
* Removes a item from a group by reference.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the item belongs.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be removed.
* @return The item that was removed.
* @type YAHOO.widget.MenuModuleItem
*/    
YAHOO.widget.MenuModule.prototype._removeItemFromGroupByValue =

    function(p_nGroupIndex, p_oItem) {

        var aGroup = this._getItemGroup(p_nGroupIndex);

        if(aGroup) {

            var nItems = aGroup.length;
            var nItemIndex = -1;
        
            if(nItems > 0) {
        
                var i = nItems-1;
            
                do {
            
                    if(aGroup[i] == p_oItem) {
            
                        nItemIndex = i;
                        break;    
            
                    }
            
                }
                while(i--);
            
                if(nItemIndex > -1) {
            
                    return this._removeItemFromGroupByIndex(
                                p_nGroupIndex, 
                                nItemIndex
                            );
            
                }
        
            }
        
        }
    
    };


/**
* Updates the index, groupindex, and className properties of the items
* in the specified group. 
* @private
* @param {Number} p_nGroupIndex Number indicating the group of items to update.
*/
YAHOO.widget.MenuModule.prototype._updateItemProperties = 

    function(p_nGroupIndex) {

        var aGroup = this._getItemGroup(p_nGroupIndex);
        var nItems = aGroup.length;
    
        if(nItems > 0) {
    
            var Dom = this._oDom;
            var i = nItems - 1;
            var oItem;
            var oLI;
    
            // Update the index and className properties of each member        
        
            do {
    
                oItem = aGroup[i];
    
                if(oItem) {
        
                    oLI = oItem.element;
    
                    oItem.index = i;
                    oItem.groupIndex = p_nGroupIndex;
    
                    oLI.setAttribute("groupindex", p_nGroupIndex);
                    oLI.setAttribute("index", i);
    
                    Dom.removeClass(oLI, "first-of-type");
    
                }
        
            }
            while(i--);
    
    
            if(oLI) {
    
                Dom.addClass(oLI, "first-of-type");
    
            }
    
        }
    
    };


/**
* Creates a new item group (array) and it's associated HTMLUlElement node 
* @private
* @param {Number} p_nIndex Number indicating the group to create.
* @return An item group.
* @type Array
*/
YAHOO.widget.MenuModule.prototype._createItemGroup = function(p_nIndex) {

    if(!this._aItemGroups[p_nIndex]) {

        this._aItemGroups[p_nIndex] = [];

        var oUL = document.createElement("ul");

        this._aListElements[p_nIndex] = oUL;

        return this._aItemGroups[p_nIndex];

    }

};


/**
* Returns the item group at the specified index.
* @private
* @param {Number} p_nIndex Number indicating the index of the item group to
* be retrieved.
* @return An array of items.
* @type Array
*/
YAHOO.widget.MenuModule.prototype._getItemGroup = function(p_nIndex) {

    var nIndex = ((typeof p_nIndex == "number") ? p_nIndex : 0);

    return this._aItemGroups[nIndex];

};


/**
* Subscribe's a MenuModule instance to it's parent MenuModule instance's events.
* @private
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to listen
* for events on.
*/
YAHOO.widget.MenuModule.prototype._configureItemSubmenuModule = 

    function(p_oItem) {

        var oSubmenu = p_oItem.cfg.getProperty("submenu");
    
        if(oSubmenu) {
    
            /*
                Listen for configuration changes to the parent MenuModule 
                instance so they they can be applied to the submenu.
            */
    
            this.cfg.configChangedEvent.subscribe(
                this._onParentMenuModuleConfigChange, 
                oSubmenu, 
                true
            );
            
            this.renderEvent.subscribe(
                this._onParentMenuModuleRender,
                oSubmenu, 
                true
            );
    
            oSubmenu.beforeShowEvent.subscribe(
                this._onSubmenuBeforeShow, 
                oSubmenu, 
                true
            );
    
            oSubmenu.showEvent.subscribe(this._onSubmenuShow, oSubmenu, true);
    
            oSubmenu.hideEvent.subscribe(this._onSubmenuHide, oSubmenu, true);
    
        }

};


/**
* Subscribes a MenuModule instance to the specified item's Custom Events.
* @private
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to listen for events on.
*/
YAHOO.widget.MenuModule.prototype._subscribeToItemEvents = function(p_oItem) {

    var aArguments = [this, p_oItem];

    p_oItem.focusEvent.subscribe(this._onItemFocus, aArguments);

    p_oItem.blurEvent.subscribe(this._onItemBlur, aArguments);

    p_oItem.cfg.configChangedEvent.subscribe(
        this._onItemConfigChange,
        aArguments
    );

};


/**
* Returns the offset width of a MenuModule instance.
* @private
*/
YAHOO.widget.MenuModule.prototype._getOffsetWidth = function() {

    var oClone = this.element.cloneNode(true);

    this._oDom.setStyle(oClone, "width", "");

    document.body.appendChild(oClone);

    var sWidth = oClone.offsetWidth;

    document.body.removeChild(oClone);

    return sWidth;

};


/**
* Determines if a DOM event was fired on an item and (if so) fires the item's
* associated Custom Event
* @private
* @param {HTMLElement} p_oElement The original target of the event.
* @param {String} p_sEventType The type/name of the Custom Event to fire.
* @param {Event} p_oDOMEvent The DOM event to pass back when firing the 
* Custom Event.
* @return An item.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype._fireItemEvent = 

    function(p_oElement, p_sEventType, p_oDOMEvent) {

        var me = this;
    
        /**
        * Returns the specified element's parent HTMLLIElement (&#60;LI&#60;)
        * @param {p_oElement} An HTMLElement node
        * @ignore
        * @return Returns an HTMLElement node
        * @type HTMLElement 
        */
        function getItemElement(p_oElement) {
        
            if(p_oElement == me.element) {
    
                return;
            
            }
            else if(p_oElement.tagName == "LI") {
        
                return p_oElement;
        
            }
            else if(p_oElement.parentNode) {
    
                return getItemElement(p_oElement.parentNode);
        
            }
        
        }
    
    
        var oElement = getItemElement(p_oElement);
    
        if(oElement) {
    
            /*
                Retrieve the item that corresponds to the 
                HTMLLIElement (&#60;LI&#60;) and fire the Custom Event        
            */
    
            var nGroupIndex = parseInt(oElement.getAttribute("groupindex"), 10);
            var nIndex = parseInt(oElement.getAttribute("index"), 10);
            var oItem = this._aItemGroups[nGroupIndex][nIndex];
    
            if(!oItem.cfg.getProperty("disabled")) {
    
                oItem[p_sEventType].fire(p_oDOMEvent);
    
                return oItem;
    
            }
    
        }

    };


// Private DOM event handlers

/**
* Generic event handler for the MenuModule's root HTMLDivElement node.  Used 
* to handle "mousedown," "mouseup," "keydown," "keyup," and "keypress" events.
* @private
* @param {Event} p_oEvent Event object passed back by the event 
* utility (YAHOO.util.Event).
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance 
* corresponding to the HTMLDivElement that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onDOMEvent = 

    function(p_oEvent, p_oMenuModule) {

        var Event = this._oEventUtil;

        // Map of DOM event types to Custom Event types

        var oEventTypes =  {
                "mousedown": "mouseDownEvent",
                "mouseup": "mouseUpEvent",
                "keydown": "keyDownEvent",
                "keyup": "keyUpEvent",
                "keypress": "keyPressEvent"
            };
    
        var sCustomEventType = oEventTypes[p_oEvent.type];
        
        var oTarget = Event.getTarget(p_oEvent);
    
        /*
            Check if the target was an element that is a part of a 
            an item and (if so), fire the associated custom event.
        */
    
        this._fireItemEvent(oTarget, sCustomEventType, p_oEvent);

    
        // Fire the associated custom event for the MenuModule
    
        this[sCustomEventType].fire(p_oEvent);
    
    
        /*
            Stop the propagation of the event at each MenuModule instance
            since menus can be embedded in eachother.
        */
            
        Event.stopPropagation(p_oEvent);

    };


/**
* "mouseover" event handler for the MenuModule's root HTMLDivElement node.
* @private
* @param {Event} p_oEvent Event object passed back by the event
* utility (YAHOO.util.Event).
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance 
* corresponding to the HTMLDivElement that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onElementMouseOver = 

    function(p_oEvent, p_oMenuModule) {

        var Event = this._oEventUtil;
        var oTarget = Event.getTarget(p_oEvent);
    
        if(
            (
                oTarget == this.element || 
                this._oDom.isAncestor(this.element, oTarget)
            )  && 
            !this._bFiredMouseOverEvent
        ) {
    
            // Fire the "mouseover" Custom Event for the MenuModule instance
    
            this.mouseOverEvent.fire(p_oEvent);
    
            this._bFiredMouseOverEvent = true;
            this._bFiredMouseOutEvent = false;
    
        }
    
    
        /*
            Check if the target was an element that is a part of an item
            and (if so), fire the "mouseover" Custom Event.
        */
    
        if(!this._oCurrentItem) {
    
            this._oCurrentItem = 
                this._fireItemEvent(oTarget, "mouseOverEvent", p_oEvent);
    
        }
    
    
        /*
            Stop the propagation of the event at each MenuModule instance
            since menus can be embedded in eachother.
        */
    
        Event.stopPropagation(p_oEvent);

    };


/**
* "mouseout" event handler for the MenuModule's root HTMLDivElement node.
* @private
* @param {Event} p_oEvent Event object passed back by the event
* utility (YAHOO.util.Event).
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance 
* corresponding to the HTMLDivElement that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onElementMouseOut = 

    function(p_oEvent, p_oMenuModule) {

        var Dom = this._oDom;
        var Event = this._oEventUtil;
        var oRelatedTarget = Event.getRelatedTarget(p_oEvent);
        var bLIMouseOut = true;
        var bMovingToSubmenu = false;
            
    
        // Determine where the mouse is going
    
        if(this._oCurrentItem && oRelatedTarget) {
    
            if(
                oRelatedTarget == this._oCurrentItem.element || 
                Dom.isAncestor(this._oCurrentItem.element, oRelatedTarget)
            ) {
    
                bLIMouseOut = false;
    
            }
    
    
            var oSubmenu = this._oCurrentItem.cfg.getProperty("submenu");
    
            if(
                oSubmenu && 
                (
                    oRelatedTarget == oSubmenu.element ||
                    Dom.isAncestor(oSubmenu.element, oRelatedTarget)
                )
            ) {
    
                bMovingToSubmenu = true;
    
            }
    
        }
    
    
        if(this._oCurrentItem && (bLIMouseOut || bMovingToSubmenu)) {
    
            // Fire the "mouseout" Custom Event for the item
    
            this._oCurrentItem.mouseOutEvent.fire(p_oEvent);
    
            this._oCurrentItem = null;
    
        }
    
    
        if(
            !this._bFiredMouseOutEvent && 
            (
                !Dom.isAncestor(this.element, oRelatedTarget) ||
                bMovingToSubmenu
            )
        ) {
    
            // Fire the "mouseout" Custom Event for the MenuModule instance
    
            this.mouseOutEvent.fire(p_oEvent);
    
            this._bFiredMouseOutEvent = true;
            this._bFiredMouseOverEvent = false;
    
        }
    
    
        /*
            Stop the propagation of the event at each MenuModule instance
            since menus can be embedded in eachother.
        */
    
        Event.stopPropagation(p_oEvent);

    };


/**
* "click" event handler for the MenuModule's root HTMLDivElement node.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance 
* corresponding to the HTMLDivElement that fired the event.
*/         
YAHOO.widget.MenuModule.prototype._onElementClick = 

    function(p_oEvent, p_oMenuModule) {

        var Event = this._oEventUtil;
        
        var oTarget = Event.getTarget(p_oEvent);
        
        /*
            Check if the target was a DOM element that is a part of an
            item and (if so), fire the associated "click" 
            Custom Event.
        */
        
        var oItem = this._fireItemEvent(oTarget, "clickEvent", p_oEvent);
    
        if(oItem) {

            var oSubmenu = oItem.cfg.getProperty("submenu");
    
            /*
                ACCESSIBILITY FEATURE FOR SCREEN READERS: Expand/collapse the
                submenu when the user clicks on the submenu indicator image.
            */        
    
            if(oTarget == oItem.submenuIndicator && oSubmenu) {

                if(oSubmenu.cfg.getProperty("visible")) {
        
                    oSubmenu.hide();
        
                }
                else {

                    var oActiveItem = this.activeItem;
               

                    // Hide any other submenus that might be visible
                
                    if(oActiveItem && oActiveItem != this) {
                
                        this.clearActiveItem();
                
                    }

                    this.activeItem = oItem;
        
                    oItem.cfg.setProperty("selected", true);

                    oSubmenu.show();
        
                }
        
            }
            else {
            
                if(oTarget.tagName == "A") {
    
                    Event.preventDefault(p_oEvent);
                
                }

                var sURL = oItem.cfg.getProperty("url");

                if(sURL.substr((sURL.length-1),1) != "#") {
        
                    document.location = sURL;
                
                }

            }
        
        }


        /*
            Stop the propagation of the event at each MenuModule 
            instance since Menus can be embedded in eachother.
        */

        Event.stopPropagation(p_oEvent);
    
    
        // Fire the associated "click" Custom Event for the MenuModule instance
    
        this.clickEvent.fire(p_oEvent);

    };


// Private Custom Event handlers


/**
* "beforerender" Custom Event handler for a MenuModule instance.  Appends all 
* of the HTMLUListElement (&#60;UL&#60;s) nodes (and their child 
* HTMLLIElement (&#60;LI&#60;)) nodes and their accompanying title nodes to  
* the body of the MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onBeforeRender = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var Dom = this._oDom;
        var oConfig = this.cfg;
        var oEl = this.element;
        var nListElements = this._aListElements.length;
    

        if(oConfig.getProperty("position") == "static") {
    
            oConfig.queueProperty("iframe", false);
            oConfig.queueProperty("visible", true);
            
        }
    
    
        if(nListElements > 0) {
    
            var i = 0;
            var bFirstList = true;
            var oUL;
            var oGroupTitle;
    
    
            do {
    
                oUL = this._aListElements[i];
    
                if(oUL) {
    
                    if(bFirstList) {
            
                        Dom.addClass(oUL, "first-of-type");
                        bFirstList = false;
            
                    }
    
    
                    if(!Dom.isAncestor(oEl, oUL)) {
    
                        this.appendToBody(oUL);
    
                    }
    
    
                    oGroupTitle = this._aGroupTitleElements[i];
    
                    if(oGroupTitle) {
    
                        if(!Dom.isAncestor(oEl, oGroupTitle)) {
    
                            oUL.parentNode.insertBefore(oGroupTitle, oUL);
    
                        }
    
    
                        Dom.addClass(oUL, "hastitle");
    
                    }
    
                }
    
                i++;
    
            }
            while(i < nListElements);
    
        }

    };


/**
* "render" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onRender = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        if(this.cfg.getProperty("position") == "dynamic") {
    
            var sWidth = this.element.parentNode.tagName == "BODY" ? 
                    this.element.offsetWidth : this._getOffsetWidth();
        
            this.cfg.setProperty("width", (sWidth + "px"));
    
        }

    };


/**
* "show" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onShow = 

    function(p_sType, p_aArgs, p_oMenuModule) {
    
        /*
            Setting focus to an item in the newly visible submenu alerts the 
            contents of the submenu to the screen reader.
        */

        this.setInitialFocus();
    
    };


/**
* "hide" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onBeforeHide = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var oActiveItem = this.activeItem;

        if(oActiveItem) {
    
            oActiveItem.blur();

            if(oActiveItem.cfg.getProperty("selected")) {
    
                oActiveItem.cfg.setProperty("selected", false);
    
            }
    
            var oSubmenu = oActiveItem.cfg.getProperty("submenu");
    
            if(oSubmenu && oSubmenu.cfg.getProperty("visible")) {
    
                oSubmenu.hide();
    
            }
    
        }

    };


/**
* "configchange" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that subscribed
* to the event.
*/
YAHOO.widget.MenuModule.prototype._onParentMenuModuleConfigChange = 

    function(p_sType, p_aArgs, p_oSubmenu) {
    
        var sPropertyName = p_aArgs[0][0];
        var oPropertyValue = p_aArgs[0][1];
    
        switch(sPropertyName) {
    
            case "iframe":
            case "constraintoviewport":
    
                p_oSubmenu.cfg.setProperty(sPropertyName, oPropertyValue);
                    
            break;        
            
        }
    
    };


/**
* "render" Custom Event handler for a MenuModule instance.  Renders a  
* submenu in response to the firing of it's parent's "render" event.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that subscribed
* to the event.
*/
YAHOO.widget.MenuModule.prototype._onParentMenuModuleRender = 

    function(p_sType, p_aArgs, p_oSubmenu) {

        /*
            Set the "constraintoviewport" configuration 
            property to match the parent MenuModule
        */ 
    
        var oParentMenu = p_oSubmenu.parent.parent;

        var oConfig = {

                constraintoviewport: 
                    oParentMenu.cfg.getProperty("constraintoviewport"),
    
                xy: [0,0]
    
            };


        /*
            Only sync the "iframe" configuration property if the parent
            MenuModule instance's position is of the same value
        */

        if(
            this.cfg.getProperty("position") == 
            oParentMenu.cfg.getProperty("position")
        ) {

            oConfig.iframe = oParentMenu.cfg.getProperty("iframe");
        
        }
                   

        p_oSubmenu.cfg.applyConfig(oConfig);
        

        if(this._oDom.inDocument(this.element)) {
    
            this.render();
    
        }
        else {
    
            this.render(this.parent.element);
    
        }
    
    };


/**
* "beforeshow" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuBeforeShow = 

    function(p_sType, p_aArgs, p_oSubmenu) {
    
        var oParent = this.parent;
        var aAlignment = oParent.parent.cfg.getProperty("submenualignment");

        this.cfg.setProperty(
            "context", 
            [
                oParent.element, 
                aAlignment[0], 
                aAlignment[1]
            ]
        );

        oParent.submenuIndicator.alt = 
            oParent.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
    
    };


/**
* "show" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuShow = 

    function(p_sType, p_aArgs, p_oSubmenu) {
    
        var oParent = this.parent;

        oParent.submenuIndicator.alt = 
            oParent.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
    
    };


/**
* "hide" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuHide = 

    function(p_sType, p_aArgs, p_oSubmenu) {
    
        var oParent = this.parent;

        if(oParent.parent.cfg.getProperty("visible")) {

            oParent.cfg.setProperty("selected", false);
    
            oParent.focus();
        
        }

        oParent.submenuIndicator.alt = 
            oParent.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
    
    };


/**
* "focus" YAHOO.util.CustomEvent handler for a MenuModule instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onItemFocus = 

    function(p_sType, p_aArgs, p_aObjects) {
    
        var me = p_aObjects[0];
        var oItem = p_aObjects[1];
    
        me.activeItem = oItem;
    
    };


/**
* "blur" YAHOO.util.CustomEvent handler for a MenuModule instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onItemBlur = 

    function(p_sType, p_aArgs, p_aObjects) {
    
        var me = p_aObjects[0];
        var oItem = p_aObjects[1];
        var oSubmenu = oItem.cfg.getProperty("submenu");
    
        if(!oSubmenu || (oSubmenu && !oSubmenu.cfg.getProperty("visible"))) {
    
            me.activeItem = null;
    
        }
    
    };


/**
* "configchange" YAHOO.util.CustomEvent handler for the MenuModule 
* instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the 
* event was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onItemConfigChange = 

    function(p_sType, p_aArgs, p_aObjects) {

        var me = p_aObjects[0];    
        var sProperty = p_aArgs[0][0];
        var oItem = p_aObjects[1];
    
        switch(sProperty) {
    
            case "submenu":
    
                var oSubmenu = p_aArgs[0][1];
    
                if(oSubmenu) {
    
                    me._configureItemSubmenuModule(oItem);
    
                }
    
            break;
    
            case "text":
            case "helptext":
    
                /*
                    A change to an item's "text" or "helptext"
                    configuration properties requires the width of the parent
                    MenuModule instance to be recalculated.
                */
    
                if(me.element.style.width) {
        
                    var sWidth = me._getOffsetWidth() + "px";
    
                    me._oDom.setStyle(me.element, "width", sWidth);
    
                }
    
            break;
    
        }
    
    };


/**
* The default event handler executed when the moveEvent is fired, if the 
* "constraintoviewport" configuration property is set to true.
*/
YAHOO.widget.MenuModule.prototype.enforceConstraints = 

    function(type, args, obj) {

        var Dom = this._oDom;
        var oConfig = this.cfg;
    
        var pos = args[0];
            
        var x = pos[0];
        var y = pos[1];
        
        var bod = document.getElementsByTagName('body')[0];
        var htm = document.getElementsByTagName('html')[0];
        
        var bodyOverflow = Dom.getStyle(bod, "overflow");
        var htmOverflow = Dom.getStyle(htm, "overflow");
        
        var offsetHeight = this.element.offsetHeight;
        var offsetWidth = this.element.offsetWidth;
        
        var viewPortWidth = Dom.getClientWidth();
        var viewPortHeight = Dom.getClientHeight();
        
        var scrollX = window.scrollX || document.body.scrollLeft;
        var scrollY = window.scrollY || document.body.scrollTop;
        
        var topConstraint = scrollY + 10;
        var leftConstraint = scrollX + 10;
        var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
        var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;
        
        var aContext = oConfig.getProperty("context");
        var oContextElement = aContext ? aContext[0] : null;
    
    
        if (x < 10) {
    
            x = leftConstraint;
    
        } else if ((x + offsetWidth) > viewPortWidth) {
    
            if(
                oContextElement && 
                ((x - oContextElement.offsetWidth) > offsetWidth)
            ) {
    
                x = (x - (oContextElement.offsetWidth + offsetWidth));
    
            }
            else {
    
                x = rightConstraint;
    
            }
    
        }
    
        if (y < 10) {
    
            y = topConstraint;
    
        } else if (y > bottomConstraint) {
    
            if(oContextElement && (y > offsetHeight)) {
    
                y = ((y + oContextElement.offsetHeight) - offsetHeight);
    
            }
            else {
    
                y = bottomConstraint;
    
            }
    
        }
    
        oConfig.setProperty("x", x, true);
        oConfig.setProperty("y", y, true);
    
    };


// Event handlers for configuration properties

/**
* Event handler for when the "position" configuration property of a
* MenuModule changes.
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance fired
* the event.
*/
YAHOO.widget.MenuModule.prototype.configPosition = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var sCSSPosition = p_aArgs[0] == "static" ? "static" : "absolute";
    
        this._oDom.setStyle(this.element, "position", sCSSPosition);
    
    };


/**
* Event handler for when the "iframe" configuration property of a
* MenuModule changes.
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance fired
* the event.
* @see YAHOO.widget.Overlay#configIframe
*/
YAHOO.widget.MenuModule.prototype.configIframe = 

    function(p_sType, p_aArgs, p_oMenuModule) {    

        if(this.cfg.getProperty("position") == "dynamic") {

            YAHOO.widget.MenuModule.superclass.configIframe.call(
                this, 
                p_sType, 
                p_aArgs, 
                p_oMenuModule
            );
    
        }
    
    };
    
// Public methods

YAHOO.widget.MenuModule.prototype.toString = function() {

    return ("Menu " + this.id);

};


/**
* Sets the title of a group of items.
* @param {String} p_sGroupTitle The title of the group.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the title belongs.
*/
YAHOO.widget.MenuModule.prototype.setItemGroupTitle = 

    function(p_sGroupTitle, p_nGroupIndex) {
        
        if(typeof p_sGroupTitle == "string" && p_sGroupTitle.length > 0) {
    
            var Dom = this._oDom;

            var nGroupIndex = 
                    typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0;
    
            var oTitle = this._aGroupTitleElements[nGroupIndex];
    
    
            if(oTitle) {
    
                oTitle.innerHTML = p_sGroupTitle;
                
            }
            else {
    
                oTitle = document.createElement(this.GROUP_TITLE_TAG_NAME);
                        
                oTitle.innerHTML = p_sGroupTitle;
    
                this._aGroupTitleElements[nGroupIndex] = oTitle;
    
            }
    
    
            var i = this._aGroupTitleElements.length - 1;
            var nFirstIndex;
    
            do {
    
                if(this._aGroupTitleElements[i]) {
    
                    Dom.removeClass(
                        this._aGroupTitleElements[i],
                        "first-of-type"
                    );

                    nFirstIndex = i;
    
                }
    
            }
            while(i--);
    
    
            if(nFirstIndex !== null) {
    
                Dom.addClass(
                    this._aGroupTitleElements[nFirstIndex], 
                    "first-of-type"
                );
    
            }
    
        }
    
    };


/**
* Appends the specified item to a MenuModule instance.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be added.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return The item that was added to the MenuModule.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.addItem = function(p_oItem, p_nGroupIndex) {

    if(p_oItem) {

        return this._addItemToGroup(p_nGroupIndex, p_oItem);
        
    }

};


/**
* Inserts an item into a MenuModule instance at the specified index.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be inserted.
* @param {Number} p_nItemIndex Number indicating the ordinal position 
* at which the item should be added.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return The item that was inserted into the MenuModule.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.insertItem = 

    function(p_oItem, p_nItemIndex, p_nGroupIndex) {
    
        if(p_oItem) {
    
            return this._addItemToGroup(p_nGroupIndex, p_oItem, p_nItemIndex);
    
        }
    
    };


/**
* Removes the specified item from a MenuModule instance.
* @param {YAHOO.widget.MenuModuleItem/Number} p_oObject The item or index of 
* the item to be removed.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return The item that was removed from the MenuModule.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.removeItem =

    function(p_oObject, p_nGroupIndex) {
    
        if(typeof p_oObject != "undefined") {
    
            var oItem;
    
            if(p_oObject instanceof YAHOO.widget.MenuModuleItem) {
    
                oItem = 
                    this._removeItemFromGroupByValue(p_nGroupIndex, p_oObject);           
    
            }
            else if(typeof p_oObject == "number") {
    
                oItem = 
                    this._removeItemFromGroupByIndex(p_nGroupIndex, p_oObject);
    
            }
    
            if(oItem) {
    
                oItem.destroy();

                this.logger.log("Item removed." + 
                    " Text: " + oItem.cfg.getProperty("text") + ", " + 
                    " Index: " + oItem.index + ", " + 
                    " Group Index: " + oItem.groupIndex);
    
                return oItem;
    
            }
    
        }
    
    };


/**
* Returns a multi-dimensional array of all of a MenuModule's items.
* @return An array of items.
* @type Array
*/        
YAHOO.widget.MenuModule.prototype.getItemGroups = function() {

    return this._aItemGroups;

};


/**
* Returns the item at the specified index.
* @param {Number} p_nItemIndex Number indicating the ordinal position of the 
* item to be retrieved.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return An item.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.getItem = 

    function(p_nItemIndex, p_nGroupIndex) {
    
        if(typeof p_nItemIndex == "number") {
    
            var aGroup = this._getItemGroup(p_nGroupIndex);
    
            if(aGroup) {
    
                return aGroup[p_nItemIndex];
            
            }
    
        }
    
    };


/**
* Removes the MenuModule instance's element from the DOM and sets all child 
* elements to null.
*/
YAHOO.widget.MenuModule.prototype.destroy = function() {

    // Remove DOM event handlers

    this._oEventUtil.purgeElement(this.element);


    // Remove Custom Event listeners

    this.mouseOverEvent.unsubscribeAll();
    this.mouseOutEvent.unsubscribeAll();
    this.mouseDownEvent.unsubscribeAll();
    this.mouseUpEvent.unsubscribeAll();
    this.clickEvent.unsubscribeAll();
    this.keyPressEvent.unsubscribeAll();
    this.keyDownEvent.unsubscribeAll();
    this.keyUpEvent.unsubscribeAll();
    this.beforeMoveEvent.unsubscribeAll();


    var nItemGroups = this._aItemGroups.length;
    var nItems;
    var oItemGroup;
    var oItem;
    var i;
    var n;


    // Remove all items

    if(nItemGroups > 0) {

        i = nItemGroups - 1;

        do {

            oItemGroup = this._aItemGroups[i];

            if(oItemGroup) {

                nItems = oItemGroup.length;
    
                if(nItems > 0) {
    
                    n = nItems - 1;
        
                    do {

                        oItem = this._aItemGroups[i][n];

                        if(oItem) {
        
                            oItem.destroy();
                        }
        
                    }
                    while(n--);
    
                }

            }

        }
        while(i--);

    }        


    // Continue with the superclass implementation of this method

    YAHOO.widget.MenuModule.superclass.destroy.call(this);
    
    this.logger.log("Destroyed.");

};




/**
* Sets focus to a MenuModule instance's first enabled item.
*/
YAHOO.widget.MenuModule.prototype.setInitialFocus = function() {

    var oItem = this._getFirstEnabledItem();
    
    if(oItem) {
    
        oItem.focus();
    }
    
};


/**
* Sets the "selected" configuration property of a MenuModule instance's first
* enabled item to "true."
*/
YAHOO.widget.MenuModule.prototype.setInitialSelection = function() {

    var oItem = this._getFirstEnabledItem();
    
    if(oItem) {
    
        oItem.cfg.setProperty("selected", true);
    }        

};


/**
* Sets the "selected" configuration property of a MenuModule instance's active 
* item to "false," blurs the item and hide's the item's submenu.
*/
YAHOO.widget.MenuModule.prototype.clearActiveItem = function () {

    if(this.activeItem) {

        var oConfig = this.activeItem.cfg;

        oConfig.setProperty("selected", false);

        var oSubmenu = oConfig.getProperty("submenu");

        if(oSubmenu) {

            oSubmenu.hide();

        }

    }

};


/**
* Initializes the class's configurable properties which can be changed using 
* the MenuModule's Config object (cfg).
*/
YAHOO.widget.MenuModule.prototype.initDefaultConfig = function() {

    YAHOO.widget.MenuModule.superclass.initDefaultConfig.call(this);

    var oConfig = this.cfg;

	// Add configuration properties

    oConfig.addProperty(
        "position", 
        {
            value: "dynamic", 
            handler: this.configPosition, 
            validator: this._checkPosition 
        } 
    );

    oConfig.addProperty("submenualignment", { value: ["tl","tr"] } );

};
