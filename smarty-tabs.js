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

            if( $._isExistClass(init) ) this.init();
        }

        /**
         * Checking the existence of a class
         * @param className
         * @returns {boolean}
         * @private
         */
        static _isExistClass( className ) {
            if( !!document.querySelector(className) ) {
                return true;
            } else {
                console.error(`Сannot find class "${className}", сheck the correctness of the input`);
                return false;
            }
        }

        /**
         * Get JavaScript element
         * @param single {string} class, id, ...
         * @param collection {boolean} if need element collection
         * @returns {object} document.querySelector
         * @private
         */
        static _el( single, collection ) {
            if( $._isExistClass(single) ) {
                return collection
                        ? document.querySelectorAll(single)
                        : document.querySelector(single);
            }
        }

        /**
         * Helper function
         * @param array {Array}
         * @param callback {function}
         * @private
         */
        static _each( array, callback ) {
            for( let i = array.length - 1; i >= 0; i-- ) {
                callback(array[i]);
            }
        }

        /**
         * Default config
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
                nav    : `${navWrapper}__item--active`.replace(/\./, ''),
                content: `${contentWrapper}__item--active`.replace(/\./, '')
            };

            return {
                startIndex    : this.config.startIndex || startIndex,
                tabSlide      : this.config.hasOwnProperty('tabSlide') ? this.config.tabSlide : tabSlide,
                maxScreen     : this.config.maxScreen || maxScreen,
                navWrapper    : `${this.initClass} ${( this.config.navWrapper || navWrapper )}`,
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

        _eventFunc() {
            /**
             * Polyfill for CustomEvent
             */
            try {
                new CustomEvent("IE has CustomEvent, but doesn't support constructor");
            } catch( e ) {
                window.CustomEvent = function( event, params ) {
                    let evt;
                    params = params || {
                                bubbles   : false,
                                cancelable: false,
                                detail    : undefined
                            };
                    evt = document.createEvent("CustomEvent");
                    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                    return evt;
                };
                CustomEvent.prototype = Object.create(window.Event.prototype);
            }

            /**
             * Create custom change event
             */
            const initCustomChange = new CustomEvent('change.custom', {
                bubbles   : true,
                cancelable: true
            });

            const that = this;
            const { navList, contentItems, activeClass } = that._config();

            const contentElem = $._el(contentItems, true);
            const navListElem = $._el(navList);

            let activeControllerIndex = that._config().startIndex;

            /**
             * Callback event function
             *
             * @param event
             */
            function tabController( event ) {
                event.preventDefault();
                let target = event.target;

                while( target.tagName !== 'UL' ) {
                    if( target.tagName === 'LI' ) break;
                    target = target.parentNode;
                }

                if( target.tagName !== 'LI' ) return;

                if( activeControllerIndex !== that._targetTabIndex(target) ) {
                    that._removeActiveClass();
                    activeControllerIndex = that._targetTabIndex(target);

                    if( that._checkScreen() ) that._tabPosition(target);

                    if( activeControllerIndex + 1 ) {
                        contentElem[activeControllerIndex].classList.add(activeClass.content);

                        target.classList.add(activeClass.nav);
                    }

                    target.dispatchEvent(initCustomChange);
                }
            }

            /**
             * Callback event function
             */
            function windowResize() { if( that._checkScreen() ) that._tabPosition() }

            /**
             * @param callback {function} User callback
             * @returns {Function} Callback event function
             */
            function customChange( callback ) {
                return function( event ) {
                    const activeController = event.target;
                    const activeContent = contentElem[activeControllerIndex];

                    if( callback ) callback(activeControllerIndex, activeController, activeContent);
                };
            }

            /**
             *  Function for init and destroy listener
             */
            return this.config.functions
                    ? this.config.functions
                    : this.config.functions = {
                /**
                 * Main initial listener
                 */
                initController() {
                    navListElem.addEventListener('click', tabController);
                },
                /**
                 * Window resize listener
                 */
                initResize() {
                    window.addEventListener('resize', windowResize);
                },
                /**
                 * Custom tabs change listener
                 * @param callback {function} User callback function
                 */
                initCustomChange( callback ) {
                    !that.config.hasOwnProperty('customChange') ? that.config.customChange = customChange(callback) :
                            that.config.customChange;

                    navListElem.addEventListener('change.custom', that.config.customChange);
                },
                /**
                 * DESTROY main initial listener
                 */
                destroyController() {
                    navListElem.removeEventListener('click', tabController);
                },
                /**
                 * DESTROY window resize listener
                 */
                destroyResize() {
                    window.removeEventListener('click', windowResize);
                },
                /**
                 * DESTROY custom tabs change listener
                 */
                destroyCustomChange() {
                    navListElem.removeEventListener('change.custom', that.config.customChange);
                }
            }
        }

        /**
         * Verification of the conditions for positioning
         * @returns {boolean}
         * @private
         */
        _checkScreen() {
            const { tabSlide, maxScreen, navList, navWrapper } = this._config();
            const navListWidth = $._el(navList).offsetWidth;
            const navWrapperWidth = $._el(navWrapper).offsetWidth;

            return (tabSlide && navListWidth > navWrapperWidth) ||
                    (tabSlide && maxScreen >= navWrapperWidth);
        }

        /**
         * Set active tab position
         * @param el {object} document.querySelector()
         * @private
         */
        _tabPosition( el ) {
            const { navList, navWrapper } = this._config();
            const navListElem = $._el(navList, false);
            const navWrapperElem = $._el(navWrapper, false);

            let positionX = el ? (navWrapperElem.offsetWidth / 2 - el.offsetWidth / 2) - el.offsetLeft : 0;
            const offsetRight = navWrapperElem.scrollWidth - navWrapperElem.clientWidth;

            if( -positionX > offsetRight ) {
                navListElem.style.transform = `translate(${ -offsetRight }px)`;
            } else {
                positionX = positionX > 0 ? 0 : positionX;
                navListElem.style.transform = `translate(${ positionX }px)`;
            }

        }

        /**
         * removal of active classes with elements
         * @private
         */
        _removeActiveClass() {
            const { navItems, contentItems, activeClass } = this._config();
            const itemsCollection = [
                {
                    elem  : $._el(navItems, true),
                    active: activeClass.nav
                }, {
                    elem  : $._el(contentItems, true),
                    active: activeClass.content
                }
            ];
            $._each(itemsCollection, ( items ) => {
                $._each(items.elem, ( elem ) => {
                    elem.classList.remove(items.active);
                })
            })
        }

        /**
         * set start index for element
         * @private
         */
        _startTab() {
            const { navItems, contentItems, activeClass, startIndex } = this._config();
            const navItem = $._el(navItems, true);
            const contentItem = $._el(contentItems, true)[startIndex];

            if( navItem.length - 1 > startIndex ) {
                navItem[startIndex].classList.add(activeClass.nav);
                contentItem.classList.add(activeClass.content);
                this._tabPosition(navItem);
            } else console.error(`Worn index, set index between 0-${navItem.length - 1}`)

        }

        /**
         * Get active tab index
         * @param el {object} document.querySelector() javascript element
         * @returns {number}
         * @private
         */
        _targetTabIndex( el ) {
            let navList = Array.prototype.slice.call($._el(this._config().navItems, true));

            return navList.indexOf(el);
        }

        /**
         * Init tabs
         * @private
         */
        init() {
            const { initController, initResize } = this._eventFunc();

            this._startTab();
            initController();
            initResize();
        }

        /**
         * Listener tabs change
         * @param callback {function} User callback function
         */
        change( callback ) {
            const { initCustomChange } = this._eventFunc();

            initCustomChange(callback);
        }

        /**
         *  Destroy tabs listener
         */
        destroy() {
            const { destroyController, destroyResize, destroyCustomChange } = this._eventFunc();

            destroyCustomChange();
            destroyController();
            destroyResize();
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
    return new SmartyTabs(init, parameters);
}