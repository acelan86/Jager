'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    logo:         ' * \n' + 
                    ' *                          $$!   ;$;\n' +                      
                    ' *                    !$  $$$$  !$$$   ;;\n' +                   
                    ' *                 $ *$$;$$$$$$$$$$;*$$$\n' +                   
                    ' *                $$$$$$$$$$$$$$$$$$$$$\n' +                    
                    ' *               $$$$$$;         o$$$$$o\n' +                   
                    ' *              *$$$   *#####;     $$$$$\n' +                   
                    ' *              $$$   &#$*!###     $$$$!\n' +                   
                    ' *              $$$;  $#!!###$   ;$$$$\n' +                    
                    ' *                $$$o  ;**   !$$$$!\n' +                      
                    ' *          !$&&&&$!  o$$$$$$o;   ;$&###&!     ;o$&&##&$;\n' + 
                    ' *       ###########$ o####*  #############!  o############\n' + 
                    ' *     ;#####;        #####  $####    *####;          ####*\n' + 
                    ' *      ###########  o####   ####;    ####$  $######;o####\n' + 
                    ' *          ;*#####o ####$  ####&    !#### o####     ####\n' +  
                    ' *    ####$**&####$ ;####  o####     ####o &####$o$#####\n' +  
                    ' *   ;o########$    *###   ####!    &####   ;######&!\n' +     
                    ' *                 ###;\n' +                                 
                    ' *                  ##o\n' +                                   
                    ' *                 ;#!\n' +                                     
                    ' *                 ;\n',
    footer: '/* publish <%= pubtime %> */',
    pubtime : '<%= grunt.template.today("yyyy-mm-dd H:MM:ss") %>',
    // Task configuration.
    // copy: {
    //   cssimg : {
    //     files:[
    //       {expand: true, cwd: 'src/core/esui/css/img/', dest: 'release/img/', src: ['**']},
    //       {expand: true, cwd: 'src/css/img/', dest: 'release/img/', src: ['**']}
    //     ]
    //   }
    // },
    // 
    smash: {
      bundle: {
        src: 'src/sinaads/main.js',
        dest: 'src/sinaads.js'
      }
    },
    jshint : {
      options : {
        "bitwise": false,
        "curly": true,
        "eqeqeq": true,
        "forin": false,
        "immed": true,
        "latedef": true,
        "newcap": true,
        "noarg": true,
        "noempty": true,
        //"nonew": true,
        "plusplus": false,
        "regexp": true,
        "undef": true,
        "unused": true,
        "strict": true,
        "trailing": true,
        // "camelcase": true,
        // "quotmark": true,
        "asi": false,
        "boss": false,
        "debug": false,
        "eqnull": false,
        "esnext": true,
        "evil": true,
        "es3":true,
        "expr": true,
        "funcscope": false,
        "globalstrict": false,
        "iterator": false,
        "lastsemic": false,
        "laxbreak": false,
        "laxcomma": false,
        "loopfunc": false,
        "multistr": false,
        "onecase": false,
        "proto": false,
        "regexdash": false,
        "scripturl": true,
        "smarttabs": false,
        "shadow": false,
        "sub": false,
        "supernew": false,
        "validthis": false,
        "browser": true,
        "couch": false,
        "devel": false,
        "node": true,
        "nonstandard": false,
        "rhino": false,
        "wsh": false,
        "worker": true,
        "nomen": false,
        "onevar": false,
        "passfail": false,
        //"white": true,
        "maxerr": 100,
        //"maxlen": 100,
        "maxparams": 10,
        "maxdepth": 10,
        //"indent": 4
      },
      files: ['src/**/*.js'],
    },
    concat : {
      SATK : {
        files : [
          { dest : 'src/SATK.full.js', src : ['src/define.js', 'src/SATK/*.js'] }
        ]
      },
      Jager : {
        files : [
          { dest : 'src/Jager.full.js', src : ['src/define.js', 'src/SATK/*.js', 'src/Jager/*.js'] }
        ]
      },
      JagerForApp : {
        files : [
          { dest : 'src/JagerForApp.full.js', src : ['src/define.js', 'src/SATK/*.js', 'src/JagerForApp/*.js'] }
        ]
      }
    },
    uglify: {
      options : {
        report : 'gzip',
        beautify : {
          ascii_only : true
        },
        sourceMapRoot : '<%= pkg.sourceRoot %>'
      },
      SATK : {
        options : {
          //preserveComments:'some',
          banner : '/*!\n' + 
                    ' * SATK\n' +
                    ' * @author acelan <xiaobin8[at]staff.sina.com.cn>\n' +
                    ' * @version 1.0.0\n' +
                    '<%= logo %>' + 
                    ' */\n',
          sourceMap: 'SATK.js.map'
        },
        files : [
          { dest : 'release/SATK.js', src : 'src/SATK.full.js'}
        ]
      },
      Jager : {
        options : {
          //preserveComments:'some',
          banner : '/*!\n' + 
                    ' * Jager\n' +
                    ' * @author acelan <xiaobin8[at]staff.sina.com.cn>\n' +
                    ' * @version 1.0.0\n' +
                    '<%= logo %>' + 
                    ' */\n',
          sourceMap: 'Jager.js.map'
        },
        files : [
          { dest : 'release/Jager.js', src : 'src/Jager.full.js'}
        ]
      },
      JagerForApp : {
        options : {
          //preserveComments:'some',
          banner : '/*!\n' + 
                    ' * Jager for app\n' +
                    ' * @author acelan <xiaobin8[at]staff.sina.com.cn>\n' +
                    ' * @version 1.0.0\n' +
                    '<%= logo %>' + 
                    ' */\n',
          sourceMap: 'JagerForApp.js.map'
        },
        files : [
          { dest : 'release/JagerForApp.js', src : 'src/JagerForApp.full.js'}
        ]
      }
    },
    copy: {
      sourcemap : {
        files:[
          {dest: 'release/plus/', src: 'Media.js.map'}
        ]
      }
    },
    watch: {
      // 在mac node version v0.10.21 下有下面的设置时，会报错，信息：Waiting...[3]    1252 segmentation fault (core dumped)  grunt
      // 导致watch 终止，connect任务结束 所以调试时注释掉。added by fedeoo 
      script : {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify']
      }
    },
    connect: {
      server: {
        options: {
          hostname: '*',//设置所有的host都能访问
          port: 1234
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-smash');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'connect', 'watch']);
  //grunt.registerTask('nouglify', ['jshint', 'concat']);
  //grunt.registerTask('nowatch', ['jshint', 'concat', 'uglify']);

};
