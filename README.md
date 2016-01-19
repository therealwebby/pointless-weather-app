# The Pointless Weather App
An experiment in to node.js with a the yahoo query api

### About
This project showcases an experiment into using restful API's using angular.js 1.5.0 rc. Gets data from yahoo's pubic query api and therefore is limited to 2000 queries a day

### Development Dependences
You'll need the following to work with this repository:
* Node.js
* NPM
* Gulp

## Getting Started

1. Make sure you have node, npm and gulp installed
2. Navigate in bash to project folder
3. Run the following command to add all gulp npm modules
  ```shell
  npm install --save-dev gulp gulp-sass gulp-autoprefixer gulp-minify-css gulp-rename gulp-notify gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-cache del gulp-livereload
  ```
4. Run the `gulp watch` task
5. Develop!

### Gulp Tasks

##### default
Run using `gulp` or `gulp default`. Deletes entire dist file before running all tasks.
##### javascript
Run using `gulp javascript`. Lints, concat's and minifies all js.
##### styles
Run using `gulp styles`. Compiles sass, concats and minifies into single file.
##### images
Run using `gulp images`. Compresses & optimises all images.
##### move-html
Run using `gulp move-html`. Moves html to dist.
##### move-svg
Run using `gulp move-svg`. Moves svg to dist.
##### move-fonts
Run using `gulp move-fonts`. Moves fonts to dist.
##### watch
Run using `gulp watch`. Watches for changes to *any* task (I think). When the file is updated run the related #
