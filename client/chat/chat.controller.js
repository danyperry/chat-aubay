(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatController', ChatController);

   
    function ChatController(UserService, $rootScope, $log) {
        var vm = this;
        vm.user = null;
        vm.allUsers = [];
        vm.prova = "ciao";
        
        //var service = {};

        vm.sendMsg = sendMsg;
        vm.userLogged = $rootScope.userLogged;
        
        (function initController() {
           
            //loadCurrentUser();
            //loadAllUsers();
            
           
        })();
        
        function sendMsg() {
            $log.debug('msg: ');
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
