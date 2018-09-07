(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$rootScope', 'AuthenticationService', 'FlashService'];
    function LoginController($location, $rootScope, AuthenticationService, FlashService) {
        var vm = this;

        $rootScope.isLoggedIn = false;
        vm.submitted = false;

        vm.login = login;

        vm.hasError = hasError;

        vm.formName = {};
        function hasError (formName, name, validation) {
            if (validation) {
                return formName[name].$dirty && formName[name].$error[validation];
            }
            return formName[name].$dirty && formName[name].$invalid;
        }

        function domainNameCheck() {
            var userName = document.getElementById('username').value;
            if (!userName.endsWith('@inmar.com')) {
                alert('Please enter a valid domain name');
                return false;
            }
            return true;
        }

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login(formName) {
            vm.submitted = true;
            if (domainNameCheck () == false) {
                return false;
            }
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
