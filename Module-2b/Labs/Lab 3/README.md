# Security : Threat Protection

*Duration : 15 mins*

*Persona : API Team / Security*

# Use case

You have an existing Apigee API proxy that takes requests from the internet and forwards them to an existing service. You have a requirement to ensure the integrity of the API message content, by protecting against threats such as JSON/XML/SQL injection and other malicious payload manipulation.

# How can Apigee Edge help?

Message content is a significant attack vector used by malicious actors. Apigee Edge provides a set of out-of-the-box policies that help mitigate the potential for your backend services to be compromised by attackers or by malformed request payloads.

In this lab we will see how to use the following policies:
 - JSON Threat Protection policy
 - Regular Expression Protection policy

# Prerequisites

* Basic understanding of [JSON](https://www.json.org/) and [XML](https://www.w3.org/TR/2008/REC-xml-20081126) data formats.
* Basic understanding of [SQL injection attacks](https://en.wikipedia.org/wiki/SQL_injection)
* Basic understanding of [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
* Have completed API Jam [Module-1](../../../Module-1) and [Module-2a](../../../Module-2a)

# Instructions

## JSON Threat Protection

1. For this lab we will be using a mock target API.  An initial Apigee API proxy has been created for you. Download the API proxy [here](./resources/Mock-Target-API.zip?raw=true).

2. Go to [https://apigee.com/edge](https://apigee.com/edge) and log in. This is the Edge management UI. 

3. Select **Develop → API Proxies** in the side navigation menu:

![image alt text](./media/image_0.png)

4. Click the **+Proxy** button on the top-right corner to invoke the Create Proxy wizard:

![image alt text](./media/image_1.png)

5. Select **Upload Proxy Bundle** and then click **Next** to import an existing proxy from a zip archive:

![image alt text](./media/image_2.png)

6. Click on **Choose File** and select the **Mock-Target-API.zip** that was previously downloaded and click **Next**.

![image alt text](./media/image_3.png)

7. Click on **Create** to upload the the proxy.

![image alt text](./media/image_4.png)

8. Confirm that the proxy was uploaded successfully and click on **Edit Proxy**:

![image alt text](./media/image_5.png)

8. On the Proxy Overview page, click the **Deployment** drop down, and select the **test** environment. Click **Deploy** in the confirmation pop-up.  Then click on the **Develop** tab:

![image alt text](./media/image_6.png)

9. Click on the "**Send request and view request headers and body**" flow under **Proxy Endpoints → default**, and then click on **+Step** on the upper right of the Request flow to attach a JSON Threat Protection policy:

![image alt text](./media/image_7.png)

10. Select **JSON Threat Protection** policy under **Security**. Click on the **Add** button to add the policy to the selected flow's request pipeline:

![image alt text](./media/image_8.png)

11. Select the policy to display the policy's XML configuration in the editor:

![image alt text](./media/image_9.png)

12. Change the policy's XML configuration to the below snippet to enforce protection against JSON payload manipulation threats:
```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<JSONThreatProtection async="false" continueOnError="false" enabled="true" name="JSON-Threat-Protection-1">
    <DisplayName>JSON Threat Protection-1</DisplayName>
    <Properties/>
    <ObjectEntryCount>5</ObjectEntryCount>
    <Source>request</Source>
</JSONThreatProtection>
```

In the above example, we use the JSON Threat Protection policy to ensure that the incoming API request JSON payload does not contain more than 5 fields. If the incoming payload contains more than 5 fields, the API proxy returns an error response.
For a full list of JSON integrity checks that can be performed using this policy, see the [JSON Threat Protection policy documentation](https://docs.apigee.com/api-platform/reference/policies/json-threat-protection-policy#elementreference).

13. Click on **Save** to save the API Proxy changes:

![image alt text](./media/image_10.png)

## Test JSON Threat Protection:

1. To test the changes made, first click on **Trace** tab of the API proxy dashboard:

![image alt text](./media/image_11.png)

2. Click on **Start Trace Session** button to begin tracing:

![image alt text](./media/image_12.png)

3. Now, send a POST request to your API endpoint at **http://{{your-organization}}-{{your-environment}}.apigee.net/mock-target-api/echo** with the following format:
```
POST /mock-target-api/echo HTTP/1.1
Host: {{your org}}-{{your env}}.apigee.net
Content-Type: application/json

{
"field1": "test_value1",
"field2": "test_value2",
"field3": "test_value3",
"field4": "test_value4",
"field5": "test_value5",
"field6": "test_value6"
}
```

You can make this call either using a REST client like the one <a href="https://apigee-restclient.appspot.com/" target="_blank">here</a>, or using a terminal.

Example `curl` command:
```
curl -X POST "http://{{your-org}}-{{your-env}}.apigee.net/mock-target-api/echo" -H "Content-Type: application/json" -d '{"field1": "test_value1", "field2": "test_value2", "field3": "test_value3", "field4": "test_value4", "field5": "test_value5", "field6": "test_value6"}'
```
* **Note:** If you are using a REST client, make sure that your HTTP request has a Header name/value pair of `Content-Type: application/json` as shown below

![image alt text](./media/image_13.png)

4. The response received will be an error, since we attempted to send more than 5 fields in the POST request payload.

![image alt text](./media/image_14.png)

On the Trace screen we also see that the JSON Threat Protection policy was triggered to return this error response:

![image alt text](./media/image_15.png)

5. You can now test for a successful API call, by sending the API endpoint a similar POST request, but this time with 5 or fewer fields in the JSON payload.
```
POST /mock-target-api/echo HTTP/1.1
Host: {{your-org}}-{{your-env}}.apigee.net
Content-Type: application/json

{
"field1": "test_value1",
"field2": "test_value2",
"field3": "test_value3",
"field4": "test_value4",
"field5": "test_value5"
}
```

Again, you can make this call either using a REST client like the one [here](https://apigee-restclient.appspot.com/), or using a terminal.

Example `curl` command:
```
curl -X POST "http://{{your-org}}-{{your-env}}.apigee.net/mock-target-api/echo" -H "Content-Type: application/json" -d '{"field1": "test_value1", "field2": "test_value2", "field3": "test_value3", "field4": "test_value4", "field5": "test_value5"}'
```

6. The response received will be a successful one, since we attempted to send fewer fields in the POST request payload:

![image alt text](./media/image_16.png)

On the Trace screen we also see that the JSON Threat Protection policy allowed the request to go through and hit the API target:

![image alt text](./media/image_17.png)

## Regular Expression Protection

### Add Protection Against SQL Injection Attacks

1. Click on the "**View IP address**" flow under **Proxy Endpoints → default**. Click on **+Step** on the upper right of the Request flow and attach a Regular Expression Protection policy.

![image alt text](./media/image_18.png)

2. Select **Regular Expression Protection** policy. Click on **Add** button to add the policy to the selected flow's request pipeline.

![image alt text](./media/image_19.png)

3. Select the policy to display the policy's XML configuration in the editor.

![image alt text](./media/image_20.png)

4. Change the policy's XML configuration to the below snippet to protect against SQL injections.
```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<RegularExpressionProtection async="false" continueOnError="false" enabled="true" name="Regular-Expression-Protection-1">
    <Source>request</Source>
    <QueryParam name="query">
        <Pattern>[\s]*(?i)((delete)|(exec)|(drop\s*table)|(insert)|(shutdown)|(update)|(\bor\b))</Pattern>
    </QueryParam>
</RegularExpressionProtection>
```

In the above example, the Regular Expression Protection policy has been configured with a pattern that matches common SQL injection attacks. This pattern will be checked against the value of the query parameter named `query`, and if there is a match, the policy will return an error response. Note that the policy lets you check the pattern against all types of input parameters and body content.

For other sample patterns, reference the [Regular Expression Protection policy documentation](https://docs.apigee.com/api-platform/reference/policies/regular-expression-protection#abouttheregularexpressionprotectionpolicy-exampleblacklistpatterns).

5. Click on **Save** to save the API Proxy changes.

![image alt text](./media/image_21.png)

## Test Regular Expression Protection:

1. To test the changes made, first click on **Trace** tab of the API proxy dashboard, and click on **Start Trace Session** button.

![image alt text](./media/image_12.png)

2. Now, send a GET request to the API endpoint at **http://{{your-organization}}-{{your-environment}}.apigee.net/mock-target-api/ip?query=** with any of the following entries in the `query` parameter. Try out all of the entries, and see if you can determine what each attack is trying to do!
```
query=delete
query=password’ OR 1=1
query=5; DROP TABLE USERS;
```

You can make this call either using a REST client like the one [here](https://apigee-restclient.appspot.com/), or using a terminal.

Example `curl` command:
```
curl "http://{{your-org}}-{{your-env}}.apigee.net/mock-target-api/ip?query={{insert SQL injection attack here}}"
```

The response received will be an error, since we attempted to send a malicious attack that we have configured our policy to recognize:

![image alt text](./media/image_22.png)

We can also confirm from the Trace screen that the Regular Expression Protection policy was triggered to return this error response:

![image alt text](./media/image_23.png)

# Lab Video

If you like to learn by watching, here are some short 4 minute videos on using the policies explained above:
- [JSON Threat Protection Policy](https://youtu.be/LIUeaAvRuTQ)
- [RegEx Protection Policy](https://youtu.be/NLg_LE3u-vM)

# Earn Extra points

Now that you have tried the JSON and Regular Expression Threat Protection policies, try out the [XML Threat Protection policy](https://docs.apigee.com/api-platform/reference/policies/xml-threat-protection-policy) that helps you check the API payload content integrity in the case of XML payloads.

# Summary

That completes this hands-on lesson. In this simple lab you learned how to protect your APIs against payload content based threats.

# References

* Useful Apigee documentation links on Threat Protection policies  -

    * [JSON Threat Protection Policy](https://docs.apigee.com/api-platform/reference/policies/json-threat-protection-policy)

    * [XML Threat Protection Policy](https://docs.apigee.com/api-platform/reference/policies/xml-threat-protection-policy)

    * [Regular Expression Protection policy](https://docs.apigee.com/api-platform/reference/policies/regular-expression-protection)

    * [Video](https://youtu.be/rC8kZJgwBFM) on using Threat Protection policies in Apigee Edge

You may now proceed to [Lab 4](../Lab%204)
