const express=require('express');
const Web3=require('web3');
const app=express();
      app.use(express.json());
const ethNetwork='https://ropsten.infura.io/v3/dc7dd373dbc94e4d9bd5ab839904e419';
const PRIVATE_KEY = '71e159c94a7b93a21e2ad7d394673e7f0887fea689fce951f49ae9f0a790bbc4';
//const ContractDepId='0x72DCCbe2D5542917590C9d6a2fF17B0724365793';
const ContractDepId='0x23C8AF8f244535c0aBe04aC441245806FB9e50dF';
const BankId='0x4C2E9c0930b01389d522B6a4B9a8fc09859dCD4D';
const GAS='3000000';
const web3= new Web3(new Web3.providers.HttpProvider(ethNetwork));
const abi=require('./ABI');
const Accounts = require('web3-eth-accounts');

// Server is running on port 3000
app.listen(3000,()=>console.log('Server is running on port 3000'))
/*****************************************************DEV ROUTES**************************************************************/
// DEV ROUTE - to check running status of API
app.get('/',(req,res)=>{
    res.json({"message":"Api is running on cypher server"})
})
// DEV ROUTE - to check contract deployment balance
/*app.get('/contractdepbel',(req,res)=>{
    web3.eth.getBalance(ContractDepId,async(err,result)=>{
        if(err){console.log(err);return;}
        let balance=web3.utils.fromWei(result,"ether");
        console.log(balance+"ETH");
        res.json({"Contract_Deployment_Balance": balance+"ETH"})
    })
   
})

*/



var contract= new web3.eth.Contract(abi,ContractDepId);
//console.log(contract);
app.get('/contractabi',(req,res)=>{
    res.json(abi)
})

/////////////////////////////////////
console.log("\n***********************\n");
// contract.methods.balanceOf(BankId).call().then((result)=>{
//     console.log("result= "+ result);
// }).catch((err)=>{console.log("ERROR :"+err);})
// contract.methods.name().call().then((result)=>{
//     console.log("name= "+ result);
// }).catch((err)=>{console.log("ERROR :"+err);})
// contract.methods.symbol().call().then((result)=>{
//     console.log("Symbol= "+ result);
// }).catch((err)=>{console.log("ERROR :"+err);})
// contract.methods.decimals().call().then((result)=>{
//     console.log("decimals= "+ result);
// }).catch((err)=>{console.log("ERROR :"+err);})
//web3.eth.handleRevert=true;
web3.eth.accounts.wallet.add(PRIVATE_KEY)
const account = web3.eth.accounts.wallet[0].address
console.log(account);

///////////////////transfer///////////////////////
     app.get('/test',(req,res)=>{
        contract.methods.transfer('0x01B7Ca9BFf093C69A1F8dA64735A1DBf01B27207','50').send({from: account, gas: GAS}).then((result)=>{
            console.log(result.status)
            res.send(result);
           })
            .catch((err)=>{console.log(err);})
       
    })
///////////////////////transferfrom//////////////////////////
  /*  contract.methods.transferFrom('0x01B7Ca9BFf093C69A1F8dA64735A1DBf01B27207','0x40E767878739529D5D244B3cbd4bC6a2e9438365','30').send({from: account, gas: GAS}).then((result)=>{
        console.log("transfer from :"+result.status)
       })
        .catch((err)=>{console.log("transfer from :"+err);})*/
///////////////////////////burn////////////////////////////////
/*contract.methods.burn('5').send({from: account, gas: GAS}).then((result)=>{
    console.log("burn :"+result.status)
   })
    .catch((err)=>{console.log("transfer from :"+err);})*/

///////////////////////////burnfrom////////////////////////////////
/*contract.methods.burnFrom('0x01B7Ca9BFf093C69A1F8dA64735A1DBf01B27207','15').send({from: account, gas: GAS}).then((result)=>{
    console.log("burn from :"+result.status)
   })
    .catch((err)=>{console.log("burn from :"+err);}) */



