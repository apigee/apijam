# Hybrid Deployment : Edge Microgateway 

*Duration : 60 mins*

*Persona : API Team*

# Use cases

There are three primary use cases for implementing a microgateway pattern:

* Keep API traffic within the enterprise network boundaries for security or compliance purposes

* Incorporate lean API Management with your microservices architecture

* Add distributed security and traffic management with centralized visibility to your existing applications.

# How does Edge Microgateway help?

Apigee Edge Microgateway provides lean API Management while benefiting from a full-fledged Apigee Edge API Management platform in the public or private cloud. Its main job is to process requests and responses to and from backend services securely while asynchronously pushing valuable API execution data to Apigee Edge where it is consumed by the Edge Analytics system. Edge Microgateway is easy to install and deploy -- you can have an instance up and running within minutes.

Apigee Edge Microgateway provides the following features:

* Analytics data is automatically collected and analyzed by the Apigee Edge platform

* Quota policies enforced in Microgateway based on settings on Apigee Edge platform

* OAuth 2 and API Keys are verified by Edge Microgateway. Spike Arrest policies are enforced. 

* Protect inbound and outbound traffic via TLS 1.2

* Create your custom policies in Node.js and enforce by Microgateway


# Overview

This topic shows you how to setup and configure a working Edge Microgateway instance. In general, you'll need to follow these same steps each time you set up a new instance of Edge Microgateway. 

After completing the steps in this topic, you'll have a fully configured, working Edge Microgateway installation capable of processing API requests. You'll test the setup by making secure API calls through Edge Microgateway to a backend target. At the end of this topic, you will learn how to add a spike arrest, api key and oauth plugins to the Microgateway.

# Pre-requisites

* You must have Node.js version 4.x LTS or later installed on your system. You can check by executing:

```
node -v
```

![image alt text](./media/image_0.png)

