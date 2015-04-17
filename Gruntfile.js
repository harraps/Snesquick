// http://thebigbrainscompany.com/blog/posts/intgration-grunt-et-bower-au-sein-d-une-application-symfony
// http://konradpodgorski.com/blog/2014/06/23/better-way-to-work-with-assets-in-symfony-2/

// Gruntfile.js
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-symlink');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Création du répertoire d'image pour l'application s'il n'existe pas.
    grunt.file.mkdir('app/Resources/public/images/');

    // properties are css files
    // values are less files
    var filesLess = {};

    // Configuration du projet
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Définition de la tache 'less'
        // https://github.com/gruntjs/grunt-contrib-less
        less: {
            bundles: {
                files: filesLess
            }
        },
        // Définition de la tache 'symlink'
        // https://github.com/gruntjs/grunt-contrib-symlink
        symlink: {
            // app/Resources/public/ doit être disponible via web/bundles/app/
            app: {
                dest: 'web/bundles/app',
                relativeSrc: '../../app/Resources/public/',
                options: {type: 'dir'}
            },
            // Gestion des glyphicons
            bootstrap_glyphicons_white: {
                dest: 'app/Resources/public/images/glyphicons-halflings-white.png',
                relativeSrc: '../../../../web/vendor/bootstrap/img/glyphicons-halflings-white.png',
                options: {type: 'file'}
            },
            // Gestion des glyphicons
            bootstrap_glyphicons: {
                dest: 'app/Resources/public/images/glyphicons-halflings.png',
                relativeSrc: '../../../../web/vendor/bootstrap/img/glyphicons-halflings.png',
                options: {type: 'file'}
            },
            // Gestion de FontAwesome
            font_awesome: {
                dest: 'app/Resources/public/fonts/awesome',
                relativeSrc: '../../../../web/vendor/font-awesome/font/',
                options: {type: 'dir'}
            }
        },
        concat: {
            dist: {
                src: [
                    'web/vendor/jquery/jquery.js',
                    'web/vendor/bootstrap/js/bootstrap-transition.js',
                    'web/vendor/bootstrap/js/bootstrap-alert.js',
                    'web/vendor/bootstrap/js/bootstrap-modal.js',
                    'web/vendor/bootstrap/js/bootstrap-dropdown.js',
                    'web/vendor/bootstrap/js/bootstrap-scrollspy.js',
                    'web/vendor/bootstrap/js/bootstrap-tab.js',
                    'web/vendor/bootstrap/js/bootstrap-tooltip.js',
                    'web/vendor/bootstrap/js/bootstrap-popover.js',
                    'web/vendor/bootstrap/js/bootstrap-button.js',
                    'web/vendor/bootstrap/js/bootstrap-collapse.js',
                    'web/vendor/bootstrap/js/bootstrap-carousel.js',
                    'web/vendor/bootstrap/js/bootstrap-typeahead.js',
                    'web/vendor/bootstrap/js/bootstrap-affix.js',
                    'web/bundles/app/js/wozbe.js'
                ],
                dest: 'web/built/app/js/wozbe.js'
            }
        },
        // Lorsque l'on modifie des fichiers LESS, il faut relancer la tache 'css'
        // Lorsque l'on modifie des fichiers JS, il faut relancer la tache 'javascript'
        watch: {
            css: {
                files: ['web/bundles/*/less/*.less'],
                tasks: ['css']
            },
            javascript: {
                files: ['web/bundles/app/js/*.js'],
                tasks: ['javascript']
            }
        },
        uglify: {
            dist: {
                files: {
                    'web/built/app/js/snesquick.min.js': ['web/built/app/js/snesquick.js']
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['css', 'javascript']);
    grunt.registerTask('css', ['less:discovering', 'less']);
    grunt.registerTask('javascript', ['concat', 'uglify']);
    grunt.registerTask('assets:install', ['symlink']);
    grunt.registerTask('deploy', ['assets:install', 'default']);
    grunt.registerTask('less:discovering', 'This is a function', function() {
        // LESS Files management
        // Source LESS files are located inside : bundles/[bundle]/less/
        // Destination CSS files are located inside : built/[bundle]/css/
        var mappingFileLess = grunt.file.expandMapping(
            ['*/less/*.less', '*/less/*/*.less'],
            'web/built/', {
                cwd: 'web/bundles/',
                rename: function(dest, matchedSrcPath, options) {
                    return dest + matchedSrcPath.replace(/less/g, 'css');
                }
            });

        grunt.util._.each(mappingFileLess, function(value) {
            // Why value.src is an array ??
            filesLess[value.dest] = value.src[0];
        });
    });

};