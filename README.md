SmartyTabs
==========


#### HTML Layout
```html
        <!-- Set init class name -->
        <div class="initClass smarty-tabs">
        
            <!-- Navigation container -->
            <div class="smarty-tabs__item smarty-controller">
                <ul class="smarty-controller__list">
                    <li class="smarty-controller__item"> tab 1 </li>
                    <li class="smarty-controller__item"> tab 2 </li>
                </ul> 
            </div>
            
            <!-- Navigation container -->
            <div class="smarty-tab__item smarty-content">
                <div class="smarty-content__item"> content block 1 </div>
                <div class="smarty-content__item"> content block 2 </div>
            </div>
            
        </div>
```
#### Initialize SmartyTabs
```js
        import SmartyTabs from './smarty-tabs.js';
        
        SmartyTabs('initClass', {
            // config
        })
```

## Parameters

Parameter                  | Type      | Default
---------------------------|-----------|----------------
_**classes**_              |           |               
                           |           |                
container                  | string    | '.smarty-tabs'
navContainer               | string    | '.smarty-controller'
navList                    | string    | '.smarty-controller__list'
navItems                   | string    | '.smarty-controller__item'
contentList                | string    | '.smarty-content'
contentItems               | string    | '.smarty-content__item'
activeClass.controller     | string    | 'smarty-controller__item--active'
activeClass.content        | string    | 'smarty-content__item--active'
controllerSlide            | boolean   | false
maxScreen                  | number    | 650
startIndex                 | number    | 0

`Author:` `Alebex`