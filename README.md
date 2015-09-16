### Styleguide
> Includes [BrowserSync](https://github.com/shakyShane/browser-sync) for fast live reloading across devices on code changes. [Jade](http://jade-lang.com) templating, [Sass](http://sass-lang.com/) and a simple grid implementation with [S-Grid](https://github.com/kiriaze/s-grid).

A gulp flavored styleguide inspired by Huge's styleguide, utilizing jade & json on top of an easily extendable format.
It comes preconfigured with Browserify, sourcemaps, libsass, optimization, bower, browser-sync, gh-pages and more.

Check the live example out at [https://kiriaze.github.io/styleguide](https://kiriaze.github.io/styleguide)!

### Get started
It's easy to get started. Just follow the steps below.

### Prerequisites

###$ [Node.js](https://nodejs.org)

Bring up a terminal and type `node --version`.
Node should respond with a version at or above 0.10.x.
If you require Node, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

### 1. Clone/Download

Clone or Download Styleguide.

	$ git clone git@github.com:kiriaze/styleguide.git


### 2. Install

Change directory into cloned project & run Node Package Manager

	$ cd styleguide && npm install --global gulp && npm install

*This will install Gulp globally. Depending on your user account, you may need to configure your system to install packages globally without administrative privileges.*

If you have installed Node with sudo or root permission, You will need to fix permissions to the .npm folder with the following command:

	sudo chown -R $(whoami) ~/.npm
	sudo chown -R $(whoami) /usr/local/lib/node_modules

### 3. Build

Run Gulp and you're good to go. This will open up a server with your styleguide and start watching for changes, with automatic refreshes on all devices! **Easy peazy titty squeezy.**

	$ gulp

Want to push it to github pages?

	gulp gh-pages

**Boom goes the dynamite.**

### ToDo's
- Move simpleForms.js out of forms module, and bower install it, then require it within forms module js file.
- Rather than manually including/requiring js/scss within ./src/assets, have them auto compile/concat from within their respective modules directories and injected into ./dist, either into 1 file or separate files?
- Consider https://github.com/assemble/assemble or replacing jade with handlebars, swig or something similar.
- Possibility to save to json from front end on contenteditable elements - if logged in?, e.g. the Typography section.
- Subsections - utilizing simpleAnchors.js
- Different stylguide themes/layouts
- Ability for modules to be used as pages
- Still working on having the ablitity to be included within your project and separated with the gulpfile.js in your main project:
	require('./gulp');
	require('./styleguide/gulp');
