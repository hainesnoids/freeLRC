let songTime = 0; // current progress in song
let lyricIndex = 0;
let unsyncedLyricsElement;
let lyrics = [
    {
        time: 0,
        value: ""
    }
]

function parseLyrics(source) {
    lyrics = [];
    const lrcSplit = source.split('\n');
    for (let i = 0; i < lrcSplit.length; i++) {
        let itm = lrcSplit[i];

        if (itm !== "") { // no empty lines sorry
            lyrics.push({
                time: 0,
                value: itm
            })
        }
    }
    renderLyrics();
}

function renderLyrics() {
    const wrapper = document.querySelector('.lyrics-scroll-bounds');
    wrapper.innerHTML = "";
    for (let i = 0; i < lyrics.length; i++) {
        let itm = lyrics[i];
        const lyric = document.createElement('div')
        lyric.classList.add('lyric');

        const time = document.createElement('span');
        time.classList.add('time');
        time.innerHTML = '--:--.--';

        const hr = document.createElement('hr');

        const value = document.createElement('span');
        value.classList.add('value');
        value.innerHTML = itm.value;

        lyric.appendChild(time);
        lyric.appendChild(hr);
        lyric.appendChild(value);

        wrapper.appendChild(lyric);
    }
    focusLyric(0);
}

function focusLyric(index) {
    const wrapper = document.querySelector('.lyrics-scroll-bounds');
    wrapper.querySelectorAll('.lyric.focus').forEach((itm) => {itm.classList.remove('focus')});
    wrapper.querySelectorAll('.lyric')[index].classList.add('focus');
    wrapper.querySelectorAll('.lyric')[index].scrollIntoView({block: "center",inline:"nearest"})
    lyricIndex = index;
}

function download() {
    // create lrc file
    let text = "";
    for (let i = 0; i < lyrics.length; i++) {
        let itm = lyrics[i];
        text += `[${formatTime(itm.time)}]${itm.value}\n`
    }

    // open download dialog
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName + '.lrc');
    element.click();
}

// this is the main function used to advance the selected line and capture the current time
// is this a good function name
function aaandNow() {
    const capTime = songTime;
    lyrics[lyricIndex].time = capTime;
    const wrapper = document.querySelector('.lyrics-scroll-bounds');
    wrapper.querySelectorAll('.lyric')[lyricIndex].querySelector('.time').innerHTML = formatTime(capTime);
    lyricIndex++;
    focusLyric(lyricIndex);
}

function init() {
    unsyncedLyricsElement = document.querySelector('#lyrics');
    unsyncedLyricsElement.addEventListener('change',(event) => {
        parseLyrics(event.target.value);
    })
    document.addEventListener('keydown',(e) => {
        if (e.key === ' ') {
            e.preventDefault();
            aaandNow();
        }
    })
    document.querySelector('.download').addEventListener('click',download)
}

document.addEventListener('DOMContentLoaded',init);