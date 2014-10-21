'use strict';

angular.module('myApp.tools', ['ngRoute','angularFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tools', {
    templateUrl: 'tools/tools.html',
    controller: 'ToolsCtrl'
  });
}])

.controller('ToolsCtrl', ['$scope','FileUploader',function($scope,FileUploader) {
    $scope.uploader = new FileUploader({
        url:'http://localhost:8081/tools/import.json'
    });
    $scope.upload=function() {
//      alert($scope.uploader.queue[0].file.name);
      $scope.uploader.uploadItem(0);
    };
}]);