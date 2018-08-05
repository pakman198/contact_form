import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import concat from 'gulp-concat';
import rename from 'gulp-rename';

gulp.task('markup', (done) => {
    return gulp.src('./index.html')
        .pipe( gulp.dest('./dist/') );

    // done();
});

gulp.task('img', (done) => {
    return gulp.src('./src/img/*.{png,gif,jpg}')
        .pipe( gulp.dest('./dist/img/') );

    // done();
});

gulp.task('sass', (done) => {
    return gulp.src('./src/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        // .pipe(cleanCSS())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))

    //done();
});

gulp.task('webfonts', (done) => {
    gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('dist/webfonts'));

    done();
});

gulp.task('scripts', (done) => {
    gulp.src([
        'node_modules/jquery/dist/jquery.js',
        './src/js/vendor/jquery-ui/jquery-ui.js',
        './src/js/navbar.js',
        './src/js/form.js',
    ])
    .pipe(concat('bundle.js'))
    // .pipe(rename('bundle.js'))
    .pipe(gulp.dest('dist/js'));

    done();
});

const server = browserSync.create();

gulp.task('serve', (done) => {
    server.init({
        server: { baseDir: './dist/'}
    });

    // done();
});

const unlink = function(path, stats) {
    console.log('File ' + path + ' was removed');
    console.log('Watching for changes');
    server.reload();
}

const change = function(path, stats) {
    console.log('File ' + path + ' was changed');
    console.log('Watching for changes');
    server.reload();
};


// watcher
gulp.task('watch', (done) => {
    console.log('Watching for changes');

    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'))
    .on('change', change)
    .on('unlink', unlink);

    gulp.watch('src/js/*.js', gulp.parallel('scripts'))
    .on('change', change)
    .on('unlink', unlink);

    gulp.watch('index.html', gulp.parallel('markup'))
    .on('change', change)
    .on('unlink', unlink);

});

gulp.task('build', gulp.parallel('markup', 'img', 'sass', 'webfonts', 'scripts'));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));