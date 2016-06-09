var DataService = {

    baseUrl: "http://music.api.berman.solutions/api/albums/",

    getAlbums: function(){
        return  $.get( this.baseUrl );
    },


    getAlbum: function( id ){
        return  $.get( this.baseUrl + id );
    },

    createAlbum: function( album, playlist ){
        return  $.post( this.baseUrl, { album , playlist } );
    },

    deleteAlbum: function( id ){
        return  $.ajax({
            url: this.baseUrl+ id,
            type: "DELETE",
            success: function( response ) {

            }
        });
    },

    updateAlbum: function( id, album, playlist ){
        return  $.ajax({
            url: this.baseUrl+ id,
            type: "PUT",
            data: { album, playlist },
            success: function( response ) {

            }
        });
    }

};