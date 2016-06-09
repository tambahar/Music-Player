var MusicPlayer = {

    play: function (track) {
        $( "#main-player" ).find( ".player-play" ).fadeOut();
        $( "#main-player" ).find( ".player-pause" ).fadeIn();
        $( ".spin-active" ).css( "-webkit-animation-play-state", "running" );
        $( ".li_track" ).removeClass( "test" ).removeClass( "active" );
        $( track ).addClass( "test" ).addClass( "active" );
    },

    pause: function () {
        var playerPlay = Player.playerBox.find( ".player-play" );
        var playerPause = Player.playerBox.find( ".player-pause" );
        playerPause.fadeOut();
        playerPlay.fadeIn();
        $( ".li_track" ).removeClass( "test" ).removeClass( "active" );
        $( ".spin-active" ).css( "-webkit-animation-play-state", "paused" );
    },

    clickOnTrack: function () {
        var that = this;
        Player.playerBox.on( "click", ".li_track", function () {
            that.playSong( this );
        });
    },

    playSong: function ( track ) {
        var that = this;
        var nowPlaying = $( track ).data( "path" );
        var src = $( "source" ).attr( "src", nowPlaying );
        var name = $( track ).html();
        var player = document.querySelector( "audio" );
        player.load();
        Player.playerBox.find( ".album img" ).addClass( "spin-active" );
        $( "#main-player" ).find( "h3" ).html( "Playing: " + name );
        that.play( track );

        $( "source" ).on( "error", function () {
            that.pause();
        } );

        player.onplay = function () {
            if( player.duration ){
                that.play( track );
            }
        };

        // player.onpause = function () {
        //     that.pause();
        // };

        that.nextSong( track );
    },

    nextSong: function ( currentSong ) {
        var that = this;
        var player = document.querySelector( "audio" );
        var nextTrack = $( currentSong ).next();

        player.onended = function () {
            if( $(nextTrack).hasClass( "li_track" ) ){
                that.playSong( nextTrack )
            }   else {
                that.pause();
            }
        };
    },

    playPause: function () {
        var that = this;
        Player.playerBox.on( "click", ".state", function () {
            var playerPause;
            var playerPlay;
            var playerState;
            var player = document.querySelector( "audio" );
            if ( player.duration > 0 ) {

                $( ".test" ).addClass("active");
                playerState = Player.playerBox.find(".album_spin").css("-webkit-animation-play-state");
                playerPlay = Player.playerBox.find( ".player-play" );
                playerPause = Player.playerBox.find( ".player-pause" );
                if ( playerState !== "running" ) {
                    playerPlay.fadeOut();
                    playerPause.fadeIn();
                    $( ".test" ).addClass( "active" );
                    $(".spin-active").css("-webkit-animation-play-state", "running");
                    player.play();

                } else {
                    var name = $( ".active" ).html();
                    $( "#main-player" ).find( "h3" ).html( "Playing: " + name );
                    that.pause();
                    player.pause();
                }
            }
        });
    }

};


