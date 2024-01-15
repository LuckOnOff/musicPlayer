'use strict';
const audioPlayer = Array.from(document.querySelectorAll('.playlist audio'));
const currentImg = document.querySelectorAll('.img-music');
const musicNames = document.querySelectorAll('.music-names span');
const backgroundAniSpan = document.querySelectorAll('.bg-animation');
const progressBar = document.querySelector('.progress-bar');
const currentTime = document.querySelector('.current-time');
const songName = document.querySelector('.song-name');
const volumeButton = document.querySelector('.volume-range');
const soundButton = document.querySelector('.sound-button');
const soundButtonImg = document.querySelector('.sound-button-img');
const inputVolumeConteiner = document.querySelector('.input-volume-conteiner');

let buttonPlayFlag = false;
let volumeFlag = false;
let currentIndex = 0;
let currentSong = audioPlayer[currentIndex];

document.addEventListener('click', (e) => {

    let target = e.target;
    let repeatButtonImgNormal = document.querySelector('.repeat-button-img');
    let repeatButtonActive = document.querySelector('.repeat-button-img-active');

    if(target.closest('.play-pause-conteiner')) {

        const playButton = document.querySelector('.play-button-conteiner');
        const pauseButton = document.querySelector('.pause-button-conteiner');

        if (buttonPlayFlag) {

            buttonPlayFlag = false;

            playButton.style.display = 'flex';
            pauseButton.style.display = 'none';
            songName.classList.remove('song-name-active');

            backgroundAniSpan.forEach(item => {
                item.classList.remove('span-animation');
            });

            currentSong.pause();
        } else {

            buttonPlayFlag = true;

            playButton.style.display = 'none';
            pauseButton.style.display = 'flex';
            songName.classList.add('song-name-active');

            backgroundAniSpan.forEach(item => {
                item.classList.add('span-animation');
            });

            currentSong.play();
        }

    }
    if(target.closest('.random-button-conteiner')) {

        for (let i = audioPlayer.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [audioPlayer[i], audioPlayer[j]] = [audioPlayer[j], audioPlayer[i]];
        }

        currentSong.loop = false;

        repeatButtonActive.style.display = 'none';
        repeatButtonImgNormal.style.display = 'block';

        playNextSong(audioPlayer);
    }
    if(target.closest('.repeat-button-img')) {

        currentSong.loop = true;

        repeatButtonActive.style.display = 'block';

        repeatButtonImgNormal.style.display = 'none';
    }
    if(target.closest('.repeat-button-img-active')) {

        currentSong.loop = false;

        repeatButtonActive.style.display = 'none';
        repeatButtonImgNormal.style.display = 'block';
    }
    if(target.closest('.previous-button-conteiner')) {

        currentSong.pause();

        currentSong.currentTime = 0;
        progressBar.value = 0;

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex = audioPlayer.length - 1;

    }

    currentSong = audioPlayer[currentIndex];

    if (buttonPlayFlag) {

        currentSong.play();

        songName.classList.remove('song-name-active');

        setTimeout(() => {
            songName.classList.add('song-name-active');
        }, 0);

    } else {

        currentSong.pause();

    }

    duractionSpan();
    currentTimeSpan();
    addTimeUpdateHandler();
    getImgAndNameMusic();

    currentSong.addEventListener('ended', () => playNextSong(audioPlayer));
    }
    if(target.closest('.next-button-conteiner')) {
        playNextSong(audioPlayer);
    }
    if(target.closest('.sound-button-img')) {
        if(!volumeFlag) {
            soundButtonImg.src = "img/sound-off.svg";
            volumeButton.value = 0;
            currentSong.volume = volumeButton.value;
            volumeFlag = true;
        } else {
            soundButtonImg.src = "img/wondicon-button.svg";
            volumeButton.value = 0.5;
            currentSong.volume = volumeButton.value;
            volumeFlag = false;
        }
    }
});

function getImgAndNameMusic() {

    const imgIndex = currentSong.getAttribute('data-imgIndex');

    for (let i = 0; i < currentImg.length; i++) {

      if (imgIndex === `index = ${i + 1}`) {

        currentImg[i].style.display = 'block';
        songName.textContent  = musicNames[i].textContent;

      } else {

        currentImg[i].style.display = 'none';

      }

    }
    

}
getImgAndNameMusic();

function playNextSong(audioPlayer) {

    currentSong.pause();

    currentSong.currentTime = 0;
    progressBar.value = 0;

    currentIndex++;

    if (currentIndex >= audioPlayer.length) {

        currentIndex = 0;

    }

    currentSong = audioPlayer[currentIndex];

    if (buttonPlayFlag) {

        currentSong.play();

        songName.classList.remove('song-name-active');
        
        setTimeout(() => {
            songName.classList.add('song-name-active');
        }, 0);

        backgroundAniSpan.forEach(item => {
            item.classList.remove('span-animation');
        });

        setTimeout(() => {
            backgroundAniSpan.forEach(item => {
                item.classList.add('span-animation');
            });
        },100)

    } else {

        currentSong.pause();

    }

    duractionSpan();
    currentTimeSpan();
    addTimeUpdateHandler();
    getImgAndNameMusic();

    progressBar.max = currentSong.duration;

}

function addEndedHandler() {
    audioPlayer.forEach((audio) => {

        audio.addEventListener('ended', () => playNextSong(audioPlayer));

    });
}

addEndedHandler();

function addTimeUpdateHandler() {

    currentSong.addEventListener('timeupdate', () => {

        progressBar.value = currentSong.currentTime;
        currentTime.textContent = formatTime(currentSong.currentTime);

    });
    
}

soundButton.addEventListener('pointerover', () => {
    inputVolumeConteiner.style.display = 'block';
    soundButtonImg.style.opacity = 1;
});

soundButton.addEventListener('pointerout', () => {
    inputVolumeConteiner.style.display = 'none';
    soundButtonImg.style.opacity = 0.6;
});

volumeButton.addEventListener('input', () => {

    currentSong.volume = volumeButton.value;

    if(currentSong.volume == 0) {
        soundButtonImg.src = "img/sound-off.svg";
    } else {
        soundButtonImg.src = "img/wondicon-button.svg";
    }
});

progressBar.addEventListener('input', () => {

    currentSong.currentTime = progressBar.value;

});

currentSong.addEventListener('loadedmetadata', () => {

    progressBar.max = currentSong.duration;

    duractionSpan();
    currentTimeSpan();
    addTimeUpdateHandler();

});

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

};

function duractionSpan() {

    const durationTime = document.querySelector('.duraction');

    durationTime.textContent = formatTime(currentSong.duration);

};

function currentTimeSpan() {

    currentTime.textContent = formatTime(currentSong.currentTime);

};

duractionSpan();
currentTimeSpan();
addTimeUpdateHandler();