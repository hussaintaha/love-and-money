import shopifySessionModel from "../Database/session";
import customerModel from "../Database/customer/customerDB";
import axios from "axios"
import { json } from "@remix-run/node"

export const action = async ({ request }) => {
    try {
        const requestdata = await request.json();
        // console.log("requestdata====", requestdata);

        const { firstName, lastName, email, password, confirmPassword } = requestdata.userDetails

        // ============================== Check Email Already Eixst ============================== //
        const checkmail = await customerModel.findOne({ email: email });

        if (!checkmail) {
            // console.log("checkmail ==========", checkmail);

            let data = JSON.stringify({
                "customer": {
                    "first_name": firstName,
                    "last_name": lastName,
                    "email": email,
                    "password": password,
                    "password_confirmation": confirmPassword,
                    "send_email_welcome": false,
                    "verified_email": true
                }
            });
            // console.log("data =======", data);

            const shopify_sessions = await shopifySessionModel.findOne();

            let config = {
                method: 'post',
                url: `https://${shopify_sessions.shop}/admin/api/2024-01/customers.json`,
                headers: {
                    'X-Shopify-Access-Token': shopify_sessions.accessToken,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            console.log("config =========", config);

            const response = await axios.request(config);
            console.log("response ===============", response.data);

            // ================================ Save Customer In DB ================================ //
            const saveCustomer = new customerModel({
                userId: response.data.customer.id,
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                subscription_status: "Inactive",
                signature_status: "Inactive",
                isInterested: true,
            });
            await saveCustomer.save()
            console.log(" saveCustomer ======", saveCustomer);
            return json({ saveCustomer, message: "user create successully" })
        } else {
            return "user already exist"
        }
    } catch (error) {
        console.log("error ==============", error);
        return error
    }
}






