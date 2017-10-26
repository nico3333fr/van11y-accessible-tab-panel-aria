/*
 * ES2015 accessible tabs panel system, using ARIA
 * Website: https://van11y.net/accessible-tab-panel/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-tab-panel-aria/blob/master/LICENSE
 */
(doc => {

    'use strict';

    const TABS_JS = 'js-tabs';
    const TABS_JS_LIST = 'js-tablist';
    const TABS_JS_LISTITEM = 'js-tablist__item';
    const TABS_JS_LISTLINK = 'js-tablist__link';
    const TABS_JS_CONTENT = 'js-tabcontent';
    const TABS_JS_LINK_TO_TAB = 'js-link-to-tab';

    const TABS_DATA_PREFIX_CLASS = 'data-tabs-prefix-class';
    const TABS_DATA_HX = 'data-hx';
    const TABS_DATA_GENERATED_HX_CLASS = 'data-tabs-generated-hx-class';
    const TABS_DATA_EXISTING_HX = 'data-existing-hx';

    const TABS_DATA_SELECTED_TAB = 'data-selected';

    const TABS_PREFIX_IDS = 'label_';

    const TABS_STYLE = 'tabs';
    const TABS_LIST_STYLE = 'tabs__list';
    const TABS_LISTITEM_STYLE = 'tabs__item';
    const TABS_LINK_STYLE = 'tabs__link';
    const TABS_CONTENT_STYLE = 'tabs__content';

    const TABS_HX_DEFAULT_CLASS = 'invisible';

    const TABS_ROLE_TABLIST = 'tablist';
    const TABS_ROLE_TAB = 'tab';
    const TABS_ROLE_TABPANEL = 'tabpanel';
    const TABS_ROLE_PRESENTATION = 'presentation';

    const ATTR_ROLE = 'role';
    const ATTR_LABELLEDBY = 'aria-labelledby';
    const ATTR_HIDDEN = 'aria-hidden';
    const ATTR_CONTROLS = 'aria-controls';
    const ATTR_SELECTED = 'aria-selected';

    const DELAY_HASH_UPDATE = 1000;

    let hash = window.location.hash.replace('#', '');

    //const IS_OPENED_CLASS = 'is-opened';



    const findById = id => doc.getElementById(id);

    const addClass = (el, className) => {
        if (el.classList) {
            el.classList.add(className); // IE 10+
        } else {
            el.className += ' ' + className; // IE 8+
        }
    }

    /*const removeClass = (el, className) => {
          if (el.classList) {
            el.classList.remove(className); // IE 10+
          }
          else {
               el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
               }
          }*/

    const hasClass = (el, className) => {
        if (el.classList) {
            return el.classList.contains(className); // IE 10+
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
        }
    }

    const setAttributes = (node, attrs) => {
        Object
            .keys(attrs)
            .forEach((attribute) => {
                node.setAttribute(attribute, attrs[attribute]);
            });
    };
    const unSelectLinks = (elts) => {
        elts
            .forEach((link_node) => {
                setAttributes(link_node, {
                    [ATTR_SELECTED]: 'false',
                    'tabindex': '-1'
                });
            });
    }
    const unSelectContents = (elts) => {
        elts
            .forEach((content_node) => {
                content_node.setAttribute(ATTR_HIDDEN, true);
            });
    }

    const selectLink = (el) => {
        let destination = findById(el.getAttribute(ATTR_CONTROLS));
        setAttributes(el, {
            [ATTR_SELECTED]: 'true',
            'tabindex': '0'
        });
        destination.removeAttribute(ATTR_HIDDEN);
        setTimeout(function() {
            el.focus();
        }, 0);
        setTimeout(function() {
            history.pushState(null, null, location.pathname + location.search + '#' + el.getAttribute(ATTR_CONTROLS))
        }, DELAY_HASH_UPDATE);
    }

    const selectLinkInList = (itemsList, linkList, contentList, param) => {
        let indice_trouve;

        itemsList
            .forEach((itemNode, index) => {
                if (itemNode.querySelector('.' + TABS_JS_LISTLINK).getAttribute(ATTR_SELECTED) === 'true') {
                    indice_trouve = index;
                }
            });
        unSelectLinks(linkList);
        unSelectContents(contentList);
        if (param === 'next') {
            selectLink(linkList[indice_trouve + 1]);
            setTimeout(function() {
                linkList[indice_trouve + 1].focus();
            }, 0);
        }
        if (param === 'prev') {
            selectLink(linkList[indice_trouve - 1]);
            setTimeout(function() {
                linkList[indice_trouve - 1].focus();
            }, 0);
        }

    }

    /* gets an element el, search if it is child of parent class, returns id of the parent */
    let searchParent = (el, parentClass) => {
        let found = false;
        let parentElement = el.parentNode;
        while (parentElement && found === false) {
            if (hasClass(parentElement, parentClass) === true) {
                found = true;
            } else {
                parentElement = parentElement.parentNode;
            }
        }
        if (found === true) {
            return parentElement.getAttribute('id');
        } else {
            return '';
        }
    }


    /** Find all tabs inside a container
     * @param  {Node} node Default document
     * @return {Array}
     */
    const $listTabs = (node = doc) => [].slice.call(node.querySelectorAll('.' + TABS_JS));


    /**
     * Build tooltips for a container
     * @param  {Node} node
     */
    const attach = (node) => {

        $listTabs(node)
            .forEach((tabs_node) => {

                let iLisible = Math.random().toString(32).slice(2, 12);
                let prefixClassName = tabs_node.hasAttribute(TABS_DATA_PREFIX_CLASS) === true ? tabs_node.getAttribute(TABS_DATA_PREFIX_CLASS) + '-' : '';
                let hx = tabs_node.hasAttribute(TABS_DATA_HX) === true ? tabs_node.getAttribute(TABS_DATA_HX) : '';
                let hxGeneratedClass = tabs_node.hasAttribute(TABS_DATA_GENERATED_HX_CLASS) === true ? tabs_node.getAttribute(TABS_DATA_GENERATED_HX_CLASS) : TABS_HX_DEFAULT_CLASS;
                let existingHx = tabs_node.hasAttribute(TABS_DATA_EXISTING_HX) === true ? tabs_node.getAttribute(TABS_DATA_EXISTING_HX) : '';
                let $tabList = [].slice.call(tabs_node.querySelectorAll('.' + TABS_JS_LIST));
                let $tabListItems = [].slice.call(tabs_node.querySelectorAll('.' + TABS_JS_LISTITEM));
                let $tabListLinks = [].slice.call(tabs_node.querySelectorAll('.' + TABS_JS_LISTLINK));
                let $tabListPanels = [].slice.call(tabs_node.querySelectorAll('.' + TABS_JS_CONTENT));
                let noTabSelected = true;

                // container
                addClass(tabs_node, prefixClassName + TABS_STYLE);
                tabs_node.setAttribute('id', TABS_STYLE + iLisible);

                // ul
                $tabList.forEach((tabList) => {
                    addClass(tabList, prefixClassName + TABS_LIST_STYLE);
                    setAttributes(tabList, {
                        [ATTR_ROLE]: TABS_ROLE_TABLIST,
                        'id': TABS_LIST_STYLE + iLisible
                    });
                });
                // li
                $tabListItems.forEach((tabListItem, index) => {
                    addClass(tabListItem, prefixClassName + TABS_LISTITEM_STYLE);
                    setAttributes(tabListItem, {
                        [ATTR_ROLE]: TABS_ROLE_PRESENTATION,
                        'id': TABS_LISTITEM_STYLE + iLisible + '-' + (index + 1)
                    });
                });
                // a
                $tabListLinks.forEach((tabListLink) => {
                    let idHref = tabListLink.getAttribute("href").replace('#', '');
                    let panelControlled = findById(idHref);
                    let linkText = tabListLink.innerText;
                    let panelSelected = tabListLink.hasAttribute(TABS_DATA_SELECTED_TAB) === true;

                    addClass(tabListLink, prefixClassName + TABS_LINK_STYLE);
                    setAttributes(tabListLink, {
                        'id': TABS_PREFIX_IDS + idHref,
                        [ATTR_ROLE]: TABS_ROLE_TAB,
                        [ATTR_CONTROLS]: idHref,
                        'tabindex': '-1',
                        [ATTR_SELECTED]: 'false'
                    });

                    // panel controlled
                    setAttributes(panelControlled, {
                        [ATTR_HIDDEN]: 'true',
                        [ATTR_ROLE]: TABS_ROLE_TABPANEL,
                        [ATTR_LABELLEDBY]: TABS_PREFIX_IDS + idHref
                    });
                    addClass(panelControlled, prefixClassName + TABS_CONTENT_STYLE);

                    // if already selected
                    if (panelSelected && noTabSelected) {
                        noTabSelected = false;
                        setAttributes(tabListLink, {
                            'tabindex': '0',
                            [ATTR_SELECTED]: 'true'
                        });
                        setAttributes(panelControlled, {
                            [ATTR_HIDDEN]: 'false'
                        });
                    }

                    // hx
                    if (hx !== '') {
                        let hx_node = document.createElement(hx);
                        hx_node.setAttribute('class', hxGeneratedClass);
                        hx_node.setAttribute('tabindex', '0');
                        hx_node.innerHTML = linkText;
                        panelControlled.insertBefore(hx_node, panelControlled.firstChild);
                    }
                    // existingHx

                    if (existingHx !== '') {
                        let $hx_existing = [].slice.call(panelControlled.querySelectorAll(existingHx + ':first-child'));
                        $hx_existing.forEach((hx_item) => {
                            hx_item.setAttribute('tabindex', '0');
                        });

                    }

                    tabListLink.removeAttribute('href');

                });


                if (hash !== '') {
                    let nodeHashed = findById(hash);
                    if (nodeHashed !== null) { // just in case of an dumb error
                        // search if hash is current tabs_node
                        if (tabs_node.querySelector('#' + hash) !== null) {
                            // search if hash is ON tabs
                            if (hasClass(nodeHashed, TABS_JS_CONTENT) === true) {
                                // unselect others
                                unSelectLinks($tabListLinks);
                                unSelectContents($tabListPanels);
                                // select this one
                                nodeHashed.removeAttribute(ATTR_HIDDEN);
                                let linkHashed = findById(TABS_PREFIX_IDS + hash);
                                setAttributes(linkHashed, {
                                    'tabindex': '0',
                                    [ATTR_SELECTED]: 'true'
                                });
                                noTabSelected = false;
                            } else {
                                // search if hash is IN tabs
                                let panelParentId = searchParent(nodeHashed, TABS_JS_CONTENT);
                                if (panelParentId !== '') {
                                    // unselect others
                                    unSelectLinks($tabListLinks);
                                    unSelectContents($tabListPanels);
                                    // select this one
                                    let panelParent = findById(panelParentId);
                                    panelParent.removeAttribute(ATTR_HIDDEN);
                                    let linkParent = findById(TABS_PREFIX_IDS + panelParentId);
                                    setAttributes(linkParent, {
                                        'tabindex': '0',
                                        [ATTR_SELECTED]: 'true'
                                    });
                                    noTabSelected = false;
                                }
                            }
                        }
                    }
                }

                // if no selected => select first
                if (noTabSelected === true) {
                    setAttributes($tabListLinks[0], {
                        'tabindex': '0',
                        [ATTR_SELECTED]: 'true'
                    });
                    let panelFirst = findById($tabListLinks[0].getAttribute(ATTR_CONTROLS));
                    panelFirst.removeAttribute(ATTR_HIDDEN);
                }

            });
    };

    /* listeners */
    ['click', 'keydown']
    .forEach(eventName => {
        //let isCtrl = false;

        doc.body
            .addEventListener(eventName, e => {

                // click on a tab link or on something IN a tab link
                let parentLink = searchParent(e.target, TABS_JS_LISTLINK);
                if ((hasClass(e.target, TABS_JS_LISTLINK) === true || parentLink !== '') && eventName === 'click') {
                    let linkSelected = hasClass(e.target, TABS_JS_LISTLINK) === true ? e.target : findById(parentLink);
                    let parentTabId = searchParent(e.target, TABS_JS);
                    let parentTab = findById(parentTabId);
                    //let $parentListItems = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_LISTITEM));
                    let $parentListLinks = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_LISTLINK));
                    let $parentListContents = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_CONTENT));

                    // aria selected false on all links
                    unSelectLinks($parentListLinks);
                    // add aria-hidden on all tabs contents
                    unSelectContents($parentListContents);
                    // add aria selected on selected link + show linked panel
                    selectLink(linkSelected);

                    e.preventDefault();
                }

                // Key down on tabs
                if ((hasClass(e.target, TABS_JS_LISTLINK) === true || parentLink !== '') && eventName === 'keydown') {
                    //let linkSelected = hasClass( e.target, TABS_JS_LISTLINK) === true ? e.target : findById( parentLink );
                    let parentTabId = searchParent(e.target, TABS_JS);
                    let parentTab = findById(parentTabId);
                    let $parentListItems = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_LISTITEM));
                    let $parentListLinks = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_LISTLINK));
                    let $parentListContents = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_CONTENT));
                    let firstLink = $parentListItems[0].querySelector('.' + TABS_JS_LISTLINK);
                    let lastLink = $parentListItems[$parentListItems.length - 1].querySelector('.' + TABS_JS_LISTLINK);

                    // strike home on a tab => 1st tab
                    if (e.keyCode === 36) {
                        unSelectLinks($parentListLinks);
                        unSelectContents($parentListContents);
                        selectLink(firstLink);

                        e.preventDefault();
                    }
                    // strike end on a tab => last tab
                    else if (e.keyCode === 35) {
                        unSelectLinks($parentListLinks);
                        unSelectContents($parentListContents);
                        selectLink(lastLink);

                        e.preventDefault();
                    }
                    // strike up or left on the tab => previous tab
                    else if ((e.keyCode === 37 || e.keyCode === 38) && !e.ctrlKey) {
                        if (firstLink.getAttribute(ATTR_SELECTED) === 'true') {
                            unSelectLinks($parentListLinks);
                            unSelectContents($parentListContents);
                            selectLink(lastLink);

                            e.preventDefault();
                        } else {
                            selectLinkInList($parentListItems, $parentListLinks, $parentListContents, 'prev');
                            e.preventDefault();
                        }
                    }
                    // strike down or right in the tab => next tab
                    else if ((e.keyCode === 40 || e.keyCode === 39) && !e.ctrlKey) {
                        if (lastLink.getAttribute(ATTR_SELECTED) === 'true') {
                            unSelectLinks($parentListLinks);
                            unSelectContents($parentListContents);
                            selectLink(firstLink);

                            e.preventDefault();
                        } else {
                            selectLinkInList($parentListItems, $parentListLinks, $parentListContents, 'next');
                            e.preventDefault();
                        }
                    }

                }

                // Key down in tab panels
                let parentTabPanelId = searchParent(e.target, TABS_JS_CONTENT);
                if (parentTabPanelId !== '' && eventName === 'keydown') {
                    let linkSelected = findById(findById(parentTabPanelId).getAttribute(ATTR_LABELLEDBY));
                    let parentTabId = searchParent(e.target, TABS_JS);
                    let parentTab = findById(parentTabId);
                    let $parentListItems = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_LISTITEM));
                    let $parentListLinks = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_LISTLINK));
                    let $parentListContents = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_CONTENT));
                    let firstLink = $parentListItems[0].querySelector('.' + TABS_JS_LISTLINK);
                    let lastLink = $parentListItems[$parentListItems.length - 1].querySelector('.' + TABS_JS_LISTLINK);


                    // strike up + ctrl => go to header
                    if (e.keyCode === 38 && e.ctrlKey) {
                        setTimeout(function() {
                            linkSelected.focus();
                        }, 0);
                        e.preventDefault();
                    }
                    // strike pageup + ctrl => go to prev header
                    if (e.keyCode === 33 && e.ctrlKey) {
                        // go to header
                        linkSelected.focus();
                        e.preventDefault();
                        // then previous
                        if (firstLink.getAttribute(ATTR_SELECTED) === 'true') {
                            unSelectLinks($parentListLinks);
                            unSelectContents($parentListContents);
                            selectLink(lastLink);

                        } else {
                            selectLinkInList($parentListItems, $parentListLinks, $parentListContents, 'prev');
                        }

                    }
                    // strike pagedown + ctrl => go to next header
                    if (e.keyCode === 34 && e.ctrlKey) {
                        // go to header
                        linkSelected.focus();
                        e.preventDefault();
                        // then next
                        if (lastLink.getAttribute(ATTR_SELECTED) === 'true') {
                            unSelectLinks($parentListLinks);
                            unSelectContents($parentListContents);
                            selectLink(firstLink);

                        } else {
                            selectLinkInList($parentListItems, $parentListLinks, $parentListContents, 'next');
                        }
                    }
                }

                // click on a tab link
                let parentLinkToPanelId = searchParent(e.target, TABS_JS_LINK_TO_TAB);
                if ((hasClass(e.target, TABS_JS_LINK_TO_TAB) === true || parentLinkToPanelId !== '') && eventName === 'click') {
                    let panelSelectedId = hasClass(e.target, TABS_JS_LINK_TO_TAB) === true ? e.target.getAttribute('href').replace('#', '') : findById(parentLinkToPanelId).replace('#', '');
                    let panelSelected = findById(panelSelectedId);
                    let buttonPanelSelected = findById(panelSelected.getAttribute(ATTR_LABELLEDBY));
                    let parentTabId = searchParent(e.target, TABS_JS);
                    let parentTab = findById(parentTabId);
                    //let $parentListItems = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_LISTITEM));
                    let $parentListLinks = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_LISTLINK));
                    let $parentListContents = [].slice.call(parentTab.querySelectorAll('.' + TABS_JS_CONTENT));

                    unSelectLinks($parentListLinks);
                    unSelectContents($parentListContents);
                    selectLink(buttonPanelSelected);

                    e.preventDefault();
                }

            }, true);
    });

    const onLoad = () => {
        attach();
        document.removeEventListener('DOMContentLoaded', onLoad);
    }

    document.addEventListener('DOMContentLoaded', onLoad);

    window.van11yAccessibleTabPanelAria = attach;


})(document);