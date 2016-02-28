
'use strict';

angular.module('app', ['ngRoute', 'ngCookies', 'ngResource',
        'chat.auth',
        'chat.constants',
        'btford.socket-io'])
       .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm',
                authenticate: 'admin'
            })
            .when('/chat', {
                controller: 'ChatController',
                templateUrl: 'chat/chat.view.html',
                controllerAs: 'vm' 
                /*authenticate: 'admin'*/
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
               
            })
            .when('/logout', {
                name: 'logout',
                referrer: '/',
                template: '',
                controller: function($location, $route, Auth, $http) {
                    var referrer = $route.current.params.referrer ||
                                    $route.current.referrer ||
                                    '/';
                    console.log("id logout"+Auth.getCurrentUser()._id);
                    $http.post("/chat/removeUserLoggato", {id: Auth.getCurrentUser()._id});
                    Auth.logout();
                    
                   
                    $location.path(referrer);
                }
            })
            .otherwise({ redirectTo: '/login' });
        }).run(function ($rootScope) {
            $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (next.name === 'logout' && current && current.originalPath && !current.authenticate) {
                next.referrer = current.originalPath;
            }
            });
        });
    
    /*
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        /*
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
         } */
