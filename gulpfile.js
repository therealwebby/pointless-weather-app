/**
 * gulpfile.js
 * Based heavily on "Getting started with gulp" by Mark Goodyear
 *
 * @link https://markgoodyear.com/2014/01/getting-started-with-gulp/
 */

//Required NPM modules
var fs = require('fs'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    notify = require("gulp-notify"),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    livereload = require('gulp-livereload'),
    sassOpt = {
      errLogToConsole: true,
      outputStyle: 'expanded'
    },
    jsFiles = [
      'src/scripts/libs/angular.min.js',
      'src/scripts/libs/angular-animate.js',
      'src/scripts/app.js'
    ];

//Sass task. Compiles and auto prefixes sass files
gulp.task('styles', function() {
  return gulp.src('src/styles/sass/main.scss')
    .pipe(sass(sassOpt).on('error', sass.logError))
    //Set auto prefixer to look back 2 versions
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //Save this file to the css director
    .pipe(gulp.dest('public/css'))
    //Append min to file name
    .pipe(rename({suffix: '.min'}))
    //Minify the file
    .pipe(minifycss())
    //Save the minified file
    .pipe(gulp.dest('public/css'))
    //Notification of completed task
    .pipe(notify({ message: 'Sass task complete' }));
});

//Javascript task. Concentrates the files and minifies them
gulp.task('javascript', function() {
  return gulp.src(jsFiles)
    //Checks for jshintrc (jsHint config file)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    //Concentrates javascript files into app.js
    .pipe(concat('app.js'))
    //Saves concat file
    .pipe(gulp.dest('public/js'))
    //Appeds .min to name of files
    .pipe(rename({suffix: '.min'}))
    //Minifys the file
    .pipe(uglify())
    //Saves file into dist file directory
    .pipe(gulp.dest('public/js'))
    //Notification of completed task
    .pipe(notify({ message: 'Javascript task complete' }));
});

gulp.task('move-html', function() {
  gulp.src('src/*.html')
  .pipe(gulp.dest('public'))
  .pipe(notify({ message: '.html files moved', onLast: true }));
});

gulp.task('move-svg', function() {
  gulp.src('src/svg/**/*')
  .pipe(gulp.dest('public/svg'))
  .pipe(notify({ message: '.svgs moved', onLast: true }));
});

gulp.task('move-fonts', function() {
  gulp.src('src/fonts/**/*.{ttf,woff,woff2,eot,svg}')
  .pipe(gulp.dest('public/fonts'))
  .pipe(notify({ message: 'Fonts moved', onLast: true }));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/images'))
    .pipe(notify({ message: 'Images optimised', onLast: true }));
});

gulp.task('clean', function() {
  return Promise.all([
    del(['public/*'])
  ]);
});

//Main gulp task that runs each indvidual task.
gulp.task('default',['clean'], function() {
    gulp.start('styles', 'javascript', 'images', 'move-html', 'move-svg', 'move-fonts');
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['javascript']);

  // Watch .js && update docs
  // gulp.watch('src/scripts/**/*.js', ['javascript', 'docs']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch html files
  gulp.watch('src/**/*.html', ['move-html']);

  // Watch for new svg or fonts
  gulp.watch('src/svg/**/*', ['move-svg']);
  gulp.watch('src/fonts/**/*', ['move-fonts']);

  livereload.listen();

  gulp.watch(['public/**']).on('change', livereload.changed);

});
