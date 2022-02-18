const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const express = require('express');
const favicon = require('serve-favicon')
const sql = require('mssql');
const { fetchUrl } = require('fetch');

const app = express();
const port = process.env.PORT || 3000;

const config = {
    user: '****',
    password: '****',
    server: 'server.database.windows.net',
    database: 'db'
}

sql.connect(config).catch((err) => debug(err));

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/styling')));
app.use(favicon(path.join(__dirname, '/src/favicon.ico')))
app.set('views', './src/views');
app.set('view engine', 'ejs');

const route = require('./src/route/routing');
app.use('/apodList', route);

var article = "";

fetchUrl('https://api.nasa.gov/planetary/apod?api_key=****', //Get your own key at: https://api.nasa.gov
    function(error, meta, body) {
        article = JSON.parse(body.toString());
    }
)

app.get('/', function(req, res) {
    res.render('index', {
        navigation: [
            {link: '/', page: "Home"},
            {link: '/apodList', page: "APOD List"},
            {link: '/latest', page: "Latest APOD"}
        ],
        title: 'APOD Articles',
        subtitle: 'Astronomy Picture of the Day',
    });
});

app.get('/latest', function(req, res) {
    var date = new Date(article.date).toLocaleDateString();
    var textDate = new Date(article.date).toDateString();
    var copyright = "";
    if (article.copyright === "none" || article.copyright == null) {
        copyright = "Nasa";
    } else {
        copyright = article.copyright;
    }
    
    res.render('latest', {
        navigation: [
            {link: '/', page: "Home"},
            {link: '/apodList', page: "APOD List"},
            {link: '/latest', page: "Latest APOD"}
        ],
        title: 'Latest APOD Article',
        subtitle: 'Astronomy Picture of the Day',
        article: article,
        copyright: copyright,
        date: date,
        textDate: textDate
    });
});

app.listen(port, function() {
    debug((`listening on port ${chalk.green(port)}`));
})
