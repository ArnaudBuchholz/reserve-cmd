# reserve-cmd
cmd handler for [reserve](https://npmjs.com/package/reserve)

## Usage

```json
{
  "handlers": {
    "cmd": "reserve/cmd"
  },
  "mappings": [{
    "match": "\\/test",
    "cmd": "./test.cmd"
  }]
}
```  

## Options

* timeout
* fail on if stderr is used

## Supported verbs

GET
  depending on accepted mime-type, the output is different, in particular
  text/plain
  text/html (automatic formatting, handle colors)
