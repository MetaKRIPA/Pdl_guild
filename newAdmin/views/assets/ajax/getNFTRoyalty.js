function getNFTRoyalty(elem){

    $.ajax({
        url: '/getNFTRoyalty',         /* Куда отправить запрос */
        method: 'post',             /* Метод запроса (post или get) */
        dataType: 'html',          /* Тип данных в ответе (xml, json, script, html). */
        success: function(data){   /* функция которая будет выполнена после успешного запроса.  */
            if(data){
                let resultData = "<h4 class=\"card-title mb-0\">NFT Royalty</h4>" + "\n";
                resultData += `<h2 class="font-light">${data} TON</h2>`;
                resultData += "<div class=\"mt-4\">\n<a href=\"#\"> More Info </a>\n</div>\n";
                elem.parentElement.innerHTML = resultData;
            }else{
                console.error(data)
            }
        },
        error: function (e){
            console.log(e);
        }
    });

}