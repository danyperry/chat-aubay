(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService', 'Auth', 'socket', 'UserService'];
    function LoginController($location, AuthenticationService, FlashService, Auth, socket, UserService) {
        var vm = this;
        vm.userLogged = [];
        vm.login = login;
        
        
        this.user = {};
        this.errors = {};
        this.submitted = false;

        this.Auth = Auth;
        this.$location = $location;

        (function initController() {
            // reset login status
            //AuthenticationService.ClearCredentials();
        })();
        
        // new Login
        function login(form) {
            this.submitted = true;

            if (form.$valid) {
                this.Auth.login({
                    username: vm.username,
                    password: vm.password
                })
                .then(() => {
                    // Logged in, redirect to home
                    //socket.syncUpdates('users', vm.userLogged);
                    UserService.addUserLogged(this.Auth.getCurrentUser())
                  
                    this.$location.path('/');
                })
                .catch(err => {
                    FlashService.Error(err.message);
                    vm.dataLoading = false;
                    this.errors.other = err.message;
                });
            }
           
        }

        function loginOld() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
