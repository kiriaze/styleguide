var gulp           = require('gulp'),
	browserSync    = require('browser-sync'),
	bs             = browserSync.create(),
	del            = require('del'),
	// gulp-load-plugins will only load plugins prefixed with gulp
	plugins        = require('gulp-load-plugins')(),
	path           = require('path'),
	mainBowerFiles = require('main-bower-files'),
	browserify     = require('browserify'),
	source         = require('vinyl-source-stream'),
	buffer         = require('vinyl-buffer'),
	runSequence    = require('run-sequence');

// Notes:
// Consider https://github.com/assemble/assemble
//
// This styleguide works as a standalone
// but can possibly be included within your project
// and separated by example below
// gulpfile.js in your main project:
	// require('./gulp');
	// require('./styleguide/gulp');

// Config
config = {

	'serverport': 3000,

	'styles': {
		'src' : 'src/assets/scss',
		'dest': 'dist/assets/css',
		'order': []
	},

	'scripts': {
		'src' : 'src/assets/js',
		'dest': 'dist/assets/js',
		'order': [
			'**/**/jquery.js',
			'**/**/jquery.easing.js',
			'**/**/*.js'
		]
	},

	// gh-pages default pushes to gh-pages branch.
	// remoteUrl: '', By default gulp-gh-pages assumes the current working directory is a git repository and uses its remote url. If your gulpfile.js is not in a git repository, or if you want to push to a different remote url ( username.github.io ), you can specify it. Ensure you have write access to the repository.
	// branch by default is gh-pages. set to master for username.github.io
	// set source to what dir you want to push to github
	'githubPages': {
		'remoteUrl'	: '',
		'branch'	: '',
		'source'	: 'dist/**/*'
	},

	'bowerDir' : 'src/assets/vendor' ,

	'src' : {
		'root' : 'src'
	},

	'dist': {
		'root'  : 'dist'
	}
}

// GH Pages
var options = {
    remoteUrl: config.githubPages.remoteUrl,
    branch: config.githubPages.branch
};

gulp.task('gh-pages', function() {
	return gulp.src(config.githubPages.source)
		.pipe(plugins.ghPages(options));
});


// Init/install Bower
gulp.task('bower', function() {
	return plugins.bower(config.bowerDir)
    	.pipe(gulp.dest(config.bowerDir))
});

// Start browserSync server
// lsof -i tcp:3000
// kill -9 PID
gulp.task('browserSync', function() {
	// Now init the Browsersync server
	bs.init({
		server: {
			baseDir: config.dist.root
		},
		port: config.serverport
		// Can't have both server and proxy, pick one.
		// proxy: {
		// 	target: 'http://site.dev'
		// }
	});
});


// Compile, concat, minify, autoprefix and sourcemap SCSS + bower
gulp.task('sass', function() {

	var files = mainBowerFiles('**/*.css');
	console.log('css bower files: ', files);

	// targets single file instead of dir since gulp runs better
	files.push(config.styles.src + '/main.scss');

	return gulp.src(files)
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.sass({
				outputStyle: 'compressed'
			}).on('error', plugins.sass.logError))
			.pipe(plugins.autoprefixer('last 2 versions'))
			.pipe(plugins.sourcemaps.write('../maps'))
		.pipe(gulp.dest(config.styles.dest))
		.pipe(plugins.filter('**/*.css')) // filters out css so browsersync css injection can work with sourcemaps
		.pipe(bs.reload({stream: true}));
});

// minify, concat, uglify, sourcemap + bower
// note: instead of running mainBowerFiles within js task, slowing down the watch task - pull out into its own task, and render a file separate from app.js like plugins.js and require it within app.js
gulp.task('js', function(){

	var files = mainBowerFiles('**/*.js');
	console.log('js bower files: ', files);

	// everything but src/app.js, then add dist/app.js since browserify outputs that
	files.push(config.scripts.src + '/**/*.js', '!' + config.scripts.src + '/app.js');
	files.push(config.scripts.dest + '/app.js');

	return gulp.src(files)
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.order(config.scripts.order))
			.pipe(plugins.uglify())
			.pipe(plugins.concat('app.js'))
		.pipe(plugins.sourcemaps.write('./')) // writing relative to gulp.dest path
		.pipe(gulp.dest(config.scripts.dest))
		.pipe(bs.reload({stream:true}))
});

