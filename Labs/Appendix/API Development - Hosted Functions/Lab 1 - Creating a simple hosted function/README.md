# API Development : Hosted Functions

*Duration : 20 mins*

*Persona : API Team*

# Use case

You have a proxy requirement where you want to aggregate the results of several API calls and to massage the output from each. These separate API calls should be executed in parallel.

# How can Apigee Edge help?

Hosted Functions provide a mechanism where customers can combine the rich support of policies with node.js apps deployed automatically by Apigee. The use case described here is best solved with real code. Through some simple code a developer can unambiguously handle the individual calls, aggregate and massage the output and with an eye to parallel execution.

In this lab we'll be creating a hosted function that utilizes node.js to parallelize several backend calls and then combine the results into a single response.

# Pre-requisites

* Basic understanding of [node.js](https://nodejs.org/en/) (Serverside Javascript)

# Instructions

## Create a "Hosted Function" API Proxy

1. It’s time to create Apigee API Proxy from Open API Specification. Click on **Develop → API Proxies** from side navigation menu.

![image alt text](./media/image_5.jpg)

2. Click **+Proxy** The Build a Proxy wizard is invoked. 

![image alt text](./media/image_6.jpg)

3. Select **Reverse proxy**, Click on **Use OpenAPI** below reverse proxy option.

![image alt text](./media/ChooseHostedFunction.png)

4. Enter details in the proxy wizard. Replace **{your-initials}** with the initials of your name. 

    * Proxy Name: **{your_initials}**_hf_proxy

    * Proxy Base Path: /v1/**{your_initials}**_hf_proxy

![image alt text](./media/ProxyDetails.png)

5. Select **Pass through (none)** for the authorization in order to choose not to apply any security policy for the proxy. Click Next. 

![image alt text](./media/image_12.jpg)

6. Go with the **default Virtual Host** configuration.

![image alt text](./media/image_13.jpg)

7. Ensure that only the **test** environment is selected to deploy to and click **Build and Deploy** 

![image alt text](./media/image_14.jpg)

8. Once the API proxy is built and deployed **click** the link to view your proxy in the proxy editor. 

![image alt text](./media/image_15.png)

9. *Congratulations!* ...You have now built a hosted function proxy. You should see the proxy **Overview** screen.

![image alt text](./media/image_16.png)

## Test the API Proxy
1. Let us test the newly built API proxy by copying the url and hitting it in a new tab in the browser. If all is well it should return "Hello, World!"

![image alt text](./media/helloWorldOutput.png)

## Extend the proxy with new functionality

The default proxy isn't very interesting. Let's extend it a bit. First let's update the package.json file.

1. Let's move into the development view
![image alt text](./media/clickOnDevelop.png)


2. Next click on `package.json` from the scripts view in the lower left hand navigation pane.
![image alt text](./media/clickOnPackageDotJson.png)

3. Update the package.json as per the following. We're adding threw new dependencies that the hosted functions service will automatically install for us and which we'll need going forward.

```javascript
{
  "name": "hello-world",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
   "start": "node index.js"
  },
  "author": "",
  "license": "",
  "description": "Hello World Application",
  "dependencies": {
    "bluebird": "^3.5.1",
    "express": "^4.16.2",
    "node-fetch": "^1.7.3"
  }
}
```

4. Click on the `index.js` script to update it.
![image alt text](./media/clickOnIndexDotJs.png)

5. Update the script with the following. This is a complete rewrite that's now relying on two of the three dependencies we added when we updated `package.json`

```javascript
const express = require('express'),
  fetch = require('node-fetch');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
```

6. Save the newly updated script
![image alt text](./media/saveIndexDotJs.png)

7. Test our new script by refreshing the tab we previewed earlier and you should see a simple text line reading: `Hello, World!`.

# Quiz

1. Let's put some happy fun questions in here

# Summary

That completes this hands-on lesson. In this simple lab you learned how to create a proxy for an existing backend using OpenAPI Specification and Apigee Edge proxy wizard.

# References

* TBD ... we don't have anything to link here yet


# Rate this lab

How did you like this lab? Rate .. to be filled in later

