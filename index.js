const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')

const app = express()
// const port = 8000
const url = 'https://blog.facialix.com/category/cupones/'

app.get('/', async(req, res) => {
    res.setHeader('Content-type', 'text/event-stream')
    res.setHeader('Access-Control-Allow-Origin', '*')

    const jsonContent = JSON.stringify(await getPromos())
    res.write(jsonContent)
    
    const intervalId = setInterval(async() => {
        const jsonContent = JSON.stringify(await getPromos())
        res.write(jsonContent)
    }, 60000)

    res.on('close', () => {
        console.log('Connection closed')
        clearInterval(intervalId)
        res.end()
    })
})

app.listen(function (error) {
    if (error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server listening')
    }
})

function getPromos() {
    const aux = axios(url).then(response => {
        const articles = []
        const html = response.data
        const $ = cheerio.load(html)
        $('.post-title', html).each(function () {
            const title = $(this).find('a').text()
            const url = $(this).find('a').attr('href')
            articles.push({
                title,
                url,
            })
        })
        return articles
    })
    return aux
}