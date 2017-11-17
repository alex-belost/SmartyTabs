import _ from 'lodash';

class SmartyTabs {
  constructor( selector, settings ) {
    const self = this;

    self.initSelector = selector || '';
    self.userSettings = settings || {};

    self.config = {
      _initialState: false,
      set initialState( state ) {
        const customException = new TypeError(`Expected state: Boolean`);

        if ( _.isBoolean(state) ) {
          this._initialState = state;
        } else {
          throw customException;
        }

      },
      get initialState() {
        return this._initialState;
      },
    };

    self.elements = {};

    self.init();
  }

  static getElement( selector, parrent ) {
    const customException = new Error(`Can not find element with ${selector} selector.`);

    const element = _.isElement(parrent)
        ? parrent.querySelector(selector)
        : document.querySelector(selector);

    try {

      if ( _.isElement(element) ) {
        return element;
      } else {
        throw customException;
      }

    } catch ( error ) {
      console.error(error.message);
    }
  }

  static get defaultAttributes() {
    return {
      tabsWrapper: '[data-js-tabs="tabs-wrapper"]',
      tabsContainer: '[data-js-tabs="tabs"]',
      tab: '[data-js-tabs="tab"]',
      content: '[data-js-tabs="content"]',
      view: '[data-js-tabs="view"]',
    };
  }

  init() {
    const self = this;
    const config = self.config;
    const attr = SmartyTabs.defaultAttributes;

    self.elements.base = _.isElement(self.initSelector)
        ? self.initSelector
        : SmartyTabs.getElement(self.initSelector);

    self.elements.tabsWrapper = SmartyTabs.getElement(attr.tabsWrapper, self.elements.base);
    self.elements.tabsContainer = SmartyTabs.getElement(attr.tabsContainer, self.elements.base);
    self.elements.content = SmartyTabs.getElement(attr.content, self.elements.base);
    self.elements.tabs = self.elements.tabsContainer.children;
    self.elements.views = self.elements.content.children;

    config.initialState = true;
  }

  destroy() {
    const self = this;
    const config = self.config;

    config.initialState = false;
  }
}

export default function ( selector, settings ) {
  return new SmartyTabs(selector, settings);
}