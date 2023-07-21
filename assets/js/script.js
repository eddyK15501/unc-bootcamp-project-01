// document.querySelectors and document.getElementByIds
const searchForm = document.querySelector('.search-form')
const searchInput = document.getElementById('search-gm')
const gifContainer = document.querySelector('.gif-container')
const memeContainer = document.querySelector('.meme-container')
const sectionContainer = document.querySelector('.section-container')
const searchedHistory = document.querySelector('.searched-history')

// personal API Keys
const giphyAPIKey = '6M9rze3zIiNSUB8y9OBLeDnETWFBztWy';
const memesAPIKey = 'c2b7d1997fb54c2cad5ff44774377108';

// global variables
let searchHistory = []
let keyword = ''

// fetch Gifs from Giphy API, and append them to the page
const fetchGifs = (searchTerm) => {
    const requestURL = `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&limit=48&&api_key=${giphyAPIKey}`

    fetch(requestURL)
        .then(res => {
            sectionContainer.classList.remove('hide')
            return res.json()
        })
        .then(data => {
            gifContainer.innerHTML = ''
            memeContainer.innerHTML = ''

            let gifsRetrieved = data.data

            if (gifsRetrieved.length !== 0) {
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
            } else {
                let h2Tag = document.createElement('h2')
                h2Tag.setAttribute('id', 'no-gifs-found')
                h2Tag.innerText = 'No search results were found'
                gifContainer.append(h2Tag)
            }
            addSearchTerm(searchTerm)

            // console.log(gifsRetrieved)
        })
}

// fetch memes from HumorAPI and append them to the page 
const fetchMemes = (searchTerm) => {
    const requestURL = `https://api.humorapi.com/memes/search?api-key=${memesAPIKey}&keywords=${searchTerm}&media-type=image&number=10`

    fetch (requestURL)
        .then(res => res.json())
        .then(data => { 
            let memesRetrieved = data.memes
            
            if (memesRetrieved.length !== 0) {
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
            } else {
                let h2Tag = document.createElement('h2')
                h2Tag.setAttribute('id', 'no-memes-found')
                h2Tag.innerText = 'No search results were found'
                memeContainer.append(h2Tag)
            }

            // console.log(memesRetrieved)
        })
}

// call both functions to retrieve data from API at once
const fetchData = (keySearch) => {
    fetchGifs(keySearch)
    fetchMemes(keySearch)
}

// function that capitalizes the first letter of the word/words, given as a parameter
const caseSensitivity = (searchTerm) => {
     // Remove leading and trailing spaces from the input
    let trimmedTerm = searchTerm.trim();

    // Convert the input to lowercase and split it into words
    let updateTerm = trimmedTerm.toLowerCase().split(" ");
    let returnTerm = '';
    
    for (let i = 0; i < updateTerm.length; i++) {
        // Capitalize the first letter of each word
        updateTerm[i] = updateTerm[i][0].toUpperCase() + updateTerm[i].slice(1);
        returnTerm += " " + updateTerm[i];
    }
    // trim any extra space within the string being returned
    return returnTerm.trim();
}

// prepend a button into the search history if the keyword has not been searched before
const addSearchTerm = (searchTerm) => {
    let newSearchTerm = caseSensitivity(searchTerm)
    // console.log(searchHistory)

    let previouslySearched = false

    for (let i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i] === newSearchTerm) {
            previouslySearched = true
        }
    }

    if (!previouslySearched) {
        searchHistory.unshift(newSearchTerm)

        const searchBtn = document.createElement('button')
        searchBtn.classList.add('search-btn')
        searchBtn.innerText = `${searchHistory[0]}`
        searchedHistory.prepend(searchBtn)
    } else {
        return
    }

    if (searchHistory.length > 7) {
        let nodes = document.querySelectorAll('.search-btn')
        let last = nodes[nodes.length - 1]
        last.remove()

        searchHistory.pop()
    }

    localStorage.setItem('keywords', JSON.stringify(searchHistory))

    document.querySelectorAll('.search-btn').forEach(btn => {
        btn.removeEventListener('click', fetchData)
        btn.addEventListener('click', (event) => {
            fetchData(event.target.innerText)
        })
    })
}

// get local storage of previously searched keywords
const getLocalStorage = () => {
    const storagedKeywords = JSON.parse(localStorage.getItem('keywords'))

    if (!storagedKeywords) {
        return false
    }

    searchHistory = storagedKeywords

    addPreviouslySearched()
}

// if previously searched keywords exist, append previous keywords on the initial render
const addPreviouslySearched = () => {
    if (searchHistory.length > 0) {
        searchHistory.forEach(search => {
            const searchBtn = document.createElement('button')
            searchBtn.classList.add('search-btn')
            searchBtn.innerText = `${search}`
            searchedHistory.append(searchBtn)
        })
    } else if (searchHistory.length > 7) {
        let nodes = document.querySelectorAll('.search-btn')
        let last = nodes[nodes.length - 1]
        last.remove()
        searchHistory.pop()
    } else {
        return
    }

    document.querySelectorAll('.search-btn').forEach(btn => {
        btn.removeEventListener('click', fetchData)
        btn.addEventListener('click', (event) => {
            fetchData(event.target.innerText)
        })
    })
}

// search keyword and call functions to retrieve data from Giphy and HumorAPI. if not keyword, then alert
const searchKeyword = (event) => {
    event.preventDefault()

    let searchTerm = searchInput.value;

    keyword = searchTerm.trim()

    // console.log(keyword)

    searchInput.value = ''

    if (keyword) {
        fetchData(keyword)
    } else {
        alert('Please enter a keyword to search')
        return
    }
}

// addEventListeners
searchForm.addEventListener('submit', searchKeyword)
// getLocalStorage when script.js initially loads
getLocalStorage()