# Traffic Management : Rate Limit APIs

*Duration : 15 mins*

*Persona : API Team / API Product Manager*

# Use case

You have a requirement to apply rate limits (quota limits) dynamically, such that you can package your APIs into different bundles each with their own quotas applied. For example, you want to be able to provide ‘Platinum’ level access that has a very high quota, and ‘Bronze’ level access that has a very low quota, both for the same underlying APIs.

# How can Apigee Edge help?

Apigee provides the capability to apply quotas to API proxies to limit access to them as required.

Apigee also provides the capability to apply API quota settings at the ‘API Product’ level, allowing you to define multiple products for the same APIs, each with their own quota settings.

# Pre-requisites

You must have completed labs 1 - 4 in order to run this lab. 

# Instructions

Note: As you will have already completed labs 1 - 4 and are familiar with how to setup API products and developer apps, as well as how to use a REST client to specify an API key, detailed instructions for those steps will be omitted here. Refer back to the previous labs if you need to see detailed instructions for those steps.

* Login to the Edge Management UI.

* Open up the **Develop** tab of your Employees API that you've used in the previous labs.

* In the proxy request pre-flow add a **Quota policy** directly after the *Verify API Key Policy* with the following configuration (note that in the below configuration 'VAK-VerifyKey' refers to the name of the Verify API Key policy that you had added. If you used a different name you will need to alter this in the configuration):

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Quota async="false" continueOnError="false" enabled="true" name="Q-EnforceQuota" type="calendar">
    <Allow count="10" countRef="verifyapikey.VAK-VerifyKey.apiproduct.developer.quota.limit"/>
    <Interval ref="verifyapikey.VAK-VerifyKey.apiproduct.developer.quota.interval">1</Interval>
    <TimeUnit ref="verifyapikey.VAK-VerifyKey.apiproduct.developer.quota.timeunit">minute</TimeUnit>
    <Identifier ref="verifyapikey.VAK-VerifyKey.client_id"/>
    <Distributed>true</Distributed>
    <Synchronous>true</Synchronous>
    <StartTime>2019-01-01 00:00:00</StartTime>
</Quota>
```

* Your API proxy should now look like this:

![image alt text](./media/image_0.png)

* Be sure to save your proxy changes.

* Create 2 new API products that include this proxy, ‘**Employees Bronze Product**’ and ‘**Employees Platinum Product**’ (refer back to [Lab-3](../Lab%203%20API%20Publishing%20-%20API%20Products%20and%20Developer%20Portals) if you don't remember how to create an API product).

For both products specify as before:

  * Environment: test

  * Access: Public

  * Automatically approve access requests.

  * Add your API proxy to the product.

For the **Bronze** product specify a quota limit of 1 request per minute:

![image alt text](./media/image_1.png)

For the **Platinum** product specify a quota limit of 1000 requests per minute:

![image alt text](./media/image_2.png)	

* Using the developer portal, register 2 new developer apps, one for each of your new products (refer back to [Lab-4](../Lab%204%20API%20Consumption%20-%20Developers%20and%20Apps) if you don't remember how to register a developer app). Record the API keys for each app.

* Launch the [REST Test client](https://apigee-restclient.appspot.com/) and run some tests using each API key. Verify that the *Bronze* API key cannot be used to send in more than 1 request per minute without triggering a quota exceeded exception:

![image alt text](./media/image_3.png)

* Verify with the *Platinum* key that you can send in more than 1 request per minute.	

# Lab Video

If you like to learn by watching, here is a short video on setting up dynamic quotas [https://youtu.be/f9jg1fJJTRE](https://youtu.be/f9jg1fJJTRE).

# Earn Extra-points

* Start a trace session for your API proxy and use it to determine at what point the quota values specified in the API product are made available within the API proxy.

# Quiz

1. In the quota configuration we provided, the ‘distributed’ and ‘synchronous’ attributes were both set to ‘true’. What is the implication for each of these if we set them to ‘false’?

2. How would you configure the quota so that POST calls are counted as 2 calls for the purposes of evaluating the quota?

# Summary

That completes this hands-on lesson. In this simple lab you learned how to apply a quota to an API proxy and use API product configuration to dynamically alter the quota within different contexts.

# References

* Useful Apigee documentation links on quotas: 

    * Quota Policy Reference: [https://docs.apigee.com/api-platform/reference/policies/quota-policy](https://docs.apigee.com/api-platform/reference/policies/quota-policy)

    * Community post on setting up dynamic quotas: [https://community.apigee.com/questions/1488/how-do-the-quota-settings-on-an-api-product-intera.html](https://community.apigee.com/questions/1488/how-do-the-quota-settings-on-an-api-product-intera.html) 

* Watch this 4minute video on "Dynamic Quotas’ - [https://youtu.be/z8Rj_VzSbh4](https://youtu.be/z8Rj_VzSbh4) 

# Rate this lab

How did you like this lab? Rate [here](https://goo.gl/forms/BJGUY07XCGboHxrw2).


