// import customerModel from "../customer/customerDB";
import customerModel from "../Database/customer/customerDB";
import Stripe from "stripe"
import "dotenv/config"

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const action = async ({ request }) => {
    console.log("============================= Check Status API ===============================");

    const body = await request.text();
    // console.log("body ================", body);

    const sigHeader = request.headers.get('stripe-signature');
    // console.log("sigHeader =========", sigHeader);

    // const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
    const endpointSecret = "whsec_q61HFp8jdNHnVYDJccteDW8VNBC7NdlZ";

    try {
        let event = stripe.webhooks.constructEvent(body, sigHeader, endpointSecret);
        // console.log("event ==============", event);

        if (event.type === "customer.subscription.created") {
            console.log("============================ customer.subscription.created ==========================");

            const userId = event.data.object.metadata.myuserid
            // console.log("userId =========", userId);

            if (userId) {

                const start_date = new Date(event.data.object.current_period_start * 1000);
                const end_date = new Date(event.data.object.current_period_end * 1000);

                const updateCustomer = await customerModel.findOneAndUpdate(
                    { userId: userId },
                    {
                        subscription_status: event.data.object.status,
                        subscription_id: event.data.object.id,
                        subscription_start: start_date,
                        subscription_end: end_date
                    },
                    { new: true }
                )
                console.log("updateCustomer in customer.subscription.created  =========", updateCustomer);
                return updateCustomer;
            } else {
                console.log("The subscription is created successfully but userid is not found and not update in database.");
                return "The subscription is created successfully but userid is not found and not update in database."
            }
        }

        else if ((event.type === "customer.subscription.updated" && event.data.object.status !== "incomplete")) {
            // console.log("event ======", event);
            console.log("============================ customer.subscription.updated ==========================");

            const userId = event.data.object.metadata.myuserid
            console.log("userId ====", userId);

            if (userId) {
                const updateCustomer = await customerModel.findOneAndUpdate(
                    { userId: userId },
                    { subscription_status: event.data.object.status },
                    { new: true }

                )
                console.log("updateCustomer in customer.subscription.updated  =========", updateCustomer);
                return updateCustomer
            } else {
                console.log("The subscription is Updated successfully but userid is not found and not update in database.");
                return "The subscription is Updated successfully but userid is not found and not update in database."
            }
        }

        else if (event.type === "customer.subscription.deleted") {
            const userId = event.data.object.metadata.myuserid
            console.log("============================ customer.subscription.deleted ==========================");

            if (userId) {
                const deleteUser = await customerModel.findOneAndUpdate(
                    { userId: userId },
                    { subscription_status: event.data.object.status },
                    { new: true }
                )
                console.log("deleteUser ====", deleteUser);
                return deleteUser;
            } else {
                console.log("The subscription is Cancelled successfully but userid is not found and not update in database.");
                return "The subscription is Cancelled successfully but userid is not found and not update in database."
            }
        }
    } catch (error) {
        return error
    }
};