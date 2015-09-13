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
	runSequence    = require('run-sequence'),
	glob           = require('glob'),
	fs             = require('fs'),
	es             = require('event-stream');

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

// parted out mainbowerfiles into its own function
gulp.task('mbf', function () {
	gulp.src(mainBowerFiles({includeDev: true}).filter(function (f) { return f.substr(-2) === 'js'; }))
		.pipe(plugins.uglify())
		.pipe(plugins.concat('vendor.js'))
		.pipe(gulp.dest('dist/assets/js/'));
});


// Compile, concat, minify, autoprefix and sourcemap SCSS + bower
gulp.task('sass', function() {

	var files = config.styles.src + '/main.scss';

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
gulp.task('js', function(){

	var files = [config.scripts.dest + '/modules.js', config.scripts.dest + '/app.js'];

	return gulp.src(files)
		.pipe(plugins.sourcemaps.init())
			// .pipe(plugins.order(config.scripts.order))
			// .pipe(plugins.uglify()) // super slow
			// .pipe(plugins.concat('app.js'))
		.pipe(plugins.sourcemaps.write('../maps')) // writing relative to gulp.dest path
		.pipe(gulp.dest(config.scripts.dest))
		.pipe(bs.reload({stream:true}))
});

// Browserify ( for requiring modules ) ran before js task
gulp.task('browserify', function() {

	// var globbedFiles = glob.sync(config.scripts.src + '/**/*.js');

	// bundles
	var files = [
		config.scripts.src + '/app.js',
		config.scripts.src + '/modules.js'
    ];

    var tasks = files.map(function(entry, output) {
    	output = entry.replace('src/',''); // change entry/ouput
		return browserify({
			entries: [entry],
			noParse: [config.bowerDir + '/jquery/dist/jquery.min.js']
		})
            .bundle()
			.pipe(source(output))
			// .pipe(buffer())
			// .pipe(plugins.sourcemaps.init({loadMaps: true}))
			// 	// Add transformation tasks to the pipeline here.
			// 	.pipe(plugins.uglify())
			// .pipe(plugins.sourcemaps.write('../maps'))
			.pipe(gulp.dest(config.dist.root))
			.pipe(bs.reload({
				stream: true
	        }))
	});

	// create a merged stream
    return es.merge.apply(null, tasks);

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


// json/jade root
gulp.task('jade', function() {

	var data = JSON.parse(fs.readFileSync('_data.json'));

	return gulp.src(config.src.root + '/*.jade')
		.pipe(plugins.jade({
			pretty: true,
			locals: data
		})
			.on('error', function(err) {
				console.log(err)
			})
		)
		.pipe(gulp.dest(config.dist.root))
});


// json/jade styleguide
gulp.task('styleguide', function() {
	return gulp.src(config.src.root + '/modules/**/*.jade')
		.pipe(plugins.data(function(file) {
			// console.log(file.path);
			return JSON.parse(fs.readFileSync(path.dirname(file.path) + '/_data.json'));
		}))
		.pipe(plugins.jade({
			pretty: true
		})
			.on('error', function(err) {
				console.log(err)
			})
		)
		.pipe(plugins.concat('modules.html'))
		.pipe(gulp.dest(config.src.root))
});

// Watchers
gulp.task('watch', function() {

	// utilizing browsersync.watch - much faster than gulp.watch

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

	// only modules
	bs.watch([
		config.src.root + '/modules/**/*.jade',
		config.src.root + '/modules/**/*.json'
	], function(event, file){
		if ( event === 'change' ) {
			// required to run jade after for update of modules.html
			runSequence('styleguide', 'jade', bs.reload)
		}
	});

	// styleguide structure
	bs.watch([
		config.src.root + '/*.jade',
		config.src.root + '/templates/*.jade',
		'_data.json'
	], function(event, file){
		if ( event === 'change' ) {
			runSequence('jade', bs.reload)
		}
	});

});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
	runSequence(
		'clean',
		'bower',
		'mbf',
		'styleguide',
		'jade',
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
