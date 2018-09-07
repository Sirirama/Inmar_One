(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;
        $rootScope.isLoggedIn = false;
        vm.submitted = false;
        vm.register = register;

        function fieldValidations() {
            var userName = document.getElementById('username').value;
            if (!userName.endsWith('@inmar.com')) {
                alert('Please enter a valid domain name');
                return false;
            }

            var password = document.getElementById('password').value;
            var regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            if (!regExp.test(password)) {
                alert('Password length should be 8 character and it contains atleast one lowercase, uppercase and numeric character');
                return false;
            }

            var aadhar = document.getElementById('aadhar').value;

            return (aadhar.length != 12) ? (function () {
                alert('Please enter a valid aadhar number');
                return false;
            }()) : (function () {
                return /^\d{4}\d{4}\d{4}$/.test(aadhar);
            }());

            return true;
        }

        function register() {
            vm.submitted = true;
            if (fieldValidations () == false) {
                return false;
            }
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
