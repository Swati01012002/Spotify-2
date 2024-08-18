let currentSong = new Audio();

function secondsToMinutes(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }
    const minutes = Math.floor(seconds/60);
    const remainSeconds = Math.floor(seconds%60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}

const playMusic = (track, pause=false)=>{
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML= "00:00 / 00:00"
}

async function main() {
    
    let songs = await getSongs()
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`
    })

}

main()