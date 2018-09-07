(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'FlashService', '$scope', '$rootScope','DTOptionsBuilder','DTColumnDefBuilder'];
    function HomeController(UserService, FlashService, $scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        $rootScope.isLoggedIn = true;
        vm.showGroupForm = false;

        $scope.dtOptionsEmpList = DTOptionsBuilder.newOptions()
        .withDisplayLength(10)
        .withOption('bLengthChange', true)
        .withOption('order', [[0, 'asc']]); 

        $scope.dtColumnDefsEmpList = [
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];

        $scope.dtOptionsGroupList = DTOptionsBuilder.newOptions()
        .withDisplayLength(10)
        .withOption('bLengthChange', true)
        .withOption('order', [[0, 'asc']]); 

        $scope.dtColumnDefsGroupList = [
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];

        $scope.dtOptionsUserList = DTOptionsBuilder.newOptions()
        .withDisplayLength(10)
        .withOption('bLengthChange', true)
        .withOption('order', [[0, 'asc']]); 

        $scope.dtColumnDefsUserList = [
            DTColumnDefBuilder.newColumnDef(7).notSortable()
        ];

        vm.emp = null;
        vm.allEmps = [];
        vm.deleteEmp = deleteEmp;

        vm.groupTitle = '';
        vm.groupNames = [];
        vm.newGroup = {};
        vm.allGroups = [];
        vm.addGroup = addGroup;
        vm.editGroup = editGroup;
        vm.deleteGroup = deleteGroup;
        vm.submitGroupRow = submitGroupRow;

        vm.userTitle = '';
        vm.newUser = {};
        vm.allUsers = [];
        vm.addUser = addUser;
        vm.editUser = editUser;
        vm.deleteUser = deleteUser;
        vm.submitUserRow = submitUserRow;

        initController();

        function initController() {
            loadCurrentEmp();
            loadAllEmps();
            loadAllGroups();
            loadAllUsers();
        }

        function loadCurrentEmp() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (emp) {
                    vm.emp = emp;
                });
        }

        function loadAllEmps() {
            UserService.GetAll()
                .then(function (emps) {
                    vm.allEmps = emps;
                });
        }

        function deleteEmp(id) {
            var confirmToDel = confirm('Are you sure you want to Delete');
            if (confirmToDel) {
                UserService.Delete(id)
                    .then(function () {
                        loadAllEmps();
                    });
            }
        }


        function loadAllGroups() {
            UserService.GetAllGroups()
                .then(function (groups) {
                    vm.allGroups = groups;
                });
        }

        function deleteGroup(id, gName) {
            var confirmToDel = confirm('Are you sure you want to Delete');
            if (confirmToDel) {
                UserService.DeleteGroup(id, gName)
                    .then(function () {
                        FlashService.Success(`Selected ${gName} group is deleted`, true);
                        loadAllGroups();
                    }, function (message){
                        FlashService.Error(message, true);
                    });
            } else {
                return false;
            }
        }
    
        function addGroup() {
            vm.showGroupForm = true;
            vm.groupTitle = "Add Group";
            vm.newGroup = {};
        }
   
        function editGroup(group) {
            vm.showGroupForm = true;
            vm.groupTitle = "Edit Group";
            vm.newGroup = group;
        }

        function submitGroupRow (newGroup) {
            vm.showGroupForm = false;
            UserService.CreateGroup(newGroup)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success(`Group is added successful`, true);
                        loadAllGroups();
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function loadAllUsers() {
            UserService.GetAllUsers()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id, uName) {
            var confirmToDel = confirm('Are you sure you want to Delete');
            if (confirmToDel) {
                UserService.DeleteUser(id)
                    .then(function () {
                        FlashService.Success(`Selected ${uName} user is deleted`, true);
                        loadAllUsers();
                    });
            } else {
                return false;
            }
        }
    
        function addUser() {
            vm.showUserForm = true;
            vm.userTitle = "Add User";
            vm.newUser = {};
            vm.newUser.groupname = "0";
        }
   
        function editUser(user) {
            vm.showUserForm = true;
            vm.userTitle = "Edit User";
            vm.newUser = user;
        }

        function userFormValidation() {
            var selObj = document.getElementById('selGroupName');
            if (selObj && !selObj.disabled) {
                if (selObj.value == '0') {
                    alert('Please select the Group Name');
                    return false;
                }
            }
        }

        function submitUserRow (newUser) {
            if (userFormValidation() == false) {
                return false;
            }
            vm.showUserForm = false;
            UserService.CreateUser(newUser)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success(`User is added successful`);
                        loadAllUsers();
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

    }

})();
