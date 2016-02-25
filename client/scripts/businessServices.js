var angularBlogBusinessServices = angular.module('app', ['ngCookies']);

angularBlogBusinessServices.factory('checkCreds', ['$cookies', function($cookies) {
        return function() {
            var returnVal = false;
            var blogCreds = $cookies.globals;
            if (blogCreds !== undefined && blogCreds !== "") {
                returnVal = true;
            }
            return returnVal;
        };

    }]);