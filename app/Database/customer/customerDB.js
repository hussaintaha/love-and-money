import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    userId: String,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    confirmPassword: String,
    signature_id: String,
    signature_status: String,
    subscription_id: String,
    subscription_status: String,
    subscription_start: String,
    subscription_end: String,
    payment_status: String,
    payment_type: String,
    sessionId: String,
    isInterested: Boolean
});

const customerModel = mongoose.models.Customers || mongoose.model("Customers", customerSchema);
export default customerModel;