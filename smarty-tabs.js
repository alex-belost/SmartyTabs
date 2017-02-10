class SmatryTabs {
    constructor( init, userConfig ) {
        this.config = userConfig || {};
        this.initClass = init;
        
        this._startStartTab();
        
        // events
        window.addEventListener( 'resize', () => {
            if( this._checkWidth() ) this._tabPosition();
        } );
        
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
                
                // add for current item active class
                let targetIndex = this._targetTabIndex( target );
                
                if( targetIndex + 1 ) {
                    SmatryTabs._el( this._contentItems(), true )[ targetIndex ]
                        .classList.add( this._activeClass().content );
                    target.classList.add( this._activeClass().nav );
                }
                
            } );
        }
    }
    
    // default congif
    _startIndex() { return this.config.startIndex || 0 }
    
    _tabSlide() { return this.config.tabSlide || true }
    
    _maxScreen() { return this.config.tabSlide || 650 }
    
    _container() { return this.initClass + ( this.config.container || '.smarty-tabs' ) }
    
    _navWrapper() { return `${this.initClass}` + ( this.config.container || '.smarty-controller' ) }
    
    _navList() { return `${this.initClass} ` + ( this.config.container || '.smarty-controller__list') }
    
    _navItems() { return `${this.initClass} ` + ( this.config.container || '.smarty-controller__item') }
    
    _contentWrapper() { return `${this.initClass} ` + ( this.config.container || '.smarty-content') }
    
    _contentItems() { return `${this.initClass} ` + ( this.config.container || '.smarty-content__item' ) }
    
    _activeClass() {
        return {
            nav    : this.config.activeController || 'smarty-controller__item--active',
            content: this.config.activeContent || 'smarty-content__item--active'
        }
    }
    
    // helper function
    static _el( single, collection ) {
        return collection ? document.querySelectorAll( single ) : document.querySelector( single )
    }
    
    _tabPosition( el ) {
        let list = SmatryTabs._el( this._navList() );
        let positionX = el ? ( list.offsetWidth / 2 - el.offsetWidth / 2) - el.offsetLeft : 0;
        list.style.transform = `translate(${positionX}px)`;
    }
    
    _checkWidth() { return this._tabSlide() && this._maxScreen() <= window.innerWidth }
    
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
    
    _startStartTab() {
        SmatryTabs._el( this._navItems(), true )[ this._startIndex() ]
            .classList.add( this._activeClass().nav );
        SmatryTabs._el( this._contentItems(), true )[ this._startIndex() ]
            .classList.add( this._activeClass().content );
    }
    
    _targetTabIndex( el ) {
        let navList = Array.prototype.slice.call( SmatryTabs._el( this._navItems(), true ) );
        return navList.indexOf( el );
    }
    
}
export default function( init, parameters ) {
    return new SmatryTabs( init, parameters );
}
