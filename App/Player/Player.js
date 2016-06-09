var Player = {

    albumsWrapper: $( "#wrapper" ),

    playerBox: $( "#main-player" ),

    removeSpin: function(){
        this.albumsWrapper.find( "img" ).removeClass( "album_spin" );
        this.playerBox.find( "img" ).removeClass( "album_spin" );
    },

    openPlayer: function() {
        var that = this;
        this.albumsWrapper.on("click", ".album-play", function () {

            var hasClass = $( this ).parents( ".album-buttons" ).siblings( "img" ).hasClass( "album_spin" );
            if( !hasClass ){
                that.removeSpin();
                $( this ).parents( ".album-buttons" ).siblings( "img" ).addClass( "album_spin" );
                var id = $( this ).parents( ".single_album" ).data( "id" );
                DataService.getAlbum(id).then(
                    function( response ) {
                        var album = ( response );
                        var albumsHTML = Templates.player( id, album );
                        that.appendAlbum( albumsHTML );
                        var firstSong = that.playerBox.find( ".li_track" )[0];
                        MusicPlayer.playSong( firstSong );
                    }
                );
            }
            that.playerBox.slideDown();
            $( 'body' ).animate( { scrollTop: 0 }, 500 );
        });
    },

    closePlayer: function() {
        var that = this;
        this.playerBox.on( "click", ".icon-close", function(){
            that.playerBox.slideUp();
        } );
    },

    appendAlbum: function(albumsHTML){
        this.playerBox.html( albumsHTML );
        this.playerBox.find( "img" ).addClass( "album_spin" );
    },

    playAlbum: function() {
        this.openPlayer();
        MusicPlayer.clickOnTrack();
        MusicPlayer.playPause();
    },

    init: function(){
        this.closePlayer();
        this.playAlbum();
    }
};