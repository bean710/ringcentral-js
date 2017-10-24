(function(root) {

    var expect = chai.expect;
    var spy = sinon.spy;

    function apiCall(method, path, json, status, statusText, headers) {

        status = status || 200;
        statusText = statusText || 'OK';

        var isJson = typeof json !== 'string';

        if (isJson && !headers) headers = {'Content-Type': 'application/json'};

        fetchMock.mock('http://whatever' + path, {
            body: isJson ? JSON.stringify(json) : json,
            status: status,
            statusText: statusText,
            headers: headers,
            sendAsJson: false
        }, {
            method: method,
            times: 1
        });

    }

    function authentication() {

        apiCall('POST', '/restapi/oauth/token', {
            'access_token': 'ACCESS_TOKEN',
            'token_type': 'bearer',
            'expires_in': 3600,
            'refresh_token': 'REFRESH_TOKEN',
            'refresh_token_expires_in': 60480,
            'scope': 'SMS RCM Foo Boo',
            'expireTime': new Date().getTime() + 3600000
        });

    }

    function logout() {

        apiCall('POST', '/restapi/oauth/revoke', {});

    }

    function presenceLoad(id) {

        apiCall('GET', '/restapi/v1.0/account/~/extension/' + id + '/presence', {
            "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id + "/presence",
            "extension": {
                "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id,
                "id": id,
                "extensionNumber": "101"
            },
            "activeCalls": [],
            "presenceStatus": "Available",
            "telephonyStatus": "Ringing",
            "userStatus": "Available",
            "dndStatus": "TakeAllCalls",
            "extensionId": id
        });

    }

    function subscribeGeneric(expiresIn, id, remove, timeZoneString) {

        expiresIn = expiresIn || 15 * 60 * 60;

        var date = new Date();

        var method = 'POST';
        if (id) method = 'PUT';
        if (remove) method = 'DELETE';

        var expirationTime = new Date(date.getTime() + (expiresIn * 1000)).toISOString();
        if (timeZoneString) {
            expirationTime = expirationTime.replace('Z', timeZoneString);
        }

        apiCall(method, '/restapi/v1.0/subscription' + (id ? '/' + id : ''), remove ? '' : {
            'eventFilters': [
                '/restapi/v1.0/account/~/extension/~/presence'
            ],
            'expirationTime': expirationTime,
            'expiresIn': expiresIn,
            'deliveryMode': {
                'transportType': 'PubNub',
                'encryption': false,
                'address': '123_foo',
                'subscriberKey': 'sub-c-foo',
                'secretKey': 'sec-c-bar'
            },
            'id': 'foo-bar-baz',
            'creationTime': date.toISOString(),
            'status': 'Active',
            'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
        });

    }

    function subscribeOnPresence(id, detailed) {

        id = id || '1';

        var date = new Date();

        apiCall('POST', '/restapi/v1.0/subscription', {
            'eventFilters': ['/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '')],
            'expirationTime': new Date(date.getTime() + (15 * 60 * 60 * 1000)).toISOString(),
            'deliveryMode': {
                'transportType': 'PubNub',
                'encryption': true,
                'address': '123_foo',
                'subscriberKey': 'sub-c-foo',
                'secretKey': 'sec-c-bar',
                'encryptionAlgorithm': 'AES',
                'encryptionKey': 'VQwb6EVNcQPBhE/JgFZ2zw=='
            },
            'creationTime': date.toISOString(),
            'id': 'foo-bar-baz',
            'status': 'Active',
            'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
        });

    }

    function tokenRefresh(failure) {

        if (!failure) {

            apiCall('POST', '/restapi/oauth/token', {
                'access_token': 'ACCESS_TOKEN_FROM_REFRESH',
                'token_type': 'bearer',
                'expires_in': 3600,
                'refresh_token': 'REFRESH_TOKEN_FROM_REFRESH',
                'refresh_token_expires_in': 60480,
                'scope': 'SMS RCM Foo Boo'
            });

        } else {

            apiCall('POST', '/restapi/oauth/token', {
                'message': 'Wrong token',
                'error_description': 'Wrong token',
                'description': 'Wrong token'
            }, 400);

        }

    }

    function createSdk(options) {

        options = options || {};

        var opts = {
            server: 'http://whatever',
            appKey: 'whatever',
            appSecret: 'whatever',
            Request: fetchMock.constructor.Request,
            Response: fetchMock.constructor.Response,
            Headers: fetchMock.constructor.Headers,
            fetch: fetchMock.fetchMock.bind(fetchMock),
            refreshDelayMs: 1,
            redirectUri: 'http://foo'
        };

        Object.keys(options).forEach(function(k) {
            opts[k] = options[k];
        });

        return new RingCentral.SDK(opts);

    }

    /**
     * @global
     * @param {function(SDK, function)} fn
     * @return {function()}
     */
    function asyncTest(fn) {

        return function() {

            var sdk = createSdk();

            function clean() {
                fetchMock.restore();
                sdk.cache().clean();
            }

            return new Promise(function(resolve, reject) {

                clean();

                authentication();

                var platofrm = sdk.platform();

                resolve(platofrm.login({
                    username: 'whatever',
                    password: 'whatever'
                }));

            }).then(function() {
                return fn(sdk, createSdk);
            }).then(function() {
                expect(fetchMock.done()).to.equal(true);
                clean();
            }).catch(function(e) {
                clean();
                console.error(e.stack);
                throw e;
            });

        };

    }

    root.expect = expect;
    root.spy = spy;
    root.SDK = RingCentral.SDK;
    root.asyncTest = asyncTest;
    root.apiCall = apiCall;
    root.presenceLoad = presenceLoad;
    root.tokenRefresh = tokenRefresh;
    root.logout = logout;
    root.subscribeOnPresence = subscribeOnPresence;
    root.subscribeGeneric = subscribeGeneric;
    root.authentication = authentication;

    console.log('Test env was set up');

})(typeof window !== 'undefined' ? window : global);

