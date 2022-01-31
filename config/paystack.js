const paystack = (request) => {
    const MySecretKey = 'sk_test_57a8212c9c3c5f470b979f9ce8026e12894fe990';
    // sk_test_xxxx to be replaced by your own secret key

   const initializePayment = (form, mycallback) => {    
    const options = {
        url : 'https://api.paystack.co/transaction/initialize',
        headers : {
            authorization: MySecretKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
        },
       form
    }
    const callback = (error, response, body)=>{
        return mycallback(error, body);
    }
    request.post(options,callback);
   }


   const verifyPayment = (ref, mycallback) => {
    const options = {
        url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
        headers : {
            authorization: MySecretKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
       }
    }
    const callback = (error, response, body)=>{
        return mycallback(error, body);
    }
    request(options,callback);
   }
   return {initializePayment, verifyPayment};
}


module.exports = paystack
