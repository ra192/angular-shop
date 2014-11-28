'use strict';

function handleCallback(fbResponse,callback) {
    if (fbResponse.status === 'connected') {
        callback({isLoggedIn:true,accessToken:fbResponse.authResponse.accessToken});
    } else {
        callback({isLoggedIn:false,accessToken:null});
    }
}

angular.module('myApp.user', ['facebook', 'myApp.settings'])
    .config(['FacebookProvider', 'settings',
        function (FacebookProvider, settings) {
            FacebookProvider.init(settings.facebookAppId);
        }])
    .factory('User',['$rootScope','$http','Facebook','settings',function($rootScope,$http,Facebook,settings){
        var user={
            login:function(callback) {
                Facebook.login(function (fbResponse) {
                    handleCallback(fbResponse,callback);
                });
            },
            logout:function(success) {
                Facebook.logout(function (fbResponse) {
                    handleCallback(fbResponse,callback);
                });
            },
            getLoginStatus: function(callback){
                Facebook.getLoginStatus(function(fbResponse){
                    handleCallback(fbResponse,callback);
                });
            }
        };

        $rootScope.$on('Facebook:authResponseChange', function (ev, fbResponse) {
            if (fbResponse.status === 'connected') {
                $http.post(settings.apiUrl + '/users/add.json', {
                    "userID": fbResponse.authResponse.userID,
                    "accessToken": fbResponse.authResponse.accessToken,
                    "expiresIn": fbResponse.authResponse.expiresIn
                });
            }
        });

        return user;
    }]);
