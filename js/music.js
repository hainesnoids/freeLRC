let fileInput,
    songTitle,
    musicPlayer,
    playbackPause,
    clock,
    clockNeg,
    progress,
    playingBefore,
    fileName,
    progressUpdateEvent;

function loadSong(file) {
    songTitle.innerText = file.name;
    fileName = file.name;
    musicPlayer.src = URL.createObjectURL(file);

    clock.innerText = "--:--.--";
    clockNeg.innerText = "--:--.--";

    progress.value = 0;
    progress.max = 100;
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    const ms = Math.floor(((seconds * 1000) % 1000) / 10);
    return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(ms).padStart(2,'0')}`;
}

function updateProgress(fromAnimationFrame) {
    songTime = musicPlayer.currentTime;
    const currentTime = musicPlayer.currentTime;
    const duration = musicPlayer.duration || 0;

    clock.innerText = formatTime(currentTime);
    clockNeg.innerText = formatTime(duration);

    if (fromAnimationFrame === true) {
        progressUpdateEvent = window.requestAnimationFrame(() => {updateProgress(true)});
    }
}

function timeChange() {
    const currentTime = musicPlayer.currentTime;
    const duration = musicPlayer.duration || 1;

    progress.value = (currentTime / duration) * 100;
    progress.dispatchEvent(changeEvent);
}

function play() {
    musicPlayer.play();
    playbackPause.innerHTML = '<span class="material-symbols-outlined">pause</span>';
    progressUpdateEvent = window.requestAnimationFrame(() => {updateProgress(true)});
}

function pause() {
    musicPlayer.pause();
    playbackPause.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
    window.cancelAnimationFrame(progressUpdateEvent);
}

function dragAreaSetup() {
    document.querySelectorAll('dragarea').forEach((dragArea) => {
        dragArea.addEventListener("dragenter", function() {
            dragArea.classList.add('hover');
        }, false);
        dragArea.addEventListener("dragover", function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }, false);
        dragArea.addEventListener("dragleave", function() {
            dragArea.classList.remove('hover');
        }, false);
        dragArea.addEventListener("drop", function(e) {
            e.stopPropagation();
            e.preventDefault();
            dragArea.classList.remove('hover');
            loadSong(e.dataTransfer.files[0]);
        }, false);
    })
}

document.addEventListener('DOMContentLoaded',() => {
    fileInput = document.querySelector('#music-file');
    songTitle = document.querySelector('.music .file-name');
    musicPlayer = document.querySelector('.music #music-player');
    playbackPause = document.querySelector('.music #playback-pause');
    clock = document.querySelector('.music #clock');
    clockNeg = document.querySelector('.music #clock_neg');
    progress = document.querySelector('.music #progress');

    fileInput.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', (event) => {
            loadSong(event.target.files[0]);
        }, false)
        input.click();
    });
    dragAreaSetup();

    musicPlayer.addEventListener('timeupdate', timeChange);

    musicPlayer.addEventListener('ended', () => {
        playingBefore = false;
        pause();
    });

    musicPlayer.addEventListener('pause', () => {
        playingBefore = false;
        pause();
    });

    progress.addEventListener('changeStarting',() => {
        pause();
    });

    musicPlayer.addEventListener('play', () => {
        playingBefore = true;
        play();
    });

    progress.addEventListener('changedElsewhere', () => {
        musicPlayer.currentTime = (Number(progress.value) / 100) * musicPlayer.duration;
        if (playingBefore === true) {
            play();
        }
    });

    playbackPause.addEventListener('click', () => {
        if (musicPlayer.paused) {
            playingBefore = true;
            play();
        } else {
            playingBefore = false;
            pause();
        }
        document.body.focus(); // force focus on body to redirect space key presses
    });
});