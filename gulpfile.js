/*
 *  Copyright 2018 Willamette University
 *
 *  This file is part of OAI-PHM Service.
 *  
 *  @author Michael Spalti
 *
 *  OAI-PHM Service is based on the Modular OAI-PMH Server, University of Helsinki, 
 *  The National Library of Finland.
 *
 *  OAI-PHM Service is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  OAI-PHM Service is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OAI-PHM Service.  If not, see <http://www.gnu.org/licenses/>.
 */

var gulp = require("gulp");
var ts = require("gulp-typescript");
require('source-map-support').install();

gulp.task("build", function () {
    return gulp.src("src/**/*.ts")
        .pipe(ts({
            noImplicitAny: false,
            target: "es6",
            module: "commonjs",
            sourceMap: true,

        })).pipe(gulp.dest("dist"));
});

gulp.task("copy", function() {
    return gulp.src([".env"])
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-production", function() {
    return gulp.src(["production/.env", "production/host_config.json"])
        .pipe(gulp.dest("dist/server"));
});


const rimraf = require('rimraf');

gulp.task("dist-clean", function(done) {

try {
  rimraf.sync('dist');
} catch (err) {
  console.error('Error deleting files:', err);
}
done();
});

