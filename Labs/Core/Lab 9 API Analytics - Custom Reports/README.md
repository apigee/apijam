# API Analytics : Custom Reporting

*Duration : 20 mins*

*Persona : API Team*

# Use case

Let's say your API has gained wide adoption. It's popular. You have attracted a number of talented, creative app developers and people are downloading and installing their apps. The API team is very interested in how the API is performing, how it's being used, and how to plan for improvements. 

# How can Apigee Edge help?

Apigee Edge Analytics Services collects and analyzes a wealth of information that flows through APIs. This information is gathered, analyzed, and provided to you immediately, in real time. In this lab we will see how you can extend the Edge analytics services by create dimension and metrics and use them in Custom reports.

**Custom Reports** 

There are several out-of-the-box, standard reports that are automatically provided for every Edge organization. They track several critical operational metrics, such as proxy response time, target response time, cache performance, error rates, and others. An API Publisher can create custom reports to augment the standard reports. By adding custom reports, you can create a set of charts that provide insight into the exact aspects of your API program that you wish to analyze.

In this lab, you will create a custom report to provide insight into the consumption of your APIs.

# Pre-requisites

* An existing API proxy created in Apigee Edge.

* Traffic to API Proxy.

# Instructions

## Navigate to the Analytics section of Edge

1. Go to [https://apigee.com/edge](https://apigee.com/edge) and log in. This is the Edge management UI. 

2. Select **Analyze → Reports** in the side navigation menu.

![image alt text](./media/image_0.png)

## Creating a Custom Report

* Click **+Custom Report**.

![image alt text](./media/image_1.png)

* Enter the **Report Name** and **Report Description**.

![image alt text](./media/image_2.png)

* Select a chart type, **Column**. This is the style of chart that will be used to present your custom analytic data.

![image alt text](./media/image_3.png)

* In the Metrics sections, choose the metric that you wish to analyze. Select **Traffic** as the metric. See [Custom Metrics ](https://docs.google.com/document/d/1T33fq5q5D6z7nmxI7gcKtcIcNvOxbuIv_BO8DWWthis/edit#heading=h.ksg236njnyhd)for a description of each metric.

![image alt text](./media/image_4.png)

* Select an **Aggregate Function** that you want applied to the data for the first metric. You can select an aggregation function to display the *Sum*, *Average*, *Min*, or *Max* values. Select **Sum** as the Aggregate Function. 

* (Optional) Click **+Metric** to add additional metrics. Select **Total Response Time** as the metric and **Average** as the Aggregate Function.

![image alt text](./media/image_5.png)

* Click on the **Dimension** dropdown and select **Proxy**. Every dimension you add (by clicking **+Dimension**) constrains the data set used to generate the reports. In effect, you're presenting more and more specific data with each drill down. 

![image alt text](./media/image_6.png)

* Add an additional **Dimension** for **Request Path**.

![image alt text](./media/image_7.png)

* You can further narrow the data displayed by adding filters to your report definition. 
In the **Filter** section of the page, click **+Filter Condition**. 
Select **Proxy** as the entity you want to filter on, select **=** as the **Operator** and set the **Value** to your API Proxy name (e.g. "ap_employees").

![image alt text](./media/image_8.png)

* Click on the check button under Actions to save this filter.

![image alt text](./media/image_9.png)

* Click **Save**. 

*Note: Data delay interval - After API calls are made to proxies, it takes about **10-15 minutes** for the data to appear in dashboards, custom reports, and management API calls.*

## Viewing a Custom Report

Once you have saved the **Custom Report** you can view it immediately. You should see something similar to the following:

![image alt text](./media/image_10.png)

If no data is returned, verify that the timeframe of the **Custom Report** matches a timeframe where traffic was being sent to the API.

![image alt text](./media/image_11.png)

Also, verify that the appropriate **Environment** (in this case *test*) has been selected on the top right dropdown.

![image alt text](./media/image_12.png)

## Drilldown dimensions

You can select from a large number of custom drilldown dimensions. Drilldown dimensions let you specify which dimensions to measure in your custom report. Apigee Edge Analytics collects data on a wide range of dimensions. And, you can also select any custom dimensions that have been created in your organization. See [Analytics reference](http://docs.apigee.com/analytics-services/reference/analytics-reference).

To drill down into the custom report you just created, click on the name of your **Proxy** under the **Summary** on the bottom of the report.

![image alt text](./media/image_13.png)

You should now be able to view a drill-down into the **Request Path** dimension for your **API Proxy**.

![image alt text](./media/image_14.png)

## Editing and deleting your reports

When you've completed building your custom report, the data is populated immediately. The graph is defaulted to plot the first metric you chose for the tab in your custom report. If you want to see different metrics, or compare them against each other, follow these steps:

1. Click the report name to view the graphs of the selected report.

2. Click the Edit button to edit the display name, dimensions, and measures.

3. Click **Save**.

You also have the option to delete a report by clicking the **Delete** button.

# Lab Video

If you like to learn by watching, [here](https://youtu.be/p91de5WkR98) is a short video on creating a custom report.

# Earn Extra-points

You can extend the Edge analytics services by using the Statistics collector policy to extend custom dimensions and metrics for use in Custom reports. 

**Statistics Collector** policy Enables you to collect statistics for data in a message, such as product ID, price, REST action, client and target URL, and message length. The data can come from flow variables predefined by Apigee or custom variables that you define. The statistics data is passed to the analytics server, which analyzes the statistics and generates reports. You can view the reports by using the Edge management UI or Edge API.

# Quiz

1. What is the difference between a Dimension and a Metric?

2. What happens when you drill down into additional Dimensions?

# Summary

In this exercise, you learned about custom reports in Apigee Edge. You also added the custom report along with other reports to a custom dashboard. Please visit the documentation to see the different kinds of operational reports and dashboards that are available to you.

# References

## Custom Metrics Reference Table

<table>
  <tr>
    <td>Metric</td>
    <td>Description</td>
  </tr>
  <tr>
    <td>Average transactions per second</td>
    <td>The number of API requests and resulting responses per second.</td>
  </tr>
  <tr>
    <td>Cache hit</td>
    <td>The number of API requests that are serviced from the Apigee cache. The request for the cached data is not forwarded to the backend target. </td>
  </tr>
  <tr>
    <td>Policy errors</td>
    <td>The request is marked as is_Error when it cannot be serviced successfully by a policy.</td>
  </tr>
  <tr>
    <td>Proxy errors</td>
    <td>The request is marked as is_Error when it cannot be serviced successfully by the proxy.</td>
  </tr>
  <tr>
    <td>Request processing latency</td>
    <td>The length of time it takes the proxy to complete an end-to-end transaction. </td>
  </tr>
  <tr>
    <td>Request size</td>
    <td>The size of the request in bytes.</td>
  </tr>
  <tr>
    <td>Response processing latency</td>
    <td>The time it takes for the proxy to process a request measured in milliseconds. </td>
  </tr>
  <tr>
    <td>Response size</td>
    <td>The size of the response in bytes.</td>
  </tr>
  <tr>
    <td>Target errors</td>
    <td>The request is marked as is_Error when it cannot be serviced successfully by the backend target.</td>
  </tr>
  <tr>
    <td>Target response time</td>
    <td>The time it takes from when a request is sent from to the backend target and when it is received from the backend. </td>
  </tr>
  <tr>
    <td>Total response time</td>
    <td>The total time for an app to receive a response from an API request. This is the sum of the request processing latency of the proxy, request processing latency of the customer endpoint, response generation latency of the customer endpoint, and the response processing latency of the proxy. It also includes the latency introduced by the network layer as the request and response can go through multiple networks before it reaches its destination. </td>
  </tr>
  <tr>
    <td>Traffic</td>
    <td>Also known as throughput. The number of API requests and resulting responses seen by the organization.</td>
  </tr>
</table>


## Additional References

* Useful Apigee documentation links on API Analytics - 

    * Apigee Analytics dashboards documentation [http://docs.apigee.com/analytics-services/content/analytics-dashboards](http://docs.apigee.com/analytics-services/content/analytics-dashboards)

    * Analytics Best Practices
[https://apigee.com/about/blog/cto-musings/api-best-practices-analytics](https://apigee.com/about/blog/cto-musings/api-best-practices-analytics)

    * Watch this 4 minute video on "Custom Reports using Apigee Edge Analytics" - [https://youtu.be/lTcuc2so4oI](https://youtu.be/lTcuc2so4oI)

# Rate this lab

How did you like this lab? Rate [here](https://goo.gl/forms/4elHC2g6EuwnBlon1).

