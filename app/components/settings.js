'use strict';

angular.module('myApp.settings', []).
    constant("settings", {
        apiUrl: "http://localhost:8081",
        productsPerPage: 5
    });
