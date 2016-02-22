(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['UserService', '$rootScope', '$log'];
    function ChatController(UserService, $rootScope, $log) {
        var vm = this;
        vm.user = "";
        vm.allUsers = [];
        vm.createMsg = createMsg;
        vm.msg = "";

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function createMsg(msg) {
            vm.user = $rootScope.globals.currentUser.username;
            return $rootScope.globals.currentUser.username + ": " + msg;
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user[0];
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }
    }

})();