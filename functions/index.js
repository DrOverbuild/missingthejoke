const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const creds = require('./creds.json');
const stripe = require('stripe')(creds.sk);


const app = express();
app.use(cors({origin: true}));
app.use(bodyParser.json({type: 'application/*+json'}));


app.post('/', async (request, response) => {
    if (!validateBody(response, request.body)) {
        return;
    }

    const address = request.body.address;

    if (!validateAddress(response, address)) {
        return;
    }

    const product = request.body.product;

    if (!validateProduct(response, product)) {
        return;
    }

    const session = await createSession(response, address, product);

    if (session && session.id) {
        response.json({id: session.id});
    } else {
        response.status(400).send("Unable to create session");
    }
});

const validateBody = function (response, body) {
    if (!body) {
        response.status(400).send("Request Body Required");
        return false;
    }

    return true;
}

const validateAddress = function (response, address) {
    if (!address) {
        response.status(400).send("Address Required");
        return false;
    }

    if (!address.name) {
        response.status(400).send("Name Required");
        return false;
    }

    if (!address.email) {
        response.status(400).send("Email Required");
        return false;
    }

    if (!address.street1) {
        response.status(400).send("Street 1 Required");
        return false;
    }

    if (!address.city) {
        response.status(400).send("City Required");
        return false;
    }

    if (!address.state) {
        response.status(400).send("State Required");
        return false;
    }

    if (!address.zip) {
        response.status(400).send("Zip Required");
        return false;
    }

    return true;
}

const validateProduct = function (response, product) {
    if (!product) {
        response.status(400).send("Product required");
        return false;
    }

    const products = ["artwork", "derpface", "both"];

    if (!products.includes(product)) {
        response.status(400).send(`Invalid product: ${product}`);
        return false;
    }

    return true
}

const createSession = async function(response, address, product) {
    var productName = "";
    var imgUrl = "";
    var price = 2.50;

    const productDesc = "Our high quality vinyl 2\" x 2\" stickers are perfect for your laptop, notebook, HydroFlask" +
    "(sksksks), or any other surface you enjoy cluttering with brand representation. Sport the " +
    "Missing the Joke logo featuring the beautiful faces of Micah and Jasper, or go along with " +
    "the work of art (probably a Microsoft Paint drawing) that is the joke flying over the head " +
    "of our mascot, Derpface. Or take them both because you're indecisive and because we can give " +
    "you a better price. Stickers will be mailed to your billing address.";

    if (product === "artwork") {
        productName = "Missing the Joke Logo Sticker";
        imgUrl = "https://missingthejoke.com/img/missingthejokelogo.jpg";
    } else if (product === "derpface") {
        productName = "Missing the Joke Derpface Sticker";
        imgUrl = "https://missingthejoke.com/img/wooosh.jpg";
    } else if (product === "both") {
        productName = "Missing the Joke Logo and Derpface Stickers";
        imgUrl = "https://missingthejoke.com/img/bothstickers.jpg";
        price = 350;
    } else{
        response.status(400).send("Error: Invalid product: Please choose 'artwork', 'derpface', or 'both'");
        return;
    }

    var street2 = "";

    if (address.street2) {
        street2 = address.street2;
    }

    const stripeAddress = {
        line1: address.street1,
        line2: street2,
        city: address.city,
        state: address.state,
        postal_code: address.zip,
        country: 'US'
    }

    // get the customer first
    console.log("checking for customer...");
    const customers = await stripe.customers.list({
        limit: 1,
        email: address.email
    });

    var customer = null;

    // check if customer exists
    if (customers.data && customers.data.length > 0) {
        console.log("Found customer, updating...");
        customer = customers.data[0];
        customer = await stripe.customers.update(customer.id, {
            name: address.name,
            address: stripeAddress,
            shipping: {
                name: address.name,
                address: stripeAddress
            }
        });
    } else {
        console.log("No customer, creating...");
        customer = await stripe.customers.create({
                name: address.name,
                email: address.email,
                address: stripeAddress,
                shipping: {
                    name: address.name,
                    address: stripeAddress
                }
            }
        );
    }

    console.log(customer);

    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        billing_address_collection: 'required',
        payment_method_types: ['card'],
        line_items: [
            {
                description: productDesc,
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productName,
                        images: [imgUrl],
                    },
                    unit_amount: price,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `https://missingthejoke.com/success.html`,
        cancel_url: `https://missingthejoke.com/cancel.html`,
    });

    return session;
}

exports.setupPayment = functions.https.onRequest(app);