import {allSongs} from "./all-songs.js";
import {startIndex} from "./indexWords.js";

// options
// find words
// find strings
// find popularity of words.
// find all times mentioned

function init() {
    document.querySelector('.search-form').addEventListener('submit', search);
    startIndex();
}

function search(e) {
    e.preventDefault();
    const inputValue = document.querySelector('.search-input')?.value;
    const output = [];
    for(const song of allSongs) {
        const results = findNeedleInHaystack(inputValue, song.lyrics);

        if(results.length > 0) {
            for(const result of results) {
                output.push({
                    song: song.title,
                    content: result,
                });
            }

        }
    }

    setOutput(output);
}

function findNeedleInHaystack(needle, haystack) {
    const buffer = 10
    const regex = new RegExp(`(?:.{0,${buffer}})${needle}(?:.{0,${buffer}})`, 'gi');
    const matches = haystack.match(regex) || [];

    return matches.map(match => {
        const startIndex = haystack.indexOf(match);
        const endIndex = startIndex + match.length;
        const startSliceIndex = Math.max(startIndex - buffer, 0);
        const endSliceIndex = Math.min(endIndex + buffer, haystack.length);
        return haystack.slice(startSliceIndex, endSliceIndex);
    });
}

function highlight(fullString, highlighted) {
    const startIndex = fullString.indexOf(highlighted);
    if (startIndex === -1) {
        // Return the original string if the highlighted substring is not found
        return fullString;
    }

    const endIndex = startIndex + highlighted.length;
    const beforeHighlighted = fullString.slice(0, startIndex);
    const afterHighlighted = fullString.slice(endIndex);

    return beforeHighlighted + "<b>" + highlighted + "</b>" + afterHighlighted;
}

function setOutput(outputArray) {
    const outputDiv = document.querySelector('.response-section');
    const inputValue = document.querySelector('.search-input')?.value;
    outputDiv.innerHTML = '';
    if(outputArray.length === 0) return;

    for(const item of outputArray) {
        const child = document.createElement("div");
        const title = document.createElement("b");
        const content = document.createElement("p");
        title.innerText = item.song
        content.innerHTML = highlight(item.content, inputValue);
        child.appendChild(title)
        child.appendChild(content)
        child.appendChild(document.createElement('hr'))
        outputDiv.appendChild(child);
    }
}

init()
