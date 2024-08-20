import json from "@remix-run/node"
import customerModel from "../Database/customer/customerDB";
import eSignature from "../Dropbox/eSignature";

export const action = async ({ request }) => {
    try {
        const customerId = await request.json();
        console.log("customerId ======", customerId);

        if (customerId) {
            const findCustomerInDB = await customerModel.findOne({ userId: customerId });
            console.log("findCustomerInDB ======", findCustomerInDB);


            if (findCustomerInDB) {
                let dropbox_sign = await eSignature(findCustomerInDB);
                console.log("dropbox_sign ======", dropbox_sign);
                return dropbox_sign
            }
            else {
                console.log("Cutomer Not Found In Database");
                return json("Cutomer Not Found In Database");
            }
        } else {
            console.log("Cutomer Id Not Found");
            return json("Cutomer Id Not Found");
        }
        return true

    } catch (error) {
        console.log("error in dropbox sign api =======", error);
        return error
    }
}

