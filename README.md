# babel-plugin-transform-shorthand-instance [![NPM version](http://img.shields.io/npm/v/babel-plugin-transform-shorthand-instance.svg?style=flat-square)](https://www.npmjs.org/package/babel-plugin-transform-shorthand-instance)

Babel plugin to enable shorthand instance expressions (similar to `@` in CoffeeScript).

This is an __advanced__ plugin that requires [Babby](https://github.com/lukehorvat/babby) to work, not regular Babel.

It transforms code like this:

```javascript
class Logger {
  constructor(message) {
    #message = message;
    #logMessage();
  }

  logMessage() {
    console.log(#message);
  }
}
```

...into this:

```javascript
class Logger {
  constructor(message) {
    this.message = message;
    this.logMessage();
  }

  logMessage() {
    console.log(this.message);
  }
}
```

## Installation

Install the package with NPM:

```bash
$ npm install babel-plugin-transform-shorthand-instance
```

## Usage

Add the following line to your `.babelrc` file:

```json
{
  "plugins": ["transform-shorthand-instance"]
}
```