* Windows requires [OpenSSL](https://www.openssl.org/) to be installed and added to the PATH.

* [cURL](https://curl.haxx.se/download.html) or a chrome extension like [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).

# Instructions

## Installing Edge Microgateway

This section explains how to install Edge Microgateway and initialize a default configuration.

1. Install Edge Microgateway with npm using the global install option. This command installs the software and puts the edgemicro executable in your path

```
npm install -g edgemicro
```

![image alt text](./media/image_1.png)

1. Initialize Edge microgateway and create default configuration

```
edgemicro init
```

![image alt text](./media/image_2.png)

NOTE: This command creates a default configuration file in the home directory of the user.

## Configure Edge Microgateway

This step will configure your Edge Microgateway instance with the Apigee Edge instance. In this lab, you will connect to a public cloud instance of Apigee Edge. The step will differ slightly when connecting to a private cloud instance. Please refer to the docs for more details.

This command requires standard information about your Apigee Edge account: organization name, environment name, username (email address), and password. **You must be an Edge organization administrator** to use this command:

```
edgemicro configure -o {org name} -e {env name} -u {username}
```

![image alt text](./media/image_3.png)

All of the configuration done so far allows Edge Microgateway to bootstrap itself to Apigee Edge. After the bootstrapping succeeds, Edge Microgateway retrieves a payload of additional configuration information from Apigee Edge.

NOTE: Please **Save the key and secret in a secure location**. You will need it to start or reload the Edge microgateway instance.

The configuration command deploys a proxy "edgemicro-auth" in the org+env

![image alt text](./media/image_4.png)

This proxy is responsible for :

1. Providing Edge Microgateway with a list of all products in the org

2. Verifying API Keys

3. Generating [JWS](https://tools.ietf.org/html/rfc7519) based Oauth Access Tokens.

The command also created a configuration file in the following location:

```
~/.edgemicro/{org name}-{env name}-config.yaml
```

![image alt text](./media/image_5.png)

## Create Entities on Apigee Edge

Edge Microgateway follows the philosophy of *Centrally administer and author policies, federate policy enforcement.*

In this section you will, 

1. Define a proxy on Apigee Edge. When Edge Microgateway starts (and during reload), it downloads the configuration from Edge and exposes the API locally on Microgateway.

2. Define a product (that includes the proxy created in Step 1). Edge Microgateway downloads the product information and uses it to enforce API Keys or OAuth.

3. Finally, create a developer (optional) and a developer app (for client id and secret).

### Create a Proxy

1. Log in to your organization on Apigee Edge.

2. Select **APIs > API Proxies** from the top menu.

3. In the API Proxies page, click **+API Proxy**.

4. In the Build a Proxy wizard, select Reverse proxy (most common).

![image alt text](./media/image_6.png)

5. In the Details page of the wizard, configure as follows, where we point to an example target API that we can use for testing purposes:
  * Proxy Name : edgemicro_httpbin
  * Proxy Base Path: /httpbin
  * Existing API : [https://httpbin.org](https://httpbin.org)

  ![image alt text](./media/image_7.png)

6. Click **Next**.

  **Important**: Edge Microgateway-aware proxy names **must** always begin with the prefix ```edgemicro_```.

7. In the Security page of the wizard, select **Pass through (none)**

  ![image alt text](./media/image_8.png)

8. Click **Next**.

9. In the Virtual Hosts page of the wizard, accept the defaults.

10. Click **Next**.

11. In the Build page of the wizard, review your proxy settings. Make sure the test environment is selected.

12. Click **Build and Deploy**. 

### Create a Product

Create a product that contains your Edge Microgateway-aware proxy(s):

1. Log in to the Edge management UI

2. Go to **Publish > API Products**.

3. In the Products page, click **+ API Product**.
Fill out the Product Details dialog as follows:

  * Name : Edgemicro HttpBin Product
  * Display Name : Edgemicro HttpBin Product
  * Environment : test
  * Access : Public
  * Key Approval Type : Automatic
  * Resources 
    * API Proxy: Add these two proxies: edgemicro_httpbin and edgemicro-auth
    * Revision : 1
    * Resource Path: /**

4. Click **Import Resource**.

5. Click **Save**.

  ![image alt text](./media/image_9.png)

### Create a Developer (optional)

For the purpose of this tutorial, you can use any existing developer for the next step, creating a developer app. But if you wish, create a test developer now:

1. Go to **Publish > Developers**.

2. In the Products page, click **+ Developer**.

3. Fill out the dialog to create a test developer.

  ![image alt text](./media/image_10.png)

### Create a Developer App

You are going to use the client credentials from this app to make secure API calls through Edge Microgateway:

1. Go to **Publish > Apps**.

2. In the Developer Apps page, click **+ App**.

3. Fill out the Developer App dialog as follows:
  * Name : Edgemicro Test APp
  * Display Name : Edgemicro Test APp
  * Developer : If you created a test developer, select it. Or, you can use any existing developer for the purpose of this tutorial.
  * Products: Select Edgemicro HttpBin Product (the product you just created)

  ![image alt text](./media/image_11.png)

4. Click the checkmark button next to the Products field to add the product.

5. Click **Save**

## Test Edge Microgateway Setup

### Start Edge Microgateway

To start Edge Microgateway, run the following command:

```
edgemicro start -o {org-name} -e {env-name} -k {key} -s {secret} 
```

  ![image alt text](./media/image_12.png)
  
NOTES:

1. Edge microgateway starts on port 8000 by default

2. Edge microgateway starts in "cluster" mode by default. You will find one worker process per CPU.

### Test API Proxy

Make a call to the API Proxy using cURL, Postman etc.

```
curl http://localhost:8000/httpbin
```

![image alt text](./media/image_13.png)

NOTE: It is expected that the API call will fail due to "Missing Authorization Header".

**Explanation**

The Edge microgateway configuration controls the security for the API proxies hosted in EM. The default configuration is to enable the OAuth plugin and not allow missing or invalid authorization headers.

![image alt text](./media/image_14.png)

Notice, the Oauth plugin is enabled (because it is a part of the plugin sequence). Also the flags allowNoAuthorization and allInvalidAuthorization is set to false.

## Enable API Key Verification

In this section you will access an Edge Microgateway proxy via API Keys. Since we have already created the proxy, product and app, we can go ahead and test the API access.

First, grab the API Key (consumer key) from the Edge UI.

1. In the Developer Apps list page.

2. Select the app you just created, Edgemicro Test APp

3. Click **Show** next to the Consumer Key and Consumer Secret

![image alt text](./media/image_15.png)

```
curl http://localhost:8000/httpbin/get -H "x-api-key: KreCI7sQeeJpS0ImqhGMutzx5PLdmgtA"
```

![image alt text](./media/image_16.png)

## Enable Spike Arrest

In this topic, you will enable the spike arrest plugin to the microgateway instance.

1. Open the configuration file located here:

```
vi ~/.edgemicro/{org-name}-{env-name}-config.yaml
```

1. Add the following lines in the plugins stanza.

```
plugins:
    sequence:
      - oauth
      - spikearrest
```

NOTE: **Order is important**! Plugins are always executed in the order of appearance in the configuration file. In this case, first the API Key (or OAuth token) is verified then the spike arrest plugin is executed. 

1. Add the following spike arrest configuration anywhere in the config file:

```
spikearrest:
      timeUnit: minute   
      allow: 10   
      buffersize: 0
```      
 
![image alt text](./media/image_17.png)

1. Reload the Edge microgateway instance (if running) in a new terminal window.

```
edgemicro reload -o {org-name} -e {env-name} -k {key} -s {secret}
```

![image alt text](./media/image_18.png)

NOTE: You **MUST** run the reload command from the **same directory** as where you ran the start command.

You will see the the microgateway instance has now picked up the spike arrest plugin

![image alt text](./media/image_19.png)

NOTE: You will see an "installed plugin" message for each worker process.

1. Test Configuration: Keep running the following command till you see the failure.

```
curl http://localhost:8000/httpbin/get -H "x-api-key: KreCI7sQeeJpS0ImqhGMutzx5PLdmgtA"
```

![image alt text](./media/image_20.png)

NOTE: Spike Arrest configuration is applied for **each worker process**.

## Enable OAuth (Access Token Verification)

In this topic, you will be able to access the API proxies hosted by Edge Microgateway using OAuth access tokens. The OAuth plugin serves dual purpose (for validating Access Tokens and API Keys). Since the OAuth plugin is already loaded by microgateway, we can go directly to testing the configuration.

1. Obtain an Access Token: Get the new access token from CLI and by calling an API. Pass the org name, env and consumer key and secret (obtained from the Edge Management UI)

![image alt text](./media/image_21.png)

```
edgemicro token get -o {org-name} -e {env-name} -i {consumer key} -s {consumer secret}
```

![image alt text](./media/image_22.png)

The resulting access token is a JWS (JSON Web Token - Signed). Use this token to make the API calls.

1. Invoke the API

```
curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhcHBsaWNhdGlvbl9uYW1lIjoiYWZiOTM5ZWMtZWVkNi00MmZjLWFhM2ItNDZiYTNlYzZlNTJkIiwiY2xpZW50X2lkIjoiS3JlQ0k3c1FlZUpwUzBJbXFoR011dHp4NVBMZG1ndEEiLCJzY29wZXMiOltdLCJhcGlfcHJvZHVjdF9saXN0IjpbIkVkZ2VtaWNybyBIdHRwQmluIFByb2R1Y3QiXSwiaWF0IjoxNDgzNDY4NTQ4LCJleHAiOjE0ODM0NzAzNDd9.pngjKaZl6HgjpUs3na3Z2M909wCCunEOvhjTd3yrsavZVMExdO9PH6kEUzDkhGjGpwYTJB_dKhXv6lYRZ57uXMN1KlRDrJ27xZ35MMhuhU0bkhbTR81u5LY65JGpzY2Rlj5Qki_qCzKe9LsCoEpW0bS-bUnHM20kfhmzrdCI4SzHQfcnCdxYX3dgFME-hMcjjkRBE4QYAxCaiElcsOPmssRNNsqTFueBAxpiYJ1bPe1XcUyDJhkodCoFsCXcPM6Jg8M7OaIrA5uQRXqxbKGEZr0o7zlfH_w3e91dfGmSAjI-CQVMxAQS1-V1xq6z1My8KP70x7S5Srg_suvSvalkAA" http://localhost:8000/httpbin/get
```

 ![image alt text](./media/image_23.png)

## Centralized Analytics/Visibility

We now have a fully functioning Edge Microgateway instance, let's see what's it's been up to! By default, the analytics plugin module is added to Edge Micro. This module silently (and asynchronously) pushes analytics data from Edge Micro to Apigee edge, where it is consumed by the Edge Analytics system.

1. Log in to your organization on Apigee Edge.

2. Select **Analyze > API Proxy Performance**.

3. In the** Proxy Performance** dashboard, select the edgemicro_httpbin proxy.
The graph shows you information about the the proxy's traffic patterns, such as total traffic, average response time, average target response time, and more

![image alt text](./media/image_24.png)

# Earn Extra-points

## Instructions

Add or enforce quota policy in Edge microgateway.

1. Log in to the Edge management UI

2. Go to **Publish > API Products**.

3. In the Products page, select "**Edgemicro HttpBin Product**"

4. Edit the product

![image alt text](./media/image_25.png)

5. Add quota information to the Product in the Edge Management UI

    1. Set **Quota**: 7

    2. **Requests Every**: 1

    3. **Time Unit**: Minute

![image alt text](./media/image_26.png) 

1. Click **Save**.

2. Edit the configuration file (~/.edgemicro/{org-name}-{env-name}-config.yaml) and enable the Quota plugin

![image alt text](./media/image_27.png)

## Test the Configuration

Keep running the following command till you see the failure.

```
curl http://localhost:8000/httpbin/get -H "x-api-key: KreCI7sQeeJpS0ImqhGMutzx5PLdmgtA"
```

![image alt text](./media/image_28.png)

# Quiz

1. Do Apigee Edge policies work on Apigee Edge microgateway?

2. Can microgateway expose only some proxies?

3. Can microgateway route based on content or header?

4. How does microgateway sync with Edge?

# Summary

In this lab you learned how to install and configure Apigee Edge Microgateway. You were able to proxy APIs on microgateway and enable policies like spike arrest, OAuth, API Key verification and Quotas. Finally, you were able to get a centralized view (analytics) of the APIs hosted on the microgateway.

# References

* Link to Apigee docs page

    * Edge Microgateway Setup and Configure: [http://docs.apigee.com/microgateway/v21x/edge-microgateway-tutorial-v21x](http://docs.apigee.com/microgateway/v21x/edge-microgateway-tutorial-v21x)

    * FAQ: [http://docs.apigee.com/microgateway/content/edge-microgateway-faq](http://docs.apigee.com/microgateway/content/edge-microgateway-faq)

* Link to Community posts and articles with "[Edge Micro](https://community.apigee.com/spaces/71/index.html)" 

* Writing Custom Plugins: [http://docs.apigee.com/microgateway/latest/develop-custom-plugins](http://docs.apigee.com/microgateway/latest/develop-custom-plugins)

* Docker Apigee Edge Microgateway: [https://apigee.com/about/blog/developer/running-apigee-edge-microgateway-docker-container](https://apigee.com/about/blog/developer/running-apigee-edge-microgateway-docker-container)

* Sample docker file: [https://github.com/kevinswiber/apigee-edgemicro-docker](https://github.com/kevinswiber/apigee-edgemicro-docker)

# Rate this lab

How did you link this lab? Rate [here](http://apigee.com).

