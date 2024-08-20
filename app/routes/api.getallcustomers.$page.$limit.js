import customerModel from "../Database/customer/customerDB";
import { json } from "@remix-run/node"

export const loader = async ({ params }) => {
    console.log("request =====", params);

    const totalcustomer = await customerModel.countDocuments();
    // console.log("totalcustomer ============", totalcustomer);

    const page = params.page;
    const limit = params.limit;
    let skip = (page - 1) * limit

    const totalPages = Math.ceil(totalcustomer / limit);
    console.log("totalPages =========", totalPages);

    const hasNext = page < totalPages
    const hasPrev = page > 1

    try {
        const customerData = await customerModel.find()
            .lean()
            .skip(skip)
            .limit(limit)
        // console.log("customerData ========", customerData);

        return json({ customerData, hasNext, hasPrev, totalcustomer, limit })

    } catch (error) {
        console.log("error in getallcustomer route ============", error);
        return error
    }
}