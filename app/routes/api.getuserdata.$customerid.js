import customerModel from "../Database/customer/customerDB";
import { json } from "@remix-run/node"

export const loader = async ({ params }) => {
    try {
        console.log("params ===", params);
        let customerId = params.customerid;

        let getcustomerDataFromDb = await customerModel.findOne({ userId: customerId });
        console.log("getcustomerDataFromDb ====", getcustomerDataFromDb);

        if (getcustomerDataFromDb) {
            return json( getcustomerDataFromDb )
        } else {
            console.log("Customer Not Found");
            return json("Customer Not Found")
        }
    } catch (error) {
        console.log("Error in loader function:", error);
        return error;
    }
}

