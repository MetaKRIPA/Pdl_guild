function getUserCounter(elem){

    $.ajax({
        url: '/getUsersCounter',         /* Куда отправить запрос */
        method: 'post',             /* Метод запроса (post или get) */
        dataType: 'json',          /* Тип данных в ответе (xml, json, script, html). */
        success: function(data){   /* функция которая будет выполнена после успешного запроса.  */
            if(data){
                let resultData = "<h4 class=\"card-title mb-0\">PADLAs</h4>" + "\n";

                let span = "";
                if(data.newUser !== 0){
                    span = ` <span class="font-16 text-success font-medium">+${data.newUser}</span>`
                }
                resultData += `<h2 class="font-light">${data.allUser}${span}</h2>`;
                resultData += "<div class=\"mt-4\">\n<a href=\"#\"> All PADLAs </a>\n</div>\n";
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