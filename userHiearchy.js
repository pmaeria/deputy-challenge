/**
 * Class has a collection of methods to set users and roles to get a list of subordinates
 * Normally I don't use classes. I prefer simple pure functions that I chain together. The task description seemed
 * to suggest an implementation like this to avoid global variables floating about
 */
class UserHiearchy {
    constructor() {
        // default to null before setRoles and setUsers is called
        this.users = null;
        this.roleMap = null;
    }

    /**
     * Sets an array of users 
     * @param {Array} users 
     */
    setUsers(users) {
        if (!Array.isArray(users)) {
            throw new Error('must be an Array');
        }        

        // not sure if it would be better practice to make a copy of 
        // the array instead of setting the reference, ie: users.slice()
        this.users = users;
    }

    /**
     * Converts an array of roles into key value pairs with role Id as key
     * Then populates each role with an array of roles that are subordinate to it
     * @param {Array} roles 
     */
    setRoles(roles) {
        if (!Array.isArray(roles)) {
            throw new Error('must be an Array');
        }

        // roleMap is empty if roles don't exist
        if (roles.length === 0) {
            this.roleMap = {};
            return; // exit
        }

        /* reduce roles into an object with role Id as keys for easy lookup
            and children to store every role under a parent role
            eg:
            {
                1: {
                    role: {
                        Id: 1,
                        Name: 'System Administrator,
                        Parent: 0
                    }
                    children: []
                },
                2: {
                    role: {
                        Id: 2,
                        Name: 'Location Manager',
                        Parent: 1,
                    },
                    children: []
                },
                3: {
                    role: {
                        Id: 3,
                        Name: 'Supervisor',
                        Parent: 2,
                    }
                    children: []
                }
            }
        */
        const roleMap = roles.reduce((roleMap,role) => {
            roleMap[role.Id] = {
                role,
                children: []
            };
            return roleMap;
        }, {});

        // for every role, we want to add its Id as a child to every parent role above it up to the top role or Parent:0
        roles.forEach(role => {
            let currentParent = role.Parent;

            // while we haven't reached the top role or Parent:0, we continue to travel up the role hierarchy
            // add the current role Id as a child of every parent along the way. 
            // we're using while loop with simple key value look up for traversal instead of recursion
            while(currentParent !== 0) {
                let parentRole = roleMap[currentParent];

                // add the current role Id as a child of the current parent
                parentRole.children.push(role.Id);

                // continue to travel up the object
                currentParent = parentRole.role.Parent;
            }
        });

        this.roleMap = roleMap;
    }

    /**
     * Takes a user id and returns users subordinate to that user
     * @param {Number} userId 
     * @return {Array} Array of subordinate users
     */
    getSubordinates(userId) {
        
        // A potential issue here is method calling order
        // If a consumer were to call getSubordinates without setRoles and setUsers then maybe it should error
        // The alternative implementation is using pure functions instead of a class, where the API of each function is clear
        if (!this.roleMap) {
            throw new Error('setRoles not called before getSubordinates');
        }
        if (!this.users) {
            throw new Error('setUsers not called before getSubordinates');
        }

        const topUser = this.users.find(user => user.Id === userId);

        // there are no subordinates if user does not exist
        // maybe should we throw an Error instead?
        if (!topUser) { return []; }

        // retrieve all roles subordinate to the user's role
        // assuming if role cannot be a found, children is an empty array
        const subordinateRoles = (this.roleMap[topUser.Role] || {}).children || [];

        // if there are no subordinate roles, then there are no subordinate users
        if (subordinateRoles.length === 0) {
            return [];
        }

        // filter all users that have a role in the list of roles
        return this.users.filter(user => {
            return subordinateRoles.includes(user.Role);
        });
    }
}

module.exports = UserHiearchy;