/*****************************************************PRODUCTION ROUTES**************************************************************/
// Production Route - to get all details from bank
app.get('/getBankDetails',(req,res)=>{ 
   // res.json({"Name":"Api is running on cypher server"})
   let TOKENNAME,TOKENSYMBOL,DECIMALUNITS,TOTALSUPPLY;
 
    contract.methods.name().call().then((result)=>{
    //res.send(result);
    TOKENNAME=result;
    console.log("name= "+ result);
    }).catch((err)=>{
    TOKENNAME=err;
    console.log("ERROR :"+err);
    let formaterror=`{"errorcode" :"GBD1","message" : "${err}"}`
    console.log(JSON.parse(formaterror));
    res.json(JSON.parse(formaterror));
    })


    contract.methods.symbol().call().then((result)=>{
    //res.send(result);
    TOKENSYMBOL=result;
    console.log("Symbol= "+ result);
    }).catch((err)=>{
    TOKENSYMBOL=err;
    console.log("ERROR :"+err);
    let formaterror=`{"errorcode" :"GBD2","message" : "${err}"}`
    console.log(JSON.parse(formaterror));
    res.json(JSON.parse(formaterror));
    })
    

    contract.methods.decimals().call().then((result)=>{
    //res.send(result);
    DECIMALUNITS=result;
    console.log("decimals= "+ result);
    }).catch((err)=>{
    DECIMALUNITS=err;
    console.log("ERROR :"+err);
    let formaterror=`{"errorcode" :"GBD3","message" : "${err}"}`
    console.log(JSON.parse(formaterror));
    res.json(JSON.parse(formaterror));
    })

    contract.methods.totalSupply().call().then((result)=>{
    //res.send(result);
    TOTALSUPPLY=result;
    console.log("totalSupply= "+ result);
    }).catch((err)=>{
    TOTALSUPPLY=err;
    console.log("ERROR :"+err);
    let formaterror=`{"errorcode" :"GBD4","message" : "${err}"}`
    console.log(JSON.parse(formaterror));
    res.json(JSON.parse(formaterror)); 
    })

   
    function formatjson(){
        let jsonResult=`{"TokenName" : "${TOKENNAME}","TokenSymbol" : "${TOKENSYMBOL}","DecimalUnits" : "${DECIMALUNITS}","BankID" :"${BankId}","TotalSupply" :"${TOTALSUPPLY}"}`
        console.log(JSON.parse(jsonResult));
        res.json(JSON.parse(jsonResult));
    }
    setTimeout(formatjson, 5000);
    
})

// Production Route - to get user details 

app.get('/getUserDetails/:USERID',(req,res)=>{
let USERID=req.params.USERID,BALANCEOF;
console.log(USERID);

 contract.methods.balanceOf(USERID).call().then((result)=>{
 BALANCEOF=result;
 console.log("result= "+ result);
 }).catch((err)=>{
 BALANCEOF=err;
 console.log("ERROR :"+err);
 let formaterror=`{"errorcode" :"GUD","message" : "${err}"}`
 console.log(JSON.parse(formaterror));
 res.json(JSON.parse(formaterror));
})


     function formatjson(){
         let jsonResult=`{"UserId" : "${USERID}","UserBalance" : "${BALANCEOF}"}`
         console.log(JSON.parse(jsonResult));
         res.json(JSON.parse(jsonResult));
     }
     setTimeout(formatjson, 3000);

})

// Production Route - to get user Account
app.get('/createUser',(req,res)=>{

    const accounts = new Accounts(ethNetwork);
    const userAccount=web3.eth.accounts.create();
    console.log('user = '+ userAccount.address +" private key ="+userAccount.privateKey);

    function formatjson(){
        let jsonResult=`{"Address" : "${userAccount.address}","PrivateKey" : "${userAccount.privateKey}"}`
        console.log(JSON.parse(jsonResult));
        res.json(JSON.parse(jsonResult));
    }
    setTimeout(formatjson, 2000);
    

})

// Production Route - to post money from bank to user account
/*
Request
{
    "UserId" :"0x01B7Ca9BFf093C69A1F8dA64735A1DBf01B27207",
    "TransferAmmount":10
}
Response
{
    "status": "true",
    "UserId": "0x01B7Ca9BFf093C69A1F8dA64735A1DBf01B27207",
    "TransferAmmount": "10"
}

*/

