const SmartyTabs = (() => {
    class $ {
        /**
         * @param init {string} document.querySelector() initial class name
         * @param userConfig {object} user tab config
         * @class SmartyTabs
         * @constructor
         */
        constructor( init, userConfig ) {
            this.initClass = init;
            this.config = userConfig || {};
            
            if( $._checkClass( init ) ) this._initTab();
        }
        
        /**
         *  check for class name
         *
         * @param className
         * @returns {boolean}
         * @private
         */
        static _checkClass( className ) {
            if( !!document.querySelector( className ) ) {
                return true;
            } else {
                console.error( `class "${className}" not found` );
                return false;
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
            if( $._checkClass( single ) ) {
                return collection ? document.querySelectorAll( single ) : document.querySelector( single );
            }
        }
        
        /**
         * init tab
         *
         * @private
         */
        _initTab() {
            this._startTab();
            this._resizeWindow();
            this._controller();
        }
        
        /**
         * verification of the conditions for positioning
         *
         * @returns {boolean}
         * @private
         */
        _checkScreen() {
            const { tabSlide, maxScreen, navList } = this._config();
            const listWidth = $._el( navList ).offsetWidth;
            
            return (tabSlide && maxScreen <= window.innerWidth) ||
                (tabSlide && listWidth > window.innerWidth)
        }
        
        /**
         * default config
         *
         * @returns {{startIndex: number, tabSlide: boolean, maxScreen: number, container: string, navWrapper: string,
         *     navList: string, navItems: string, contentWrapper: string, contentItems: string, activeClass: {nav:
         *     (string), content: (string)}}}
         * @private
         */
        _config() {
            const startIndex = 0;
            const tabSlide = true;
            const maxScreen = 650;
            const navWrapper = '.smarty-controller';
            const navList = `${navWrapper}__list`;
            const navItems = `${navWrapper}__item`;
            const contentWrapper = '.smarty-content';
            const contentItems = `${contentWrapper}__item`;
            const activeClass = {
                nav    : `${navWrapper}__item--active`.replace( /\./, '' ),
                content: `${contentWrapper}__item--active`.replace( /\./, '' )
            };
            
            const init = this.initClass;
            const userConfig = this.config;
            
            return {
                startIndex    : userConfig.startIndex || startIndex,
                tabSlide      : userConfig.tabSlide || tabSlide,
                maxScreen     : userConfig.maxScreen || maxScreen,
                navWrapper    : `${init} ${( userConfig.navWrapper || navWrapper )}`,
                navList       : `${init} ${( userConfig.navList || navList )}`,
                navItems      : `${init} ${( userConfig.navItems || navItems)}`,
                contentWrapper: `${init} ${( userConfig.contentWrapper || contentWrapper )}`,
                contentItems  : `${init} ${( userConfig.contentItems || contentItems )}`,
                activeClass   : {
                    nav    : userConfig.activeController || activeClass.nav,
                    content: userConfig.activeContent || activeClass.content
                }
            }
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
                const { contentItems, activeClass } = this._config();
                
                if( targetIndex + 1 ) {
                    $._el( contentItems, true )[ targetIndex ].classList.add( activeClass.content );
                    
                    target.classList.add( activeClass.nav );
                }
                
            };
            $._el( this._config().navList ).addEventListener( 'click', useTab );
        }
        
        /**
         * navigation positioning
         * set tab position on center
         *
         * @param el {object} document.querySelector()
         * @private
         */
        _tabPosition( el ) {
            let list = $._el( this._config().navList );
            let positionX = el ? (list.offsetWidth / 2 - el.offsetWidth / 2) - el.offsetLeft : 0;
            const offsetRight = list.scrollWidth - document.body.clientWidth;
            
            if( -positionX > offsetRight ) {
                list.style.transform = `translate(${ -offsetRight }px)`;
            } else {
                positionX = positionX > 0 ? 0 : positionX;
                list.style.transform = `translate(${ positionX }px)`;
            }
            
        }
        
        /**
         * removal of active classes with elements
         *
         * @private
         */
        _removeActiveClass() {
            const { navItems, contentItems, activeClass } = this._config();
            
            let itemsCollection = [
                {
                    items : $._el( navItems, true ),
                    active: activeClass.nav
                },
                {
                    items : $._el( contentItems, true ),
                    active: activeClass.content
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
            const { navItems, contentItems, activeClass, startIndex } = this._config();
            
            $._el( navItems, true )[ startIndex ].classList.add( activeClass.nav );
            $._el( contentItems, true )[ startIndex ].classList.add( activeClass.content );
        }
        
        /**
         * get active tab item index
         *
         * @param el {object} document.querySelector() javascript element
         * @returns {number}
         * @private
         */
        _targetTabIndex( el ) {
            let navList = Array.prototype.slice.call( $._el( this._config().navItems, true ) );
            return navList.indexOf( el );
        }
        
    }
    
    return $;
})();

/**
 * @param init {string} class, id, ...
 * @param parameters {object} user config
 * @returns {object} new tab object
 */
export default function( init, parameters ) {
    return new SmartyTabs( init, parameters );
}