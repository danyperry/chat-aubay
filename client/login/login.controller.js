(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location','$rootScope', 'AuthenticationService', 'FlashService', 'Auth', 'socket', 'UserService', '$log','WebSocket'];
    function LoginController($location,$rootScope, AuthenticationService, FlashService, Auth, socket, UserService,$log, WebSocket) {
        var vm = this;
        vm.userLogged = [];
        vm.login = login;
        vm.$rootScope = $rootScope;
        
        this.user = {};
        this.errors = {};
        this.submitted = false;

        this.Auth = Auth;
        this.$location = $location;
        vm.newUserConnected = newUserConnected;

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
                    newUserConnected(this.Auth.getCurrentUser());
                    this.$location.path('/');
                })
                .catch(err => {
                    FlashService.Error(err.message);
                    vm.dataLoading = false;
                    this.errors.other = err.message;
                });
            }
           
        }
        
        function newUserConnected(user){
            
            let host = window.location.origin;
            console.log("WEBSOCKET connecting to", host);

            vm.socket = io.connect(host);
            
            vm.socket.on('connect', () => {
                let sessionId = vm.socket.io.engine.id;

                console.log("WEBSOCKET connected with session id", sessionId);
                $log.debug('USER'+user.username);
                vm.socket.emit('new_user', { user: user });
                
                /*
                // this is the new event handler
                vm.socket.on('new_connection', (data) => {

                    if (data.user.id === sessionId) {
                        vm.$rootScope.$apply(() => {
                            $log.debug('new_connection dentro websocket');
                            //Auth.setCurrentUser(data.user);
                        });
                    }
                });*/
            
            });
			
            
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
