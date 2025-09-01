let songTime = 0; // current progress in song
let lyricIndex = 0;
let unsyncedLyricsElement;
let lyrics = [
    {
        time: 0,
        value: ""
    }
]

function parseLyrics(source, fromWarning = false) {
    lyrics = [];
    const lrcSplit = source.split('\n');
    if (fromWarning === false) {
        if (new RegExp("^\[[0-9:.]*\]").test(source) === true) {
            document.querySelector('.formatted-lyrics-alert').style.display = "";
            document.querySelector('.no-lyrics-alert').style.display = "none";
            document.querySelector('.lyrics-flex-bounds').innerHTML = "";
            return;
        }
    } else {
        document.querySelector('.formatted-lyrics-alert').style.display = "none";
        document.querySelector('.no-lyrics-alert').style.display = "";
    }
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
    const wrapper = document.querySelector('.lyrics-flex-bounds');
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
    wrapper.querySelectorAll('.lyric')[index].scrollIntoView({block: "center",inline:"nearest",container:"nearest"})
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
    document.querySelector('.finished-dialog').close();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName + '.lrc');
    element.click();
}

// this is the main function used to advance the selected line and capture the current time
// is this a good function name
function isInBounds() {
    if (lyricIndex < 0) {
        lyricIndex = 0;
        return -1
    } else if (lyricIndex >= lyrics.length - 1) {
        return 1
    }
    return 0
}

function aaandNow() {
    const ready = isInBounds();
    const capTime = songTime;
    lyrics[lyricIndex].time = capTime;
    const wrapper = document.querySelector('.lyrics-scroll-bounds');
    wrapper.querySelectorAll('.lyric')[lyricIndex].querySelector('.time').innerHTML = formatTime(capTime);
    lyricIndex++;
    if (ready) {
        allDone();
    } else {
        focusLyric(lyricIndex);
    }
}

function runThatBack() {
    lyricIndex--;
    if (isInBounds() === -1) {
        musicPlayer.currentTime = 0;
        return;
    }
    const wrapper = document.querySelector('.lyrics-scroll-bounds');
    musicPlayer.currentTime = lyrics[lyricIndex - 1].time ?? 0;
    wrapper.querySelectorAll('.lyric')[lyricIndex].querySelector('.time').innerHTML = '--:--.--';
    lyrics[lyricIndex].time = 0;
    focusLyric(lyricIndex);
}

function allDone() {
    document.querySelector('.finished-dialog').showModal();
}

function speedUp(doI) {
    musicPlayer.preservesPitch = true;
    if (doI === true) {
        musicPlayer.playbackRate = 1.75;
    } else {
        musicPlayer.playbackRate = 1;

    }
}

function theseLyricsLookRightToMe() {
    parseLyrics(document.querySelector('#lyrics').value,true);
}

function init() {
    unsyncedLyricsElement = document.querySelector('#lyrics');
    unsyncedLyricsElement.addEventListener('change',(event) => {
        parseLyrics(event.target.value);
    })
    document.querySelector('.formatted-lyrics-alert button').addEventListener('click',theseLyricsLookRightToMe);
    document.addEventListener('keydown',(e) => {
        if (e.key === ' ') {
            e.preventDefault();
            aaandNow();
        } else if (e.key === ',') {
            e.preventDefault();
            runThatBack();
        } else if (e.key === '.') {
            speedUp(true);
        }
    })
    document.addEventListener('keyup',(e) => {
        if (e.key === '.') {
            speedUp(false);
        }
    })
    document.querySelectorAll('.download').forEach((itm) => {itm.addEventListener('click',download)})

    document.querySelector('.advance').addEventListener('click',aaandNow)
    document.querySelector('.retreat').addEventListener('click',runThatBack)
    let speedFast = false;
    document.querySelector('.speedup').addEventListener('click',() => {
        if (speedFast === false) {
            speedUp(true);
        } else {
            speedUp(false);
        }
    })
}

document.addEventListener('DOMContentLoaded',init);