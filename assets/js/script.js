// document.querySelectors and document.getElementByIds
const searchForm = document.querySelector('.search-form')
const searchInput = document.getElementById('search-gm')
const gifContainer = document.querySelector('.gif-container')
const memeContainer = document.querySelector('.meme-container')
const sectionContainer = document.querySelector('.section-container')

// personal API Keys
const giphyAPIKey = '6M9rze3zIiNSUB8y9OBLeDnETWFBztWy';
const memesAPIKey = 'c2b7d1997fb54c2cad5ff44774377108';

// global variables
let searchHistory = []
let keyword = ''

// fetch Gifs from Giphy API, and append them to the page
const fetchGifs = () => {
    const requestURL = `https://api.giphy.com/v1/gifs/search?q=${keyword}&limit=20&&api_key=${giphyAPIKey}`

    fetch(requestURL)
        .then(res => res.json())
        .then(data => {
            let gifsRetrieved = data.data

            gifsRetrieved.forEach(gif => {
                let anchorTag = document.createElement('a')
                anchorTag.setAttribute('href', gif.url)
                anchorTag.setAttribute('target', '_blank')
                let gifImg = document.createElement('img')
                gifImg.setAttribute('src', gif.images.fixed_height.webp)
                gifImg.setAttribute('alt', gif.title)
                anchorTag.append(gifImg)
                gifContainer.append(anchorTag)
            })
            // console.log(gifsRetrieved)
        })
}

// fetch memes from HumorAPI and append them to the page 
const fetchMemes = () => {
    const requestURL = `https://api.humorapi.com/memes/search?api-key=${memesAPIKey}&keywords=${keyword}&media-type=image&number=10`

    fetch (requestURL)
        .then(res => res.json())
        .then(data => { 
            let memesRetrieved = data.memes
            
            memesRetrieved.forEach(meme => {
                let anchorTag = document.createElement('a')
                anchorTag.setAttribute('href', meme.url)
                anchorTag.setAttribute('target', '_blank')
                let memeImg = document.createElement('img')
                memeImg.setAttribute('src', meme.url)
                memeImg.setAttribute('alt', meme.description)
                // memeImg.setAttribute('referrerpolicy', 'no-referrer')
                anchorTag.append(memeImg)
                memeContainer.append(anchorTag)
            })
            
            console.log(memesRetrieved)
        })
}

// search keyword and call functions to retrieve data from Giphy and HumorAPI. if not keyword, then alert
const searchKeyword = (event) => {
    event.preventDefault()

    let searchTerm = searchInput.value;

    keyword = searchTerm

    searchInput.value = ''
    
    console.log(keyword)

    if (keyword) {
        gifContainer.innerHTML = ''
        memeContainer.innerHTML = ''
        sectionContainer.classList.remove('hide')
        fetchGifs()
        fetchMemes()
    } else {
        alert('Please enter a keyword to search')
        return
    }
}

// addEventListeners
searchForm.addEventListener('submit', searchKeyword)