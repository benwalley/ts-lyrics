import {allSongs} from "./all-songs.js";

const hashTable = {}
let wordArray = []

export function startIndex() {
    for(const song of allSongs) {
        const lyrics = cleanLyrics(song.lyrics);
        const lyricArray = lyrics.split(' ');
        for(const word of lyricArray) {
            if(hashTable[word]) {
                hashTable[word].totalCount ++
                if(hashTable[word].songs[song.title]) {
                    hashTable[word].songs[song.title] ++
                } else {
                    hashTable[word].songs[song.title] = 1
                }
            } else {
                hashTable[word] = {
                    totalCount: 1,
                    songs: {}
                }
                hashTable[word].songs[song.title] = 1
            }
        }
    }
    displayResults(hashTable)
}

function sortObjectToArray(obj) {
    const dataArray = Object.entries(obj).map(([key, value]) => ({
        key,
        ...value,
    }));

    dataArray.sort((a, b) => b.totalCount - a.totalCount);
    wordArray = dataArray;
    return dataArray;
}

function displayResults(hashTable) {
    const resultsContainer = document.querySelector('.indexedResults');

    const wordArray = sortObjectToArray(hashTable)
    let counter = 0;
    for(const word of wordArray) {

        const content = `
            <div class="indexItem" data-counter="${counter}">${word.key} <span>${word.totalCount}</span></div>
        `
        resultsContainer.innerHTML += content;
        counter ++
    }
    addEventListeners()
}

function addEventListeners() {
    const items = document.querySelectorAll('.indexItem')
    for(let i = 0; i < items.length; i++) {
        const item = items[i];
        item.addEventListener('click', handleShowDetails)
    }
}

function handleShowDetails(e) {
    const wordDetails = wordArray[e.target.dataset.counter];
    const container = document.querySelector('.detailsHeader');
    container.classList.add('visible');

    const wordContainer = container.querySelector('.word');
    wordContainer.innerText = wordDetails.key
    container.querySelector('.totalCount').innerText = wordDetails.totalCount;

    let songsItsUsedInContent = '';
    for(const title in wordDetails.songs) {
        const number = wordDetails.songs[title];
        songsItsUsedInContent += `<div>${title}: <b>${number}</b></div>`
    }

    container.querySelector('.songsUsedIn').innerHTML = songsItsUsedInContent;
}

function cleanLyrics(inputString) {
    // Remove all characters except letters, spaces, single quotes, and new lines
    let cleanedString = inputString.toLowerCase().replace(/[^A-Za-z\s'"']/g, '');

    // Remove duplicate spaces
    cleanedString = cleanedString.replace(/\s+/g, ' ');

    // Remove double quotes
    cleanedString = cleanedString.replace(/"/g, '');

    return cleanedString;
}
