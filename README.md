# webpackLearn
webpack3.x笔记

Demo01: Entry file (source)
Entry file is a file which Webpack reads to build bundle.js.

For example, main.js is an entry file.

// main.js
document.write('<h1>Hello World</h1>');
index.html

<html>
  <body>
    <script type="text/javascript" src="bundle.js"></script>
  </body>
</html>
Webpack follows webpack.config.js to build bundle.js.

// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
Launch the server, visit http://127.0.0.1:8080 .

$ cd demo01
$ npm run dev
Demo02: Multiple entry files (source)
Multiple entry files are allowed. It is useful for a multi-page app which has different entry file for each page.

// main1.js
document.write('<h1>Hello World</h1>');

// main2.js
document.write('<h2>Hello Webpack</h2>');
index.html

<html>
  <body>
    <script src="bundle1.js"></script>
    <script src="bundle2.js"></script>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: {
    bundle1: './main1.js',
    bundle2: './main2.js'
  },
  output: {
    filename: '[name].js'
  }
};
Demo03: Babel-loader (source)
Loaders are preprocessors which transform a resource file of your app (more info) before Webpack's building process.

For example, Babel-loader can transform JSX/ES6 file into normal JS files，after which Webpack will begin to build these JS files. Webpack's official doc has a complete list of loaders.

main.jsx is a JSX file.

// main.jsx
const React = require('react');
const ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.querySelector('#wrapper')
);
index.html

<html>
  <body>
    <div id="wrapper"></div>
    <script src="bundle.js"></script>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      }
    ]
  }
};
The above snippet uses babel-loader which needs Babel's preset plugins babel-preset-es2015 and babel-preset-react to transpile ES6 and React.

Demo04: CSS-loader (source)
Webpack allows you to include CSS in JS file, then preprocessed CSS file with CSS-loader.

main.js

require('./app.css');
app.css

body {
  background-color: blue;
}
index.html

<html>
  <head>
    <script type="text/javascript" src="bundle.js"></script>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules:[
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
    ]
  }
};
Attention, you have to use two loaders to transform CSS file. First is CSS-loader to read CSS file, and another one is Style-loader to insert <style> tag into HTML page.

Then, launch the server.

$ cd demo04
$ npm run dev
Actually, Webpack inserts an internal style sheet into index.html.

<head>
  <script type="text/javascript" src="bundle.js"></script>
  <style type="text/css">
    body {
      background-color: blue;
    }
  </style>
</head>
Demo05: Image loader (source)
Webpack could also include images in JS files.

main.js

var img1 = document.createElement("img");
img1.src = require("./small.png");
document.body.appendChild(img1);

var img2 = document.createElement("img");
img2.src = require("./big.png");
document.body.appendChild(img2);
index.html

<html>
  <body>
    <script type="text/javascript" src="bundle.js"></script>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules:[
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};
url-loader transforms image files into <img> tag. If the image size is smaller than 8192 bytes, it will be transformed into Data URL; otherwise, it will be transformed into normal URL.

After launching the server, small.png and big.png have the following URLs.

<img src="data:image/png;base64,iVBOR...uQmCC">
<img src="4853ca667a2b8b8844eb2693ac1b2578.png">
Demo06: CSS Module (source)
css-loader?modules (the query parameter modules) enables the CSS Module which gives a local scoped CSS to your JS module's CSS. You can switch it off with :global(selector) (more info).

index.html

<html>
<body>
  <h1 class="h1">Hello World</h1>
  <h2 class="h2">Hello Webpack</h2>
  <div id="example"></div>
  <script src="./bundle.js"></script>
</body>
</html>
app.css

/* local scope */
.h1 {
  color:red;
}

/* global scope */
:global(.h2) {
  color: blue;
}
main.jsx

var React = require('react');
var ReactDOM = require('react-dom');
var style = require('./app.css');

ReactDOM.render(
  <div>
    <h1 className={style.h1}>Hello World</h1>
    <h2 className="h2">Hello Webpack</h2>
  </div>,
  document.getElementById('example')
);
webpack.config.js

