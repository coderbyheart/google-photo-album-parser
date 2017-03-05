import rp from 'request-promise'

const rx = /\["(https:\/\/[^\.]+.googleusercontent\.com\/[^"]+)",([0-9]+),([0-9]+),/
const extractPhotos = data => data.match(new RegExp(rx, 'g'))
    .map(m => m.match(rx))
    .map(p => {
        const width = +p[2]
        const height = +p[3]
        const url = `${p[1]}=w${width}-h${height}-no`
        return {url, width, height}
    })

rp({
    method: 'GET',
    headers: {
        'dnt': '1',
        'accept-language': 'en-US,en;q=0.8,de;q=0.6',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'authority': 'photos.google.com'

    },
    uri: process.env.ALBUM
})
    .then(data => extractPhotos(data))
    .then(photos => {
        console.log(JSON.stringify(photos.reverse(), '\t', 2))
    })
