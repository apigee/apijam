# API Security and API Producer - Consumer Relationship on Apigee Edge

*Duration : 10 mins*

*Persona : API Team*

# Use case

You have an API that you want to secure and expose for consumption by different Apps (API clients).  In addition to setting up authorized access to the API, you also want to be able to identify and control which App is making calls to the API so you can customize API behavior based on the the caller, or gather data on consumption patterns by differnt Apps and view that data through Analytics dashboards.

# How can Apigee Edge help?

## API Proxy - API Product - App Relationship

On Apigee Edge, in order to secure an API and control access by consumers, we need to first understand the relationship between API Proxies, API Products and Apps.

While the API Proxy allows you to expose the API endpoint according to API design specification, it also serves to decouple the API backend (target service) from the front end (client Apps), and in turn API production from consumption. This is accomplished by creating 'API Products', which are configurations that define how an API can be consumed. The API Product configuration may contain metadata that defines rules for consumption of the API through the particular API Product. These rules may include allowed consumption quota (Eg. 100 API calls per minute), visibility (Public vs Private vs Internal), API resource restrictions (Eg. Only /products resource URL may be called, but not /products/{product ID}), which API deployment environment the caller is allowed to access (Eg. test, prod), etc.
Once the API Products are created, client Apps can then subscribe to them. On subscription, Apigee automatically generates and provisions an API Key/Secret pair for the App. These credentials can then be used to call the API endpoint with authentication and authorization, from within App code.

![image alt text](./media/image_proxy_product_app.png)

## API Proxy Configuration

Within the API Proxy, the [Verify API Key Policy](http://docs.apigee.com/api-services/reference/verify-api-key-policy) can be used to authenticate and authorize incoming API calls.
As a result of successful authentication, the [Verify API Key Policy](https://docs.apigee.com/api-platform/reference/policies/verify-api-key-policy) also populates the API Proxy runtime context with details about the App making the call, the App developer, the API product associated with the call, and so on.  This context can be used to parameterize other policies applied, in order to affect API behavior such as quota enforcement or routing based on the client App. The data can also be extracted and used to gain business insights through Apigee Analytics.

In this lab, you will..
* Configure a [Verify API Key Policy](https://docs.apigee.com/api-platform/reference/policies/verify-api-key-policy) for an existing API proxy, and use the Apigee Trace tool to see the policy in action.  
* Bundle the API Proxy into an API Product, and
* Register an App within your Org, that subscribes to the API Product, to test authorized consumption of the API.

# Pre-requisites

For this lab, you will need an API proxy that is not currently secured.  If you do not have an API proxy available for this lab, revisit the lab ["API Design : Create a Reverse Proxy from OpenAPI Spec"](https://github.com/aliceinapiland/apijam/tree/master/Module-1/Labs/Lab%201) and then return here to complete these steps.

# Instructions

## Choose (and invoke) an API Proxy to secure

1. Log into the Apigee Edge Management UI at [https://login.apigee.com](https://login.apigee.com). Navigate to  **Develop → API Proxies**, and select the API Proxy (labeled **{your_initials}**_Hipster-Products-API) that you created in [Lab 1](https://github.com/aliceinapiland/apijam/tree/master/Module-1/Labs/Lab%201).

![image alt text](./media/image_1.png)

2. Verify that the API proxy is deployed to an environment from the **Overview** page.  Environment(s) to which the selected revision of the API proxy is deployed will be indicated by a green circle.  If it is not deployed, click an environment from the "Deployment" pull-down to deploy the API proxy to that environment.

![image alt text](./media/image_2.png)

3. Verify that you can successfully make calls using the built-in trace tool.

* Click the **Trace** tab near the top of the window.

* The Trace view allows you to initiate tracing for up to 10 minutes, during which time all requests (regardless of whether they are sent from the trace tool or any other client) will be captured and their traces made visible to you.

* Click **Start Trace Session** to begin a trace session.

* If you're using the API proxy you built in the [previous Lab](https://github.com/aliceinapiland/apijam/tree/master/Module-1/Labs/Lab%201), add the `/products` resource path to the URL prior to sending a sample API call request. Click **Send** to send a request.

* You should see a successful 2xx response for your API Call (it may take a few seconds for the trace results to appear)

![image alt text](./media/image_3.png)

## Add a Verify API Key Policy

* Menu: **Develop > API Proxies**

* Open your API proxy and click the **Develop** tab (in the upper right area of the page) to see the flow editor (you may have to move the panes to see the full request and response flow lines)

* Click **+Step** on the request flow.

![image alt text](./media/image_4.png)

* Select *Verify API Key* policy from the *Security* section of the list.  The name can be changed or left at the default.

* Click **Add**

![image alt text](./media/image_5.png)

* The policy will be added after any policies you previously had in the Request flow.  Since we likely want this to occur first, drag the new policy to be the leftmost of any policies in the flow.

* With the *Verify API Key* policy selected, you can see its configuration (the default policy configuration is below).  Note that the API Key is being retrieved from the context as the variable *request.queryparam.apikey*.  This is the default but the policy can be configured to retrieve the key from any parameter key you prefer.

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <VerifyAPIKey async="false" continueOnError="false" enabled="true" name="VAK-VerifyKey">
    <DisplayName>VAK-VerifyKey</DisplayName>
     <Properties/>
    <APIKey ref="request.queryparam.apikey"/>
</VerifyAPIKey>
```

* **Save** the API proxy.

* Click the **Trace** tab near the top of the window.

* Click **Start Trace Session** to begin a trace session.

* Click **Send** to send a request.  

* You should see a 401 (unauthorized) response for your API Call because the API proxy was expecting an API Key as a query parameter.  See the trace session below

* NOTE: In Lab 4, you will get an API Key that will allow you to make this API call successfully.

![image alt text](./media/image_6.png)

# Lab Video

If you would rather watch a video that covers this topic, point your browser [here](https://youtu.be/3nUFCOgGlS8). (note: you only need to watch until the 3:00 minute mark for this specific lab).

# Quiz

1. Why is the Verify API Key policy typically found as the first policy in the Request PreFlow?  When might it be in a conditional PreFlow instead of the "All" PreFlow?

2. How would you configure the policy to get the API Key from a header called "Api-Key" instead of the default query parameter location?

# Summary

In this lab you learned how to protect your API proxy using the Verify API Key policy.  You implemented the policy and tested it using the built-in Trace Tool.

# References

* Link to Apigee docs page

    * Verify Api Key Policy [https://docs.apigee.com/api-platform/reference/policies/verify-api-key-policy](https://docs.apigee.com/api-platform/reference/policies/verify-api-key-policy)

# Rate this lab

How did you like this lab? Rate [here](https://goo.gl/forms/XxDqVtWHnyFdEChv1).

Now go to [Lab-3](../Lab%203%20API%20Publishing%20-%20API%20Products%20and%20Developer%20Portals)