module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
             loader: 'css-loader',
             options: {
               modules: true
             }
          }
        ]
      }
    ]
  }
};
Launch the server.

$ cd demo06
$ npm run dev
Visiting http://127.0.0.1:8080 , you'll find that only second h1 is red, because its CSS is local scoped, and both h2 is blue, because its CSS is global scoped.

Demo07: UglifyJs Plugin (source)
Webpack has a plugin system to expand its functions. For example, UglifyJs Plugin will minify output(bundle.js) JS codes.

main.js

var longVariableName = 'Hello';
longVariableName += ' World';
document.write('<h1>' + longVariableName + '</h1>');
index.html

<html>
<body>
  <script src="bundle.js"></script>
</body>
</html>
webpack.config.js

var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new UglifyJsPlugin()
  ]
};
After launching the server, main.js will be minified into following.

var o="Hello";o+=" World",document.write("<h1>"+o+"</h1>")
Demo08: HTML Webpack Plugin and Open Browser Webpack Plugin (source)
This demo shows you how to load 3rd-party plugins.

html-webpack-plugin could create index.html for you, and open-browser-webpack-plugin could open a new browser tab when Webpack loads.

main.js

document.write('<h1>Hello World</h1>');
webpack.config.js

var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Webpack-demos',
      filename: 'index.html'
    }),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    })
  ]
};
Launch the server.

$ cd demo08
$ npm run dev
Now you don't need to write index.html by hand and don't have to open browser by yourself. Webpack did all these things for you.

Demo09: Environment flags (source)
You can enable some codes only in development environment with environment flags.

main.js

document.write('<h1>Hello World</h1>');

if (__DEV__) {
  document.write(new Date());
}
index.html

<html>
<body>
  <script src="bundle.js"></script>
</body>
</html>
webpack.config.js

var webpack = require('webpack');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [devFlagPlugin]
};
Now pass environment variable into webpack. Opening demo09/package.json, you should find scripts field as following.

// package.json
{
  // ...
  "scripts": {
    "dev": "cross-env DEBUG=true webpack-dev-server --open",
  },
  // ...
}
Launch the server.

$ cd demo09
$ npm run dev
Demo10: Code splitting (source)
For big web apps, it’s not efficient to put all code into a single file. Webpack allows you to split a large JS file into several chunks. Especially, if some blocks of code are only required under some circumstances, these chunks could be loaded on demand.

Webpack uses require.ensure to define a split point (official document).

// main.js
require.ensure(['./a'], function (require) {
  var content = require('./a');
  document.open();
  document.write('<h1>' + content + '</h1>');
  document.close();
});
require.ensure tells Webpack that ./a.js should be separated from bundle.js and built into a single chunk file.

// a.js
module.exports = 'Hello World';
Now Webpack takes care of the dependencies, output files and runtime stuff. You don't have to put any redundancy into your index.html and webpack.config.js.

<html>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
Launch the server.

$ cd demo10
$ npm run dev
On the surface, you won't feel any differences. However, Webpack actually builds main.js and a.js into different chunks(bundle.js and 0.bundle.js), and loads 0.bundle.js from bundle.js when on demand.

Demo11: Code splitting with bundle-loader (source)
Another way of code splitting is using bundle-loader.

// main.js

// Now a.js is requested, it will be bundled into another file
var load = require('bundle-loader!./a.js');

// To wait until a.js is available (and get the exports)
//  you need to async wait for it.
load(function(file) {
  document.open();
  document.write('<h1>' + file + '</h1>');
  document.close();
});
require('bundle-loader!./a.js') tells Webpack to load a.js from another chunk.

Now Webpack will build main.js into bundle.js, and a.js into 0.bundle.js.

Demo12: Common chunk (source)
When multi scripts have common chunks, you can extract the common part into a separate file with CommonsChunkPlugin, which is useful for browser caching and saving bandwidth.

// main1.jsx
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello World</h1>,
  document.getElementById('a')
);

// main2.jsx
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h2>Hello Webpack</h2>,
  document.getElementById('b')
);
index.html

