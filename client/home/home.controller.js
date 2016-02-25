(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', '$log', 'Auth','FlashService'];
    function HomeController(UserService, $rootScope, $log, Auth, FlashService) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        
        vm.isLoggedIn = Auth.isLoggedIn;
        vm.isAdmin = Auth.isAdmin;
        vm.getCurrentUser = Auth.getCurrentUser;
     
        initController();

        function initController() {
            $log.debug("current user: "+vm.getCurrentUser().nome);
            //loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            $log.debug("user"+$rootScope.globals.currentUser.username);
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

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
                FlashService.Success("Utente cancellato correttamente.",true);
            });
        }
    }

})();