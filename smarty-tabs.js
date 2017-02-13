class SmartyTabs {
    /**
     *
     * @param init {string} document.querySelector() initial class name
     * @param userConfig {object} user tab config
     * @class SmartyTabs
     * @constructor
     */
    constructor( init, userConfig ) {
        
        this.config = userConfig || {};
        this.initClass = init;
        
        this._initTab();
    }
    
    /**
     * init tab
     * @private
     */
    _initTab() {
        if( this._checkInit() ) {
            this._startTab();
            this._resizeWindow();
            this._controller();
        } else console.error( 'Check the input class init or transmitted settings' );
    }
    
    /**
     * default config
     * @returns {{startIndex: number, tabSlide: boolean, maxScreen: number, container: string, navWrapper: string,
     *     navList: string, navItems: string, contentWrapper: string, contentItems: string, activeClass: {nav:
     *     (string), content: (string)}}}
     * @private
     */
    _config() {
        const startIndex = 0;
        const tabSlide = true;
        const maxScreen = 650;
        const container = '.smarty-tabs';
        const navWrapper = '.smarty-controller';
        const navList = '.smarty-controller__list';
        const navItems = '.smarty-controller__item';
        const contentWrapper = '.smarty-content';
        const contentItems = '.smarty-content__item';
        const activeClass = {
            nav    : 'smarty-controller__item--active',
            content: 'smarty-content__item--active'
        };
        return {
            startIndex    : this.config.startIndex || startIndex,
            tabSlide      : this.config.tabSlide || tabSlide,
            maxScreen     : this.config.maxScreen || maxScreen,
            container     : this.initClass + ( this.config.container || container ),
            navWrapper    : `${this.initClass}${( this.config.navWrapper || navWrapper )}`,
            navList       : `${this.initClass} ${( this.config.navList || navList )}`,
            navItems      : `${this.initClass} ${( this.config.navItems || navItems)}`,
            contentWrapper: `${this.initClass} ${( this.config.contentWrapper || contentWrapper )}`,
            contentItems  : `${this.initClass} ${( this.config.contentItems || contentItems )}`,
            activeClass   : {
                nav    : this.config.activeController || activeClass.nav,
                content: this.config.activeContent || activeClass.content
            }
        }
    }
    
    /**
     * get element
     *
     * @param single {string} class, id, ...
     * @param collection {boolean} if need element collection
     * @returns {object} document.querySelector
     * @private
     */
    static _el( single, collection ) {
        return collection ? document.querySelectorAll( single ) : document.querySelector( single )
    }
    
    /**
     * event resize
     * check current window screen and max screen
     *
     * @private
     */
    _resizeWindow() {
        window.addEventListener( 'resize', () => {
            if( this._checkScreen() ) this._tabPosition();
        } );
    }
    
    /**
     * main controller settings
     *
     * @private
     */
    _controller() {
        const useTab = ( event ) => {
            event.preventDefault();
            let target = event.target;
            
            while( target.tagName !== 'UL' ) {
                if( target.tagName === 'LI' ) break;
                target = target.parentNode;
            }
            
            if( !this._checkScreen() ) this._tabPosition( target );
            
            this._removeActiveClass();
            
            // add for current item active class
            let targetIndex = this._targetTabIndex( target );
            
            if( targetIndex + 1 ) {
                SmartyTabs._el( this._config().contentItems, true )[ targetIndex ]
                    .classList.add( this._config().activeClass.content );
                target.classList.add( this._config().activeClass.nav );
            }
            
        };
        if( SmartyTabs._el( this._config().navList ) ) {
            SmartyTabs._el( this._config().navList ).addEventListener( 'click', useTab );
        }
    }
    
    /**
     * check init class
     *
     * @returns {boolean}
     * @private
     */
    _checkInit() {
        return typeof(this.initClass) === 'string' && this.initClass !== undefined;
    }
    
    /**
     * navigation positioning
     * set tab position on center
     *
     * @param el {object} document.querySelector()
     * @private
     */
    _tabPosition( el ) {
        let list = SmartyTabs._el( this._config().navList );
        let positionX = el ? ( list.offsetWidth / 2 - el.offsetWidth / 2) - el.offsetLeft : 0;
        list.style.transform = `translate(${positionX}px)`;
    }
    
    /**
     * verification of the conditions for positioning
     *
     * @returns {boolean}
     * @private
     */
    _checkScreen() {
        return (this._config().tabSlide && this._config().maxScreen <= window.innerWidth) ||
            ( SmartyTabs._el( this._config().navList ).offsetWidth > window.innerWidth && this._config().tabSlide )
    }
    
    /**
     * removal of active classes with elements
     *
     * @private
     */
    _removeActiveClass() {
        let itemsCollection = [
            {
                items : SmartyTabs._el( this._config().navItems, true ),
                active: this._config().activeClass.nav
            },
            {
                items : SmartyTabs._el( this._config().contentItems, true ),
                active: this._config().activeClass.content
            }
        ];
        for( let i = itemsCollection.length - 1; i >= 0; i-- ) {
            for( let j = itemsCollection[ i ].items.length - 1; j >= 0; j-- ) {
                itemsCollection[ i ].items[ j ].classList.remove( itemsCollection[ i ].active );
            }
        }
    }
    
    /**
     * set start index for element
     *
     * @private
     */
    _startTab() {
        SmartyTabs._el( this._config().navItems, true )[ this._config().startIndex ]
            .classList.add( this._config().activeClass.nav );
        SmartyTabs._el( this._config().contentItems, true )[ this._config().startIndex ]
            .classList.add( this._config().activeClass.content );
    }
    
    /**
     * get active tab item index
     *
     * @param el {object} document.querySelector() javascript element
     * @returns {number}
     * @private
     */
    _targetTabIndex( el ) {
        let navList = Array.prototype.slice.call( SmartyTabs._el( this._config().navItems, true ) );
        return navList.indexOf( el );
    }
    
}

/**
 * @param init {string} class, id, ...
 * @param parameters {object} user config
 * @returns {object} new tab object
 */
export default function( init, parameters ) {
    return new SmartyTabs( init, parameters );
}