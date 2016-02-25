const gulp = require('gulp'); 
const traceur = require('gulp-traceur');
const jshint = require('gulp-jshint');
const webserver = require('gulp-webserver');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');

var config = {    
    jsPath: ['app/**/*.js'],
    htmlPath: ['app/*.html', 'app/**/*.html'],
    dist: 'dist',
    jshint:'.jshintrc',
    vendor: 'bower_components/**/*.**'
};

gulp.task('lint', () => {
    return gulp.src(config.jsPath)
        .pipe(jshint(config.jshint))
        .pipe(jshint.reporter('default'));
});

gulp.task('serve', () => {
    gulp.src(config.dist)
        .pipe(webserver({
            livereload: true,
            directoryListing: {
                enable: true,
                path: config.dist
            },
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('clean', () => {
 return gulp.src(config.dist)
    .pipe(clean());
});

gulp.task('copy', ['clean'], () => {
    gulp.src(config.htmlPath)
        .pipe(gulp.dest(config.dist));
    gulp.src(config.vendor)
        .pipe(gulp.dest(config.dist + '/bower_components'));
});

gulp.task('watch', () => {
    gulp.watch(config.jsPath
        .concat(config.htmlPath)
        .concat('gulpfile.js'), 
    ['lint', 'copy', 'traceur']);
}); 

gulp.task('traceur', ['clean'], () => {
	return gulp.src(config.jsPath) //traceur.RUNTIME_PATH
        .pipe(sourcemaps.init())
		.pipe(traceur({modules:'instantiate', moduleName: true}))
        .pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.dist));
});

gulp.task('default', ['clean', 'lint','copy', 'traceur', 'serve', 'watch']);