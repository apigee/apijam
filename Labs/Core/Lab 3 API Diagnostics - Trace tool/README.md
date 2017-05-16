# API Diagnostics : Trace Tool

*Duration : 20 mins*

*Persona : API Team / DevOps*

# Use case

One of your team members is complaining that the API call is returning an error. You are asked to monitor the traffic and debug the issue.

# How can Apigee Edge help?

The Trace component in Edge is a powerful tool for troubleshooting and monitoring API proxy behavior.  Trace features an intuitive visual graph which outlines each step in an API proxy flow -- request, response, policies, etc.  Drill into each step to understand its impact on proxy behavior, filter your view to zero in on specific requests, and export your Trace session for non-real-time diagnostics.

In this lab, we will configure your proxy to expect a new query parameter -- called "initials" (your initials).  We will then use the trace tool to find the root cause of a 404 error, filtering the view to show only those requests containing your initials.

# Pre-requisites

You have an API proxy created in Apigee Edge. If not, jump back to the "Create Reverse Proxy with OpenAPI specification" lab.

# Instructions

## Part 1 - Configure API Proxy

* Go to [https://apigee.com/edge](https://apigee.com/edge) and log in. This is the Edge management UI. 

* Select **Develop → API Proxies** in the side navigation menu

![image alt text](./media/image_0.jpg)

* Select the **{your_initials}_employee_proxy** that you created in an earlier lab exercise.	

![image alt text](./media/image_1.png)

* Click on the **Develop** tab to access the API Proxy development dashboard.

![image alt text](./media/image_2.png)

* Click on **PreFlow** under Proxy Endpoints default, Click on **+Step** on the Request flow to attach an *Extract Variables* policy.


![image alt text](./media/image_3.png)

* Select **Extract Variables Policy**. Name the policy "Extract-Initials", and click on the **Add** button to add the Extract Variables policy.  Be aware that if you choose a different policy name, it will conflict when you paste the policy code snippet below.

Note: The Extract Variables policy icon is visible on the request flow and shows exactly where the policy is attached. Corresponding XML (in keeping with Edge’s config-then-code approach) can be seen in an edit pane below.

* Change the Policy XML configuration to match the code below.  Doing so will "teach" your proxy to extract your initials from a query parameter in the API request.

Note: In the following snippet, the Pattern value that reads *{my_initials}* is referencing a variable in your API proxy called *my_initials*, you do not need to replace this with your initials. 

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ExtractVariables async="false" continueOnError="false" enabled="true" name="Extract-Initials">
    <DisplayName>Extract My Initials</DisplayName>
    <Properties/>
    <QueryParam name="initials">
        <Pattern ignoreCase="true">{my_initials}</Pattern>
    </QueryParam>
</ExtractVariables>
```

* Click on **Save**. It will prompts to create a new revision, then click on *Save as new Revision*. 

![image alt text](./media/image_4.png)

* **Deploy** the new revision to *test* environment. 

![image alt text](./media/image_6.png)

## Part 2 - Trace and Troubleshoot

Consider a scenario where one of your API consumers reports seeing 404 errors in response to their requests.  How would you get to the bottom of this issue?  The Trace tool allows you to isolate that user’s requests and step through proxy logic one step at a time.  Let’s send some traceable requests -- note the failure -- and attempt to understand why it’s failing.

* Click on the **TRACE** tab to access the real-time API Trace tool.


* Locate the URL field and append the following to the end

```
/7ed25ec5-c89f-11e6-861b-0ad881f403bfaaa?initials={your initials}
```

* Update above *{your initials}* with your actual initials and remove the braces.

![image alt text](./media/image_7.png)

* Click the green **Start Trace Session** button, then click **Send**. Note a trace log is captured, with a 404 response.  

* Step through the visualization, clicking points of interest along the request/response flow and taking note of the metadata provided at the bottom of the screen.

	**Trace-Step 1:** Extract Variables Policy

	**Trace-Step 2:** Request sent to target

	**Trace-Step 3:** Response returned from target

* *Congratulations!*  You’ve found the problem.  Your target service cannot find an entity with the ID provided (7ed25ec5-c89f-11e6-861b-0ad881f403bfaaa).  This is a trivial example, but you can see how the tool -- providing before and after insight into message, query, and header contents -- would be of immense use in diagnosing malformed requests and other common issues.

* Edit your URL field once more to follow the pattern below

```
/e7f5ce16-205e-11e7-990c-0eec2415f3df?initials={your initials}
```

* Update above {your initials} with your actual initials & remove the braces

![image alt text](./media/image_12.png)

* Click the **Send** button again.

* Note - this time, your request returns a valid JSON response.

## Part 3 - Filtering

Now, imagine troubleshooting this issue - except with hundreds or thousands of requests flowing through the system at a given time.  Fortunately, the Trace tool can filter its real-time capture so that it only shows entries with a given query or header parameter.

* Click the red **Stop Trace Session** button.  

* Expand the filters pane on the left side of your screen.  Then add a query parameter filter named ‘initials’.  Put your initials in the value column and ensure the URL also holds your initials, like before.

```
/e7f5ce16-205e-11e7-990c-0eec2415f3df?initials={your initials}
```

![image alt text](./media/image_8.png)


* Click the green **Start Trace Session** button, then click the **Send** button again to fire another API call.  Note the captured trace entry.


* Update the URL with a new, fake value for the initials query parameter.  Example below.

```
/e7f5ce16-205e-11e7-990c-0eec2415f3df?initials=xyz
```

![image alt text](./media/image_11.png)

* Click the **Send** button. 

Note: No matter how many times you click send, no new trace entry is captured!  This is expected behavior, as our filter is configured to only trace requests with your initials in the query.

* One more thing -- with your trace session still active, click the **Download Trace Session** button to export a record of the trace results.  You’ll need this for the extra credit.

So you’ve diagnosed a real-time problem with your API and distilled the information down to show only requests relevant to your investigation.  In a true-to-life scenario, you’d likely filter on API key or another, more sophisticated identifier than initials.

# Lab Video

If you prefer to learn by watching, here is a video lab on using the Trace tool

[https://youtu.be/luCU2XTh5J0](https://youtu.be/luCU2XTh5J0)

# Earn Extra-points

Take a few minutes and explore the Trace interface a bit deeper.  Hover over the steps in the request/response visualization and note the Latency bubble that pops up, showing you how much time elapsed at that particular step.  Drill into the metadata in the bottom window.  Click the ‘Extract Variables’ policy and note that the initials you provided are shown as an extracted variable called ‘my_initials’.  

Finally, take a look at the exported trace session from the lab.  See if you can interpret the results -- imagine some scenarios where this export could be ingested into other tools for offline diagnostics.

# Quiz

1. Name two kinds of metadata the Trace tool provides you with.

2. What criteria can be used to filter Trace results?

# Summary

In this lab, you learned how to diagnose a reported problem with your API in real-time using the Trace tool.  You learned how to filter those results down to a relevant subset of data -- and how to export the results for later review. 

# References

* Apigee Docs: Trace.  [http://docs.apigee.com/api-services/content/using-trace-tool-0](http://docs.apigee.com/api-services/content/using-trace-tool-0)

* Apigee Community on Tracing: [https://community.apigee.com/topics/trace.html](https://community.apigee.com/topics/trace.html)

* Watch this 4minute video to learn about the Trace Tool

    * [https://community.apigee.com/articles/36248/apigee-4mv4d-api-proxy-trace-console.html](https://community.apigee.com/articles/36248/apigee-4mv4d-api-proxy-trace-console.html)

# Rate this lab

How did you link this lab? Rate [here](https://docs.google.com/a/google.com/forms/d/1Rc17-TqTtqfXgOu9SqYbVGyAzssnANftD2Hpspmr1KQ).

Now to go [Lab-4](https://github.com/apigee/devjam3/tree/master/Labs/Core/Lab%204%20API%20Security%20-%20Securing%20APIs%20with%20API%20Keys)
