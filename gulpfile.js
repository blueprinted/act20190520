var gulp = require('gulp');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
var debug = require('gulp-debug');
var htmlmin = require('gulp-htmlmin');
var cssUglify = require('gulp-minify-css');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var clean = require('gulp-clean');
var pump = require('pump');
var del = require('del');


gulp.task('html',callback => {
    gulp.src('src/*.html')
    .pipe(debug({title:'html'}))
    .pipe(htmlmin({
        collapseWhitespace : true,
        removeComments : true
    })).on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('dist'));
    callback();
});

/* 这个会连同dist目录都删除..并且还会删除node_modules/目录下的一些文件
gulp.task('clean', function(callback) {
    pump([
        gulp.src('dist/'),
        clean()
    ], callback)
});
*/

gulp.task('clean', function(callback) {
    del([
        'dist/**/*'
    ], callback);
    callback();
});

gulp.task('css',function(callback){
    var processors = [px2rem({remUnit: 75})];
    gulp.src('src/static/c/*.css', {base:'src'})
    .pipe(debug({title:'css'}))
    .pipe(postcss(processors))
    //.pipe(cssUglify())
    .pipe(gulp.dest('dist/'));
    callback();
});

gulp.task('js',function(callback){
    gulp.src(['src/static/j/*.js'],{base:'src'})
    .pipe(babel())
    .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(debug({title:'js'}))
    .pipe(uglify())
    .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('dist/'));
    callback();
});
gulp.task('jsd',function(callback){
    gulp.src(['src/data/*.js'],{base:'src'})
    .pipe(babel())
    .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(debug({title:'js'}))
    .pipe(uglify())
    .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('dist/'));
    callback();
});

gulp.task('image',function(callback){
    gulp.src('src/static/i/**',{base:'src'})//要处理的图片目录为img目录下的所有的.jpg .png .gif 格式的图片;
    .pipe(debug({title:'image'}))
    .pipe(cache(imagemin({
        progressive : true,//是否渐进的优化
        svgoPlugins : [{removeViewBox:false}],//svgo插件是否删除幻灯片
        interlaced : true //是否各行扫描
    })))
    .pipe(gulp.dest('dist/'));
    callback();
});

gulp.task('copy',function(callback){
    gulp.src(
        [
            'bend/**'
        ],{base:'bend/'}
    )
    .pipe(debug({title:'copy'}))
    .pipe(gulp.dest('dist/bend/'));
    callback();
});

gulp.task('default', gulp.series('clean',gulp.parallel('html','css','js','jsd','image'), 'copy'));
