import Firebase from "../../../components/firebase";

export default class ShoppingData {

    /**
     * Function used to update the shopping item
     * @param {Object} newItem contains information about the shopping item
     * @param {string} index contains the id of the shopping item
     */
    static updateItem = async function (newItem, index) {
        var itemsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/shopping/${index}`);
        await itemsRef.update(newItem, function (error) {
            if (error) alert(error)
            else console.log("Update completed")
        });
    }

    /**
     * Function used to add a new shopping item
     * @param {Object} newItem contains information about the shopping item
     */
    static pushItem = async function (newItem) {
        var itemsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/shopping`);
        await itemsRef.push(newItem, function (error) {
            if (error) alert(error)
            else console.log("Update completed")
        })
    }

    /**
     * Function used to delete a shopping item
     * @param {string} index contains the id of the shopping item
     */
    static deteleItem = async function (index) {
        var itemsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/shopping/${index}`);
        await itemsRef.remove();
    }

    /**
     * Function used to add a new item to the budget
     * @param {Object} newItem contains information about the shopping item being added to the budget
     */
    static addItemToBudget = function (newItem) {
        var itemsRef = Firebase.database.ref(`/flats/${Firebase.flatInfo.flatId}/budget`);
        itemsRef.push(newItem, function (error) {
            if (error) alert(error)
            else console.log("Update completed")
        })
    };
}


