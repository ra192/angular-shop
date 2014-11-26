'use strict';

angular.module('myApp.tools', ['ngRoute', 'myApp.settings', 'angularFileUpload', 'facebook'])

    .config(['$routeProvider', 'FacebookProvider', function ($routeProvider, FacebookProvider) {
        $routeProvider.when('/tools', {
            templateUrl: 'tools/tools.html',
            controller: 'ToolsCtrl'
        });

        FacebookProvider.init('131207310315568');
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