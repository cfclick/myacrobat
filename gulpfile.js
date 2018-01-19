var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
/*var paths = {
    pages: ['views/main/*.cfm']
};*/

/*gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});*/

gulp.task("default", [], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['includes/ts/Application.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("includes/js"));
});