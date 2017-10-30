# Van11y accessible tabs panel system, using ARIA

<img src="https://van11y.net/layout/images/logo-van11y.svg" alt="Van11y" width="300" />

This script will transform a simple list of anchors to contents into a fantastic-shiny accessible tabpanel system, using ARIA.

The demo is here: https://van11y.net/downloads/tab-panel/demo/index.html

Website is here: https://van11y.net/accessible-tab-panel/

La page existe aussi en français : https://van11y.net/fr/onglets-accessibles/

## How it works

__ARIA is coming__

The script adds all needed attributes to your tabs controls and panels (```role="tab/tablist/etc."```,```aria-selected/controls="…"```).

__Then a bit of styling classes__

Then it will generate some classes for you, to allow styling your tabs as you want.

__And JavaScript does the rest__

Some listeners for keyboard and mouse interactions are added, when you activate one, it will updates attributes and manage keyboard interations.

## How to use it

__Download the script__

You may also use npm command: ```npm i van11y-accessible-tab-panel-aria```.

You may also use bower: ```bower install van11y-accessible-tab-panel-aria```.

__Conventions__

Then, follow the conventions given in this minimal example (in bold).

- use classes needed (```js-tabs```, ```js-tablist```, ```js-tablist__item```, ```js-tablist__link```, ```js-tabcontent```)
- check that your anchors are working.
- for accessibility purposes (for VoiceOver), the plugin has to give focus to ```hx``` (```h2```, ```h3```, ```h4```, etc.) in tab contents.

For ```Hx```, you have two cases:

- There aren’t any in your ```js-tabcontent```’s, so specify in ```data-hx``` attribute (will be added with ```class="invisible"```, which means visually hidden);
- There are some, just tell it to the plugin using ```data-existing-hx``` attribute.

Example without ```hx```:
```
<div class="js-tabs">
  <ul class="js-tablist" data-hx="h2">
   <li class="js-tablist__item">
    <a href="#id_first" class="js-tablist__link">1st tab</a>
   </li>
   <li class="js-tablist__item">
    <a href="#id_second" class="js-tablist__link">2nd tab</a>
   </li>
  </ul>
 <div id="id_first" class="js-tabcontent">
   here the content of 1st tab
 </div>
 <div id="id_second" class="js-tabcontent">
   here the content of 2nd tab
 </div>
</div>
```
Example with ```hx```:
```
<div class="js-tabs">
  <ul class="js-tablist" data-existing-hx="h2">
   <li class="js-tablist__item">
    <a href="#id_first" class="js-tablist__link">1st tab</a>
   </li>
   <li class="js-tablist__item">
    <a href="#id_second" class="js-tablist__link">2nd tab</a>
   </li>
  </ul>
 <div id="id_first" class="js-tabcontent">
   <h2>title</h2>
   here the content of 1st tab
 </div>
 <div id="id_second" class="js-tabcontent">
   <h2>other title</h2>
   here the content of 2nd tab
 </div>
</div>
```

The script is launched when the page is loaded. If you need to execute it on AJAX-inserted content, you may use for example on `<div id="newContent">your tab panel source</div>`:

```van11yAccessibleTabPanelAria(document.getElementById('newContent'));```

## Keyboard shortcuts

If you focus on the tabs “buttons”:

- use Up/Left to see previous tab,
- use Down/Right to see next tab
- use Home to see first tab (wherever you are in tab buttons)
- use End to see last tab (wherever you are in tab buttons)

If you focus on a tab content:

- use Ctrl Up/Left to set focus on the tab button for the currently displayed tab
- use Ctrl PageUp to set focus on the previous tab button for the currently displayed tab
- use Ctrl PageDown to set focus on the next tab button for the currently displayed tab

Warning: Ctrl+PageUp/PageDown combination could activate for some browsers a switch of browser tabs. Nothing to do for this, as far as I know (if you have a solution, let me know).

## Logic of styling classes

__Before Javascript__

Once you set up the code with your content, style it before activating JavaScript: so it will be nice even if there is no JavaScript.

For example, just imagine you are on poor mobile connexion, and the JavaScript hasn’t (yet) loaded. Or it can be disabled.

__After Javascript__

You should add classes to the source, and use them this way:
```
[role="tablist"].my-style {…}
```
Basically, you should rely on ARIA attributes, so styles will be applied only if JavaScript is loaded and well-executed.
Namespaced generated classes

The plugin has another feature: if you don’t like styling on role attributes, it can generate classes for you only for styling tabs when they are activated.

Here is an example:
```
<ul … data-tabs-prefix-class="last-tabs">
```
The ```data-tabs-prefix-class``` will add classes on each elements:
```
<ul … class="… last-tabs-tabs__list">
  <li … class="… last-tabs-tabs__item">
    <a … class="… last-tabs-tabs__link">…
```
So with ```data-tabs-prefix-class="last-tabs"``` you have:

- ```last-tabs-tabs__list``` for styling the ```ul```;
- ```last-tabs-tabs__item``` for styling the ```li```;
- ```last-tabs-tabs__link``` for styling the ```a```;
- ```last-tabs-tabs__content``` for styling each tab panel.

## Bonuses

__Tab panel opened by default__
        
If you need a tab to be opened by default, it is possible, using <code>data-selected="1"</code> on the <code>.js-tablist__link</code> you need to be opened (<a href="https://van11y.net/downloads/tab-panel/demo/index.html">See the demo, second example</a>).
        
Other tabs are still available, here are the rules for this feature:
     
- The fragment detection (explained below) will <strong>always</strong> have priority on this feature;
- If there are several <code>data-selected="1"</code> put on tabs in the same group (which does not make sense and should never happen), the first one will be used.


__Anchor added in URL__

As you may notice (or not), now the script adds a fragment in the URL when you click or select a tab using the keyboard. It is cool when you want to copy/paste the link of the page you are reading, and the opened tab will be the good one!
Anchor on a tab panel

If you need to make a link on your page to a id that is on a tab panel, the script will detect it and display the good tab, only for you.

If you want to test, open a new window, and copy/paste this:
https://van11y.net/downloads/tab-panel/demo/index.html#id_third

__Anchor in a tab panel__

If you need to make a link on your page to a id that is in a tab panel, the script will detect it and display the good tab, only for you.

If you want to test, open a new window, and copy/paste this:
https://van11y.net/downloads/tab-panel/demo/index.html#cool-anchor

__“In-page” link to a tab panel__

If you need to create in your current page a link to a tab (inside or outside), it is possible:

- Create the link to the content you want to target: ```<a href="#link-to-tab">link to tab option</a>```
- Add the class ```class="js-link-to-tab"``` to it;
- And that’s all. The plugin will make it work.

