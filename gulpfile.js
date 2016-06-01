var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require("browser-sync").create();
var eslint = require('gulp-eslint');

gulp.task('default', ['styles', 'lint'], function() {
  // place code for your default task here
	gulp.watch('./static/sass/**/*.scss', ['styles']);
	gulp.watch('./static/js/**/*.scss', ['lint']);
	browserSync.init({
		proxy: '127.0.0.1:5000'
	});
	console.log("hello gulp!");
});

gulp.task('lint', function() {
	return gulp.src(['./static/js/**/*.js'])
	// eslint() attaches the lint output to the eslint property
	.pipe(eslint())
	// Output to console
	.pipe(eslint.format());
});

// Conver scss files to css
gulp.task('styles', function() {
	gulp.src('./static/sass/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});