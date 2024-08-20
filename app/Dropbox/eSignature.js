import * as DropboxSign from "@dropbox/sign";
import * as fs from 'fs';
import path from "path";
import "dotenv/config"

async function eSignature(customerData) {

    try {
        console.log("customerData in dropbox =======", customerData);
        const { userId, first_name, last_name, email } = customerData
        // console.log("userId ===", userId);
        // console.log("first_name ===", first_name);
        // console.log("last_name ===", last_name);
        // console.log("email ===", email);

        console.log("DROPBOX_API_KEY ===", process.env.DROPBOX_API_KEY);

        const signatureRequestApi = new DropboxSign.SignatureRequestApi();
        signatureRequestApi.username = process.env.DROPBOX_API_KEY;

        const signer1 = {
            emailAddress: email,
            name: `${first_name} ${last_name}`,
            order: 0,
        };

        const signingOptions = {
            draw: true,
            type: true,
            upload: true,
            phone: true,
            defaultType: "draw",
        };

        const __dirname = process.cwd()
        console.log("ll =========", path.join(__dirname, '/dummy-pdf_2.pdf'));

        const fileBuffer = {
            value: fs.readFileSync(path.join(__dirname, '/dummy-pdf_2.pdf')),
            options: {
                filename: 'dummy-pdf_2.pdf',
                contentType: "application/pdf",
            },
        };

        const data = {
            clientId: process.env.DROPBOX_CLIENT_ID,
            title: "Love And Money",
            subject: "Contract Signature ",
            message: "Please sign this contract and then we can discuss more. Let me know if you have any questions.",
            signers: [signer1],
            files: [fileBuffer],
            signingOptions,
            testMode: true,
        };

        const response = await signatureRequestApi.signatureRequestCreateEmbedded(data);
        console.log("response.body ================", response.body);

        let signatureId = response.body.signatureRequest.signatures[0].signatureId
        console.log("signatureId =====", signatureId);

        const embeddedApi = new DropboxSign.EmbeddedApi();
        embeddedApi.username = process.env.DROPBOX_API_KEY;

        const signUrlResponse = await embeddedApi.embeddedSignUrl(signatureId);
        console.log("sign_url response ================", signUrlResponse.body);

        const sign_url = signUrlResponse.body.embedded.signUrl;
        console.log("sign_url ==============", sign_url);

        return sign_url
    } catch (error) {
        console.log("error in esignature =======", error);
        return error
    }

}

export default eSignature;
