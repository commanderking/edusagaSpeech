var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require("browser-sync").create();

gulp.task('default', ['styles'], function() {
  // place code for your default task here
  	gulp.watch('/static/sass/**/*.scss', ['styles']);
	browserSync.init({
		proxy: '127.0.0.1:5000'
	});
  	console.log("hello gulp!");
});

// Conver scss files to css
gulp.task('styles', function() {
	gulp.src('static/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./static/css'))
		.pipe(browserSync.stream());
});