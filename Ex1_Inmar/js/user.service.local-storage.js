(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$timeout', '$filter', '$q'];
    function UserService($timeout, $filter, $q) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        
        service.GetAllGroups = GetAllGroups;
        service.GetByGroupId = GetByGroupId;
        service.GetByGroupname = GetByGroupname;
        service.CreateGroup = CreateGroup;
        service.DeleteGroup = DeleteGroup;

        service.GetAllUsers = GetAllUsers;
        service.GetByUserId = GetByUserId;
        service.GetByUserName = GetByUserName;
        service.CreateUser = CreateUser;
        service.DeleteUser = DeleteUser;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getUsers());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { id: id });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function GetByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { username: username });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByUsername(user.username)
                    .then(function (duplicateUser) {
                        if (duplicateUser !== null) {
                            deferred.resolve({ success: false, message: 'Username "' + user.username + '" is already taken' });
                        } else {
                            var users = getUsers();

                            // assign id
                            var lastUser = users[users.length - 1] || { id: 0 };
                            user.id = lastUser.id + 1;

                            // save to local storage
                            users.push(user);
                            setUsers(users);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(user) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user;
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function GetAllGroups() {
            var deferred = $q.defer();
            deferred.resolve(getGroups());
            return deferred.promise;
        }

        function GetByGroupId(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getGroups(), { id: id });
            var group = filtered.length ? filtered[0] : null;
            deferred.resolve(group);
            return deferred.promise;
        }

        function GetByGroupname(groupname) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getGroups(), { groupname: groupname });
            var group = filtered.length ? filtered[0] : null;
            deferred.resolve(group);
            return deferred.promise;
        }

        function CreateGroup(group) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByGroupname(group.name)
                    .then(function (duplicateGroup) {
                        if (duplicateGroup !== null) {
                            deferred.resolve({ success: false, message: 'Groupname "' + group.name + '" is already taken' });
                        } else {
                            var groups = getGroups();

                            if (!group.id) {
                                // assign id
                                var lastGroup = groups[groups.length - 1] || { id: 0 };
                                group.id = lastGroup.id + 1;
                                
                                // save to local storage
                                groups.push(group);
                                setGroups(groups);
                            } else {
                                for (var i = 0; i < groups.length; i++) {
                                    if (groups[i].id === group.id) {
                                        groups[i] = group;
                                        break;
                                    }
                                }
                                setGroups(groups);
                            }

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function DeleteGroup(id, gName) {
            var deferred = $q.defer();
            var flag = 0;
            var groups = getGroups();
            var users = _getUsers();
            
            for(var j = 0; j < users.length; j++) {
                if(users[j].groupname == gName) {
                    flag = 1;
                    deferred.reject(`Groupname ${gName} is used by someother users`);
                    break;
                }
            }

            if (flag != 1) {
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    if (group.id === id) {
                        groups.splice(i, 1);
                        break;
                    }
                }
                setGroups(groups);
                deferred.resolve();
            }

            return deferred.promise;
        }

        function GetAllUsers() {
            var deferred = $q.defer();
            deferred.resolve(_getUsers());
            return deferred.promise;
        }

        function GetByUserId(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(_getUsers(), { id: id });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function GetByUserName(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(_getUsers(), { username: username });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function CreateUser(user) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByUserName(user.name)
                    .then(function (duplicateUser) {
                        if (duplicateUser !== null) {
                            deferred.resolve({ success: false, message: 'Username "' + group.name + '" is already taken' });
                        } else {
                            var users = _getUsers();
                            if (!user.id) {
                                var lastUser = users[users.length - 1] || { id: 0 };
                                user.id = lastUser.id + 1;
                                
                                // save to local storage
                                users.push(user);
                                _setUsers(users);
                            } else {
                                for (var i = 0; i < users.length; i++) {
                                    if (users[i].id === user.id) {
                                        users[i] = user;
                                        break;
                                    }
                                }
                                _setUsers(users);
                            }

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function DeleteUser(id) {
            var deferred = $q.defer();

            var users = _getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            _setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getUsers() {
            if(!localStorage.users){
                localStorage.users = JSON.stringify([]);
            }

            return JSON.parse(localStorage.users);
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }

        function getGroups() {
            if(!localStorage.groups){
                localStorage.groups = JSON.stringify([]);
            }

            return JSON.parse(localStorage.groups);
        }

        function setGroups(groups) {
            localStorage.groups = JSON.stringify(groups);
        }

        function _getUsers() {
            if(!localStorage._users){
                localStorage._users = JSON.stringify([]);
            }

            return JSON.parse(localStorage._users);
        }

        function _setUsers(_users) {
            localStorage._users = JSON.stringify(_users);
        }
    }
})();
