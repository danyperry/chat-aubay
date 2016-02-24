(function () {
    'use strict';

    angular
        .module('app')
        .directive('limitTo', inputLimit);

    function inputLimit() {
        return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keydown", function() {
                if (this.value.length == limit) return false;
            });
            }
        }
    }

})();
