// Данной строчкой мы подключаем Gulp к нашему проекту, посредством функции require. 
// Данная функция подключает пакеты из папки node_modules в наш проект, присваивая их переменной. 
const { src, dest, parallel, series, watch } = require('gulp');
// npm install gulp-htmlmin --save-dev
const minhtml = require('gulp-htmlmin');
// npm install --save-dev gulp-babel @babel/core @babel/preset-env
// Babel - это транспайлер, который переписывает код современного стандарта ES2015+ на более поздний
const babel = require('gulp-babel');
// npm install --save-dev gulp-uglify
// минификация JS кода. позволяет сжимать и минимизировать файлы JS/CSS до 80% от их первоначального размера
const uglify = require('gulp-uglify');
// npm install --save-dev gulp-concat
// Конкатенация (соеденить несколько файлов в один)
const concat = require('gulp-concat');
// npm install node-sass gulp-sass --save-dev
// преобразование Sass, Scss в CSS
const sass = require('gulp-sass');
// npm install gulp-clean-css --save-dev
// минификация CSS
const mincss = require('gulp-clean-css');
// npm install gulp-eslint -D
const eslint = require('gulp-eslint');
// npm i del -D
// удаление
const del = require('del');
// npm i browser-sync -D
const browserSync = require('browser-sync').create();

function moveHTML() {
    return src('index.html') // Берем источник
        .pipe(minhtml({
            collapseWhitespace: true, // удаляем все переносы
            removeComments: true // удаляем все комментарии
          }))
        .pipe(dest('build')) // Выгружаем результата в папку
        .pipe(browserSync.reload({stream:true}));
}

function buildJS() {
    return src('assets/js/*.js')
        //  eslint () присоединяет вывод линта к свойству "eslint"
        //  файлового объекта, чтобы его могли использовать другие модули.
        .pipe(eslint())
        //  eslint.format () выводит результаты линта на консоль.
        .pipe(eslint.format())
        //  Чтобы процесс завершился с кодом ошибки (1) на
        //  lint error, возвращаем поток и конвейер для failAfterError последними.
        .pipe(eslint.failAfterError())
        .pipe(babel({
            presets: ['@babel/env'] // берет любые указанные вами целевые среды и проверяет их на соответствие своим сопоставлениям, чтобы составить список плагинов и передает его Babel.
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
    
        .pipe(dest('build/js'))
        .pipe(browserSync.reload({stream:true}));
}

function buildCSS() {
    return src('assets/scss/*.scss')
        .pipe(sass())
        .pipe(mincss())
        .pipe(concat('styles.css'))
        .pipe(dest('build/style'))
        .pipe(browserSync.reload({stream:true}));
}

function launchBrowser() {
    browserSync.init({ //Запустит и инициализирует сервер
        server: 'build/'
    });
    watch('assets/js/*.js', buildJS,);
    watch('assets/scss/*.scss', buildCSS);
    watch('index.html', moveHTML);
}

function deleteBuild() {
    return del('build');
}

// default - gulp
exports.build = series(deleteBuild, parallel(moveHTML, buildJS, buildCSS), launchBrowser);