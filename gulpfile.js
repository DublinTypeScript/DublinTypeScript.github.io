"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp        = require("gulp"),
    uglify      = require("gulp-uglify"),
    rename      = require("gulp-rename"),
    concat      = require("gulp-concat"),
    runSequence = require("run-sequence");

//******************************************************************************
//* Bundle CSS
//******************************************************************************
gulp.task("bundle-css", function() {

    var files = [
        "./node_modules/animate.css/animate.min.css",
        "./node_modules/bootstrap/dist/css/bootstrap.min.css",
        "./src/css/site.css"
    ];

    return gulp.src(files)
        .pipe(concat("app.css"))
        .pipe(gulp.dest('./dist/'));

});

gulp.task("bundle-js", function() {

    var files = [
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.min.js",
        "./node_modules/handlebars/dist/handlebars.min.js",
        "./node_modules/masonry-layout/dist/masonry.pkgd.min.js",
        "./src/js/site.js"
    ];

    return gulp.src(files)
        .pipe(concat("app.js"))
        .pipe(gulp.dest('./dist/'));

});

gulp.task("default", function (cb) {
  runSequence(
    "bundle-css",
    "bundle-js",
    cb);
});
