var gulp = require('gulp'),
  fs = require('fs'),
  path = require('path'),
  runSequence = require('run-sequence'),
  mainBowerFiles = require('main-bower-files'),
  browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var paths = {
  vendors: {
    dest: path.join(__dirname, 'build/assets/vendor')
  },
  views: {
    src: path.join(__dirname, 'src/templates/**/*.jade'),
    dest: path.join(__dirname, 'build'),
    filter: ['**/*.jade', '!**/_*']
  },
  coffee: {
    src: path.join(__dirname, 'src/coffee/**/*.coffee'),
    dest: path.join(__dirname, 'build/assets/js')
  }
} 

gulp.task('install', function() {
  return $.bower();
});

gulp.task('vendor', function() {
  return gulp.src(mainBowerFiles(), {
      base: path.join(__dirname, 'bower_components')
    })
    .pipe(gulp.dest(paths.vendors.dest));
});


gulp.task('templates', function() {

  gulp.src(paths.views.src)
   .pipe($.filter(paths.views.filter))
   .pipe($.jade({
       pretty: true
    }))
    .pipe(gulp.dest(paths.views.dest));
});

gulp.task('coffee', function() {

  gulp.src(paths.coffee.src)
    .pipe($.coffee({bare: true}).on('error', $.util.log))
    .pipe(gulp.dest(paths.coffee.dest));
});

gulp.task('build', function(callback) {
  runSequence( 'install', ['vendor', 'templates', 'coffee'],
    callback);
});



gulp.task('default', ['build'], function(done) {
  browserSync({
   server: {
          baseDir: "./build"
      },
    injectChanges: true,
    logConnections: false,
    logSnippet: false,
    logLevel: 'info',
    ghostMode: false,
    online: false,
    notify: true,
    open: false
  }, done);

  gulp.watch(paths.views.src, ['templates', browserSync.reload]);
  gulp.watch(paths.coffee.src, ['coffee', browserSync.reload]);
});

