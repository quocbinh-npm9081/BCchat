let mix = require('laravel-mix');
mix.js('./src/resources/js/app.js', './src/public/script/script.js')
    .js('./src/resources/js/chatPrivate.js', './src/public/script/chatPrivate.js')
    .sass('./src/resources/sass/app.scss', './src/public/style/style.css')
    .options({
        postCss: [require('tailwindcss')]
    })