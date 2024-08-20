import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import "./dashboard.css"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HelloSign from "hellosign-embedded";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Dashboard = () => {
    console.log("Shopify.shop 22222 =====", Shopify.shop);

    const [customerDetails, setCustomerDetails] = useState({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        subscription_status: "",
        signature_status: "",
    })

    let customerId = ShopifyAnalytics.meta.page.customerId;

    const fetchCustomerData = async () => {
        try {

            const customerData = await fetch(`https://${Shopify.shop}/apps/loveandmoney/api/getuserdata/${customerId}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            });

            const customerDatajson = await customerData.json();

            if (customerDatajson === "Customer Not Found") {
                alert("Please login");
                window.open(`https://${Shopify.shop}/account`, "_self");
            }
            else {
                setCustomerDetails({
                    id: customerDatajson.userId,
                    first_name: customerDatajson.first_name,
                    last_name: customerDatajson.last_name,
                    email: customerDatajson.email,
                    subscription_status: customerDatajson.subscription_status,
                    signature_status: customerDatajson.signature_status,
                });
            }

        } catch (error) {
            console.log("Error fetching customer data:", error);
        }
    }

    const handleDropBoxSign = async () => {
        const client = new HelloSign({
            clientId: "86a3fe151076d3c68a1cc95cea6814e4"
        });

        const fetchUrl = await fetch(`https://${Shopify.shop}/apps/loveandmoney/api/dropbox_sign`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(customerId)
        });

        const signURL = await fetchUrl.json();

        client.open(signURL, {
            skipDomainVerification: true,
        });
    }

    const handleStripePayment = async () => {
        try {
            const fetchData = await fetch(`https://${Shopify.shop}/apps/loveandmoney/api/stripePayment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(customerId)
            });

            if (!fetchData.ok) {
                throw new Error("Failed to fetch data");
            }

            const stripeData = await fetchData.json();

            if (stripeData === "Please sign the contract first and then go to payment") {
                alert("Please sign the contract first and then go to payment");
            } else if (stripeData.paymentURL) {
                window.open(stripeData.paymentURL);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, []);

    return (
        <div className='dashboard-container'>
            <Grid container spacing={2}>

                <Grid item xs={2}>
                    <Box p={2} bgcolor="#101F33" height="90vh" color="white" border="1px solid white">
                        <Typography variant="h5" >
                            <HomeIcon style={{ fontSize: "30px", color: "white" }} />
                        </Typography>
                        <Typography variant="body1">
                            Sidebar Content
                        </Typography>

                    </Box>
                </Grid>


                <Grid item xs={10}>
                    <Box bgcolor="#3b82f680" p={2} height='10vh' border="1px solid black">
                        <div style={{ display: "flex", justifyContent: "end", alignItems: "center", gap: "5px" }}>
                            <Typography>
                                <AccountCircleIcon style={{ fontSize: "30px" }} />
                            </Typography>
                            <Typography variant="h4" component="h2" textAlign="right">
                                {customerDetails.first_name} {customerDetails.last_name}
                            </Typography>
                        </div>
                    </Box>


                    <Box p={2} height="80vh" display="flex" justifyContent="space-between" backgroundColor="#C9C0BB" border="1px solid black">

                        <Card style={{ border: "1px solid white", height: "20vh", backgroundColor: "#101F33", display: "flex", gap: "20px", flexDirection: "column", justifyContent: "center", alignItems: "start", padding: "20px" }}>

                            <CardContent style={{ border: "1px solid white", display: "flex", alignItems: "start", justifyContent: "center", textAlign: "center", gap: "55px" }} >
                                <Typography variant='h3' style={{ color: "white" }}>
                                    Signature Status
                                </Typography>

                                <Typography >
                                    {
                                        customerDetails.signature_status === 'signed' ? (
                                            <CheckIcon style={{ fontSize: 30, color: "black", border: "1px solid black", borderRadius: "50%", backgroundColor: "white" }} />
                                        ) : (
                                            <CloseIcon style={{ fontSize: 30, color: "black", border: "1px solid black", borderRadius: "50%", backgroundColor: "white" }} />
                                        )
                                    }
                                </Typography>
                            </CardContent>

                            <CardContent style={{ border: "1px solid white", display: "flex", alignItems: "start", justifyContent: "center", textAlign: "center", gap: "20px" }} >
                                <Typography variant='h3' style={{ color: "white" }}>
                                    Subscription Status
                                </Typography>

                                <Typography >
                                    {
                                        customerDetails.subscription_status === 'active' ? (
                                            <CheckIcon style={{ fontSize: 30, color: "black", border: "1px solid black", borderRadius: "50%", backgroundColor: "white" }} />
                                        ) : (
                                            <CloseIcon style={{ fontSize: 30, color: "black", border: "1px solid black", borderRadius: "50%", backgroundColor: "white" }} />
                                        )
                                    }
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" style={{ maxWidth: 400, padding: 20, height: "15vh", }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ borderBottom: "1px solid black", textAlign: "center", marginBottom: "20px" }}>
                                    Subscribe to Our Plan
                                </Typography>
                                <Button disabled={customerDetails.signature_status === "signed" ? true : false} onClick={handleDropBoxSign} variant="contained" size="large" style={{ marginRight: 10 }}>Dropbox Sign</Button>
                                <Button disabled={customerDetails.signature_status !== "signed" || customerDetails.subscription_status === "active" ? true : false} onClick={handleStripePayment} variant="contained" size="large">Payment</Button>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </div >
    );
}

export default Dashboard;
