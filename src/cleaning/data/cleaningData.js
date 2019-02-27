import Firebase from "../../../components/firebase";

export default class CleaningData {

    /**
     * Function used to update the job
     * @param {Object} newJob contains the object for the cleaning job
     * @param {string} index contains the string id of the cleaning job
     */
    static updateJob = async (newJob, index) => {
        var jobsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/jobs/${index}`);
        await jobsRef.update(newJob).catch((error) => console.log(error));
    }

    /**
     * Function used to push a cleaning job
     * @param {Object} newJob contains the object for the cleaning job
     */
    static pushJob = async (newJob) => {
        var jobsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/jobs`);
        await jobsRef.push(newJob).catch((error) => console.log(error));
    }

    /**
     * Function used to delete a cleaning job
     * @param {string} index contains the string id of the cleaning job
     */
    static deteleJob = async (index) => {
        var jobsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/jobs/${index}`);
        await jobsRef.remove().catch((error) => console.log(error));
    }

    /**
     * Function used to mark a job as done and change the order
     * @param {date} date contains the next startDate for the cleaning job
     * @param {string} index contains the string id of the cleaning job
     */
    static doneJob = async (date, index) => {
        var flatRef = Firebase.database.ref(`flats/${Firebase.flatInfo.flatId}/jobs/${index}`)
        flatRef.once('value', (snap) => {
            let vargu = snap.val().order;
            let itemQeDel = vargu.shift();
            vargu.push(itemQeDel);
            let updateJob = {
                startDate: date,
                order: vargu,
            }
            flatRef.update(updateJob);
        })
    }
}


