import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import concat from 'gulp-concat';
import babel from 'gulp-babel';

gulp.task('markup', (done) => {
    return gulp.src('./index.html')
        .pipe( gulp.dest('./dist/') );

    // done();
});

gulp.task('img', (done) => {
    gulp.src('./src/img/*.{png,gif,jpg}')
        .pipe( gulp.dest('./dist/img/') );

    done();
});

gulp.task('sass', (done) => {
    gulp.src('./src/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))

    done();
});

gulp.task('ie-css', (done) => {
    gulp.src('./src/scss/ie.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))

    done();
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
    .pipe(babel()) // IE9 testing purposes
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

    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass', 'ie-css'))
    .on('change', change)
    .on('unlink', unlink);

    gulp.watch('src/js/*.js', gulp.parallel('scripts'))
    .on('change', change)
    .on('unlink', unlink);

    gulp.watch('index.html', gulp.parallel('markup'))
    .on('change', change)
    .on('unlink', unlink);

});


gulp.task('develop', gulp.parallel('markup', 'img', 'sass', 'ie-css', 'webfonts', 'scripts'));

gulp.task('default', gulp.series('develop', gulp.parallel('watch', 'serve')));