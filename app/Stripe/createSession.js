import Stripe from "stripe";
import "dotenv/config"
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createSession(customerData) {
    try {
        console.log("STRIPE_SECRET_KEY =========", process.env.STRIPE_SECRET_KEY);
        console.log("customerData ========", customerData);

        const { userId, first_name, last_name } = customerData
        console.log("userId =========", userId);
        const customerName = `${first_name} ${last_name}`
        const customerAddress = "Fire Brigade Ln, Fire Brigade Lane, Barakhamba, New Delhi, Delhi 110001, India"

        // ======================= create session =======================//
        const prices = await stripe.prices.list({
            lookup_keys: ['Shopify-Subscription'],
            expand: ['data.product'],
        });
        // console.log('prices', prices.data)

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            mode: 'subscription',
            line_items: [
                {
                    price: `${prices.data[0].id}`,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.STRIPE_SUCCESS_URL}`,
            cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
            subscription_data: {
                metadata: {
                    myuserid: userId,
                },
            },
            customer_email: customerData.email,
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
        });

        console.log("session ================", session);

        return { session: session }

        return true

    } catch (error) {
        console.log("error in createsesion route =====", error);
        return error
    }
}

export default createSession;