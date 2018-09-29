const assert = require('assert');
const isOverlapping = require("../isOverlapping");

describe('isOverlapping', () => {
    describe('API', () => {
        it('should be a function', () => {
            assert.equal(typeof isOverlapping, 'function');
        });

        it('should take two arguments', () => {
            assert.equal(isOverlapping.length, 2);
        });

        it('should throw error if first argument is not an object', () => {
            const schedule1 = 'not an object';
            const schedule2 = {
                "Id": 2,
                "Employee": 2,
                "Department": 1,
                "StartTime": 1458165600,
                "EndTime": 1458194400
            };
            assert.throws(() => isOverlapping(schedule1, schedule2), Error);
        });

        it('should throw error if second argument is not an object', () => {
            const schedule1 = {
                "Id": 2,
                "Employee": 2,
                "Department": 1,
                "StartTime": 1458165600,
                "EndTime": 1458194400
            };
            const schedule2 = 'not an object';
            assert.throws(() => isOverlapping(schedule1, schedule2), Error);
        });
    });

    it('should return false if Employees are different', () => {
        const schedule1 = {
            "Id": 1,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };
        const schedule2 = {
            "Id": 2,
            "Employee": 2,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };
        assert.equal(isOverlapping(schedule1, schedule2), false);
    });

    it('should return true if Ids are the same', () => {
        const schedule1 = {
            "Id": 1,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };
        const schedule2 = {
            "Id": 1,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };
        assert.equal(isOverlapping(schedule1, schedule2), true);
    });

    it('should return true if StartTimes are the same', () => {
        const schedule1 = {
            "Id": 1,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };
        const schedule2 = {
            "Id": 2,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };
        assert.equal(isOverlapping(schedule1, schedule2), true);
    });

    it('should return true if schedules overlap', () => {
        const schedule1 = {
            "Id": 1,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };
        const schedule2 = {
            "Id": 2,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458192400,
            "EndTime": 1458196400
        };
        assert.equal(isOverlapping(schedule1, schedule2), true);
    });

    it('should return true if schedules overlap with arguments swapped', () => {
        const schedule1 = {
            "Id": 2,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458192400,
            "EndTime": 1458196400
        };
        const schedule2 = {
            "Id": 1,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };

        assert.equal(isOverlapping(schedule1, schedule2), true);
    });

    it('should return false if schedules don\'t overlap', () => {
        const schedule1 = {
            "Id": 1,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458165600,
            "EndTime": 1458194400
        };
        const schedule2 = {
            "Id": 2,
            "Employee": 1,
            "Department": 1,
            "StartTime": 1458195400,
            "EndTime": 1458196400
        };
        assert.equal(isOverlapping(schedule1, schedule2), false);
    });
});