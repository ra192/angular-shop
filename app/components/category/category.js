'use strict';

function CategoryService(categoriesArray) {

    var findCategoryByName = function (categoryName, categoriesArray) {
        for (var i = 0; i < categoriesArray.length; i++) {
            if (categoriesArray[i].name == categoryName) return categoriesArray[i];
            var category = findCategoryByName(categoryName, categoriesArray[i].children);
            if (category != null) return category;
        }

        return null;
    };

    var selectCategory = function (categoryName, categoriesArray) {
        for (var i = 0; i < categoriesArray.length; i++) {
            if (categoriesArray[i].name == categoryName)
                categoriesArray[i].selected = true;
            else
                categoriesArray[i].selected = false;

            selectCategory(categoryName, categoriesArray[i].children);
        }
    };

    this.categoriesArray = categoriesArray;

    this.findCategoryByName = function (categoryName) {
        return findCategoryByName(categoryName, this.categoriesArray);
    };

    this.selectCategory = function (categoryName) {
        selectCategory(categoryName, this.categoriesArray);
    };

    this.toggleCategory = function (categoryName) {

        var category = this.findCategoryByName(categoryName);

        category.expanded = !category.expanded;
    };
}

angular.module('myApp.category', ['myApp.settings'])

    .factory('categoryService', ['$http', 'settings', function ($http,settings) {

        var categoryService = new CategoryService([]);

        categoryService.init = function (callback) {
            if (categoryService.categoriesArray.length == 0) {
                $http.get(settings.apiUrl+'/categories.json').success(function (data) {
                    categoryService.categoriesArray = data.data;
                    callback();
                });
            }
            else
                callback();
        };

        return categoryService;
    }]);
