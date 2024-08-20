import { Alert, Button, Container, Grid, TextField, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';



const VerifyEmail = () => {
    const [mail, setmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifyemailstatus, setVerifyEmailStatus] = useState(false)

    console.log("error", error);

    const handleVerifyEmail = async () => {
        setLoading(true)

        try {
            if (!mail) {
                setError('Please enter a valid email address.');
                return;
            }
            const checkCustomer = await fetch(`https://${Shopify.shop}/apps/loveandmoney/api/verifyemail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: mail
                })
            });
            console.log("checkCustomer ====", checkCustomer);

            const checkCustomerJson = await checkCustomer.json();
            console.log("checkCustomerJson ====", checkCustomerJson);

            if (checkCustomerJson.message === "You already use this email for sunbscription") {
                setError(true)
            }

            if (checkCustomerJson.message === "No customer found with the specified email") {
                window.open(`https://${Shopify.shop}/pages/onboarding?email=${checkCustomerJson.email}`, "_blank")
            }

            else if (checkCustomerJson.message === "Customer data saved successfully") {
                setmail("")
                setVerifyEmailStatus(true);
                setTimeout(() => {
                    window.open(`https://${Shopify.shop}/account`, "_blank");
                    setVerifyEmailStatus(false);
                }, 2000)
            }
        } catch (error) {
            console.log("error =======", error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <ThemeProvider theme={createTheme()}>
            <Container maxWidth="sm" style={{ marginTop: "8%" }}>
                <CssBaseline />
                {
                    loading ? (<Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                    </Box>) : (
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                    Verify Email Address
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={mail}
                                    onChange={(e) => {
                                        setmail(e.target.value);
                                        setError('');
                                    }}
                                    error={!!error}
                                    helperText={error ? "You already use this email for subscription. Please login" : ""}

                                />
                            </Grid>
                            {verifyemailstatus ? <Alert severity="success" style={{ display: "flex", justifyContent: "start", alignItems: "start", margin: "0px 20px", width: "180%", fontSize: "small", }}> Email Verified </Alert> : ""}
                            <Grid item xs={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={!mail}
                                    onClick={handleVerifyEmail}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    )
                }

            </Container>
        </ThemeProvider>
    );
}

export default VerifyEmail