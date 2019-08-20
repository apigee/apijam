## Module 3 - Lab 1 : Global policy management using Shared Flows, Flow Hooks and Flow Callouts
# Policy Management : Shared Flows

*Duration : 20 mins*

*Persona : API Team / Policy Management*

# Use case:

You are tasked with designing multiple API proxies for your organization, your APIs have similar requirements with respect to Security, Logging and Mediation. You are looking to define a standard implementation for these requirements and would also like a means to enforce certain requirements that all new APIs with your organization should adhere to. 

# How can Apigee Edge help?

By exposing an API through Apigee Edge, you gain the ability to modify and monitor its behavior using out-of-the-box policies. Edge's out-of-the-box policies enable you to enhance your API with sophisticated features to control traffic, enhance performance, enforce security, and increase the utility of your APIs, without requiring you to write any code or to modify any backend services. 

In additon to these policies, Apigee Edge also provides for manner to group multiple of these policies into a single re-usable collection called Shared Flows. Shared Flows gives you an ability reuse policies / best practices across different API proxies and even across different teams. Furthermore Apigee Edge also provides concepts of flow hooks by which you can have these shared flows invoked automatically within any new proxy that is created within your organization, hence eliminating the need to explicitly callout flows.



# Pre-requisites

* Basic understanding of [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification) (Swagger)
* Completed a previous Module 2 (a) for our [Virtual API Jam](https://github.com/aliceinapiland/apijam/tree/master/Module-2a) or have the equivalent knowledge. Alternatively, go through the ["Getting started guide"](https://docs.apigee.com/api-platform/get-started/get-started) in the Apigee Docs site.
* We will be reusing the proxies from the module 2 of virtual Apijam, a copy of the proxy code is available within the resources section in this repo.
* Please snure that you have a Oauth proxy within your organization, if not, you can follow the instructions from Lab 2(a) of this APIJam. [here](../../Module-2a/Lab%202#create-oauth-token-endpoints) 

# Instructions

In this lab we will see how we can bundle certain out of the box policies, that you have already used in our labs, like traffic management policy(Spike Arrest) and Security (OAuth) into a shared flow and have this shared flow invoked within your proxy using the flow callout feature. 

## Create and Deploy a Shared Flow

1. Go to [https://apigee.com/edge](https://apigee.com/edge) and log in. This is the Edge management UI. 

2. Select **Develop → Shared Flows** in the side navigation menu.

![image alt text](./media/image_0.png)

3. Click the **+Shared Flow** button on the top-right corner to invoke the **+New Shared Flow** wizard. 

![image alt text](./media/image_1.png)

4. Provide a name and description for your shared flow.
 Note - To avoid confusion with others memebers participating in the APIJam, please prefix your shared flow with your initials.

![image alt text](./media/image_2.png)

5. Verify that an empty shared flow is created by selecting **Develop** tab in the right side menu.

![image alt text](./media/image_4.png)

* Shared flow will look similar to a proxy that you have build in previous modules of this APIJam.

Note- Although a shared flow appers to look like a proxy, a shared flow has no endpoint. It can be used only from an actual API proxy or shared flow that's in the same organization as the shared flow itself.

* Click on **Deployment** and select the **test** environment to deploy the flow to the test environment. 

![image alt text](./media/image_5.png)

* You will be prompted with a dialog box to confirm the deployment to encironment ""test"", click on Deploy.

![image alt text](./media/image_6.png)

6. Now lets add the policies we want to be part of this FLOW, Click on **default** section under Shared Flows, and then click on **+Step** on the upper right of the Request flow to attach a Spike Arrest policy.

![image alt text](./media/image_7.png)

7. Select **Spike Arrest Policy**. Click on **Add** button to add the spike arrest policy to the shared flow canvas.

![image alt text](./media/image_8.png)

8. Note the Spike Arrest policy icon on top of request flow that shows exactly where the policy is attached. Select the policy to display the policy's XML configuration in the editor. What you now see is the default XML configuration for the Spike Arrest Policy.

![image alt text](./media/image_9.png)

9. Change the Policy XML configuration to the below snippet to enforce a rate of 12 requests per minute.
```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<SpikeArrest async="false" continueOnError="false" enabled="true" name="Spike-Arrest-1">
    <DisplayName>Spike Arrest-1</DisplayName>
    <Properties/>
    <Rate>12pm</Rate>
    <UseEffectiveCount>true</UseEffectiveCount>
</SpikeArrest>
```

10. Similary, Lets add the **Oauth v2.0** Policy to ensure that an API Token based security is enforced in all APIs that are using this flow. 

![image alt text](./media/image_10.png)

Please ensure OAuth v2.0 policy is the first policy (before Spike Arrest) and then click **Save**.

![image alt text](./media/image_11.png)

* Note- if your  OAuth v2.0 policy does not appear as the first policy you can use the drag and drop feature to move policies around within the canvas.


## Testing your shared flow using Flow Callouts and Flow Hooks

Your shared flow is now ready for testing. As discussed earlier, Shared flows do not have actual backend implementations, hence for testing our shared flow we will need to either invoke this within a proxy via an explicit **flow callout** or have this flow attached to a **flow hook**. 

To test this flow we will be using the existing proxy that you created within [Module 2(a)](../../Module-2a/Lab%202). If you have not completed Module 2(a), It is recommended that you review the content of the lab to familiarize witht he concepts of Spike Arrest and Oauth first before we proceed with this Lab.

If you have completed Module 2 and have the Hipster API Proxy already, you can skip the next steps and move to Step 1.


### (Optional) Create APIProxy - Only required if you have not completed Module 2

a. Go to [https://apigee.com/edge](https://apigee.com/edge) and log in. This is the Edge management UI.

b. Select **Develop** → **API Proxies** in the side navigation menu.

![image alt text](./media/image_12.png)

c. Click the **+Proxy** button on the top-right corner to invoke the Create Proxy wizard.

![image alt text](./media/image_13.png)

d. Select **Proxy Bundle** and then click **Next** to import an existing proxy form a zip archive.

![image alt text](./media/image_14.png)

Download the API proxy "as_Hipster-Products-API_rev1_2019_08_20.zip" that implements OAuth client credentials grant type [here](./Resources/as_Hipster-Products-API_rev1_2019_08_15.zip). 

Back in the proxy creation wizard, click "Choose File", select the ***“zip”*** file you just downloaded and click **Next**:

![image alt text](./media/image_15.png)

e. Click **Build**:

![image alt text](./media/image_16.png)

You should see a successful "Uploaded proxy" message as shown below.  You now have the **Hispster Products Api Proxy** from Module 2.  Click "Hister Products API" near the bottom of the page:

f. Click on **Developer** Tab and and Then Select **<your_initials>_Hipster-Products-API** under the Navigator section.
![image alt text](./media/image_17.png)


g. Replace <Your_Initials> with your initials within the Display Name and Basepaths sections as show below and click Save 
![image alt text](./media/image_18.png)


g. Deploy the proxy by clicking on the **Deployment** dropdown and selecting the **test** environment:

![image alt text](./media/image_19.png)

Your proxy is now ready for testing, if you would like to test this, please follow instructions from Module 2. The steps below will detail how to invoke the shared flow that you have created as a part of this Lab. Following the tests from Module 2 is an import pre-requitie as your will need your applocation Key and Secret for the remainder of this Lab.

1. Since the Hipster API already contians the Policies for Oauth and Spike arrest, we will start by removing these polcies from the preflow. Click on Each of the polcies and select small "x" sign on the top right hand corner of the policy icon to remove the polcies from execution sequence.
![image alt text](./media/image_20.png)

2. Click on **+ Step** Icon to Add Policies and select the **Flow Callout** Polciy from within ***Extention*** section of the policy menu. Within the **Shared flow** drop down menu you should see your shared flow, select it and click on Add 
![image alt text](./media/image_21.png)

3. Save Your Proxy and Click on **Trace** Tab to start testing.
![image alt text](./media/image_22.png)

4.  Click on **Start Trace Session** to see API Proxy with spike arrest in action.
![image alt text](./media/image_23.png)

5. To streamline testing you can externalize credentials and org specefic details as below:

```
export APP_CLIENT_SECRET="secret"
export APP_CLIENT_KEY="key"
export ORG_NAME="orgname"
export ENV="envname"
```

Note - for App Client Key and Secret, you will need an ***App*** created within Apigee Edge and Module 2 talks about API Products, Api Developer and Application. It also details out how to obtain your Applications Key and Secret that are needed for this lab,

6. We will be using application creadentials (Client ID and Secret) to Make ***curl***  POST Call to the OAuth Endpoint to obtain an API Token using the Client credential OAuth grant type:
```
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: application/json' "https://$ORG_NAME-$ENV.apigee.net/oauth/client_credential/accesstoken?grant_type=client_credentials" -d "client_id=$APP_CLIENT_KEY&client_secret=$APP_CLIENT_SECRET"
```

You shpuld see a response like below:
```
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: application/json' "https://$ORG_NAME-$ENV.apigee.net/oauth/client_credential/accesstoken?grant_type=client_credentials" -d "client_id=$APP_CLIENT_KEY&client_secret=$APP_CLIENT_SECRET"
{
  "refresh_token_expires_in" : "0",
  "api_product_list" : "[dr_Hipster-Products-API-Product]",
  "api_product_list_json" : [ "dr_Hipster-Products-API-Product" ],
  "organization_name" : "apijams-amer-1",
  "developer.email" : "jdev@gmail.com",
  "token_type" : "BearerToken",
  "issued_at" : "1566275920240",
  "client_id" : "<Client ID>",
  "access_token" : "<Token>",
  "application_name" : "ae65d3ab-38bf-44c8-955c-c9bc5ebdbf86",
  "scope" : "",
  "expires_in" : "3599",
  "refresh_count" : "0",
  "status" : "approved"
}%                                         
```

7. Take Your token from above response and externalise it using another ENV Variable like below:
```
export ACCESS_TOKEN="Token from Above Response"
```
Now make the actual Call your Hispter API using below CURL and Look at the trace:
```
curl -X GET -H "Authorization: Bearer $ACCESS-TOKEN" "https://$ORG_NAME-$ENV.apigee.net/v1/<Your Initials>_hipster-products-api"

```
Note - Be sure to replace <Your Initials> above 

Your should see a 200 OK response with a Hello Guest! Response. You see your API Calls in the Trace Tool and Also note that there Flow Call out was initiated. 

![image alt text](./media/image_24.png)

8. Lets re-enter the above CURL command Multiple Times in Quick succession to Engage our Spike Arrest Policy, You should see an error like below:
```
{"fault":{"faultstring":"Spike arrest violation. Allowed rate : MessageRate{messagesPerPeriod=12, periodInMicroseconds=240000000, maxBurstMessageCount=1.0}","detail":{"errorcode":"policies.ratelimit.SpikeArrestViolation"}}}%  
```

![image alt text](./media/image_26.png)



9. You can now Omit the API Key from your Curl Call and see that you get a ***401 Unathorized** Error
![image alt text](./media/image_25.png)

# Flow Hooks

# Lab Video

If you like to learn by watching, here are some short videos on using [Shared Flows](https://youtu.be/-7xx34uD8Kk) and [Flows Hooks](https://youtu.be/-lP5tI3ppZI).

# Earn Extra-points

Now that you are familiar with the concept of Shared flow and how to invoke them, continue explore more about Shared flows and how you can [invoke one shared flow from another flow.](https://docs.apigee.com/api-platform/fundamentals/shared-flows#calling-a-shared-flow) 

# Summary

That completes this hands-on lesson. In this simple lab you learned how to re-use policies accross multiple proxies using shared flows.

# References

* Useful Apigee documentation links on Flows, Flow Hooks, OAuth, Spike Arrest Policy  - 

    * [Spike Arrest Policy](http://docs.apigee.com/api-services/reference/spike-arrest-policy)

    * [OAuth Policy](https://docs.apigee.com/api-platform/security/oauth/oauth-introduction)

    * [Shared Flows](https://docs.apigee.com/api-platform/fundamentals/shared-flows)

    * [Flow Hooks](https://docs.apigee.com/api-platform/fundamentals/flow-hooks)


Now go to [Lab-2](../Lab 2)
