# NeXt UI Framework

NeXt UI toolkit is an HTML5/JavaScript based toolkit for network web application. Provide high performance and high quality framework and network centric topology component.

https://developer.cisco.com/site/neXt/

## Build instructions

### Environment requriements

We require these tools in your system to build the project.

* GNU
  * Coreutils
  * Findutils
  * SED
  * Make
* NodeJS & NPM
  * PhantomJS
  * LESS
  * YUIDoc
  * Uglify

### For Debian/Ubuntu
Install the required software:
* sudo apt-get install nodejs
* sudo npm install -g node-getopt
* sudo npm install -g yuidocjs
* sudo npm install -g uglify
* sudo npm install -g less
* sudo npm install -g phantom phantomjs
 
Build the project:
* make clean
* make

### For Mac OS X with Brew
Install the required software:

If you do not have [Homebrew](http://brew.sh), use this command to install it:

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
* brew install gnu-sed
* brew install node
* sudo npm install -g node-getopt
* sudo npm install -g yuidocjs
* sudo npm install -g uglify
* sudo npm install -g less
* sudo npm install -g phantom phantomjs

Build the project:
* make clean
* make

## Key Features

* Build interactive topology on top of web browser
* Speak to the backend via REST API
* Customize topology for your needs
* Use powerful solution by the leader in industry
* Acquaint NeXt with AngularJS: they'll get along with each other

## Who's Using NeXt

* Cisco
* Verizon

Are you NeXt?

## ES2015 Changes

* Initialized as npm module
* Installed hjs-webpack to bootstrap Webpack configuration
* Installed loader dependencies to compile the code.

## ES2015 Build Process

* Clone the repo
* Run `npm install`
* Run `npm start` to have a webpack hot-reloading server or run `npm build` to compile and minify the code.

## Notes

* To build the final product you can run `npm run build`. Currently the command is configured to run over Powershell on Windows. See `package.json` and change the `prebuild` script to: `rm -r public && mkdir public`.

## Team

* Kang Li (lkang2@cisco.com)
* Aikepaer Abuduweili (aaikepae@cisco.com)
* Alexei Zverev (alzverev@cisco.com)

Reach out these guys to report bugs, share ideas and understand the framework.
