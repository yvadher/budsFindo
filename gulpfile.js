var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  target = 'builds/angular/',
  connect = require('gulp-connect');;

gulp.task('js', function() {
  gulp.src(target + 'js/*');
});

gulp.task('html', function() {
  gulp.src(target + '*.html');
});

gulp.task('css', function() {
  gulp.src(target + 'css/*.css');
});

gulp.task('watch', function() {
  gulp.watch(target + 'js/**/*', ['js']);
  gulp.watch(target + 'css/*.css', ['css']);
  gulp.watch([target + '*.html',
    target + 'views/*.html'], ['html']);
});

gulp.task('webserver', function() {
  connect.server({
    root: ['./builds/angular/'],
    port: process.env.PORT || 5000, // localhost:5000
    livereload: false
  });
  // gulp.src(target)
  //   .pipe(webserver({
  //     livereload: true,
  //     open: true
  //   }));
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'webserver']);
