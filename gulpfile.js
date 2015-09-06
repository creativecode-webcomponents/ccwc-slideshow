var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('slide', function () {
  return gulp.src('src/ccwc-slide.es6')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('ccwc-slide.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src'));
});

gulp.task('slideshow', function () {
  return gulp.src('src/ccwc-slideshow.es6')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('ccwc-slideshow.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src'));
});

gulp.task('default', ['slide', 'slideshow']);
