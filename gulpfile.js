//编写任务
const gulp = require('gulp');

//所有.html处理
gulp.task('copy-html', function(){
    return gulp.src('*.html')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
})

//图片
gulp.task('images' , function(){
    return gulp.src('*.{jpg,png}')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
})

//数据源的拷贝
gulp.task('data', function(){
    return gulp.src(['*.json','!package.json'])
    .pipe(gulp.dest('dist/data'))
    .pipe(connect.reload());
})

//js代码拷贝
gulp.task('scripts', function(){
    return gulp.src(['*.js','!gulpfile.js'])
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
})

/*
    gulp-sass
    gulp-minify-css
    gulp-rename
*/

const scss = require('gulp-sass');
const minifyCSS = require('gulp-minify-css');
const rename = require('gulp-rename');

gulp.task('scss1',function(){
    return gulp.src('scss/index.scss')
    .pipe(scss())
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCSS())
    .pipe(rename('index.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
})

gulp.task('scss2',function(){
    return gulp.src('scss/banner.scss')
    .pipe(scss())
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCSS())
    .pipe(rename('banner.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
})

//上述这些代码都是我们静态文件的处理
//一次性执行多个任务
gulp.task('build',['copy-html','images','data','scripts','scss1','scss2'], function(){
    console.log('项目建立成功');
});

/*
  启动监听
*/
gulp.task('watch',function(){
    gulp.watch('*.html',['copy-html']);
    gulp.watch('*.{jpg,png}',['images']);
    gulp.watch(['*.json','!package.json'],['data']);
    gulp.watch(['*.js','!gulpfile.js'],['scripts']);
    gulp.watch('scss/index.scss',['scss1']);
    gulp.watch('scss/banner.scss',['scss2']);
})


/*
   启动一个服务器
   gulp-connect
*/

const connect = require('gulp-connect');
gulp.task('server', function(){
    connect.server({
        root: 'dist',
        port: 8886,
        livereload: true
    })
})

gulp.task('default',['server','watch']);