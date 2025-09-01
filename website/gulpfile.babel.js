import gulp from 'gulp';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass'
import { deleteAsync } from 'del';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const sass = gulpSass(dartSass);

// Rutas
const paths = {
  pug: {
    src: 'pug/pages/**/*.pug', // Sólo páginas
    watch: 'pug/**/*.pug', // Vigilar todo Pug
    dest: 'dist/',
  },
  scss: {
    src: 'scss/*.scss',
    watch: 'scss/**/*.scss',
    dest: 'dist/css/',
  },
  assets: {
    src: 'assets/**/*', // Archivos estáticos
    dest: 'dist/assets/',
  },
  scripts: {
    src: 'script/app.js', // Archivo de entrada de Rollup
    watch: 'script/**/*.js', // Vigilar todos los scripts
    watchNode: 'node_modules/@dnui/ui/dist/**/*.js', // Vigilar todos los scripts
    dest: 'dist/script/', // Carpeta de salida
  },
};

const rollupConfig = {
  input: paths.scripts.src,
  plugins: [
    resolve(), // Resolver módulos
    // terser(),  // Minificar con Terser
  ],
};

const rollupOutputOptions = {
  file: `${paths.scripts.dest}/app.js`,
  format: 'iife',
  // formats: ['es', 'cjs', 'umd', 'iife'],
  name: 'Sicuani',
  sourcemap: true,
};

// Servidor de desarrollo
const server = browserSync.create();

export const compilePug = () => {
  return gulp
    .src(paths.pug.src)
    .pipe(
      pug({
        pretty: true, // HTML legible
      })
    )
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(server.stream());
};

// Tarea: Procesar scss con Babel
export const processScss = () => {
  return gulp
    .src(paths.scss.src)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      includePaths: ['./node_modules']
    }))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(server.stream());
}

// Tarea: Copiar archivos estáticos
export const copyAssets = () => {
  return gulp.src(paths.assets.src).pipe(gulp.dest(paths.assets.dest));
};

export const bundleScripts = async () => {
  const bundle = await rollup(rollupConfig);
  await bundle.write(rollupOutputOptions);
};

// Tarea: Limpiar la carpeta `dist`
export const clean = () => deleteAsync(['dist']);

// Tarea: Servidor con recarga en tiempo real
export const serve = (done) => {
  server.init({
    server: {
      baseDir: 'dist',
    },
    port: 3000,
  });
  done();
};

// Tarea: Vigilar cambios
export const watchFiles = () => {
  gulp.watch(paths.pug.watch, compilePug); // Vigila cambios en Pug
  gulp.watch(paths.scss.watch, processScss); // Vigila cambios en SCSS
  gulp.watch(paths.assets.src, copyAssets); // Vigila cambios en assets
  gulp.watch(paths.scripts.watch, bundleScripts); // Vigila cambios en scripts
  gulp.watch(paths.scripts.watchNode, bundleScripts); // Vigila cambios en scripts
};

// Tarea predeterminada
export const dev = gulp.series(
  clean,
  // gulp.parallel(compilePug, processScss, copyAssets),
  gulp.parallel(compilePug, processScss, copyAssets, bundleScripts),
  serve,
  watchFiles
);

export default dev;
