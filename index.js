const AWS = require('aws-sdk');
exports.handler = async (event) => {
    var ES_ENDPOINT = process.env.ES_ENDPOINT;
    var USERNAME = process.env.USERNAME;
    var PASSWORD = process.env.PASSWORD;
    console.log('Received event:', JSON.stringify(event, null, 2));
    return consultElasticsearch(
        ES_ENDPOINT,
        USERNAME,
        PASSWORD,
        event.requestContext.http.method,
        event.requestContext.http.path,
        event.rawQueryString,
        event.body);
};
function consultElasticsearch(
    esEndpoint,
    username,
    password,
    httpMethod,
    path,
    querystring,
    data) {
    return new Promise((resolve, reject) => {
        var endpoint = new AWS.Endpoint(esEndpoint);
        var request = new AWS.HttpRequest(endpoint, 'eu-west-1');
        var finalPath = path.substring('/deploy/search'.length);
        if (finalPath == '') finalPath = '/';
        if (querystring != '') querystring = '?' + querystring;
        request.method = httpMethod;
        request.path = finalPath + querystring;
        request.body = data;
        request.headers['Host'] = esEndpoint;
        request.headers['Content-Type'] = 'application/json';
        request.headers['Authorization'] = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        if (request.body) {
            request.headers['Content-Length'] = Buffer.byteLength(request.body);
        }
        console.log('Sending request: ' + request.method + ' ' + request.path)
        var credentials = new AWS.EnvironmentCredentials('AWS');
        var signer = new AWS.Signers.V4(request, 'es');
        signer.addAuthorization(credentials, new Date());
        var client = new AWS.HttpClient();
        client.handleRequest(request, null, function(response) {
            console.log(response.statusCode + ' ' + response.statusMessage);
            var responseBody = '';
            response.on('data', function (chunk) {
                responseBody += chunk;
            });
            response.on('end', function (chunk) {
                console.log('Response body: ' + responseBody);
                resolve(responseBody);
            });
        }, function(error) {
            console.log('Error: ' + error);
            reject(error);
        });
    });
}
