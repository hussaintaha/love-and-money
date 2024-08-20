import { useState, useEffect } from "react";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert, CircularProgress } from "@mui/material";

const Signup = () => {

    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false)
    const [successMessage, setSuccessMessage] = useState(false)
    const [stateDisable, setStateDisable] = useState(false);


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        console.log("urlParams ===========", urlParams);

        const email = urlParams.get('email');
        console.log("email ===========", email);

        if (email) {
            setStateDisable(true)
            setUserDetails(prevState => ({
                ...prevState,
                email: email
            }));
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (userDetails.password !== userDetails.confirmPassword) {
                setPasswordError(true)
                return
            } else if (!userDetails.email.includes('@')) {
                alert("Invalid Email")
                return
            }

            setLoading(true)

            const fetchdata = await fetch(`https://${Shopify.shop}/apps/loveandmoney/api/createUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userDetails })

            });
            console.log("fetchdata =========", fetchdata);

            if (fetchdata.status === 200) {

                const jsonData = await fetchdata.json();
                console.log("jsonData ============", jsonData);

                if (jsonData === "user already exist") {
                    setEmailError(true)
                    return
                }

                else if (jsonData.message === "user create successully") {
                    setEmailError(false)
                    setPasswordError(false)
                    setLoading(false)
                    setSuccessMessage(true)
                    setUserDetails("")

                    setTimeout(() => {
                        window.open(`https://${Shopify.shop}/account/login`, "_blank")
                    }, 2000);
                    return
                }
            }
        } catch (error) {
            console.log("error in signup page ==========", error);
            return
        } finally {
            setLoading(false);
        }
    }

    return (
        <ThemeProvider theme={createTheme()}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    {loading ?
                        (<Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>) : (
                            <>
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Sign up
                                </Typography>

                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    {successMessage ? <Alert severity="success" style={{ marginBottom: "10px", fontSize: "medium" }} > Signup successfull </Alert> : ""}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} style={{ fontSize: "medium" }}>
                                            <TextField
                                                autoComplete="given-name"
                                                name="firstName"
                                                required
                                                fullWidth
                                                id="firstName"
                                                label="First Name"
                                                autoFocus
                                                value={userDetails.firstName}
                                                onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
                                                style={{ fontSize: "medium" }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="lastName"
                                                label="Last Name"
                                                name="lastName"
                                                autoComplete="family-name"
                                                value={userDetails.lastName}
                                                onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={emailError}
                                                required
                                                fullWidth
                                                disabled={stateDisable}
                                                id="email"
                                                label="Email Address"
                                                name="email"
                                                autoComplete="email"
                                                value={userDetails.email}
                                                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="password"
                                                label="Password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={userDetails.password}
                                                onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                                                InputProps={{
                                                    endAdornment: (
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="confirmPassword"
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={userDetails.confirmPassword}
                                                onChange={(e) => setUserDetails({ ...userDetails, confirmPassword: e.target.value })}
                                                InputProps={{
                                                    endAdornment: (
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowConfirmPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                                label="I agree to the terms and conditions."
                                            />
                                        </Grid>

                                        {emailError ? (
                                            <Alert severity="error" style={{ display: "flex", justifyContent: "start", alignItems: "start", margin: "0px 20px", width: "180%", fontSize: "small", }}>Email already exists. Please use a different email.</Alert>
                                        ) : passwordError ? <Alert severity="error" style={{ display: "flex", justifyContent: "start", alignItems: "start", margin: "0px 20px", width: "180%", fontSize: "small", }}> Password do not match </Alert> : ""
                                        }

                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Sign Up
                                    </Button>
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Link href="https://codem-teststore.myshopify.com/account/login" target="_blank" variant="body2">
                                                Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

// window.open('https://codem-teststore.myshopify.com/account/login', "_blank")

export default Signup;
