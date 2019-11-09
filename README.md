# Vue Code Sample

This is a generic version of the production site: [EZ-EV](https://www.ez-ev.com/showroom). You can run this generic version by following the instalation steps below, but the functionality mirrors production.

The project is built on our internal frontend framework called Skeletor. 

Skeletor is a directory structure and Gulp workflow designed as an easy starting point for front end development of projects. It is designed to give you a quick and organized way to start developing web apps with best practices in mind, as well as enforce consistency in the frontend architecture used at HERO_digital. 

Skeletor uses open source tools for its workflow. If you haven't installed these requirements please do so.

-   [Python](https://www.python.org/downloads/) (v2.7 at the time of this writing)
-   [Node.js](https://nodejs.org/en/) (v8.11.2 at the time of this writing)

**NOTE:** Most of our development has occured on PCs. We have tested this on development Macs before, but Macs may have other requirements (like having Xcode) which are not documented here.

## Installing

-   Clone or Download this repository into your machine.
-   Open a terminal and install the Node.Js dependencies by running `npm install` in your project directory.

### Configuration

_You may skip this step as the Vue Code Sample is already set up_

Before running the project, be sure to update the `skeletor.config.js` file in the root of the project directory. There, you'll be able to update things like the local url and whether or not you want to proxy that url or work entirely off the file system.

## Gulp Tasks

 -	`gulp`: Default command will spin up a BrowserSync server and watch all your SASS and JS files for changes, compiling when necessary. It will also watch for new icons added to the sprites directory.
 -	`gulp sass`: Compiles SASS and runs PostCSS and minification on the resulting CSS.
 -	`gulp svg:sprite`: Creates an svg spritesheet using all SVGs found in `src/sprites/vectors`.
 -	`gulp svg:inline`: Adds svgs available using the `inline_svg()` SASS mixin using all SVGs found in `src/sprites/inline`.
 -	`gulp scripts:dev`: Compiles `main.js` file without minification and while retaining console logs.
 -	`gulp scripts:prod`: Compiles, minifies, and drops console logs on `main.js`.
 -	`gulp build`: Executes all compilation of CSS and JS, with minification and optimization. Also generates a print stylesheet and regenerates vector spritesheet.

## Using the Workflow

Once everything is set up and your configuration settings updated, simply run `gulp` from the command line and the rest is automated. A BrowserSync window will open to your index page which will automatically inject styles and refresh the page when SASS, JS, and other file types you specify in the config are modified. 

### Javascript

Most of our code is written to be transferrable components.  

We have attempted to account for all best practices and performance needs in this boilerplate. Inside the `src/js` folder, you'll find different places where you can store code. Each location builds the final `main.js` in a slightly different way:

 -	`common`: These are things you want to fire on your site right away (headers, analytics tagging, etc). If you are using the component structure, remember to call `init()` at the end of the file.
 -	`components`: These are dynamic, portable pieces of code which relate to specific pieces of a site (eg. siders, accordions, etc). 
 -	`vendor`: Vendor files are the first ones written to the `main.js`, and are thus available to all components. You should use this when a lot of different components on the site share the same dependency, particularly if those components all appear on the same page. Please try to keep your use of vendor js to a conservative level, as it will bloat the entire `main.js` file.
 -	`fallbacks`: Save local fallbacks for js you are calling via CDN.
 -	`skeletor.main.js` - This is the last piece brought into the `main.js`, and simply calls the `init` functions of all the components it finds on the page.

### Vectors

Anything saved into the `vectors` folder will be automatically turned into an SVG spritesheet (as long as gulp is running). This also can be done by simply running `gulp build`.

### SASS/PostCSS

Skeletor leverages SASS for some helper functions and mixins, and after you run `gulp build`, PostCSS comes in as well, adding vendor prefixes when necessary. You can change the settings for which browsers you want to target inside the `package.json` under `browserlist`. This gives you the ability to write simplified CSS code while also handling fallbacks for older browsers.

#### Panthor Design System Philosophy

Panthor is an in-development Design System we aim to use cross-departmentally. Through much hard work and exercises, we have come up with a system we think help Designers and Developer speak the same language and ensure smooth transitions from Mockup to Code. These are the core principals and assumptions of Panthor:

 1.	**Foundations** are the basic building blocks of a design. They are necessary for defining _Elements_ and _Structures_. These should all translate to SASS variables. Examples include:
	- Colors
	- Type (Fonts, Weights, Sizes, Line Heights, etc)
	- Grids & Spacing
	- Motion
2. **Elements** are simply HTML elements. They are necessary for defining _Structures_. Examples include:
	- Inputs
	  - `type="text"`
	  - `type="radio"`
	  - `type="checkbox"`
	  - `type="select"`
	- Fieldsets
	- Labels
	- Buttons (`button`, `type="submit"`, `a`, etc)
	- Links
	- Media (`img`, `video`, etc)
	- Tables
	- Copy (`h1`, `h2`, `p`, `caption`, etc)
3. **Structures** are sets of _Elements_ that serve a specific functional purpose. They are necessary for defining Flows. Examples include:
	- Header/Footer   
	- Sliders
	- Accordions
	- Cards
	- "Components"
4. **Flows** are pages which define the content presented to the end-user. Examples include:
	- Pages
	- Stepped Forms
	- Dashboards

In code, everything written in SASS should follow this same flow. **Elements** inherit their properties mainly from the Colors, Type, and Grids defined in **Foundations**. **Structures** inherit the properties of the elements contained within them, and adjust styling around those elements by utilizing the same **Foundations**. This helps us enforce the design system from a code perspective, as well as helps maintain the system with low effort.
