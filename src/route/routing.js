const express = require('express');
const router = express.Router();
const sql = require('mssql');
const debug = require('debug')('app:router');

router.route('/').get((req, res) => {(
    async function query() {
        const request = new sql.Request();
        const result = await request.query('select * from articles');
        console.log(result.recordset);
        var shortExplanation = [];
        for (var i = 0; i < result.recordset.length; i++) {// have to do this as max-lines doesn't work in css
            shortExplanation.push(result.recordset[i].explanation.substr(0, 200)+'...');
        }
        console.log(shortExplanation);
        debug(result);
        res.render('apodList', {
            navigation: [
                {link: '/', page: "Home"},
                {link: '/apodList', page: "APOD List"},
                {link: '/latest', page: "Latest APOD"}
            ],
            title: 'APOD Articles',
            subtitle: 'Astronomy Picture of the Day',
            shortExplanation: shortExplanation,
            articles: result.recordset
        })
    }()
)});

router.route('/:id').get((req, res) => {(
    async function query(){
        const id = req.params.id;
        const request = new sql.Request();
        const result = await request.input('id', sql.Int, id).query(
            'select * from articles where id = @id'
        );
        debug(result);
        res.render('apodView', {
            navigation: [
                {link: '/', page: "Home"},
                {link: '/apodList', page: "APOD List"},
                {link: '/latest', page: "Latest APOD"}
            ],
            title: 'APOD Articles',
            subtitle: 'Astronomy Picture of the Day',
            article: result.recordset[0]
        })
    }()
)});

module.exports = router;