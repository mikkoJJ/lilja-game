// http://24ways.org/2013/grunt-is-not-weird-and-hard/
/* global module */

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> by <%= pkg.author %>, <%= grunt.template.today("dd.mm.yyyy") %> */\n'
          },
          dist: {
              src: ['src/*/*'],
              dest: 'dist/<%= pkg.name %>.min.js'
          }
        },
        
        htmlbuild: {
            dist: {
                src: 'index.html',
                dest: 'dist/',
                options: {
                    beautify: true,
                    //prefix: '//some-cdn',
                    relative: true,
                    scripts: {
                        main: '<%= uglify.dist.dest %>'
                    },
                    data: {
                        // Data to pass to templates
                        version: '<%= pkg.version %>',
                        title: 'Lilja',  
                    },
                }
            }
        },
        
        copy: {
            dist: { 
                files: [
                    {
                        src: ['*.css'],
                        dest: 'dist/',
                    },
                    { 
                        expand: true,
                        cwd: 'assets/',
                        src: ['*', 'audio/*', 'graphics/*'], 
                        dest: 'dist/assets',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'lib/',
                        src: ['*.js'],
                        dest: 'dist/lib/'
                    }
                ]
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html-build');
    
    grunt.registerTask('default', ['uglify', 'htmlbuild', 'copy']);
};

