'use strict';

angular.module('myApp.settings', []).
    constant("settings", {
        apiUrl: "http://localhost:9000",
        productsPerPage: 5,
        facebookAppId: '131207310315568'
    });
