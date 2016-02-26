(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['UserService', '$rootScope', '$log', 'Auth', 'socket', 'WebSocket', '$http'];
    function ChatController(UserService, $rootScope, $log, Auth, socket, WebSocket, $http) {
        var vm = this;
        vm.messages = [];
        vm.users = [];
        vm.message = "";
        vm.getCurrentUser = Auth.getCurrentUser;
        vm.utenteConnesso = utenteConnesso;
        vm.register =  register;
        vm.WebSocket = WebSocket;
        vm.sendMessage = sendMessage;
        vm.partecipants = [];
        initController();
        register();

        function register() {
            $log.debug("-------------------- entrato in register ------------------");
            WebSocket.on('new_connection', (data) => {
                handleNewConnection(data);
            });
            
            WebSocket.on('incoming_message', (data) => {
                handleIncomingMessage(data);
            });

            WebSocket.on('user_disconnected', (data) => {
                handleUserDisconnected(data);
            });
        }

        function initController() {
            $log.debug("-------------------- entrato in initController ------------------");
            loadCurrentUser();
            loadAllUsers();
            loadPartecipants();
            
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
        //vm.createMsg = createMsg;
        vm.msg = "";
        
        
/*
        function createMsg(msg) {
            //vm.user = vm.getCurrentUser;
<<<<<<< HEAD
           //return vm.getCurrentUser().username + ": " + msg;
           // $rootScope.globals.currentUser.username
            vm.user = "dany";
            return ["$rootScope.globals.currentUser.username", msg];
=======
            //return vm.getCurrentUser().username + ": " + msg;
            vm.user = $rootScope.globals.currentUser.username;
            return [$rootScope.globals.currentUser.username, msg];
>>>>>>> c9132484cf22b993ad7640ba396f526ec960f881
        }
*/
        function loadCurrentUser() {
            vm.user = vm.getCurrentUser;
        }

        function loadAllUsers() {
            vm.allUsers = UserService.getUserLogged()
                .then(function (users) {
                    vm.allUsers = users;
                });
            $log.debug("userLogged" +vm.allUsers);
  
        }
        
        function sendMessage() {
            //$log.debug("message: "+vm.message);
            var msg = {user: vm.getCurrentUser().username, message: vm.message};
            socket.emit('send:message', msg);
            
            let params = {
                message:    vm.message,
                created_at: new Date().toISOString(),
                user_id:    Auth.getCurrentUser().id
            };

            $http.post("/messages", params).then(
                () => {
                    vm.message = "";
                },
                (reason) => {
                    console.log("error", reason);
                }
            );
            vm.message = '';
            
            $log.debug(vm.messages);
            
        };
        
        function utenteConnesso() {
            //$log.debug("message: "+vm.message);
            var msg = {user: vm.getCurrentUser().username, message: "è entrato nella chat"};
            socket.emit('send:message', msg);
            
            // add the message to our model locally
            //TODO
            //vm.messages.push(msg);
            // clear message box
            vm.message = '';
        };
        
         function handleIncomingMessage(data) {
           
            socket.emit('send:message', { message: data.message});
            vm.messages.push({ message: data.message, user: data.user, created_at: data.created_at, type: "message" });
        }

        function handleUserDisconnected(data) {
            loadPartecipants(); 
            vm.messages.push({ message: `User ${data.username} disconnected` });
            
                       
        }

        function handleNewConnection(data) {
            //socket.emit('send:message', { message: "new connection"});
            vm.messages.push({ message: `User ${data.user.name} joined`, name: "System", created_at: data.created_at, type: "notification" });
            loadPartecipants();
        }
        
        function loadPartecipants(){
             $http.get("/partecipants").then(
                (partecipants) => {
                    vm.partecipants = partecipants.data;
                },
                (reason) => {
                    console.log("error", reason);
                }
            );
            $log.log(vm.partecipants);
        }
        
        
    }

})();