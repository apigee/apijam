# Apigee Service Broker Microgateway Buildpack Decorator: Secure a CF App 

*Duration : 45 mins*

*Persona : API Team*

# Use case
You have an API Created in Pivotal Cloud Founday. You want to proxy it through Apigee Edge Microgateway

The [Apigee Edge Service Broker for PCF](http://docs.pivotal.io/partners/apigee/index.html) enables developers to manage APIs for their PCF apps through the Apigee Edge management console.

This lab describes how to use a Microgateway Decorator to secure a sample app depoyed Pivotal Cloud Foundry (PCF). 

# Pre-requisites
* You have [installed and configured](https://docs.pivotal.io/pcf-dev/) PCFDev

* You have [installed and configured](https://github.com/apigee/pivotal-cf-apigee/tree/master/apigee-cf-service-broker#step-2-install-the-apigee-service-broker-from-source) the Apigee Edge Service Broker. Or you got a set of credentials from your instructor that has access to a PCF environment with Apigee Edge Service Broker for PCF tile. 

* You have installed [cf CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html).

* Read about Cloud Foundry buildpacks and decorators [here](https://github.com/cf-platform-eng/meta-buildpack)

* You have an Apigee account and have access to an Apigee org

* You have [installed] (http://docs.apigee.com/api-services/content/using-oauth2-security-apigee-edge-management-api) get_token utility

# Instructions

Before you begin, you will need to get the following from your PCF instance or receive them from your instructor.

YOUR-SYSTEM-DOMAIN: This the the domian/hostname where the PCF is deployed. If you are using self signed certs for this endpoint, you will have to use `--skip-ssl-validation` for some of the commands

PCF-USER-NAME: PCF username

PCF-PASSWORD: PCF Password


0. Setup Environment Variables
   ```
   export PCF_DOMAIN=local.pcfdev.io
   export ORG={org-name}
   export ENV={env-name}
   ```

1. Login to the PCF Environment
	Open Shell (CLI for windows). CD to your working directory

	```
	cf login -a https://api.local.pcfdev.io --skip-ssl-validation -u admin -p admin
	```

2. Deploy a sample App to PCF
   ```
   git clone https://github.com/spring-guides/gs-rest-service.git
   cd gs-rest-service/complete
   ```
   You must modify the `manifest.yaml` file with the changes shown below.
   ```
   name: spring_hello
   domain: local.pcfdev.io

   env:
     JBP_CONFIG_JAVA_MAIN: '{arguments: "--server.port=8090"}'
   ```

   Build the jar file:
   ```
   ./gradlew build
   ```
   Install the Diego plugin
   ```
   cf add-plugin-repo CF-Community https://plugins.cloudfoundry.org/
   cf install-plugin Diego-Enabler -r CF-Community
   ```
   Push the application
   ```
   cf push --no-start -m 512M
   cf enable-diego spring_hello
   ```

3. Upload meta-buildpack decorator to PCF Dev
   ```
   git clone https://github.com/cf-platform-eng/meta-buildpack.git
   cd meta-buildpack
   ./build
   ./upload
   ```
   
4. Upload the Apigee Microgateway decorator to PCF Dev
   ```
   git clone https://github.com/swilliams11/edgemicro-decorator.git
   cd edgemicro-decorator
   ./upload
   ```
   
5. Create the Edge Microgateway User Defined Service Instance
   ```
   cf cups edgemicro_service -p '{"application_name":"edgemicro_service", "org":"'$(echo $ORG)'", "'$(echo $ENV)'":"", "user":"CHANGE","pass":"CHANGE", "nodejs_version_number": "6.10.2", "edgemicro_version":"2.4.6", "edgemicro_port":"8080", "onpremises": "false", "tags": ["edgemicro"]}'
   ```

6. Restart the CF App
   ```
   cf restart spring_hello
   ```

7. Test the service
   ```
   curl http://rest-service.local.pcfdev.io/edgemicro_hello
   ```
   This call should fail because the CF app is secured by Microgateway.
   
8. Test the service with API Key
   ```
   curl http://rest-service.local.pcfdev.io/edgemicro_hello -H "x-api-key: {api key}"
   ```

# Lab Video

If you are lazy and don’t want to implement this use case, it’s OK. You can watch this short video. Guess what, the lab owner is equally lazy. We will update the lab video soon!

# Summary

In this lab you have added API Management via Cloud Foundry Decorator (Buildpack) to an API deployed on CLoud Foundry.

# References

* Link to Apigee docs page
    * [Microgateway](http://docs.apigee.com/microgateway/content/edge-microgateway-home)
	* [Apigee Service Broker](https://apigee.com/about/tags/pivotal-cloud-foundry)

# Rate this lab

How did you link this lab? Rate [here](https://drive.google.com/open?id=1L95jU79wmOP-rHVY2Laba8lApZpS-yztwdONz0nCzWs).
