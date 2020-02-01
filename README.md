# REserve/**cmd**
Command line handler for [REserve](https://npmjs.com/package/reserve). It allows execution and output capturing of command lines.

[![Travis-CI](https://travis-ci.org/ArnaudBuchholz/reserve-cmd.svg?branch=master)](https://travis-ci.org/ArnaudBuchholz/reserve-cmd#)
[![Coverage Status](https://coveralls.io/repos/github/ArnaudBuchholz/reserve-cmd/badge.svg?branch=master)](https://coveralls.io/github/ArnaudBuchholz/reserve-cmd?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/80cbb39bea726d634780/maintainability)](https://codeclimate.com/github/ArnaudBuchholz/reserve-cmd/maintainability)
[![Package Quality](https://npm.packagequality.com/shield/reserve-cmd.svg)](https://packagequality.com/#?package=reserve-cmd)
[![Known Vulnerabilities](https://snyk.io/test/github/ArnaudBuchholz/reserve-cmd/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ArnaudBuchholz/reserve-cmd?targetFile=package.json)
[![dependencies Status](https://david-dm.org/ArnaudBuchholz/reserve-cmd/status.svg)](https://david-dm.org/ArnaudBuchholz/reserve-cmd)
[![devDependencies Status](https://david-dm.org/ArnaudBuchholz/reserve-cmd/dev-status.svg)](https://david-dm.org/ArnaudBuchholz/reserve-cmd?type=dev)
[![reserve](https://badge.fury.io/js/reserve-cmd.svg)](https://www.npmjs.org/package/reserve-cmd)
[![reserve](http://img.shields.io/npm/dm/reserve-cmd.svg)](https://www.npmjs.org/package/reserve-cmd)
[![install size](https://packagephobia.now.sh/badge?p=reserve-cmd)](https://packagephobia.now.sh/result?p=reserve-cmd)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FArnaudBuchholz%2Freserve-cmd.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FArnaudBuchholz%2Freserve-cmd?ref=badge_shield)

## Usage

```json
{
  "handlers": {
    "cmd": "reserve-cmd"
  },
  "mappings": [{
    "match": "\\/test",
    "cmd": "./test.cmd"
  }]
}
```  

Capturing group values substitutions can be used, space escaping is done with the character `.

## Options

| Option | Default Value | Explanation |
|---|---|---|
| `env` | `{}` | Additional variables to be used in the created process *(see [`child_process.execFile`](https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_child_process_execfile_file_args_options_callback))* |
| `timeout` | `0` | Automatic kill of the process *(see [`child_process.execFile`](https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_child_process_execfile_file_args_options_callback))* |
| `text-only` | `false` | When set, the output is always text |
| `html-header` | `''` | Additional content to be added in the header of the HTML output |
| `html-footer` | `''` | Additional content to be added in the footer of the HTML output |
| `html-tracking` | `false` | Injects JavaScript code to scroll the HTML output while executing |

Any command can be executed (use it **carefully**). If a process can not be started, the request ends with a `500` error.

## Supported verbs

### GET

The handler adapts the output based on the accepted mime-type. If `text/html` is found in the [accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) header, the content is formatted to HTML. Otherwise, the output uses text format.
