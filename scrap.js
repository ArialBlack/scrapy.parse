/*var scrapy = require('node-scrapy')
    , url = 'https://github.com/strongloop/express'
    , selector = '.js-repo-meta-container'

scrapy.scrape(url, selector, function(err, data) {
    if (err) return console.error(err)
    console.log(data)

 countries.regions[0].url

});*/

var _ = require('underscore');

var regions =  [
            { name: 'Сеул', url: 'https://www.tripadvisor.ru/Hotels-g294197-Seoul-Hotels.html' },
            { name: 'Пусан', url: 'https://www.tripadvisor.ru/Hotels-g297884-Busan-Hotels.html' }
        ],
    pages = [],
    index = 0;

function getNextPage (regionUrl) {
    var pagesUrl = [],
        domain = 'https://www.tripadvisor.ru',

        scrapy = require('node-scrapy')
        , surl = regionUrl
        , model = {
            selector: '.prw_common_standard_pagination a.nav.next',
            get: 'href'
        }

    scrapy.scrape(surl, model, function(err, data) {
        if (err) return console.error(err)
        if (data) {
            var nextUrl = domain + data;

            if(_.contains(pages, nextUrl) === false){
                pages.push(nextUrl);
                console.log(nextUrl);
            }

            console.log(pages.length);
            getNextPage (nextUrl);
        } else {
            index++;
            if (index <= regions.length-1) {
                pages.push(regions[index].url);
                getNextPage (regions[index].url);
            }
        }
    });
}

pages.push(regions[index].url);
getNextPage (regions[index].url);