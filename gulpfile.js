/**
 * Created by Administrator on 2017/6/14.
 */
// 引入gulp
var gulp = require('gulp');             // 基础库

// 引入gulp插件
var //livereload = require('gulp-livereload'), // 网页自动刷新（服务器控制客户端同步刷新）
    webserver = require('gulp-webserver'), 
// 本地服务器
    sass=require("gulp-ruby-sass"),   //sass编译插件
    uglify=require("gulp-uglify"),   //压缩js脚本
    rename=require("gulp-rename"),//引入min写法
    imagemin=require("gulp-imagemin"),//对图片进行压缩
    pngquant=require("imagemin-pngquant");// 对图片进行深度压缩的插件
// tp=require("gulp-tinypng-compres"); //对图片进行深度压缩的插件,需要去官网注册

// 注册任务
gulp.task('webserver', function() {
    gulp.src( './dist' ) // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            //livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

//把开发环境中的HTML文件，移动至发布环境
gulp.task('html', function() {
    return gulp.src('src/**/*.html') // 指明源文件路径、并进行文件匹配
        .pipe(gulp.dest('dist')); // 输出路径
});
//注册sass的任务
gulp.task("sass",function () {
    return sass("src/sass/**/*.scss",{style:"compact"})
        .on("error",function (err) {
            console.log("编译sass出错",err.message)
        })
        .pipe(gulp.dest("dist/css"))
});
//注册js压缩的任务
gulp.task("script",function () {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest("dist/js"))
});

//注册压缩图片得任务
gulp.task("imagemin",function () {
    return gulp.src('src/images/**/*.{png,JPG,gif,svg}')
        .pipe(imagemin({
            progressive:true,  //无损压缩jpg图片
            svgPlugins:[{removeVievbox:false}],  //不移除svg图片的viewbox属性
            use:[pngquant]  //使用pngquant插件进行深度压缩
        }))
        .pipe(gulp.dest("dist/images"))  //输出路径
});
gulp.task('watch',function(){
    // 监听 html
    gulp.watch('src/**/*.html', ['html']);
    // 监听 scss
    gulp.watch('src/sass/*.scss', ['sass']);
    // 监听 images
    gulp.watch('src/images/**/*.{png,jpg,gif,svg}', ['imagemin']);
    // 监听 js
    gulp.watch('src/js/*.js', ['script']);
});

// 默认任务
gulp.task('default',['sass','script','imagemin','html','webserver']);