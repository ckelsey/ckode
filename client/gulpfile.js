'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash.assign');
var stringify = require('stringify');
var plugins = require('gulp-load-plugins')();
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');

/* BROWSER SYNC
* Starts bower server
*/

gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "."
		}
	});
});

var styles = ["src/css/*.css"]
gulp.task('minifyCSS', css);

function css() {
	gulp.src(styles)
		.pipe(minifyCSS())
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
		.pipe(plugins.concat('ckode.min.css'))
		.pipe(gulp.dest('dist'))
}


var babelPlugins = [
	require('babel-plugin-transform-es2015-modules-commonjs'),
]

var minifyJSOptions = assign({}, watchify.args,{
	entries: ['./src/js/index.js'],
	debug: true
});

var minifyJS = watchify(browserify(minifyJSOptions)
	.transform(stringify, { minify: true })
	.transform(require('babelify'), {
		presets: [require('babel-preset-env')],
		plugins: babelPlugins
	})
);

gulp.task('minifyJS', bundleJS);
minifyJS.on('update', bundleJS);
minifyJS.on('log', plugins.util.log);

function bundleJS() {
	return minifyJS.bundle()
		.on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
		.pipe(source('ckode.min.js'))
		.pipe(buffer())
		.pipe(plugins.sourcemaps.init({ loadMaps: true }))
		.pipe(plugins.uglifyEs.default())
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest('./dist'))
		.on('end', function () { plugins.util.log('Done!'); });
}


gulp.task('live', function () {
	gulp.watch(styles, ['minifyCSS']);
});


gulp.task('default', [
	'browser-sync',
	'minifyJS',
	'minifyCSS',
	'live'
], function () { });