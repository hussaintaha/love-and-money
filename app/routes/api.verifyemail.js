import axios from "axios";
import shopifySessionModel from "../Database/session";
import customerModel from "../Database/customer/customerDB";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {

    try {
        let data = await request.json();
        console.log("data ===========", data);

        const { email } = data;

        const shopify_session = await shopifySessionModel.findOne();
        // console.log("shopify_session ========", shopify_session);

        const fetchCustomer = await axios.get(`https://${shopify_session.shop}/admin/api/2024-04/customers.json`, {
            headers: {
                'X-Shopify-Access-Token': shopify_session.accessToken,
                'Content-Type': 'application/json'
            }
        });
        // console.log("fetchCustomer ==============", fetchCustomer);

        const customers = fetchCustomer.data.customers;
        // console.log("customers ===========", customers);

        const filteredCustomers = customers.filter((customer) => customer.email === email);
        console.log("filteredCustomers =========", filteredCustomers);

        if (filteredCustomers.length > 0) {

            let findCustomerInDb = await customerModel.findOne({ email: filteredCustomers[0].email });
            console.log("findCustomerInDb ==========", findCustomerInDb);

            if (findCustomerInDb === null) {
                const customerData = {
                    userId: filteredCustomers[0].id,
                    first_name: filteredCustomers[0].first_name,
                    last_name: filteredCustomers[0].last_name,
                    email: filteredCustomers[0].email,
                    subscription_status: "Inactive",
                    isInterested: true,
                };
                await customerModel.create(customerData);
                console.log("Customer data saved successfully:", customerData);
                return json({ message: "Customer data saved successfully", email: email })
            } else {
                return json({ message: "You already use this email for sunbscription", email: email })
            }
        }
        else {
            console.log("No customer found with the specified email:", email);
            return json({ message: "No customer found with the specified email", email: email })
        }
    } catch (error) {
        console.log("Error occurred:", error);
        return error;
    }
};
