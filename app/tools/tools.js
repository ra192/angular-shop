'use strict';

angular.module('myApp.tools', ['ngRoute', 'myApp.settings', 'angularFileUpload', 'facebook'])

    .config(['$routeProvider', 'FacebookProvider', 'settings', function ($routeProvider, FacebookProvider, settings) {
        $routeProvider.when('/tools', {
            templateUrl: 'tools/tools.html',
            controller: 'ToolsCtrl'
        });

        FacebookProvider.init(settings.facebookAppId);
    }])

    .controller('ToolsCtrl', ['$scope', '$http', 'settings', 'FileUploader', 'Facebook', function ($scope, $http, settings, FileUploader, Facebook) {

        Facebook.getLoginStatus(function (fbResponse) {
            if (fbResponse.status === 'connected') {
                $scope.uploader.headers.accessToken=fbResponse.authResponse.accessToken;
            }
        });

        $scope.uploader = new FileUploader({
            url: settings.apiUrl + '/tools/import.json'
        });

        $scope.upload = function () {
            $scope.uploader.uploadItem(0);
        };
    }]);