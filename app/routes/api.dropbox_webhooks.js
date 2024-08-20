import customerModel from "../Database/customer/customerDB";
export const action = async ({ request }) => {
    try {
        // console.log("request ==============", request);

        let body = await request.text()
        // console.log("body ====================", body);


        const start = body.indexOf('{');
        const end = body.lastIndexOf('}');
        // Extract JSON data
        const jsonData = body.substring(start, end + 1);
        console.log("jsonData ====================", jsonData);

        // // Parse JSON
        const data = JSON.parse(jsonData);
        const { signature_request: signatureRequest, event } = data;

        // console.log("event ===========", event);

        if (event.event_type === "signature_request_sent") {
            console.log(" ========== sentttttttttttt ==========");
            console.log("signatureRequest ===========", signatureRequest);

            let customerEmail = signatureRequest.signatures[0].signer_email_address

            let updateCustomer = await customerModel.findOneAndUpdate(
                { email: customerEmail },
                {
                    signature_id: signatureRequest.signature_request_id,
                    signature_status: signatureRequest.signatures[0].status_code
                },
                // { upsert: true, new: true }
            );

            console.log("updateCustomer in request-senttt ========", updateCustomer);
        }

        else if (event.event_type === "signature_request_signed") {
            console.log(" ========== signedddddddd ==========");
            console.log("signatureRequest ===========", signatureRequest);

            let customerEmail = signatureRequest.signatures[0].signer_email_address

            let updateCustomer = await customerModel.findOneAndUpdate(
                { email: customerEmail },
                {
                    signature_id: signatureRequest.signature_request_id,
                    signature_status: signatureRequest.signatures[0].status_code
                },
                { new: true }
            );

            console.log("updateCustomer in request-signedd ========", updateCustomer);
        }



        return true
    } catch (error) {
        console.log("error in dropbox_webhooks ==========", error);
        return error
    }
}




