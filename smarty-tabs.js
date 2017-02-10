const SmartyTabs = (() => {
    function SmartyTabs( initClass, config ) {
        if( !(this instanceof SmartyTabs) ) return new SmartyTabs( initClass, config );
        if( initClass ) {
            const userConfig = config || {};
            const init = initClass || '';
            const that = this;
            
            // config
            const $ = {
                startIndex     : userConfig.startIndex || that._startIndex,
                container      : userConfig.container
                    ? `${init}${userConfig.container}`
                    : `${init}${that._container}`,
                navContainer   : userConfig.navContainer || that._navContainer,
                navList        : that._getEl( userConfig.navList
                    ? `${init} ${userConfig.navList}`
                    : `${init} ${that._navList}` ),
                navItems       : that._getEl( userConfig.navItems
                    ? `${init} ${userConfig.navItems}`
                    : `${init} ${that._navItems}`, true ),
                contentList    : that._getEl( userConfig.contentList
                    ? `${init} ${userConfig.contentList}`
                    : `${init} ${that._contentList}` ),
                contentItems   : that._getEl( userConfig.contentItems
                    ? `${init} ${userConfig.contentItems}`
                    : `${init} ${that._contentItems}`, true ),
                activeClass    : {
                    controller: userConfig.activeController || that._activeController,
                    content   : userConfig.activeContent || that._activeContent
                },
                controllerSlide: userConfig.controllerSlide || that._controllerSlide,
                maxScreen      : userConfig.maxScreen || that._maxScreen,
                maxBool        : false
            };
            
            // start init
            this._startTab( $.navItems, $.contentItems, $.startIndex, $.activeClass );
            $.maxBool = this._checkWidth( $.maxScreen );
            
            // events
            window.addEventListener( 'resize', () => {
                $.maxBool = this._checkWidth( $.maxScreen );
                if( !$.maxBool ) this._controllerCenter( $.navList );
            } );
            if( $.navList ) {
                $.navList.addEventListener( 'click', ( event ) => {
                    event.preventDefault();
                    let target = event.target;
                    
                    while( target.tagName !== 'UL' ) {
                        if( target.tagName === 'LI' ) break;
                        target = target.parentNode;
                    }
                    
                    if( $.maxBool ) this._controllerCenter( $.navList, target );
                    
                    // remove active class
                    this._removeClass( $.navItems, $.activeClass.controller );
                    this._removeClass( $.contentItems, $.activeClass.content );
                    
                    // add for current item active class
                    let controllerIndex = this._currentTab( target, $.activeClass.controller, $.navList );
                    if( controllerIndex + 1 ) {
                        $.contentItems[ controllerIndex ].classList.add( $.activeClass.content );
                        target.classList.add( $.activeClass.controller );
                    }
                    
                } );
            }
        }
    }

// prototype
    SmartyTabs.prototype = {
        _startIndex      : 0,
        _controllerSlide : true,
        _maxScreen       : 650,
        _container       : '.smarty-tabs',
        _navContainer    : '.smarty-controller',
        _navList         : '.smarty-controller__list',
        _contentList     : '.smarty-content',
        _navItems        : '.smarty-controller__item',
        _contentItems    : '.smarty-content__item',
        _activeController: 'smarty-controller__item--active',
        _activeContent   : 'smarty-content__item--active',
        _getEl( el, col ) {
            return col ? document.querySelectorAll( el ) : document.querySelector( el );
        },
        _controllerCenter( navList, el ) {
            let trX = el ? (navList.offsetWidth / 2 - el.offsetWidth / 2) - el.offsetLeft : 0;
            navList.style.transform = `translate(${trX}px)`;
        },
        _checkWidth( max ) {
            return this._controllerSlide && max <= window.innerWidth;
        },
        _removeClass( items, activeClass ) {
            items.forEach( ( item ) => {
                if( item.classList.contains( activeClass ) ) item.classList.remove( activeClass )
            } )
        },
        _addClass( item, activeClass ) {
            item.classList.add( activeClass )
        },
        _startTab( controllerItems, contentItems, startIndex, activeClass ) {
            controllerItems[ startIndex ].classList.add( activeClass.controller );
            contentItems[ startIndex ].classList.add( activeClass.content );
        },
        _currentTab( target, activeClass, navList ) {
            if( !target.classList.contains( activeClass ) ) {
                let nodeList = Array.prototype.slice.call( navList.children );
                return nodeList.indexOf( target );
            }
        }
    };
    return SmartyTabs;
})();

export default SmartyTabs;