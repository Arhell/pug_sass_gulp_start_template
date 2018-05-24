'use strict';

var gulp = require('gulp'),
		glp  = require('gulp-load-plugins')(),
		img  = require('gulp-imagemin'),
		bs   = require('browser-sync').create();

gulp.task('pug', function () {
	return gulp.src('src/pug/*.pug')
		.pipe(glp.pug({
			pretty:true
		}))
		.pipe(gulp.dest('dist'))
		.on('end', bs.reload);
});

gulp.task('stylus', function () {
	return gulp.src('src/stylus/*.styl')
		.pipe(glp.sourcemaps.init())
		.pipe(glp.stylus({
			'include css': true
		}))
		.pipe(glp.autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}))
		.on("error", glp.notify.onError({
			title: "Stylus error"
		}))
		.pipe(glp.csso())
		.pipe(glp.sourcemaps.write())
		.pipe(gulp.dest('dist/css'))
		.pipe(bs.reload ({
			stream: true
		}));
});

gulp.task('scripts', function () {
	return gulp.src(['src/js/libs.js',
									 'src/js/common.js'
		])
		.pipe(glp.concat('scripts.min.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(bs.reload ({
			stream: true
		}));
});

gulp.task('img', function () {
	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img'))
});

gulp.task('bs', function() {
	bs.init({
		server: {
			baseDir: "./dist"
		}
	});
});

gulp.task('watch', function () {
	gulp.watch('src/pug/*.pug', gulp.series('pug'));
	gulp.watch('src/stylus/*.styl', gulp.series('stylus'));
});

gulp.task('default', gulp.series(
	gulp.parallel('pug', 'stylus', 'scripts'),
	gulp.parallel('watch', 'bs')
));