<html>
  <body>
    <div id="a"></div>
    <div id="b"></div>
    <script src="commons.js"></script>
    <script src="bundle1.js"></script>
    <script src="bundle2.js"></script>
  </body>
</html>
The above commons.js is the common chunk of main1.jsx and main2.jsx. As you can imagine, commons.js includes react and react-dom.

webpack.config.js

var webpack = require('webpack');

module.exports = {
  entry: {
    bundle1: './main1.jsx',
    bundle2: './main2.jsx'
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      // (the commons chunk name)

      filename: "commons.js",
      // (the filename of the commons chunk)
    })
  ]
}
Demo13: Vendor chunk (source)
You can also extract the vendor libraries from a script into a separate file with CommonsChunkPlugin.

main.js

var $ = require('jquery');
$('h1').text('Hello World');
index.html

<html>
  <body>
    <h1></h1>
    <script src="vendor.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
webpack.config.js

var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js',
    vendor: ['jquery'],
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    })
  ]
};
In above codes, entry.vendor: ['jquery'] tells Webpack that jquery should be included in the common chunk vendor.js.

If you want a module available as a global variable in every module, such as making $ and jQuery available in every module without writing require("jquery"). You should use ProvidePlugin (Official doc) which automatically loads modules instead of having to import or require them everywhere.

// main.js
$('h1').text('Hello World');


// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js'
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
Of course, in this case, you should load jquery.js globally by yourself.

Demo14: Exposing global variables (source)
If you want to use some global variables, and don't want to include them in the Webpack bundle, you can enable externals field in webpack.config.js (official document).

For example, we have a data.js.

// data.js
var data = 'Hello World';
index.html

<html>
  <body>
    <script src="data.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
Attention, Webpack will only build bundle.js, but not data.js.

We can expose data as a global variable.

// webpack.config.js
module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
    ]
  },
  externals: {
    // require('data') is external and available
    //  on the global var data
    'data': 'data'
  }
};
Now, you require data as a module variable in your script. but it actually is a global variable.

// main.jsx
var data = require('data');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>{data}</h1>,
  document.body
);
You could also put react and react-dom into externals, which will greatly decreace the building time and building size of bundle.js.

Demo15: React router (source)
This demo uses webpack to build React-router's official example.

Let's imagine a little app with a dashboard, inbox, and calendar.

+---------------------------------------------------------+
| +---------+ +-------+ +--------+                        |
| |Dashboard| | Inbox | |Calendar|      Logged in as Jane |
| +---------+ +-------+ +--------+                        |
+---------------------------------------------------------+
|                                                         |
|                        Dashboard                        |
|                                                         |
|                                                         |
|   +---------------------+    +----------------------+   |
|   |                     |    |                      |   |
|   | +              +    |    +--------->            |   |
|   | |              |    |    |                      |   |
|   | |   +          |    |    +------------->        |   |
|   | |   |    +     |    |    |                      |   |
|   | |   |    |     |    |    |                      |   |
|   +-+---+----+-----+----+    +----------------------+   |
|                                                         |
+---------------------------------------------------------+
webpack.config.js

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
    ]
  }
};
index.js

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import './app.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="/app">Dashboard</Link></li>
            <li><Link to="/inbox">Inbox</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
          </ul>
          Logged in as Jane
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route path="/app" component={Dashboard}/>
            <Route path="/inbox" component={Inbox}/>
            <Route path="/calendar" component={Calendar}/>
            <Route path="*" component={Dashboard}/>
          </Switch>
        </main>
      </div>
    );
  }
};

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <p>Dashboard</p>
      </div>
    );
  }
};

class Inbox extends React.Component {
  render() {
    return (
      <div>
        <p>Inbox</p>
      </div>
    );
  }
};

class Calendar extends React.Component {
  render() {
    return (
      <div>
        <p>Calendar</p>
      </div>
    );
  }
};

render((
  <BrowserRouter>
    <Route path="/" component={App} />
  </BrowserRouter>
), document.querySelector('#app'));
index.html

<html>
  <body>
    <div id="app"></div>
    <script src="/bundle.js"></script>
  </body>
</htmL>
Launch the server.

$ cd demo15
$ npm run dev
