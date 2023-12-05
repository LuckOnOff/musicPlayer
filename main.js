'use strict';
const audioPlayer = document.querySelectorAll('.playlist audio');
const currentImg = document.querySelectorAll('.img-music');
const musicNames = document.querySelectorAll('.music-names span');
const backgroundAniSpan = document.querySelectorAll('.bg-animation');
const progressBar = document.querySelector('.progress-bar');
const currentTime = document.querySelector('.current-time');
const songName = document.querySelector('.song-name');
const repeatButtonImgNormal = document.querySelector('.repeat-button-img');
const repeatButtonActive = document.querySelector('.repeat-button-img-active');
const previousButton = document.querySelector('.previous-button-conteiner');
const playPauseConteiner = document.querySelector('.play-pause-conteiner');
const nextButton = document.querySelector('.next-button-conteiner');
const randomButton = document.querySelector('.random-button-conteiner');
const volumeButton = document.querySelector('.volume-range');
const soundButton = document.querySelector('.sound-button');
const soundButtonImg = document.querySelector('.sound-button-img');
const inputVolumeConteiner = document.querySelector('.input-volume-conteiner');

let audioPlayerArr = Array.from(audioPlayer);
let buttonPlayFlag = false;
let volumeFlag = false;
let currentIndex = 0;
let currentSong = audioPlayerArr[currentIndex];

playPauseConteiner.addEventListener('click', () => {
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

randomButton.addEventListener('click', () => {

    for (let i = audioPlayerArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [audioPlayerArr[i], audioPlayerArr[j]] = [audioPlayerArr[j], audioPlayerArr[i]];
    }

    currentSong.loop = false;

    repeatButtonActive.style.display = 'none';
    repeatButtonImgNormal.style.display = 'block';

    playNextSong(audioPlayerArr);

});

repeatButtonImgNormal.addEventListener('click', () => {

    currentSong.loop = true;

    repeatButtonActive.style.display = 'block';
    repeatButtonImgNormal.style.display = 'none';

});

repeatButtonActive.addEventListener('click', () => {

    currentSong.loop = false;

    repeatButtonActive.style.display = 'none';
    repeatButtonImgNormal.style.display = 'block';

});

previousButton.addEventListener('click', () => {
    
    currentSong.pause();

    currentSong.currentTime = 0;
    progressBar.value = 0;

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex = audioPlayerArr.length - 1;

    }

    currentSong = audioPlayerArr[currentIndex];

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

    currentSong.addEventListener('ended', () => playNextSong(audioPlayerArr));
});

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

nextButton.addEventListener('click', () => playNextSong(audioPlayerArr));

function addEndedHandler() {
    audioPlayerArr.forEach((audio) => {

        audio.addEventListener('ended', () => playNextSong(audioPlayerArr));

    });
}

addEndedHandler();

function addTimeUpdateHandler() {

    currentSong.addEventListener('timeupdate', () => {

        progressBar.value = currentSong.currentTime;
        currentTime.innerHTML = formatTime(currentSong.currentTime);

    });
    
}

soundButton.addEventListener('mouseover', () => {
    inputVolumeConteiner.style.display = 'block';
    soundButtonImg.style.opacity = 1;
});

soundButton.addEventListener('mouseout', () => {
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

soundButtonImg.addEventListener('click', () => {
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

    durationTime.innerHTML = formatTime(currentSong.duration);

};

function currentTimeSpan() {

    currentTime.innerHTML = formatTime(currentSong.currentTime);

};

duractionSpan();
currentTimeSpan();
addTimeUpdateHandler();