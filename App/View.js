var View = {

    insertAlbums: function() {
        var that = this;
        //noinspection JSLint
        DataService.getAlbums().then(
            function( response ) {
                var albums = ( response );
                var albumsHTML = Templates.albums( albums );
                that.appendAlbums( albumsHTML );
            },

            function( error ){
                console.log( error );
            }
        );
    },

    appendAlbums: function( albumsHTML ){
        $( "#wrapper" ).html( albumsHTML );
    },

    newAlbumDiv: $( "#dialog" ),

    addSongsDiv: $( "#addPlayList" ),

    addNewAlbum: function( id ){
        var that = this;
        var input = $( ".album_input" );
        FancyBox.fancyBoxFadeIn();
        that.newAlbumDiv.fadeIn();
        if ($( "#finishAndSave" ).hasClass("edit-mode")) {
            Templates.editOrNewAlbumTitle( "Edit" );
        } else {
            Templates.editOrNewAlbumTitle( "New" );
        }

        that.urlPicToPreview();
        that.newAlbumDiv.find( "#reset" ).on( "click", function() {
            input.val("");
        });

        $('.icon-close1').on('click', function () {
            $('#fancy-box').hide();
        });

        $('.icon-close2').on('click', function () {
            $('#fancy-box').hide();
        });


        that.newAlbumDiv.find( "#save" ).on( "click", function() {
            if( that.isAlbumInputValid( input ) ){
                var album = {};
                input.each(function(){
                    album[this.name] = this.value;
                });

                that.finishAndSave( id, album );

                that.newAlbumDiv.css( "display", "none" );
                that.addSongsDiv.fadeIn();
            }
        });
    },

    urlPicToPreview: function () {
        var toPreview = function () {
            var urlInput = $( "input[name=album_image]" ).val();
            $( "#img1" ).attr( "src", urlInput );
        };

        $( "document" ).ready( function() {
            toPreview();
        });
        $( "input[name=album_image]" ).on( "input", function(){
            toPreview();
        });
    },

    addAnotherSong: function(){
        var that = this;
        that.addSongsDiv.on( "click", "#addSong", function(){
            var anotherInput = Templates.anotherSongInput();
            that.addSongsDiv.find( "#inputs" ).append( anotherInput );
        } );
    },

    finishAndSave: function( id, album ) {
        var that = this;

        $( "#finishAndSave" ).unbind( "click" ).on( "click", function () {

            var playlist = [];
            var inputs = $( ".song-input" );
            if( that.isAlbumInputValid( inputs ) ) {
                for (var i = 0; i < inputs.length; i = i + 2) {
                    playlist.push({
                        name: inputs[i].value,
                        path: inputs[i + 1].value
                    });
                }

                if ($(this).hasClass("edit-mode")) {
                    DataService.updateAlbum(id, album, playlist).then(
                        function (response) {
                            var albumName = response.album_name;
                            var albumArtist = response.album_artist;
                            $("#finishAndSave").removeClass("edit-mode");
                            $(".clear-input").val("");
                            alert('The Changes For "'+ albumArtist +' - '+ albumName +'" Has Been Successfully Performed.');
                            that.insertAlbums();
                        }
                    );
                } else {
                    DataService.createAlbum(album, playlist).then(
                        function (response) {
                            var albumName = response.album.album_name;
                            var albumArtist = response.album.album_artist;
                            alert('The New Album "'+ albumArtist +' - '+ albumName +'" Has Been Successfully Created.');
                            that.insertAlbums();
                        }
                    );
                }

                that.addSongsDiv.css( "display", "none" );
                FancyBox.fancyBoxFadeOut();
            }
        } );
    },

    editAlbum: function(){
        var that = this;

        $( "main" ).on( "click", ".edit", function(){
            var id =  $( this ).parents( ".stored-id" ).data( "id" );
            $( "#finishAndSave" ).addClass( "edit-mode" );
            DataService.getAlbum( id ).then(
                function( response ) {
                    var album = ( response );
                    var img = album.album.album_image;
                    var artist = album.album.album_artist;
                    var albumName = album.album.album_name;
                    var playlist = album.playlist;

                    $( "input[name='album_name']" ).val( albumName );
                    $( "input[name='album_artist']" ).val( artist );
                    $( "input[name='album_image']" ).val( img );

                    var name = "";
                    var path = "";
                    var anotherInput = "";
                    for ( var i = 0; i < playlist.length; i++) {
                        name = ( playlist[i].name );
                        path = ( playlist[i].path );
                        anotherInput += Templates.anotherSongInput( name, path );
                    }
                    that.addSongsDiv.find( "#inputs" ).html( anotherInput );
                    that.addNewAlbum( id );

                } );
        } );
    },

    delete: function(){
        var that = this;
        Player.albumsWrapper.on( "click", ".albumTrash", function(){
            var id =  $( this ).parents( ".single_album" ).data( "id" );
            var albumName =  $( this ).parents( ".single_album" ).attr( "data-albumName" );
            var confirmDelete = window.confirm('Are You Sure You Want To Delete "'+ albumName +'" Album?');
            if( confirmDelete ){
                DataService.deleteAlbum( id ).then(
                    function( response ){
                        that.insertAlbums();
                        alert('"'+ albumName +'" Has Been Successfully Deleted.')
                    }
                );
            }
        } );
    },

    isAlbumInputValid: function ( input ) {
        var regex;
        if(input.hasClass( "album_input" )){
            regex = {
                album_name: new RegExp( "^([A-Z][a-zA-Z0-9\- \'()]*\s*)$" ),
                album_artist: new RegExp( "^([A-Z][a-zA-Z0-9\- \'()]*\s*)$" ),
                album_image: new RegExp( "^(https?:\/\/.*\.(?:png|jpg|jpeg|img|gif))$" )
            };
        } else if( input.hasClass( "song-input" ) ){
            regex = {
                song_name: new RegExp( "^([A-Z][a-zA-Z0-9\- \'':;()]*\s*)$" ),
                song_url: new RegExp( "^(http:\/\/[a-zA-Z0-9_~.=*&%/?':;()-]+)(?:mp3|wav)$" )
            };
        }

        var valid = 0;
        $.each( input, function( key, value ) {
            var inputValue = $(value).val();
            var inputName = $(value).attr("name");

            if (regex[inputName].test(inputValue)) {
                $("input[name=" + inputName + "]").removeClass( "regexInvalid" );
                valid = 1
            } else {
                $(this).addClass( "regexInvalid" );
                valid = 0;
                return false;
            }
        });
        return valid;
    },

    search: function () {
        $( "input#search-album" ).on( "input", function () {
            var searchValue = $( "input#search-album" ).val().toLowerCase();
            var albums = $( ".single_album" );
            $.each( albums, function ( key, album ) {
                var albumName = $(album).attr( "data-albumName" ).toLowerCase();
                var albumArtist = $(album).attr( "data-albumArtist" ).toLowerCase();
                if( albumName.includes(searchValue) || albumArtist.includes(searchValue) ) {
                    $(this).css("display", "inline-flex");
                }   else {
                    $(this).css("display", "none");
                }
                if( searchValue.length == 0 ){
                    $( ".single_album" ).css( "display", "inline-flex" );
                }
            } );
        } );
    },


    bindEvents: function(){
        var that = this;
        $( "#add-album" ).on( "click", function() {
            var anotherInput = Templates.anotherSongInput();
            that.addSongsDiv.find( "#inputs" ).html( anotherInput );
            that.addNewAlbum();
        });
        this.addAnotherSong();
        this.editAlbum();
        this.delete();
        this.search();
    },

    init: function(){
        this.insertAlbums();
        this.bindEvents();
    }
};



