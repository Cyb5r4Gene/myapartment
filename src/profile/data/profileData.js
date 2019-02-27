import Firebase from "../../../components/firebase";

export default class ProfileData {

    /**
     * Function used to update the user information
     * @param {Object} userInfo contains information about the user to be updated
     */
    static updateUser = async function (userInfo) {
        var user = Firebase.auth.currentUser;
        user.updateProfile(userInfo).catch((error) => {
            alert(error)
        })
    }
}


