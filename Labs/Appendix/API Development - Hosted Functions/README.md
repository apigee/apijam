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

## Extend the proxy with new functionality

1. The default proxy isn't very interesting. Let's extend it a bit. First let's update the package.json file


```javascript
{
  "dependencies": {
    "bluebird": "^3.5.1",
    "express": "^4.16.2",
    "node-fetch": "^1.7.3"
  }
}
```
![image alt text](./media/package.json)

# Earn Extra-points

Now that you have created a reverse proxy using OpenAPI spec, Click on the Develop tab & explore the flow conditions populated from OpenAPI spec. Also, Explore OpenAPI Spec editor using which you can edit OpenAPI specification & Generate API Proxy using the link above the OpenAPI Spec editor. Explore trace tab in Proxy overview page.

# Quiz

1. How do you import the proxy bundle you just downloaded? 
2. How does Apigee Edge handle API versioning? 
3. Are there administrative APIs to create, update or delete API proxies in Apigee?

# Summary

That completes this hands-on lesson. In this simple lab you learned how to create a proxy for an existing backend using OpenAPI Specification and Apigee Edge proxy wizard.

# References

* Useful Apigee documentation links on API Proxies - 

    * Build a simple API Proxy - [http://docs.apigee.com/api-services/content/build-simple-api-proxy](http://docs.apigee.com/api-services/content/build-simple-api-proxy) 

    * Best practices for API proxy design and development - [http://docs.apigee.com/api-services/content/best-practices-api-proxy-design-and-development](http://docs.apigee.com/api-services/content/best-practices-api-proxy-design-and-development) 

* Watch this 4minute video on "Anatomy of an API proxy" - [https://youtu.be/O5DJuCXXIRg](https://youtu.be/O5DJuCXXIRg) 

# Rate this lab

How did you like this lab? Rate [here](https://goo.gl/forms/G8LAPkDWVNncR9iw2).

Now go to [Lab-2](https://github.com/apigee/devjam3/tree/master/Labs/Core/Lab%202%20Traffic%20Management%20-%20Throttle%20APIs)

