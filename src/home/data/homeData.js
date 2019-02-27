import Firebase from "../../../components/firebase";
import { Alert } from 'react-native';

export default class HomeData {

    /**
     * Function used to update home details
     * @param {Object} newItem contains home details
     */
    static updateHomeDetails = async function (newItem) {
        var itemsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/flatDetails/`);
        await itemsRef.update(newItem).catch(error => console.log(error))
    }

     /**
     * Function used to add home with code
     * @param {string} code contains the code for the home
     */
    static addHomeWithCode = async function (code) {
        var invitationRef = Firebase.database.ref(`/invitations/${code}`);
        invitationRef.once('value', (snap) => {
            if (snap.val() == null) {
                alert("This invitation code does not exist in the database!");
                return
            }
            flatId = snap.val().flatId;
            var usersRef = Firebase.database.ref(`/users/${Firebase.userInfo.uid}`);
            usersRef.set({ flatId: flatId })
                .then(() => {
                    var flatRef = Firebase.database.ref(`/flats/${flatId}/roommates/`);
                    flatRef.child(Firebase.userInfo.uid).set({
                        name: Firebase.userInfo.displayName,
                        photoURL: Firebase.userInfo.photoURL,
                    }).then(() => {
                        invitationRef.remove();
                        Firebase.auth.signOut();
                        alert("You have been logged out for refresh reasons.\n Please log in now in your new apartment!");
                    })
                })
        })
    }

     /**
     * Function used to open a modal box where you can kick a roommate out or make him householder
     * @param {object} roommate contains roommate information
     * @param {string} key contains roommate id
     */
    static kickRoommate = async function (roommate, key) {
        var householderRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/roommates/${Firebase.userInfo.uid}`);
        householderRef.once('value', (snap) => {
            // you can kick a roommate out only if you are a householder
            if (snap.child('householder').exists()) {
                // look the roommate we clicked if he is a householder
                var roommateref = snap.ref.parent.child(`${Object.keys(Firebase.roommates)[key]}`);
                roommateref.once('value', childSnap => {
                    var roommateIsHouseholder = childSnap.child('householder').exists();
                    Alert.alert(
                        `${roommate[1].name}`,
                        `What do you want to do with ${roommate[1].name.split(" ")[0]}?`,
                        [
                            { text: 'Cancel', onPress: () => console.log(Object.keys(Firebase.roommates)[key]), style: 'cancel' },
                            (Object.keys(Firebase.roommates)[key] !== Firebase.userInfo.uid) ?

                                (roommateIsHouseholder) ?
                                    {
                                        text: `Remove ${roommate[1].name.split(" ")[0]} from householder`,
                                        onPress: () => {
                                            roommateref.update({
                                                householder: null,
                                            })
                                        }
                                    } :
                                    {
                                        text: `Make ${roommate[1].name.split(" ")[0]} householder`,
                                        onPress: () => {
                                            roommateref.update({
                                                householder: true,
                                            })
                                        }
                                    } :
                                {
                                    text: `You are a householder`,
                                },
                            {
                                text: `Kick ${roommate[1].name.split(" ")[0]} out`,
                                onPress: () => {
                                    this.leaveFlat(Object.keys(Firebase.roommates)[key])
                                }
                            },
                        ],
                        { cancelable: true }
                    )
                });
            }
        })
    }

    /**
     * Fuction used to leave the flat and delete all the data
     * @param {string} roommateID to be removed from flat
     */
    static leaveFlat = async function (roommateID) {
        // count roommate - if only one roommate than delete the flat
        await Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/roommates/`).once('value', (snap) => {
            if (Object.keys(snap.val()).length == 1) {
                Firebase.auth.signOut();
                Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}`).remove();
                return;
            }
        })

        // if the current user wants to leave than sign user out
        if (roommateID === Firebase.userInfo.uid) {
            Firebase.auth.signOut();
            alert(`You left the flat!`);
        }

        var usersRef = Firebase.database.ref(`/users/${roommateID}`);
        usersRef.set({
            flatId: 0,
        })

        var roommatesRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/roommates/${roommateID}`);
        roommatesRef.remove();

        var budgetRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/budget/`);
        budgetRef.once('value', (snap) => {
            Object.keys(snap.val()).forEach(key => {
                var budgetIdRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/budget/${key}`);
                budgetIdRef.once('value', (snap) => {
                    if (snap.val().boughtBy == roommateID) {
                        budgetIdRef.remove();
                    }
                })
            })
        })

        var shoppingRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/shopping/`);
        shoppingRef.once('value', (snap) => {
            Object.keys(snap.val()).forEach(key => {
                if (snap.val()[key].addedBy == roommateID)
                    Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/shopping/${key}`).remove();
            })
        })

        var jobsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/jobs/`);
        // get all cleaning jobs
        jobsRef.once('value', (jobsSnap) => {
            // interate over each cleaning job
            Object.keys(jobsSnap.val()).forEach(jobsKey => {
                var jobsIdRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/jobs/${jobsKey}/order`);
                // get all jobs id
                jobsIdRef.once('value', (jobsIdSnap) => {
                    var orderArray = jobsIdSnap.val();
                    for (let i = 0; i < jobsIdSnap.val().length; i++) {
                        var elementToCompare = orderArray.shift();
                        if (elementToCompare.key == roommateID) {
                            jobsIdRef.set(orderArray);
                            break;
                        }
                        else
                            orderArray.push(elementToCompare);
                    }
                })
            })
        })
    }
}
