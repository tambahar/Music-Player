var Templates = {

    albums: function (albums) {
        var singleAlbum = "";
        var names = [];
        $.each(albums, function (index, image) {
            var albumName = albums[index].album.album_name;
            var images = albums[index].album.album_image;
            var albumArtist = albums[index].album.album_artist;
            var albumId = albums[index]._id;
            if (images.length > 0) {
                names.push(albumName);
                var arcName = Templates.arcName( albumArtist, albumName );

                singleAlbum +=  '<div class="single_album stored-id" data-id="'+ albumId +'" data-albumName="'+ albumName +'" data-albumArtist="'+ albumArtist +'" >' +
                    '<div class="album">' +
                    '<img class="" src = ' + images + ' id="image">' +
                    '<div class="album_center">' +
                    arcName +
                    '</div>' +
                    '<div class="album-buttons">' +
                    '<span class="albumTrash"><i class="fa fa-trash"></i></span>' +
                    '<span class="album-pencil edit"><i class="fa fa-pencil"></i></span>' +
                    '<span class="album-play"><i class="fa fa-play"></i></span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }

        });
        return singleAlbum;
    },

    arcName: function ( albumArtist, albumName ) {
        var arcName = "";
        var notes = (albumArtist + "-" + albumName).split("");
        if( notes.length < 33 ){
            $.each(notes, function (index) {

                var mdl = Math.round(parseFloat(index - (notes.length / 2) + 0.5));
                arcName += "<h1 class='arc'><span class='char" + index + "' style='transform: rotate(" + mdl + 1 + "deg);'>"
                    + notes[index] +
                    "</span></h1>";
            });
        } else {
            arcName += "<div class='not_arc'><h1>" +albumArtist+ " - " +albumName +"</h1></div>";
        }
        return arcName;
    },

    player: function ( id, album ) {
        var ol = "";
        var playerHtml = "";
        var image = album.album.album_image;
        var playlist = album.playlist;
        $.each(playlist, function (index, track) {
            ol += "<li class='li_track' data-path = " + track.path + ">" + track.name + "</li>";
        });


        playerHtml +=   '<div class="left col">' +
            '<div class="album">' +
            '<img src = ' + image + ' alt="Album image" class="a">' +
            '<span class="icon-close"><i class="fa fa-times"></i></span>' +
            '<div class="album_center">' +
            '<span class="state player-play"><i class="fa fa-play"></i></span>' +
            '<span class="state player-pause"><i class="fa fa-pause"></i></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="right col stored-id" data-id="'+ id +'">' +
            '<audio controls autoplay>' +
            '<source src="" data-name="" type="audio/mp3">' +
            '</audio>' +
            '<h3 id="now-playing"></h3>' +
            '<ol id="ol_playlist">' +
            ol +
            '</ol>' +
            '<span class="icon-edit edit"><i class="fa fa-pencil"></i></span>' +
            '</div>';
        return playerHtml;
    },

    anotherSongInput: function ( name, path ) {
        var inputHtml;
        if( name && path ) {
            inputHtml = '<label class="song-name">Song Name : </label><input class="song-input clear-input" value="'+ name +'" type="text" name="song_name" placeholder="e.g Time">' +
                '<label class="song-url">URL : </label><input class="song-input clear-input" value="'+ path +'" type="text" name="song_url" placeholder="e.g https://___________.mp3">';
        } else {
            inputHtml = '<label class="song-name">Song Name : </label><input class="song-input" value="" type="text" name="song_name" placeholder="e.g Time">' +
                '<label class="song-url">URL : </label><input class="song-input" value="" type="text" name="song_url" placeholder="e.g https://___________.mp3">';

        }   return inputHtml;
    },

    editOrNewAlbumTitle: function ( state ) {
        $( ".addNewAlbum" ).html( state + " Album" );
        $( ".addP" ).html( state + " Album Playlist" );
    }

};


