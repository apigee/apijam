# Apigee Edge Service Broker - Microgateway Plan: Create an API Proxy 

*Duration : 45 mins*

*Persona : API Team*

# Use case
You have an API Created in Pivotal Cloud Founday. You want to proxy it through Apigee Edge Microgateway

The [Apigee Edge Service Broker for PCF](http://docs.pivotal.io/partners/apigee/index.html) enables developers to manage APIs for their PCF apps through the Apigee Edge management console.

This lab describes how to push a sample app to Pivotal Cloud Foundry (PCF), create an Apigee Edge Microgateway service instance, and bind the application to it. After binding the application to the Apigee Edge service instance, requests to the app will be forwarded to an Apigee MIcrogateway for API management. 

# Pre-requisites
* You have [installed and configured](https://docs.pivotal.io/pcf-dev/) PCFDev

* You have [installed and configured](https://github.com/apigee/pivotal-cf-apigee/tree/master/apigee-cf-service-broker#step-2-install-the-apigee-service-broker-from-source) the Apigee Edge Service Broker. Or you got a set of credentials from your instructor that has access to a PCF environment with Apigee Edge Service Broker for PCF tile. 

* You have installed [cf CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html).

* You have an Apigee account and have access to an Apigee org

* Configure Microgateway on a VM or host outside of the intended deployment pattern. This will produce a configuration YAML file that will be used in all of the following deployment options. The configuration file is of the format: {orgname}-{env}-config.yaml

* Enable plugins as necessary in the YAML file. Configure and set other parameters as necessary (log levels and connection settings, for example).

* You have [installed] (http://docs.apigee.com/api-services/content/using-oauth2-security-apigee-edge-management-api) get_token utility

* Develop custom plugins as npm modules. Installation of npm modules can be done via a public npm repo (npm.org) or a private npm repo

# Instructions

Before you begin, you will need to get the following from your PCF instance or receive them from your instructor.

YOUR-SYSTEM-DOMAIN: This the the domian/hostname where the PCF is deployed. If you are using self signed certs for this endpoint, you will have to use `--skip-ssl-validation` for some of the commands

PCF-USER-NAME: PCF username

PCF-PASSWORD: PCF Password

PCF_ORG: The instance of your PCF deployment. If you are familiar with PCF, you may just refer to this as ORG. Since Apigee also as a concept of ORG, we will call this PCF_ORG for this lab

PCF_SPACE: An org can contain multiple spaces. This is the space you will pick for this lab

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
	We will use a sample hello world node.js app from this [git repo](https://github.com/apigee/pivotal-cf-apigee)

	```
	git clone https://github.com/apigee/pivotal-cf-apigee.git

	cd pivotal-cf-apigee/sample-api
	```
	
	Open manifest.yml file and change the following paramaters
	
	```
	vi manifest.yml
	name: sampleapi
	host: sampleapi
	```

    export PCF host
    ```
    export PCF_APPHOST=sampleapi
    ```

	Push the API to PCF
	
	```
	cf push
	```
	
	On successful push, you should be able to see your app with the following command
	
	```
	cf apps
    Using manifest file /Users/srinandans/workspace/pivotal-cf-apigee/sample-api/manifest.yml

    Creating app sampleapi in org pcfdev-org / space pcfdev-space as admin...
    OK

    Creating route sampleapi.local.pcfdev.io...
    OK

    Binding sampleapi.local.pcfdev.io to sampleapi...
    OK

    Uploading sampleapi...
    Uploading app files from: /Users/srinandans/workspace/pivotal-cf-apigee/sample-api
    Uploading 3.9K, 6 files
    Done uploading
    OK
    …
    requested state: started
    instances: 1/1
    usage: 128M x 1 instances
    urls: sampleapi.local.pcfdev.io
    last uploaded: Fri Jul 21 15:47:38 UTC 2017
    stack: cflinuxfs2
    buildpack: nodejs_buildpack

     state          since                    cpu    memory          disk            details
     #0   running   2017-07-21 11:47:58 AM   0.0%   57.8M of 128M   42.1M of 512M	
	```

3.  Test sample application
    ```
	curl sampleapi.local.pcfdev.io
	{"hello":"hello from cf app"}
	```

4. Install the Cloud Foundry Apigee Service Broker
   ```
   git clone https://github.com/apigee/pivotal-cf-apigee.git
   cd pivotal-cf-apigee/apigee-cf-service-broker
   
   npm install .

   cf set-env apigee-cf-service-broker SECURITY_USER_NAME admin
   cf set-env apigee-cf-service-broker SECURITY_USER_PASSWORD admin
   cf restage apigee-cf-service-broker
   ```
   
5. Create Cloud Foundry Apigee Service Broker
   ```
   cf create-service-broker apigee-edge admin admin https://apigee-cf-service-broker.local.pcfdev.io
   Creating service broker apigee-edge as admin...
   OK
   ```

6. Enable Cloud Foundry Apigee Service Broker
   ```
   cf enable-service-access apigee-edge
   Enabling access to all plans of service apigee-edge for all orgs as admin...
   OK
   ```
   
7. List Cloud Foundry Marketplace
   ```
   cf marketplace
   Getting services from marketplace in org pcfdev-org / space pcfdev-space as admin...
   OK

   service        plans               description
   apigee-edge    org, microgateway   Apigee Edge API Platform
   local-volume   free-local-disk     Local service docs: https://github.com/cloudfoundry-incubator/local-volume-release/
   p-mysql        512mb, 1gb          MySQL databases on demand
   p-rabbitmq     standard            RabbitMQ is a robust and scalable high-performance multi-protocol messaging broker.
   p-redis        shared-vm           Redis service to provide a key-value store

   TIP:  Use 'cf marketplace -s SERVICE' to view descriptions of individual plans of a given service.
   ```
   
   ```
   cf marketplace -s apigee-edge
   Getting service plan information for service apigee-edge as admin...
   OK

   service plan   description                                   free or paid
   org            Apigee Edge for Route Services                free
   microgateway   Apigee Edge microgateway for Route Services   free
   ```

8. Create Service
   ```
   cf create-service apigee-edge microgateway microgateway
   Creating service instance microgateway in org pcfdev-org / space pcfdev-space as admin...
   OK
   ```
   
   ```
   cf service microgateway

   Service instance: microgateway
   Service: apigee-edge
   Bound apps:
   Tags:
   Plan: microgateway
   Description: Apigee Edge API Platform
   Documentation url: http://apigee.com/docs/
   Dashboard: https://enterprise.apigee.com/platform/#/

   Last Operation
   Status: create succeeded
   Message:
   Started: 2017-07-21T16:11:16Z
   Updated: 2017-07-21T16:11:16Z
   ```
   
9. Install the Apigee Microgateway App
   ```
   git clone https://github.com/apigee-internal/microgateway.git
   cd microgateway
   ```
   
   Review the manifest.yaml file and enter org, env, key and secret
   ```
   ---
   applications:
   - name: edgemicro
    memory: 512M
    instances: 1
    host: edgemicro
    path: .
    buildpack: nodejs_buildpack
    env: 
      EDGEMICRO_KEY: 'bx..x2'
      EDGEMICRO_SECRET: 'ex..x0'
      EDGEMICRO_CONFIG_DIR: '/app/config'
      EDGEMICRO_ENV: 'env-name'
      EDGEMICRO_ORG: 'org-name'
   ```
   
   Copy the {org}-{env}-config.yaml file to the microgateway/config folder.

   Add the “cloud-foundry-route-service” plugin to the config file if it doen’t exist in the plugin sequence.
   ```
   max_connections: 1000
     plugins:
       sequence:
         - oauth
         - cloud-foundry-route-service   
   ```
 
   ```
   cf push
   
   Using manifest file /Users/srinandans/workspace/microgateway/manifest.yml

   Updating app edgemicro-app in org pcfdev-org / space pcfdev-space as admin...
   OK
   …
   App edgemicro-app was started using this command `npm start`

   Showing health and status for app edgemicro-app in org pcfdev-org / space pcfdev-space as admin...
   OK

   requested state: started
   instances: 1/1
   usage: 512M x 1 instances
   urls: edgemicro-app.local.pcfdev.io
   last uploaded: Fri Jul 21 16:40:43 UTC 2017
   stack: cflinuxfs2
   buildpack: nodejs_buildpack

        state     since                    cpu    memory           disk             details
   #0   running   2017-07-21 12:41:56 PM   0.0%   213.8M of 512M   116.1M of 512M
   
   ```
   
10. Bind Route Service
    Obtain Token
	```
	./get_token
	```
	
    ```
    cf bind-route-service $PCF_DOMAIN microgateway --hostname $PCF_APPHOST -c '{"org":"'$(echo $ORG)'","env":"'$(echo $ENV)'", "bearer":"'$(cat ~/.sso-cli/valid_token.dat)'", "micro":"'$(echo $PCF_EMAPP)'","action":"proxy"}'

    cf bind-route-service $PCF_DOMAIN microgateway --hostname $PCF_APPHOST -c '{"org":"'$(echo $ORG)'","env":"'$(echo $ENV)'", "bearer":"'$(cat ~/.sso-cli/valid_token.dat)'", "micro":"'$(echo $PCF_EMAPP)'","action":"bind"}'   
    ```
   
11. Access Sample API
    ```
    curl sampleapi.local.pcfdev.io
    {"error":"invalid_auth","error_description":"Missing API Key header"}
    ```
	This error is expected. We have enabled the OAuth plugin on the microgateway. This expects either an API Key or a valid access token to access the API.

12. Obtain API Key and try Sample API
    ```
	curl sampleapi.local.pcfdev.io -H "x-api-key: xxxx"
	{"hello":"hello from cf app"}
	```

# Summary

In this lab you have added API Management via Microgateway to an API created in PCF.

# References

* Link to Apigee docs page
    * [Microgateway](http://docs.apigee.com/microgateway/content/edge-microgateway-home)
	* [Apigee Service Broker](https://apigee.com/about/tags/pivotal-cloud-foundry)

# Rate this lab

How did you like this lab? Rate [here](https://docs.google.com/forms/d/e/1FAIpQLScJZF-Tk9lACEFRZ2cwQ4HN3loDNoDgu8I8hxNbb4XUFooIzg/viewform?c=0&w=1).
