const fetch = require('node-fetch');

const ES_ENDPOINT = process.env.ES_ENDPOINT;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

exports.handler = async (event) => {
    const eventData = JSON.stringify(event);
    const method = eventData.httpMethod;
    const body = eventData.body;

    const promise = consultElasticsearch(body, method);
    return promise;
}

function consultElasticsearch(data, httpMethod){
    return new Promise( ((resolve, reject) => {
        let headers = new Headers();
        headers.append('Authorization', 'Basic' + Buffer.from(USERNAME + ":" + PASSWORD).toString('base64'))

        fetch(ES_ENDPOINT, {
            method: httpMethod,
            headers: headers,
            body: data
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error);
        })
    }))
}



