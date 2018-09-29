
/**
 * Returns true if schedules for the same employee overlap
 * @param {object} schedule1 
 * @param {object} schedule2 
 * @return {Boolean} 
 */
module.exports = function(schedule1, schedule2) {

    // checkes to make sure that schedule1 and schedule2 are objects
    // this is just shallow check. it doesn't make sure the object is a schedule
    // this could be improved by using interfaces in Typescript
    if(typeof schedule1 !== 'object') {
        throw new Error('first argument is not an object');
    }
    if(typeof schedule2 !== 'object') {
        throw new Error('second argument is not an object');
    }

    // don't bother checking further if employee is different
    if (schedule1.Employee !== schedule2.Employee) {
        return false;
    }

    // this is an assumption. if the schedule id is the same, then its the same record
    // so return true. It might make more sense to throw an error perhaps??
    if (schedule1.Id === schedule2.Id) {
        return true;
    }

    // there is overlap when the start time of schedule1 is in between start time and end time of schedule2
    // also accounts for start times for both schedules are the same
    if (schedule1.StartTime >= schedule2.StartTime && schedule1.StartTime <= schedule2.EndTime) {
        return true;
    }

    // there is overlap when the start time of schedule2 is in between start time and end time of schedule1
    if (schedule2.StartTime > schedule1.StartTime && schedule2.StartTime <= schedule1.EndTime) {
        return true;
    }

    return false; 
}