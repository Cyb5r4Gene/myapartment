import Firebase from "../../../components/firebase";
export default class BudgetData {

    /**
     * @param {string} personId used to know who payed back
     * @param {string} budgetItemId used to know which shopping item did he pay back
     */
    static pay = async function (personId, budgetItemId) {
        var itemsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/budget/${budgetItemId}/payed/${personId}`);
        await itemsRef.update({
            payed:true,
        }, function (error) {
            if (error) alert(error)
            else console.log("Update completed")
        });
    }
}


