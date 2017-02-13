class SmatryTabs {
    constructor( init, userConfig ) {
        this.config = userConfig || {};
        this.initClass = init;
        
        /**
         * init first tab on load
         */
        this._startTab();
        
        /**
         * resize event
         */
        window.addEventListener( 'resize', () => {
            if( this._checkWidth() ) this._tabPosition();
        } );
        /**
         * click event
         */
        if( SmatryTabs._el( this._navList() ) ) {
            SmatryTabs._el( this._navList() ).addEventListener( 'click', ( event ) => {
                event.preventDefault();
                let target = event.target;
                
                while( target.tagName !== 'UL' ) {
                    if( target.tagName === 'LI' ) break;
                    target = target.parentNode;
                }
                
                if( !this._checkWidth() ) this._tabPosition( target );
                
                this._removeActiveClass();
                
                /**
                 * add active class for tab item
                 */
                let targetIndex = this._targetTabIndex( target );
                
                /**
                 * add active tabs for content item
                 */
                if( targetIndex + 1 ) {
                    SmatryTabs._el( this._contentItems(), true )[ targetIndex ]
                        .classList.add( this._activeClass().content );
                    target.classList.add( this._activeClass().nav );
                }
                
            } );
        }
    }
    
    /**
     * starting at boot element
     * @returns {number}
     * @private
     */
    _startIndex() { return this.config.startIndex || 0 }
    
    /**
     * centering element when clicked
     * @returns {boolean}
     * @private
     */
    _tabSlide() { return this.config.tabSlide || true }
    
    /**
     * with resolution of of the tab will be centering
     * @returns {number}
     * @private
     */
    _maxScreen() { return this.config.maxScreen || 650 }
    
    /**
     * container class, id ...
     * @returns {string}
     * @private
     */
    _container() { return this.initClass + ( this.config.container || '.smarty-tabs' ) }
    
    /**
     * navigation wrapper class, id ...
     * @returns {string}
     * @private
     */
    _navWrapper() { return `${this.initClass}` + ( this.config.navWrapper || '.smarty-controller' ) }
    
    /**
     * navigation tab list(ul) class, id ...
     * @returns {string}
     * @private
     */
    _navList() { return `${this.initClass} ` + ( this.config.navList || '.smarty-controller__list') }
    
    /**
     * navigation tab items(li) class, id ...
     * @returns {string}
     * @private
     */
    _navItems() { return `${this.initClass} ` + ( this.config.navItems || '.smarty-controller__item') }
    
    /**
     * content wrapper class, id ...
     * @returns {string}
     * @private
     */
    _contentWrapper() { return `${this.initClass} ` + ( this.config.contentWrapper || '.smarty-content') }
    
    /**
     * content items class, id ...
     * @returns {string}
     * @private
     */
    _contentItems() { return `${this.initClass} ` + ( this.config.contentItems || '.smarty-content__item' ) }
    
    /**
     * active class for items
     * @returns {{nav: (string), content: (string)}}
     * @private
     */
    _activeClass() {
        return {
            nav    : this.config.activeController || 'smarty-controller__item--active',
            content: this.config.activeContent || 'smarty-content__item--active'
        }
    }
    
    /**
     *
     * @param single [class, id, ... ]
     * @param collection [true - if need element collection]
     * @returns {querySelector}
     * @private
     */
    static _el( single, collection ) {
        return collection ? document.querySelectorAll( single ) : document.querySelector( single )
    }
    
    /**
     * navigation positioning
     * @param el [javascript element]
     * @private
     */
    _tabPosition( el ) {
        let list = SmatryTabs._el( this._navList() );
        let positionX = el ? ( list.offsetWidth / 2 - el.offsetWidth / 2) - el.offsetLeft : 0;
        list.style.transform = `translate(${positionX}px)`;
    }
    
    /**
     * verification of the conditions for positioning
     * @returns {boolean}
     * @private
     */
    _checkWidth() {
        return (this._tabSlide() && this._maxScreen() <= window.innerWidth) ||
            ( SmatryTabs._el( this._navList() ).offsetWidth > window.innerWidth && this._tabSlide())
    }
    
    /**
     * removal of active classes with elements
     * @private
     */
    _removeActiveClass() {
        let itemsCollection = [
            {
                items : SmatryTabs._el( this._navItems(), true ),
                active: this._activeClass().nav
            },
            {
                items : SmatryTabs._el( this._contentItems(), true ),
                active: this._activeClass().content
            }
        ];
        itemsCollection.forEach( ( list ) => {
            list.items.forEach( ( item ) => {
                item.classList.remove( list.active );
            } )
        } )
    }
    
    /**
     * set start index for element
     * @private
     */
    _startTab() {
        SmatryTabs._el( this._navItems(), true )[ this._startIndex() ]
            .classList.add( this._activeClass().nav );
        SmatryTabs._el( this._contentItems(), true )[ this._startIndex() ]
            .classList.add( this._activeClass().content );
    }
    
    /**
     * get active tab item index
     * @param el [javascript element]
     * @returns {Number|number}
     * @private
     */
    _targetTabIndex( el ) {
        let navList = Array.prototype.slice.call( SmatryTabs._el( this._navItems(), true ) );
        return navList.indexOf( el );
    }
    
}
/**
 *
 * @param init [class, id, ... ]
 * @param parameters [user config]
 * @returns {SmatryTabs}
 */
export default function( init, parameters ) {
    return new SmatryTabs( init, parameters );
}