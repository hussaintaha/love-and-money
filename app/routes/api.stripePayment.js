import { json } from "@remix-run/node";
import customerModel from "../Database/customer/customerDB";
import createSession from "../Stripe/createSession";

export const action = async ({ request }) => {
    try {
        const customerId = await request.json();
        console.log("customerId =====", customerId);

        if (customerId) {
            const checkCustomer = await customerModel.findOne({ userId: customerId });
            console.log("checkCustomer ======", checkCustomer);

            if (!checkCustomer.signature_status) {
                return json("Please sign the contract first and then go to payment")
            }
            else if (checkCustomer.signature_status === "awaiting_signature") {
                return json("Please sign the contract first and then go to payment")
            }

            else {
                // ================================ Create stripe checkout session ===================================
                const sessionData = await createSession(checkCustomer)
                // console.log("sessionData ===========", sessionData);
                console.log("sessionData.url =========", sessionData.session.url);
                return json({ paymentURL: sessionData.session.url })
            }

        }

        return true
    } catch (error) {
        return error
    }
}