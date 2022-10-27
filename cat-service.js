/**
* Implementation for CatalogService defined in ./cat-service.cds
*/
const cds = require('@sap/cds')
const { retrieveJwt } = require("@sap-cloud-sdk/core")

function getJWT(req){
    if(typeof req._ !== "undefined"){
        var dfsa = retrieveJwt(req._.req)
        console.log("jwt token reqw"+dfsa);
        return retrieveJwt(req._.req);
    } else {
        return "";
    }

}
module.exports = function (){
  // Register your event handlers in here, e.g....
  this.after ('READ','Books', async each => {
    if (each.stock > 111) {
      each.title += ` -- 11% discount!`
      
    }
  })

  this.before ('CREATE','Student',async (request)=>{
    const StudentStatus = "my.bookshop.StudentStatus"
      
       if (request.data.gender == "Male"){
           request.data.title = 'Mr.';
       } else {
           request.data.title = "Mrs.";
       }


    // insert into table
    try 
    {
        let hdb = await cds.connect.to("db");
        let tx = hdb.tx();
        var data = 
            {
                STDID: request.data.STDID,
                active: true
            }
        ;

        await tx.run(
            INSERT.into(StudentStatus, [
                data
             ]));
        await tx.commit();

    } catch(err){
        console.log("data inser Error" + err);
    }



       // start workflow using destination at subaccount level(destination name is specified in package.json file inside cds.requires)

       
       const workflow = await cds.connect.to('workflowService')
       try {
       
        const response = await workflow.tx(request).post('/v1/workflow-instances', {
             "definitionId": "bpm_wf_001",
             "context": {
                 "property": request.data.STDID,
             }
         }).then(function(success){
             request.data.name = success.id;
             console.log("Success from package destination");
         })
       } catch (error) {
           console.log(error);
       }


  



       
       try {
        const core = require("@sap-cloud-sdk/core");
        const xsenv = require("@sap/xsenv");
        xsenv.loadEnv();

        const sDestinationName = "wf_oauth_cc_sdk";

       var jwt = getJWT(request);
       
        let wfResponse = await core.executeHttpRequest(
        { destinationName: sDestinationName , jwt: jwt},
        {
            method: "POST",
            url: "/v1/workflow-instances",
            headers: "Content-Type : application/json",
            data: {
                "definitionId": "bpm_wf_001",
                "context": {
                    "property": request.data.STDID,
                }
            },
        },{fetchCsrfToken: true}
        ).then(function(success){
            if(success){
                console.dir(success.data);
                request.data.name = String(success.data.id);
                console.log("Success from sdk core destination");
            } else{
                console.log("No Success Param");
            }
        }).catch(function(oerror){
            console.log("wf call error" + oerror);
        })
       } 
    catch (error) {
        request.data.name = "Error";
        console.log(error);
       }


    

       


    //    try {
    //     const {SapCfAxios} = require('sap-cf-axios');
    //     const destinationName = "wf_oauth_cc";
    //     const axios = SapCfAxios(destinationName);
    //     const configAxi = {
    //         method: "post",
    //         url: '/v1/workflow-instances',
    //         headers: {
    //             "content-type": "application/json"
    //           },

    //         data:  {
    //             "definitionId": "bpm_wf_001",
    //             "context": {
    //                 "property": request.data.STDID,
    //             }
    //         }
    //     }
        
    //     const response = await axios(configAxi);
           
    //    } catch (error) {
           
    //    }

    //    try {
    //     var axios = require("axios");
    //     var oPayload = 
    //     {
    //         "definitionId": "bpm_wf_001",
    //         "context": {
    //             "property": request.data.STDID,
    //         }
    //     };
    //     var config = 
    //     {
            
    //         method: "post",
    //         url: workflow + "/v1/workflow-instances",
    //         headers: 
    //         {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //         data: JSON.stringify(oPayload),
    //         headers: {
    //             // "X-CSRF-Token": token,
    //             "Content-Type": "application/json"
    //         },
    //         async: false,
    //         };

    //         axios(config)
    //         .then(function (response) 
    //         {
    //             console.log(respone);
    //         }).catch(function (oError){
    //             console.log(oError);
    //         })
        
    //    } catch (error) {
           
    //    }
      
})
}