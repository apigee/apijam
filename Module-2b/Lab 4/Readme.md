# **API Security : JWT**

*Duration : 15 mins*

*Persona : API Team/Security*

# **Use case**

You have an API that is consumed by third parties. You want to secure that API using JWT.

# **How can Apigee Edge help?**

[https://docs.apigee.com/api-platform/reference/policies/jwt-policies-overview](https://docs.apigee.com/api-platform/reference/policies/jwt-policies-overview)

# **Pre-requisites**

* You have completed [Lab 1](https://github.com/aliceinapiland/AdvancedVirtualAPIJam/tree/master/SecurityJam/Lab%201%20Traffic%20Management%20-%20Throttle%20APIs). If not, please complete that first.

# **Instructions**

* Go to [https://apigee.com/edge](https://apigee.com/edge) and log in. This is the Edge management UI.

* Select Admin → Environments in the side menu

![image alt text](./media/image_0.png)

* Select Key Value Maps tab, change Environment Configuration to "test’, and click **+Key Value Map**:

![image alt text](./media/image_1.png)

* Type "jwt-secret-key" (must be this name exactly) in the text box and click **Add**:

![image alt text](./media/image_2.png)

* Now that the key value map is created, add a Shared Secret (key: secret, value: Apigee123 or your choice) to it as shown:

![image alt text](./media/image_3.png)

* This shared secret will be used to both generate and verify JWT tokens using the HS256 algorithm.

* Go to Develop → Api Proxies:

![image alt text](./media/image_4.png)

* Click the **+Proxy** button on the top-right corner to invoke the Create Proxy wizard.

![image alt text](./media/image_5.png)

* Select **Proxy Bundle** and then click **Next** to import an existing proxy form a zip archive.

![image alt text](./media/image_6.png)

* Download the Apigee proxy "**JWT.zip**" that generates and verifies JWT’s [here](https://github.com/aliceinapiland/AdvancedVirtualAPIJam/blob/master/SecurityJam/Lab%204%20-%20JWT/JWT.zip?raw=true).  Then click "**Choose File**", select the “**JWT.zip**” file you just downloaded and click **Next**:

![image alt text](./media/image_7.png)

* Click **Build**.

* You should see a successful "Uploaded proxy" message..  Click on the link to the JWT proxy near the bottom of the page.

* Deploy the JWT proxy by clicking on the **Deployment** dropdown and selecting the **test** environment.

* Click on the **Develop** tab.

* You can see that the JWT proxy has two proxy endpoints: **Generate JWT** (/token) to generate a JWT, and **Verify JWT** (/verify) to verify a JWT.  Check both flows and read the XML policies to get a deeper understanding of how they work. (reference links available at the end of the lab)

![image alt text](./media/image_8.png)

* Start by turning on **Trace** for the JWT proxy.

* Then use the Apigee Rest Client: [https://apigee-rest-client.appspot.com/](https://apigee-rest-client.appspot.com/)

* POST to https://**{your-org-name}**-test.apigee.net/v1/jwt/token

![image alt text](./media/image_9.png)

* You should see a token received in HTTP response.  Copy the token value (except for the " “) and review the Trace tool to understand what happened.

* Go to [http://jwt.io](http://jwt.io) and paste the token in the Encoded Window (ensure the algorithm is HS256).  Also type the shared secret (e.g. **Apigee123** unless you changed it) in the Verify Signature box:

![image alt text](./media/image_10.png)

* Now verify the token.  Use the same Apigee REST tool to do so

* POST to https://**{your-org-name}**-test.apigee.net/v1/jwt/verify

* In the Header, put "token" and its value

![image alt text](./media/image_11.png)

* If you get a 200 return code, the JWT is valid (as expected).  Again, review the Trace tool to understand what happened.  You can also try to tamper with the JWT (add/remove characters) and invoke the same API call again.  What happens?

# **Earn Extra-points**

Change the JWT token generation policy to include [additional claims](https://docs.apigee.com/api-platform/reference/policies/generate-jwt-policy#additionalclaimsclaim) (iss, aud, sub, extra claims) in it, to see how the behavior changes.

# **Summary**

* In this lab, you learned how to use Apigee's out of the box JWT policies to both generate and verify a JWT.  Now you can use these policies to actually secure an API using JWT security.  To do so, you would first want to authenticate a user against their IdP (which also contains "claims" about that user/principal) before calling GenerateJWT and issuing the JWT with claims back to that user (for simplicity, we skipped the user authentication step in this lab and hard coded the claims). The API that is protected would invoke VerifyJWT (either directly or via an Apigee endpoint) to verify the JWT and read/verify its claims.

# **References**

* [Apigee Edge JWT token support explained in 4 minutes](https://youtu.be/mY5B6YlpkAY)

* [Apigee Edge JWT Policies Overview](https://docs.apigee.com/api-platform/reference/policies/jwt-policies-overview)

* [Adding Additional Claims to your JWT](https://docs.apigee.com/api-platform/reference/policies/generate-jwt-policy#additionalclaimsclaim)

Now go to [Lab 5](https://goo.gl/6S2iJr).
