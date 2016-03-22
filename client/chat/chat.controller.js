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
		vm.openRoom = openRoom;
        vm.partecipants = [];
        initController();
        register();
		
		vm.room = "All";
        
       

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
			
            WebSocket.on('incoming_message'+vm.getCurrentUser()._id, (data) => {
                handleIncomingMessageRoom(data);
            });
			
			
			

        }

        function initController() {
            $log.debug("-------------------- entrato in initController ------------------");
            loadCurrentUser();
            loadAllUsers();
            loadPartecipants();
            
        }
      
        vm.user = "";
        vm.allUsers = [];
      
        vm.msg = "";
        
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
            $log.debug('invio messaggio alla room: '+ vm.room);
            let params = {
                message:    vm.message,
                created_at: new Date().toISOString(),
                user_id:    Auth.getCurrentUser()._id, 
				room: vm.room
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
  		   $log.debug("handleIncomingMessage: "+ data.message);
           
            socket.emit('send:message', { message: data.message});
            vm.messages.push({ message: data.message, user: data.user, created_at: data.created_at, type: "message" });
        }
		
        function handleIncomingMessageRoom(data) {
		   $log.debug("handleIncomingMessageRoom: "+ data.message);
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
             $http.get("/chat/partecipants").then(
                (partecipants) => {
                    vm.partecipants = partecipants.data;
                },
                (reason) => {
                    console.log("error", reason);
                }
            );
            $log.log(vm.partecipants);
        }

		function openRoom(id){
			let params = {
                idUser1:    id,
                idUser2:    Auth.getCurrentUser()._id
            };
			
			vm.room = id;
			$log.debug("id della room click:"+ vm.room);
			$http.post("/chat/chatRoom", params).then(
                messages => {
                    vm.messages = messages;
					$log.debug(vm.messages);
                },
                (reason) => {
                    console.log("error", reason);
                }
            );
			
		}
        
        
    }

})();