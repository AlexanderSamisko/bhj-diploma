/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xRequest = new XMLHttpRequest();
    let requestURL;
        if (options.method == `GET`) {
            if (options.data){
                if(!options.data.password && !options.data.email){
                    requestURL = options.url + `?account_id=` + options.data;
                } else if(!options.data.password){
                    requestURL = options.url + `?mail=` + options.data.email;
                } else {
                    requestURL = options.url + `?mail=` + options.data.email + `&password=` + options.data.password;
                }
            } else {
                requestURL = options.url;
            }
          
            try {
                xRequest.open(options.method, requestURL);
                if (options.responseType) {
                    xRequest.responseType = options.responseType;
                } else {
                    xRequest.responseType = 'json';
                }
                xRequest.send();  
            } catch (err) {
                console.log(err);
            }
        } else {
            const formData = new FormData();
            if (options.data) {
                let list = Object.entries(options.data);
                for (let j = 0; j < list.length; j++) {
                    formData.append( `${list[j][0]}`, `${list[j][1]}`);
                }
            }   
            if (options.responseType) {
                xRequest.responseType = options.responseType;
            }

            try {
                xRequest.open(options.method, options.url);
                if (options.responseType) {
                    xRequest.responseType = options.responseType;
                } else {
                    xRequest.responseType = 'json';
                }
                xRequest.send(formData);
            } catch (err) {
                console.log(err);
            }   
        }
        
        const toDo = function(evt) {
            if (xRequest.status != 200) {
                const err = {
                    [`${xRequest.status}`] : xRequest.statusText
                }
                options.callback(err, null);
            } else {
                options.callback(xRequest.response.error, xRequest.response);
            }
            evt.preventDefault();
        }
        
        xRequest.addEventListener(`load`, toDo);
};
