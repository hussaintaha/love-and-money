import customerModel from "../Database/customer/customerDB";

export const loader = async ({ params }) => {

    try {
        console.log("params =======", params);

        let checkCustomer = await customerModel.findOne({ userId: params.customerid });

        if (checkCustomer) {
            console.log("checkCustomer =========", checkCustomer);
            return (checkCustomer)
        }
        else{
            return ("User Not Found in Database")
        }

    } catch (error) {
        console.log("error in checkPartner ==========", error);
        return error
    }
}

