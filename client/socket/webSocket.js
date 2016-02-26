(function () {
    'use strict';
    
     angular.module('app')
    .service('WebSocket', WebSocket);

    function WebSocket($rootScope, Auth, $log) {
        
        var vm = this;
        vm.$rootScope = $rootScope;
       
        vm.on = on;
        
        init(); 
        function init() {
            let host = window.location.origin;
            console.log("WEBSOCKET connecting to", host);

            vm.socket = io.connect(host);
            /*
            vm.socket.on('connect', () => {
                let sessionId = vm.socket.io.engine.id;

                console.log("WEBSOCKET connected with session id", sessionId);

                vm.socket.emit('new_user', { id: sessionId });
                
                
                // this is the new event handler
                vm.socket.on('new_connection', (data) => {

                    if (data.user.id === sessionId) {
                        vm.$rootScope.$apply(() => {
                            $log.debug('new_connection dentro websocket');
                            //Auth.setCurrentUser(data.user);
                        });
                    }
                });
            
            })*/
        }
        
        function on(key, callback) {
            vm.socket.on(key, (data) => {
                vm.$rootScope.$apply(() => {
                    callback(data)
                });
            });
        }
    
    }  
    
})();



