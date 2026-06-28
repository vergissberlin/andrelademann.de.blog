---
author: André Lademann
pubDatetime: 2023-01-05T09:00:09.000Z
title: "Custom ChatGPT with OpenAI API"
slug: custom-chatgpt-with-openai-api
featured: false
draft: false
tags:
  - chatgpt
  - vue-js
ogImage: "/images/posts/custom-chatgpt-with-openai-api/hero.png"
description: "OpenAI's API is surprisingly easy to use. It is no different from other REST APIs. So integrating AI into your own software is easy, and we will see AI being integrated into more and more applications. Be it in ticket systems, email clients, content ..."
canonicalURL: https://blog.andrelademann.de/custom-chatgpt-with-openai-api
---

OpenAI's API is surprisingly easy to use. It is no different from other REST APIs. So integrating AI into your own software is easy, and we will see AI being integrated into more and more applications. Be it in ticket systems, email clients, content management systems (CMS) or programs to help with tax returns. Wherever there is a lot of text to be written, AI will be indispensable.  
To test the integration, I developed my own chat with an AI:

[https://vergissberlin.github.io/example-openai-vuejs/](https://vergissberlin.github.io/example-openai-vuejs/)

## Wanna know how?

For a chat with a bot, all you need is a GET request that contains the request and an API key. I decided to route the request through a proxy so that I don't have to make my API key public.

**Roughly speaking, the following steps are currently necessary:**

1.  First you have to register with OpenAI and get an API key.
    
2.  then you have to install the OpenAI module for NodeJS by executing the following command: `npm install openai`.
    
3.  then you have to import the OpenAI module into the NodeJS application and initialise the API key:
    

```javascript
var openai = require('openai'); openai.apiKey = "API key";

```

1.  Now you can use the various functions of the OpenAI API by calling the appropriate methods on the OpenAI object. For example, one could generate the text of a document with the generate() method:
    
    ```javascript
     openai.generate({
         prompt: "text used as a template",
         model: "Name of the model used",
         temperature: 0.5 
     }, function(error, response) {
         if (error) console.error(error);
         else console.log(response.text);
     });
    
    ```
    
    **That's it!**
    
    ## Cost
    
    The cost of using the OpenAI API varies depending on the specific API you are using. Some of the APIs are free to use, while others have a cost associated with them. It's also worth noting that the cost of using the API may change over time. I recommend checking the pricing page on the OpenAI website for the most up-to-date information on the cost of using the API.
    
    Here is a link to the pricing page: [**https://beta.openai.com/pricing**](https://beta.openai.com/pricing)
    
    To take control of your cost, they provide a nice tool where you can set limits, and you can see the current usage:
    
    ![OpenAI usage dashboard showing daily API spend in January and a monthly limit of 12 dollars](/images/posts/custom-chatgpt-with-openai-api/img-1.png)
    
    ## Dive deeper
    
    If you want to know more about it,
    
    1.  take a look into my repo: [https://github.com/vergissberlin/example-openai-vuejs](https://github.com/vergissberlin/example-openai-vuejs)
        
    2.  Take a look into the API documentation at: [https://beta.openai.com/docs/quickstart/build-your-application](https://beta.openai.com/docs/quickstart/build-your-applicationTranslated)
