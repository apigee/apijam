# Lab 4 - Build an App Developer Experience using Apigee Integrated Developer Portals

*Duration : 30 mins*

*Persona : API Team*

# Use case

You want to provide and manage an easy, self-service on-boarding experince for app developers who wish to consume your API Products via a Developer Portal.  You want to enable app developers to learn about, register for, and begin using your APIs, as well as control visibility and access to different API Products.

# How can Apigee Edge help?

Apigee Edge provides multiple options for your Developer Portal. Apigee supports several developer portal solutions, ranging from simple turn-key to fully customizable and extensible. The turn-key [Integrated Developer Portal](https://docs.apigee.com/api-platform/publish/portal/build-integrated-portal) option supports branding and customization of much of the site, such as theme, logos, and page content, and can be published in seconds, directly from the management UI.  We also provide a [Drupal-based portal](https://docs.apigee.com/api-platform/publish/drupal/open-source-drupal-8) if you want full control and to leverage any of the hundreds of Drupal modules available in the Drupal Market.  This lab focuses on the Integrated Developer Portal.

## Developer Programs, Teams and Audience Management

On Apigee Edge, a [Developer Program](https://docs.apigee.com/api-platform/publish/portal/intro-developer-program) is the configuration set associated to each Developer Portal - specifically, App Developer accounts, App Developer identity management configuration, App Developer Teams, and Audience configuration for access to content published on the portal.

App Developers have the option of creating [Teams](https://docs.apigee.com/api-platform/publish/portal/developer-teams) to share responsibility for an app with other developers. Each developer within a Team is assigned a role (`Owner`, `App Admin` or `Viewer` ) that defines their access level to the shared apps.

[Audience](https://docs.apigee.com/api-platform/publish/portal/portal-audience) configurations are used to segment portal users or developer teams to control access to the following resources:
* Pages in your portal
* Published API products

The following figure shows how audiences are used to control access to a set of resources.

![image alt text](./media/DevTeamAudienceRelationship.png)

In this lab, you will create an Integrated Developer Portal wherein you will publish API Products, and through which app developers can 
* learn API usage through OpenAPI specification based interactive documentation
* register Apps that consume API Products, and thereby
* generate App client credentials (API Key and Secret) that can be used to consume APIs.

# Pre-requisites

For this lab, you should have completed [Lab 1](../Lab%201), [Lab 2](../Lab%202) and [Lab 3](../Lab%203) of this module.

You will need…

* An OpenAPI specification uploaded to your Spec store within your Organization. This specification will make up the documentation of your API.  If you do not have an OpenAPI Specification available for this lab, revisit [*Lab 1 - Design & Create an API Proxy with OpenAPI Specification*](../Lab%201)
* API Products that bundle your API Proxies. If you do not have an API Product configured, revisit [*Lab 2 - API Security and API Producer/Consumer Relationship on Apigee Edge*](../Lab%202), and [Lab 3 - Manage tiered API Product subscription through API call quotas](../Lab%203).

# Instructions

## Update API Proxy for CORS Support

CORS (Cross-origin resource sharing) is a standard mechanism that allows JavaScript XMLHttpRequest (XHR) calls executed in a web page to interact with resources from non-origin domains. CORS is a commonly implemented solution to the "[same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy)" that is enforced by all browsers. For example, if you make an XHR call to your API Proxy from JavaScript code executing in your browser, the call will fail. This is because the domain serving the page to your browser is not the same as the domain serving your API, eg. "{your org name}-{environment name}.apigee.net". CORS provides a solution to this problem by allowing servers to "opt-in" if they wish to provide cross-origin resource sharing.

In this step, we ensure that we implement CORS support for your API Proxy, before it is published to a Developer Portal where it could be invoked within interactive docs pages.

For further information, see "[Adding CORS support to an API proxy](https://docs.apigee.com/api-platform/develop/adding-cors-support-api-proxy)".

1. Navigate to **Develop → API Proxies** and select your API Proxy "{your initials}\_Hipster-Products-API". Open the **Develop** tab for this proxy, in order to edit proxy configuration.

    ![image alt text](./media/OpenProxyDevelop.png)

2. Select the '**+**' option in the **Policies** left panel, to add a new policy.

    ![image alt text](./media/AddPolicy.png)

3. Select the **Assign Message** option and add the policy with the following details:

    Display Name: `Set CORS Response Headers`
    Name: `Set-CORS-Response-Headers`

   ![image alt text](./media/AddAMCORSHeaders.png)

   Edit the policy configuration to the following:

       ```
       <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
       <AssignMessage async="false" continueOnError="false" enabled="true" name="Set-CORS-Response-Headers">
        <DisplayName>Set CORS Response Headers</DisplayName>
        <FaultRules/>
        <Properties/>
        <Set>
            <Headers>
                <Header name="Access-Control-Allow-Origin">{request.header.origin}</Header>
                <Header name="Access-Control-Allow-Headers">origin, x-requested-with, accept, content-type</Header>
                <Header name="Access-Control-Max-Age">3628800</Header>
                <Header name="Access-Control-Allow-Methods">GET, PUT, POST, DELETE</Header>
            </Headers>
        </Set>
        <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
        <AssignTo createNew="false" transport="http" type="response"/>
       </AssignMessage>
       ```
   ![image alt text](./media/EditAMCORSHeadersPolicy.png)

4. Repeat steps 2 & 3 above add another **Assign Message** policy, with the following details:
    
    Display Name: `Set OPTIONS Status Code`
    Name: `Set-OPTIONS-Status-Code`

    Policy configuration:
        ```
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <AssignMessage async="false" continueOnError="false" enabled="true" name="Set-OPTIONS-Status-Code">
            <DisplayName>Set OPTIONS Status Code</DisplayName>
            <Properties/>
            <AssignVariable>
                <Name>error.status.code</Name>
                <Value>200</Value>
            </AssignVariable>
            <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
            <AssignTo createNew="false" transport="http" type="request"/>
        </AssignMessage>
        ```
5. Select the **'PreFlow'** flow under **'Target Endpoint' -> 'default'** from the left panel. Then drag and drop the **'Set CORS Response Headers'** policy to the response pipeline of the flow, as shown below:

   ![image alt text](./media/DragDropCORSHeadersTargetRespPreFlow.png)

   This ensures that CORS headers are returned on any valid API call.

6. Select the '**+**' button to add a flow to **'Proxy Endpoint' -> 'default'** on the left panel.

   ![image alt text](./media/AddProxyEndpointFlow.png)

7. Select the **Manual** entry tab and enter the following flow details:
   
      Flow Name: `OptionsPreFlight`
      Description: `For CORS preflight requests`
      Condition Type: Custom
      Condition: `request.verb == "OPTIONS"`

      ![image alt text](./media/ConfigureOPTIONSFlow.png)
   
   Click **Add**.

   This flow handles CORS Preflight OPTIONS requests.

8. Select the **'OptionsPreFlight'** flow under **'Proxy Endpoint' -> 'default'** from the left panel. Then drag and drop the **'Set CORS Response Headers'** policy to the response pipeline of the flow, as shown below:

   ![image alt text](./media/DragDropCORSHeadersOPTIONSPreflight.png)

   This ensures that CORS headers are returned on CORS Preflight OPTIONS requests.

9. Select **'Proxy Endpoint -> default'** on the left panel. Scroll down to the bottom of the configuration, and add the following [RouteRule](https://docs.apigee.com/api-platform/fundamentals/understanding-routes#determiningtheurlofthetargetendpoint) setting before the 'default' rule, as shown below:

   ![image alt text](./media/OPTIONSRouteRule.png)

    ```
    <RouteRule name="NoRoute">
        <Condition>request.verb == "OPTIONS"</Condition>
    </RouteRule>
    ```
   This RouteRule ensures that CORS Preflight OPTIONS requests are not forwarded to the API target service.

10. Select **'Proxy Endpoint -> default'** on the left panel. Scroll to the top of the configuration, and add the following [DefaultFaultRule](https://docs.apigee.com/api-platform/fundamentals/fault-handling#creatingfaultrules-creatingadefaultfaultrule) setting, as shown below:

    ```
    <DefaultFaultRule name="DefaultFaultRule">
        <Step>
            <Name>Set-CORS-Response-Headers</Name>
        </Step>
        <Step>
            <Name>Set-OPTIONS-Status-Code</Name>
            <Condition>request.verb = "OPTIONS"</Condition>
        </Step>
        <AlwaysEnforce>true</AlwaysEnforce>
    </DefaultFaultRule>
    ```
   
   This ensures that, in the event of any API Proxy error, CORS headers are sent back correctly, and CORS Preflight OPTIONS requests are always handled. Eg. When API Key validation fails.

## Update the Open API Spec

In order to ensure that we have an updated OpenAPI Spec that accurately describes the API endpoint exposed through our API Proxy, we must first modify the spec - specifically the `host`, `basepath`, `securityDefinitions` and `security` properties. To do this, navigate to **Develop → Specs** on the main menu, select the spec that we previously imported in Lab 1, and modify the the `host`, `basepath`, `securityDefinitions` and `security` properties as shown below:

    `host: {{your API proxy host}}`  _<--- In Apigee Trial orgs this will be {{your org}}-{{environment}}.apigee.net_
    `basepth: /v1/{{your initials}}_hipster-products-api`
    ```
        securityDefinitions:
            APIKeyQuery:
                type: "apiKey"
                in: "query"
                name: "apikey"
        security:
        - APIKeyQuery: []
    ```

    ![image alt text](./media/EditSpec.png)

## Create a Developer Portal

1. Navigate to **Publish → Portals** and click **+Portal**, or **Get started** (if you haven't created any portals yet within the org).

![image alt text](./media/image_3.png)

2. Enter details in the portal creation wizard. Replace **{{your-initials}}** with the initials of your name.

  * Name: `{{your initials}}_Hipster API Portal`

  * Description: `Developer portal for consumption of Hipster APIs.`

3. Click **Create**

![image alt text](./media/image_4.png)

## Publish the Bronze (Free) API Product to the Portal

1. Click the Portal Editor’s dropdown and select **APIs**.

![image alt text](./media/image_5.png)

2. Click **+API** to select the Bronze API Product to publish to the Portal. Select the API Product to publish and click **Next**.

![image alt text](./media/image_6.png)

3. Click the **Change Spec Source** dropdown and select **Choose a different spec...**.

![image alt text](./media/image_7.png)

4. Select the recently updated OpenAPI Specification to use as a source. The current version (snapshot) of the selected OpenAPI Specification will be used to generate the documentation for this API product in the portal.

![image alt text](./media/image_8.png)

5. Select the **Registered users** option so registered developers on the Developer Portal can view this API through the portal. Click **Next**.

![image alt text](./media/image_9.png)

6. Select the **Image** button to update the icon image associated with this API product. 

![image alt text](./media/image_9b.png)

7. Then select **External Image** and provide the following URL to import image.

Image URL: `https://raw.githubusercontent.com/aliceinapiland/apijam/master/Module-1/Labs/Lab%204/media/HipsterAPIProductImage.png`

![image alt text](./media/image_9c.png)

8. Click **Finish**.

![image alt text](./media/image_9d.png)

The API product is now published to the developer portal.

## App Developer sign-up

1. Click the **Live Portal** link to launch a browser tab/window with the new Developer Portal.

![image alt text](./media/image_10.png)

2. On the developer portal, click the main menu option labeled **Sign In**. This will take you to the App Developer login page. Here, click **Create Account**.

![image alt text](./media/SignInButton.png)

![image alt text](./media/CreateAccountLink.png)

3. Provide the following details, and then click **Create Account**.

    ```
    First Name: {{your first name}}
    Last Name: {{your last name}}
    Email: {{your email address}}
    Password: {{enter a password}}
    Check the "I agree to terms." box
    ```
![image alt text](./media/CreateAccountForm.png)

4. On account creation, the App Developer will receive an email notification with an account verification link. 

![image alt text](./media/AccountVerify1.png)

Since we you have provided your own email address as the App Developer in this lab, you should have received this notification. Click the link or copy and paste it into the browser to verify the account.

![image alt text](./media/AccountVerify2.png)

5. Once account is verified, the App Developer can sign into the portal using their credentials.

![image alt text](./media/SignInForm.png)

## View API Documentation

1. Log in as App Developer using the account credentials created in the previous steps. Click on the **APIs** menu link on the Developer Portal. This will take you to the API catalog page. Here' you will see that API product we previously published to be visible to all registered developers.

![image alt text](./media/APICatalogFree.png)

2. Click the API Product icon for the Bronze product in the catalog, to view it's documentation. This will take you to an interactive documentation page generated from the OpenAPI spec that we associated to the API product at the time of publishing.

![image alt text](./media/FreeProductDocsPage.png)

3. Select one of the API resource paths from the left pannel of the docs and click **Execute**. You will then see a 401 Unauthorized response in the right pannel.

   ![image alt text](./media/TestDocsUnauthorized.png)

   This is because you haven't yet registered any Apps and therefore have no API Keys to use for an authorized API call.

## Register Apps

1. Navigate to the developer account drop down menu on the top right corner, and select the **Apps** link.

   ![image alt text](./media/AccountApps.png)

2. Click the **New App** button (either on the page itself or on the top panel, as shown below).

   ![image alt text](./media/NewApp.png)

3. Enter the following App details and click **Create**:
    App Name: `{{your initials}}_Hipster-Test-App`
    Description: `Test app to try out Hipster Products API using the Bronze (Free) API Product`

    Select the Bronze (Free) API Product that is available for subscription.

    ![image alt text](./media/CreateAppForm.png)

4. You will find that an API Key/Secret pair has been generated for your newly created App. You can now use this API Key to test the API.

   ![image alt text](./media/TestAppOverview.png)

5. Navigate to the API Catalog, select the Bronze API Product docs, and test out the GET `/products` resource again. This time though, first click on the **Authorize** button and select the newly created App's credentials to set authorization information (API Key) for the API call.

   ![image alt text](./media/TestDocsAuthorized.png)

   Click **OK** after authorization information is set.

   ![image alt text](./media/AuthorizeInDocsOk.png)

   Now, click **Execute**. You will see that a valid 200 OK API response is received.

   ![image alt text](./media/AuthorizedDocsTestResult.png)

## Enable Teams and Audience Management features

1. To utilize Teams and Audience Management features, you must first enroll into the Beta program within your Apigee Edge org. To do this, navigate to the **Publish -> Developer Programs** menu on the Management UI, and select the developer program associated with your Integrated Developer Portal.

   ![image alt text](./media/SelectDevProgram.png)

2. Click the **Enroll** button to "Enroll in beta for team and audience management".

   ![image alt text](./media/EnrollBtn.png)

   Once enrolled, you will see the Teams and Audience Management features enabled within your Developer Program.

  ![image alt text](./media/EnrollmentComplete.png)

## Create Developer Team

1. Ensure that you are logged into the Developer Portal with your App Developer credentials. Navigate to the **Teams** menu from your account drop-down.

  ![image alt text](./media/NavToTeamsPortalScreen.png)

2. Click the **+ New Team** button.

  ![image alt text](./media/AddNewTeamBtn.png)

3. Fill in team details and click **Create**.

    Overview section:
        * Team name: `{{your initials}}_Hipster App Team`
        * Description: `Team that will work together on Hipster apps, and share API Keys.`
        * Point of contact: `{your App Developer email address}`

    Memebers:

        Your App Developer email ID has already been added to the team with 'Owner' role.
        If required, you can add additional Developers with different roles.

    ![image alt text](./media/CreateTeamForm.png)

4. Once created, you will be able to access this team as a team member from the Developer Portal, and as an API producer, you can view teams created on the Developer Program within the Apigee Management UI as well.

   ![image alt text](./media/TeamCreatedDevPortal.png)

   ![image alt text](./media/TeamCreatedManagementUI.png)

## Create Audience

We will now see how to publish API products on the Developer Portal, with only certain audiences that have entitlement to view and subscribe to those products.

1. Navigate to **Publish → Developer Programs → {the developer program associated to your Developer Portal}**. Click the **Audiences** tab and click the '**+**' button to add a new audience.

   ![image alt text](./media/AddAudienceBtn.png)

   Enter the following details and click **OK**.

    Name: `Hipster-API-Privileged-Audience`
    Description: `A privileged audience that is allowed access to the Hispter API Silver and Gold products.`

    ![image alt text](./media/NewAudienceForm.png)

2. Once the Audience is created, you define who should be assigned to it. To do this, click the **+** button in the **Assignments** section of the Audience.

   ![image alt text](./media/AddAssignmentBtn.png)

   In the popup, type in the name of the team that you previously created. Select the team and click **Add(1)**.

   ![image alt text](./media/AddAssignmentForm.png)

   Click **Save** to save the audience assignment.

   ![image alt text](./media/SaveAssignment.png)

## Publish Silver API Products with New Audience Entitlements

1. Navigate to **Publish → Portals → {{your developer portal}} → APIs** and click the **+API** button.

![image alt text](./media/AddAPIToPortal1.png)

2. Select the Silver API Product and click **Next**.

![image alt text](./media/AddAPIToPortalSilver1.png)

3. Click the **Generate docs from** dropdown and select **Choose a different spec...**.

![image alt text](./media/AddAPIToPortalSilver2.png)

4. Select the recently updated OpenAPI Specification to use as a source. The current version (snapshot) of the selected OpenAPI Specification will be used to generate the documentation for this API product in the portal.

![image alt text](./media/AddAPIToPortalSilver3.png)

5. Make sure that the **Published** checkbox is checked, so that the Silver API Product is visible to authorized App developers through the API catalog, during App creation. Then click **Next**.

![image alt text](./media/AddAPIToPortalSilver4.png)

6. Select the **Image** button to update the icon image associated with this API product. 

![image alt text](./media/AddAPIToPortalSilver5.png)

7. Then select **External Image** and provide the following URL to import image.

Image URL: `https://raw.githubusercontent.com/aliceinapiland/apijam/master/Module-1/Labs/Lab%204/media/HipsterAPIProductImage.png`

Then click **Add**.

![image alt text](./media/AddAPIToPortalSilver6.png)

8. Click **Finish**.

![image alt text](./media/AddAPIToPortalSilver7.png)

9. Click the Audience Visibility icon for the Silver API Product.

![image alt text](./media/ModifyAudienceBtn.png)

10. Select the **Restricted access** option, and check the box for the Audience you just created. Click **Submit**.

![image alt text](./media/ModifyAudienceForm.png)

## Create Team App

1. On the developer portal, navigate to the developer account drop down menu on the top right corner, and select the **Apps** link. Then click the **New App** button.

   ![image alt text](./media/NewAppWithTeam.png)

3. Enter the following App details and click **Create**:
    App Name: `{{your initials}}_Hipster App`
    Description: `App that is registered against the team to share App credentials and access Silver tier Hipster API product.`
    Owner: `{{your initials}}_Hipster App Team`

    Select the Silver (Free) API Product that is available for subscription.

    ![image alt text](./media/CreateAppFormWithTeam.png)

4. You will find that an API Key/Secret pair has been generated for your newly created App. You can now use this API Key to test the API.

   ![image alt text](./media/TeamAppOverview.png)

5. Navigate to the API Catalog, select the Silver API Product docs.

   ![image alt text](./media/SilverAPIsCatalog.png)

6. Select the GET `/products` resource. Click on the **Authorize** button and select the newly created Team App's credentials to set authorization information (API Key) for the API call. Then click **Authorize** within the popup.

   ![image alt text](./media/SilverAPIsCatalogAuthorize1.png)

   Click **OK** after authorization information is set.

   ![image alt text](./media/SilverAPIsCatalogAuthorize2.png)

   Now, click **Execute**. You will see that a valid 200 OK API response is received.

   ![image alt text](./media/TeamAuthorizedDocsTestResult.png)

# Lab Video

If you would rather watch a video that covers this topic, point your browser [here](https://youtu.be/_gDpzDJPNQg).

# Earn Extra-points

* Add a second product to the portal and test it by launching the Live Portal.

* Update your API specification, and then [take a snapshot](https://docs-new.apigee.com/publish-apis#take-snapshot) of the specification to update the portal documentation. 

# Quiz

1. What are two reasons why you might publish multiple API products to the Developer Portal?

2. Changes made to OpenAPI Specification are made available in the Developer Portal automatically.  True or False?

# Summary

You’ve learned how to do the following:

* Deploy the Apigee Lightweight Developer Portal

* Publish an API Product with an OpenAPI Specification

* Use the Developer Portal UI to browse the OpenApi Specification Snapshot as a developer.

# Rate this lab

How did you link this lab? Rate [here](https://goo.gl/forms/j33WG2U0NFf02QHi1).

Now go to [Lab-4](../Lab%205)