// Browserify ( for requiring modules ) ran before js task
gulp.task('browserify', function() {

	var b = browserify({
		entries: config.scripts.src + '/app.js',
		// entries: files, // need globbing recipe..
		debug: true
	});

	return b.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(plugins.sourcemaps.init({loadMaps: true}))
			// Add transformation tasks to the pipeline here.
			.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(config.scripts.dest));

});

// Optimizing Images
gulp.task('images', function() {
	return gulp.src(config.src.root + '/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
		// Caching images that ran through imagemin
		.pipe(plugins.cache(plugins.imagemin({
			interlaced: true,
		})))
		.pipe(gulp.dest(config.dist.root + '/assets/images'))
});

// Copying fonts
gulp.task('fonts', function() {
	return gulp.src(config.src.root + '/assets/fonts/**/*')
		.pipe(gulp.dest(config.dist.root + '/assets/fonts'))
});

// CNAME
gulp.task('cname',function(){
	return gulp.src('CNAME')
		.pipe(gulp.dest(config.dist.root))
});

// Cleaning
gulp.task('clean', function(callback) {
	del(config.dist.root);
	return plugins.cache.clearAll(callback);
});


// json/jade styleguide
gulp.task('styleguide', function() {

	var fs 		= require('fs');

	return gulp.src(config.src.root + '/modules/**/*.jade')
		.pipe(plugins.data(function(file) {
			// console.log(file);
			return JSON.parse(fs.readFileSync(path.dirname(file.path) + '/_data.json')); // running watch and because require calls are cached, changes to json don't show up unless you restart the task
		}))
		.pipe(plugins.jade({pretty: true})
			.on('error', function(err) {
				console.log(err)
			}))
		.pipe(plugins.concat('modules.html'))
		.pipe(gulp.dest(config.src.root))
		.pipe(bs.reload({stream:true}))
});

// fileinclude partials. e.g. modules.html into index.html
gulp.task('fileinclude', function() {
	gulp.src([config.src.root + '/index.html']) // only target index, dont want anything else sent to dist
		.pipe(plugins.fileInclude())
		.pipe(gulp.dest(config.dist.root))
		.pipe(bs.reload({stream:true}))
});

// html - have fileinclude run before html so nothing breaks
gulp.task('html', ['fileinclude'], function() {
	gulp.src([config.src.root + '/**/*.html'])
		.pipe(gulp.dest(config.dist.root));
});


// Watchers
gulp.task('watch', function() {

	// utilizing browsersync.watch - much faster than gulp.watch

	bs.watch(config.src.root + '/**/*.html', function (event, file) {
		if ( event === 'change' ) {
			runSequence('fileinclude', bs.reload)
		}
	});

	bs.watch(config.src.root + '/**/*.scss', function (event, file) {
		if ( event === 'change' ) {
			runSequence('sass')
			bs.reload('*.css'); // for injection only
		}
	});

	bs.watch(config.src.root + '/**/*.js', function (event, file) {
		if ( event === 'change' ) {
			// required to run sequentially
			runSequence('browserify', 'js', bs.reload)
		}
	});

	bs.watch(config.src.root + '/**/*.js', function (event, file) {
		if ( event === 'change' ) {
			// required to run sequentially
			runSequence('browserify', 'js', bs.reload)
		}
	});

	bs.watch([
		config.src.root + '/modules/**/*.jade',
		config.src.root + '/modules/**/*.json'
	], function(event, file){
		if ( event === 'change' ) {
			// required to run sequentially
			runSequence('styleguide', 'fileinclude', bs.reload)
		}
	});

});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
	runSequence(
		'clean',
		'bower',
		'styleguide',
		'fileinclude',
		'sass',
		'browserify',
		'js',
		'images',
		'fonts',
		'cname',
		'browserSync',
		'watch',
		callback
	)
});
