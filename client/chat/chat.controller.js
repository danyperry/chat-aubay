(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['UserService', '$rootScope', '$log', 'Auth', 'socket'];
    function ChatController(UserService, $rootScope, $log, Auth, socket) {
        var vm = this;
        vm.messages = [];
        vm.users = [];
        vm.message = "";
        vm.getCurrentUser = Auth.getCurrentUser;
        vm.utenteConnesso = utenteConnesso;
        
        vm.sendMessage = sendMessage;
        initController();

        function initController() {
            utenteConnesso();
            loadCurrentUser();
            loadAllUsers();
        }
        
      
       /* 
        vm.socket.on('send:message', function (message) {
            vm.messages.push(message);
            $log.debug('lista messagges' +vm.messages);
        });
        */
       /* vm.socket.on('user:join', function (data) {
            vm.messages.push({
            user: 'chatroom',
            text: 'User ' + data.name + ' has joined.'
            });
            vm.users.push(data.name);
        });
        */
        vm.user = "";
        vm.allUsers = [];
        vm.createMsg = createMsg;
        vm.msg = "";
        
        

        function createMsg(msg) {
            //vm.user = vm.getCurrentUser;
           //return vm.getCurrentUser().username + ": " + msg;
            vm.user = $rootScope.globals.currentUser.username;
            return [$rootScope.globals.currentUser.username, msg];
        }

        function loadCurrentUser() {
            vm.user = vm.getCurrentUser;
        }

        function loadAllUsers() {
            vm.allUsers = UserService.getUserLogged()
                .then(function (users) {
                    vm.allUsers = users;
                });
           
            $log.debug("userLogged" +vm.allUsers);
            
            
            //vm.allUsers = $rootScope.userLogged;
            /*UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
                $log.debug("prima: "+vm.allUsers);*/
               
                //$log.debug("dopo: "+vm.allUsers);
        }
        
        function sendMessage() {
            $log.debug("message: "+vm.message);
            var msg = vm.getCurrentUser().username + ": " + vm.message;
            socket.emit('send:message', { message: msg});
            
            // add the message to our model locally
            vm.messages.push(msg);
            // clear message box
            vm.message = '';
        };
        
        function utenteConnesso() {
            $log.debug("message: "+vm.message);
            var msg = vm.getCurrentUser().username + ": è entrato nella chat";
            socket.emit('send:message', { message: msg});
            
            // add the message to our model locally
            vm.messages.push(msg);
            // clear message box
            vm.message = '';
        };
    }

})();