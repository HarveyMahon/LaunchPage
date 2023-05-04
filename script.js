//#region Music Player

function millisToMinutesAndSeconds (millis) {
    var minutes = Math.floor(millis / 60000)
    var seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQB8I11VRYq5mIgTKFByisejRkgTgnDGsqFOrVJLZVelGPqKJDz61xFaNpNVriZAjLH9O-DjmwgshWVYdQwuymoKGfFf95_jmi4_aRBnyAMnRun5gHMIQHPaXwxMJO75ZUUxYO06yXeynhxsz-bXydO44Cc8wTYV-xQNDl4hIkXeII7PTPlSuvv12JVmzVw_CIKsKw';
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.2
    });

    //#region Connecting to player 

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    //#endregion

    //#region Nav Buttons

    document.getElementById('back').onclick = function() {
        player.getCurrentState().then(state => {
            if (!state) {
                console.error('User is not playing music through this source')
                return
            }
            var time = state.position
            if (time < 5000) {
                player.previousTrack()
            } else {
                player.seek(0)
            }
          })
    }

    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();
    };
  
    document.getElementById('next').onclick = function() {
        player.getCurrentState().then(state => {
            if (!state) {
                console.error('User is not playing music through this source');
                return;
            }
            var time = state.position;
            if (time < 5000) {
                player.nextTrack();
            } else {
                player.seek(0);
            }
          });
    }

    //#endregion

    //#region Sliders

    document.onmousemove = function (e) {
        mouseX = e.clientX
        var xPos1 = document.getElementById('fauxBar').getBoundingClientRect().left
        var dist1 = mouseX - xPos1
        var xPos2 = document.getElementById('fauxVolume').getBoundingClientRect().left
        var dist2 = mouseX - xPos2
        dist1 /= 200 // getting dist as a fraction of the width of the bar
        dist2 /= 200
        var ms = dist1 * 100
        var vol = dist2 * 100
        document.getElementById('fauxBar').value = ms
        document.getElementById('fauxVolume').value = vol
      }
    
      document.getElementById('progressBox').onmouseenter = function (e) {
        var fauxBar = document.getElementById('fauxBar')
        fauxBar.style = 'visibility: visible;'
      }
    
      document.getElementById('progressBox').onmouseleave = function (e) {
        var fauxBar = document.getElementById('fauxBar')
        fauxBar.style = 'visibility: hidden;'
      }
    
      document.getElementById('progressBox').onclick = function (e) {
        mouseX = e.clientX
        var xPos = document.getElementById('songProgress').getBoundingClientRect().left
        var dist = mouseX - xPos
        dist /= 200 // getting dist as a fraction of the width of the bar
        var ms = dist * document.getElementById('songProgress').max
        player.seek(ms)
      }
    
      document.getElementById('volume').onmouseenter = function (e) {
        var fauxVolume = document.getElementById('fauxVolume')
        fauxVolume.style = 'visibility: visible;'
      }
    
      document.getElementById('volume').onmouseleave = function (e) {
        var fauxVolume = document.getElementById('fauxVolume')
        fauxVolume.style = 'visibility: hidden;'
      }
    
      document.getElementById('volume').onclick = function (e) {
        mouseX = e.clientX
        var xPos = document.getElementById('songVolume').getBoundingClientRect().left
        var dist = mouseX - xPos
        dist /= 200 // getting dist as a fraction of the width of the bar
        // var ms = dist * document.getElementById('songVolume').max
        // set volume here
        player.setVolume(dist)
        document.getElementById('songVolume').value = dist * 100
      }

    //#endregion

    //#region Updating Player
    
    var intervalSet = false
    var isPaused = true
    var currentMillis = 0
    player.addListener('player_state_changed', ({ position, duration, paused, track_window: { current_track } }) => {
        document.getElementById('songName').innerHTML = current_track.name
        document.getElementById('artist').innerHTML = current_track.artists[0].name
        document.getElementById('songProgress').max = duration
        document.getElementById('songProgress').value = position
        player.getVolume().then(volume => {
        let volumePercentage = volume * 100
        document.getElementById('songVolume').value = volumePercentage
        })
        document.getElementById('duration').innerHTML = millisToMinutesAndSeconds(duration)
        document.getElementById('position').innerHTML = millisToMinutesAndSeconds(position)
        currentMillis = position
        // allowing the interval to track if the song is paused
        if (paused !== undefined) {
        isPaused = paused
        }
        if (!paused) {
        document.getElementById('togglePlay').innerHTML = '⏸︎'
        } else {
        document.getElementById('togglePlay').innerHTML = '▶'
        }
        // ensuring the interval is only set once
        if (!intervalSet) {
            setInterval(() => {
                document.getElementById('songProgress').value += isPaused ? 0 : 100
                currentMillis += isPaused ? 0 : 100
                document.getElementById('position').innerHTML = millisToMinutesAndSeconds(currentMillis)
            }, 100)
            intervalSet = true
        }
    })

    //#endregion

    player.connect();
}

//#endregion

window.onkeyup = function(event) {
    if (event.which == 32) { // space
        document.getElementById("RealBar").focus();
    }
    else if (event.which == 27) { // escape
        document.getElementById("RealBar").blur();
    }   
    else if (event.which == 13) { // enter
        const query = "http://google.com/search?q=" + document.getElementById("RealBar").value;
        window.open(query);
    }
}

function openLink(link) {
    window.open(link);
}

function ToggleWithin() {
    document.getElementById("NavBar").classList.toggle("left")
    document.getElementById("NavBarImg").classList.toggle("left")
}

function ToggleWithinMusic() {
    document.getElementById("player").classList.toggle("hide")
}