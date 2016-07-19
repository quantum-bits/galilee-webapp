// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'materialize-css': 'materialize-src',
  'materialize': 'vendor/angular2-materialize',
  'angular2-materialize': 'vendor/angular2-materialize',
  'ng2-file-upload': 'vendor/ng2-file-upload/ng2-file-upload.js',
  'dragula': 'vendor/dragula/dist/dragula.js',
  'ng2-dragula': 'vendor/ng2-dragula'
};

/** User packages configuration. */
const packages: any = {
  'materialize-src': {
    'main': 'js/bin/materialize.min.js'
  },
  'materialize': {
    'main': 'dist/materialize-directive.js',
    //'defaultExtension': 'js'
  },
  'vendor/ng2-file-upload': {
    defaultExtension: 'js'
  },
  'vendor/dragula': {
    defaultExtension: 'js'
  },
  'vendor/ng2-dragula': {
    defaultExtension: 'js'
  }
};




////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/admin',
  'app/end-user',
  'app/end-user/reading-practice',
  'app/end-user/readings',
  'app/admin/side-nav',
  'app/admin/edit-reading-resources',
  'app/admin/update-practices',
  'app/admin/update-practices-modal',
  'app/admin/update-practice-item',
  'app/admin/update-resources',
  'app/admin/update-resource-item',
  'app/admin/upload-resource',
  'app/end-user/reading-item',
  'app/end-user/practice-item',
  'app/end-user/resource-item',
  'app/end-user/reading-resource',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