app.post('/transferFromBank',(req,res)=>{
   
console.log(req.body.UserId,req.body.TransferAmmount);
let STAT1,STAT2,UID,UTA;
   contract.methods.transfer(req.body.UserId,req.body.TransferAmmount.toString()).send({from: account, gas: GAS}).then((result)=>{
        console.log(result.status)
        STAT1=result.status;
        UID=req.body.UserId;
        UTA=req.body.TransferAmmount.toString();
       })
        .catch((err)=>{console.log("Bank Transfer Error:"+err)
        let formaterror=`{"errorcode" :"TFB1","message" : "${err}"}`
                console.log(JSON.parse(formaterror));
                res.json(JSON.parse(formaterror));
        
        
        ;})



        function formatjson(){
            contract.methods.burn(UTA).send({from: account, gas: GAS}).then((result)=>{
            STAT2=result.status;
            console.log("STATUS= "+ STAT2);
            let jsonResult=`{"status1" : "${STAT1}","status2" : "${STAT2}","UserId":"${UID}","TransferAmmount":"${UTA}"}`;
            res.json(JSON.parse(jsonResult));
            console.log(JSON.parse(jsonResult));
            })
                .catch((err)=>{console.log("burn :"+err)
                let formaterror=`{"errorcode" :"TFB2","message" : "${err}"}`
                console.log(JSON.parse(formaterror));
                res.json(JSON.parse(formaterror));
                
                ;}) 
         }
         setTimeout(formatjson, 10000);







   
})



// Production Route - to post money from one User to Other account

/*
Request
{
    "FromUserId" :"0x01B7Ca9BFf093C69A1F8dA64735A1DBf01B27207",
    "ToUserId" :"0x01B7Ca9BFf093C69A1F8dA64735A1DBf01B27207",
    "TransferAmmount":10
}
Response
{
    "status": "true",
    "FromUserId": "0x01B7Ca9BFf093C69A1F8dA64735A1DBf01B27207",
    "ToUserId": "0x40E767878739529D5D244B3cbd4bC6a2e9438365",
    "TransferAmmount": "10"
}

*/

app.post('/transferBtwUsers',(req,res)=>{
   
       contract.methods.transferFrom(req.body.FromUserId,req.body.ToUserId,req.body.TransferAmmount.toString()).send({from: account, gas: GAS}).then((result)=>{
            console.log(result.status)
            let jsonResult=`{"status" : "${result.status}","FromUserId":"${req.body.FromUserId}","ToUserId":"${req.body.ToUserId}","TransferAmmount":"${req.body.TransferAmmount.toString()}"}`;
            res.json(JSON.parse(jsonResult));
           })
            .catch((err)=>{console.log(" User Transfer Error:"+err);
            let formaterror=`{"errorcode" :"TBWUS","message" : "${err}"}`
                console.log(JSON.parse(formaterror));
                res.json(JSON.parse(formaterror));
        
        })
       
})

// Production Route - to get all user money to bank and delete account

app.get('/DeleteUser/:USERID',(req,res)=>{
    let USERID=req.params.USERID,BALANCEOF,STATUS;
    console.log(USERID);
    
     contract.methods.balanceOf(USERID).call().then((result)=>{
     BALANCEOF=result;
     console.log("result= "+ result);
     }).catch((err)=>{
     BALANCEOF=err;
     console.log("ERROR :"+err);
     let formaterror=`{"errorcode" :"DELUSER1","message" : "${err}"}`
     console.log(JSON.parse(formaterror));
     res.json(JSON.parse(formaterror));
    
    })
    
         function formatjson(){
            contract.methods.burnFrom(USERID,BALANCEOF).send({from: account, gas: GAS}).then((result)=>{
            STATUS=result.status;
            console.log("STATUS= "+ STATUS);
            let jsonResult=`{"UserId" : "${USERID}","Status" : "${STATUS}"}`
            console.log(JSON.parse(jsonResult));
            res.json(JSON.parse(jsonResult));

               })
                .catch((err)=>{console.log("burn from :"+err)
                let formaterror=`{"errorcode" :"DELUSER2","message" : "${err}"}`
                console.log(JSON.parse(formaterror));
                res.json(JSON.parse(formaterror));
                
                ;}) 
         }
         setTimeout(formatjson, 3000);
    
    })
    
    //Production Route - to handle default requests

    app.get('*',(req,res)=>{
        let jsonResult=`{"errorcode" :"GETNOTFOUND","message" : "API IS NOT DEFINED FOR THIS GET ROUTE."}`
        console.log(JSON.parse(jsonResult));
        res.json(JSON.parse(jsonResult));
    })
    

    app.post('*',(req,res)=>{
        
        let jsonResult=`{"errorcode" :"POSTNOTFOUND","message" : "API IS NOT DEFINED FOR THIS POST ROUTE."}`
        console.log(JSON.parse(jsonResult));
        res.json(JSON.parse(jsonResult));
})
