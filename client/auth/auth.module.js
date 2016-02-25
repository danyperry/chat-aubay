'use strict';

angular.module('chat.auth', [
  'chat.constants',
  'chat.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
