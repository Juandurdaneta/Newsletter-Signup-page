//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const { stringify } = require('querystring');
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) =>{
    var file = __dirname+"/signup.html";
    res.sendFile(file);
})

//Setting Up Mailchimp

mailchimp.setConfig({
    apiKey: "c1183bf8645aea5eb407ad1b0078af04-us6",
    server: "us6"
})

app.post('/', (req,res) =>{

    //Values we're going to obtain from the page
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    //LIST ID
    const listId = "e926bd1ceb";

    //User's data object
    const userData = {
        firstName : firstName,
        lastName : lastName,
        email: email
    };
    
    //Uploading data to the server
    async function run(){
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: userData.email,
            status: "subscribed",
            merge_fields: {
                FNAME: userData.firstName,
                LNAME: userData.lastName
            }
        });

        //If all goes well logging the contact's id
        res.sendFile(__dirname+"/public/views/success.html");
        console.log(`Successfully added contact as an audience member. The contact's id is ${
            response.id
            }.`);
    }

    run().catch(e => res.sendFile(__dirname+"/public/views/failure.html"));

});


app.post('/failure', function(req, res){
    res.redirect('/');
});


app.listen(process.env.PORT, (req,res) =>{
    console.log("Server started on port 3000")
})


//API KEY
//c1183bf8645aea5eb407ad1b0078af04-us6
//LIST ID
//e926bd1ceb