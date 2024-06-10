$( "form" ).submit(function( event ) {
    event.preventDefault();
    const value =  $("input").val();
    if(!value || value === ""){
        return;
    }
    $.ajax({
        url: '/authorization',
        method: 'post',
        data: {token: value},
        success: function(data){
            if(!data) alert(data);
            else window.location.href = "/";
        }
    });
});