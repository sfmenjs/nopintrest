
// Declare Dependencies

var gulp = require('gulp'),
order = require("gulp-order"),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
rename = require('gulp-rename'),
minifycss = require('gulp-minify-css'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
uglify = require('gulp-uglify'),
livereload = require('gulp-livereload');

// Task List

// SCSS to CSS + Minify

gulp.task('styles', function() {
  return sass('src/sass', { style: 'expanded'})
  .pipe(autoprefixer("last 2 versions"))
  .pipe(gulp.dest('dist/css'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(minifycss())
  .pipe(gulp.dest('dist/css'))
  .pipe(notify({ message : 'SCSS Complete' }));
});

// Bundle JS + Uglify

gulp.task('scripts', function() {
  return gulp.src(['src/javascript/**/*'])
  .pipe(concat('jsBundle.js'))
  .pipe(gulp.dest('dist/js/'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js/'))
  .pipe(notify({ message: 'JS Bundled and Uglified'}));
});

// Watch Task

gulp.task('watch', function() {
  livereload.listen({ start: true});
  gulp.watch(['./**', 'views/*']).on('change', livereload.changed);
  gulp.watch('src/sass/*', ['styles']);
  gulp.watch('src/javascript/**', ['scripts']);
});
