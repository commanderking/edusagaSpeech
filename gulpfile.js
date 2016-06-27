var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require("browser-sync").create();
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

gulp.task('default', ['styles', 'lint'], function() {
  // place code for your default task here
	gulp.watch('./static/sass/**/*.scss', ['styles']);
	gulp.watch('./static/js/**/*.scss', ['lint']);
	browserSync.init({
		proxy: '127.0.0.1:5000',
		online: true
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

// Copy HTML for distribution
gulp.task('copy-html', function() {
	gulp.src('./templates/**/*.html')
		.pipe(gulp.dest('dist/templates'));
});

// Minify image file size 
gulp.task('image-dist', function() {
	gulp.src('./static/images/**/*.png')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'));
	gulp.src('./static/images/**/*.jpg')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'));
});

// Convert scss files to css
gulp.task('styles', function() {
	gulp.src('./static/sass/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./static/css'))
		.pipe(browserSync.stream());
});


// Minify js files
gulp.task('scripts-dist', function() {
	gulp.src('./static/js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});

// Produce production ready code
gulp.task('dist', ['scripts-dist', 'styles']);