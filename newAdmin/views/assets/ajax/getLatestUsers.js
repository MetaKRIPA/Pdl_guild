function getLatestUsers(element, limit){

    $.ajax({
        url: '/getUsers',         /* Куда отправить запрос */
        method: 'post',             /* Метод запроса (post или get) */
        dataType: 'json',          /* Тип данных в ответе (xml, json, script, html). */
        data: {limit},
        success: function(data){   /* функция которая будет выполнена после успешного запроса.  */
            if(data){
                let resultData = "";
                let dateUser = "";
                let nameUser = "";
                data.forEach(elem => {

                    let d = new Date(elem.createdAt);
                    dateUser = `${(d.getMinutes() < 10) ? ("0" + d.getMinutes()) : d.getMinutes()}:${(d.getHours() < 10) ? ("0" + d.getHours()) : d.getHours()} ${(d.getDay() < 10) ? ("0" + d.getDay()) : d.getDay()}-${(d.getMonth() < 10) ? ("0" + d.getMonth()) : d.getMonth()}-${d.getFullYear()}`;

                    if(elem.first_name) nameUser = "<i class=\"me-2 mdi mdi-account\"></i>" + elem.first_name + ((elem.second_name) ? (" " + elem.second_name) : "");
                    else if(elem.username) nameUser = "<i class=\"me-2 mdi mdi-alert-circle\"></i>" + elem.username;
                    else nameUser = "<i class=\"me-2 mdi mdi-clipboard-account\"></i>" + elem.telegram;

                    resultData+=`<tr>
                        <td class="txt-oflo">${nameUser}</td>
                        <td class="mobileHide"><span
                            class="label label-info label-rounded" style="font-family: monospace; cursor: pointer" onclick="copyElementLatestPadlas(this)">${elem.wallet}</span>
                        </td>
                        <td class="txt-oflo">${dateUser}</td>
                    </tr>\n`
                });

                element.innerHTML = resultData;
            }else{
                console.error(data)
            }
        },
        error: function (e){
            console.log(e);
        }
    });

}

function copyElementLatestPadlas(elem){
    const text = elem.innerText;
    navigator.clipboard.writeText(text).then(function() {

        elem.style.cursor = "default";
        elem.style.transition = "1s";
        elem.style.background = "#5ac146";
        setTimeout(() => {
            elem.style.background = "#137eff";
            elem.style.cursor = "pointer";
        }, 1000)

    }, function(err) {
        alert('Async: Could not copy text: ', err);
    });
}