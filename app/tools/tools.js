'use strict';

angular.module('myApp.tools', ['ngRoute', 'myApp.settings', 'angularFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tools', {
    templateUrl: 'tools/tools.html',
    controller: 'ToolsCtrl'
  });
}])

.controller('ToolsCtrl', ['$scope', 'apiUrl', 'FileUploader',function($scope, apiUrl, FileUploader) {
    $scope.uploader = new FileUploader({
        url:apiUrl+'/tools/import.json'
    });
    $scope.upload=function() {
//      alert($scope.uploader.queue[0].file.name);
      $scope.uploader.uploadItem(0);
    };
}]);