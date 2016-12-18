# ESDoc RST Plugin

[![Latest Stable Version](https://img.shields.io/npm/v/esdoc-rst-plugin.svg)](https://www.npmjs.com/package/esdoc-rst-plugin)
[![License](https://img.shields.io/npm/l/esdoc-rst-plugin.svg)](https://www.npmjs.com/package/esdoc-rst-plugin)
[![Build Status](https://travis-ci.org/gregaou/esdoc-rst-plugin.svg?branch=master)](https://travis-ci.org/gregaou/esdoc-rst-plugin)
[![Documentation](https://doc.esdoc.org/github.com/gregaou/esdoc-rst-plugin/badge.svg)](https://doc.esdoc.org/github.com/gregaou/esdoc-rst-plugin)

[![Dependency Status](https://gemnasium.com/badges/github.com/gregaou/esdoc-rst-plugin.svg)](https://gemnasium.com/github.com/gregaou/esdoc-rst-plugin)
[![Code Climate](https://codeclimate.com/github/gregaou/esdoc-rst-plugin/badges/gpa.svg)](https://codeclimate.com/github/gregaou/esdoc-rst-plugin)
[![Issue Count](https://codeclimate.com/github/gregaou/esdoc-rst-plugin/badges/issue_count.svg)](https://codeclimate.com/github/gregaou/esdoc-rst-plugin)

This is a plugin that generate RST documentation.

```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "esdoc-rst-plugin",
      "option": {
        "output": "out_rst"
      }
    }
  ]
}
```

``output`` would be the output path for the RST documentation.

# Install and Usage
```sh
npm install esdoc-rst-plugin
```

# LICENSE
MIT

# Author
[Rit Grégoire@gregwarit](https://twitter.com/gregwarit)
