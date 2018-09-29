const assert = require('assert');
const UserHierarchy = require('../userHiearchy');

describe('userHierarchy', () => {
    describe('API', () => {
        const userHiearchy = new UserHierarchy();

        it('should be a function', () => {
            assert.equal(typeof UserHierarchy, "function");
        });

        it('should create an instance of UserHierarchy', () => {    
            assert.ok(userHiearchy instanceof UserHierarchy);
        });
    }); 

    describe('setRoles method', () => {
        let userHiearchy;
        beforeEach(() => {
            userHiearchy = new UserHierarchy();
        });

        it('should have a method setRoles', () => {
            assert.equal(typeof userHiearchy.setRoles, 'function');
        });
        it('should take one argument', () => {
            assert.equal(userHiearchy.setRoles.length, 1);
        });
        it('should throw an error if argument is not an array', () => {
            assert.throws(() => userHiearchy.setRoles({}), Error);
        });
        it('should set this.roleMap with key value map of roles array with children roles populated', () => {
            
            // test with Ids out of order
            const roles = [
                {
                    Id: 50,
                    Name: 'Location Manager',
                    Parent: 200,
                },
                {
                    Id: 200,
                    Name: 'System Administrator',
                    Parent: 0
                },
                {
                    Id: 3,
                    Name: 'Supervisor',
                    Parent: 50
                }
            ];

            const expected = {
                200: {
                    role: {
                        "Id": 200,
                        "Name": "System Administrator",
                        "Parent": 0
                    },
                    children: [50, 3]
                },
                3: {
                    role: {
                        Id: 3,
                        Name: 'Supervisor',
                        Parent: 50
                    },
                    children: []
                },
                50: {
                    role: {
                        "Id": 50,
                        "Name": "Location Manager",
                        "Parent": 200
                    },
                    children: [3]
                }
            }
            userHiearchy.setRoles(roles);
            assert.deepEqual(userHiearchy.roleMap, expected);
        });
    });

    describe('setUsers method', () => {
        let userHiearchy;
        beforeEach(() => {
          userHiearchy = new UserHierarchy();
        });

        it('should have a method setUsers', () => {
            assert.equal(typeof userHiearchy.setUsers, 'function');
        });
        it('should take one argument', () => {
            assert.equal(userHiearchy.setUsers.length, 1);
        });
        it('should throw an error if argument is not an array', () => {
            assert.throws(() => userHiearchy.setUsers({}), Error);
        });
        it('should set this.users with users array', () => {
            const users = [
                {
                    "Id": 1,
                    "Name": "Adam Admin",
                    "Role": 1
                },
                {
                    "Id": 2,
                    "Name": "Emily Employee",
                    "Role": 4
                }
            ]
            userHiearchy.setUsers(users);
            assert.equal(userHiearchy.users, users);
        });
    });

    describe('getSubordinates', () => {
        let userHiearchy;
        beforeEach(() => {
          userHiearchy = new UserHierarchy();
        });

        it('should have a method getSubordinates', () => {
            assert.equal(typeof userHiearchy.getSubordinates, 'function');
        });

        it('should take one argument', () => {
            assert.equal(userHiearchy.getSubordinates.length, 1);
        });

        it('should return empty array if set users is empty', () => {

            userHiearchy.setUsers([]);
            userHiearchy.setRoles([{
                Id: 200,
                Name: 'System Administrator',
                Parent: 0
            }]);

            assert.deepEqual(userHiearchy.getSubordinates(1), []);
        });

        it('should throw an Error if set users was not called first', () => {

            userHiearchy.setRoles([{
                Id: 200,
                Name: 'System Administrator',
                Parent: 0
            }]);

            assert.throws(() => { userHiearchy.getSubordinates(1) }, Error);
        });

        it('should throw an Error if set roles was not called first', () => {

            userHiearchy.setUsers([{
                "Id": 1,
                "Name": "Adam Admin",
                "Role": 1
            }]);

            assert.throws(() => userHiearchy.getSubordinates(1), Error);
        });

        it("should return empty array if set roles is empty", () => {
            userHiearchy.setUsers([{
                "Id": 1,
                "Name": "Adam Admin",
                "Role": 1
            }]);
          userHiearchy.setRoles([]);

          assert.deepEqual(userHiearchy.getSubordinates(1), []);
        });

        it("should return empty array if user id does not exist", () => {
            userHiearchy.setUsers([{
                "Id": 1,
                "Name": "Adam Admin",
                "Role": 1
            }]);
            userHiearchy.setRoles([{
                Id: 1,
                Name: "System Administrator",
                Parent: 0
            }]);

            assert.deepEqual(userHiearchy.getSubordinates(5), []);
        });
        it("should return empty array if user's Role has no children", () => {
          userHiearchy.setUsers([
            {
              Id: 1,
              Name: "Adam Admin",
              Role: 1
            },
            {
                Id: 2,
                Name: 'Location Manager',
                Parent: 1,
            }
          ]);
          userHiearchy.setRoles([{
              Id: 1,
              Name: "System Administrator",
              Parent: 0
            },
            {
                Id: 2,
                Name: 'Location Manager',
                Parent: 1,
            },
            {
                Id: 3,
                Name: 'Supervisor',
                Parent: 2,
            }]);

          assert.deepEqual(userHiearchy.getSubordinates(3), []);
        });

        it('should return an array of users that have roles subordinate to the user Id', () => {
            
            const roles = require('./fixtures/roles.json');
            const users = require('./fixtures/users.json');

            userHiearchy.setUsers(users);
            userHiearchy.setRoles(roles);

            assert.deepEqual(userHiearchy.getSubordinates(3), [{
                "Id": 2,
                "Name": "Emily Employee",
                "Role": 4
            },
            {
                "Id": 5,
                "Name": "Steve Trainer",
                "Role": 5
            }]);
        });
        
        it('should return an array of users that have roles subordinate to the user with admin role', () => {
            
            const roles = require('./fixtures/roles.json');
            const users = require('./fixtures/users.json');

            userHiearchy.setUsers(users);
            userHiearchy.setRoles(roles);

            assert.deepEqual(userHiearchy.getSubordinates(1), [{
                "Id": 2,
                "Name": "Emily Employee",
                "Role": 4
            },
            {
                "Id": 3,
                "Name": "Sam Supervisor",
                "Role": 3
            },
            {
                "Id": 4,
                "Name": "Mary Manager",
                "Role": 2
            },
            {
                "Id": 5,
                "Name": "Steve Trainer",
                "Role": 5
            }]);
        });
    });
});