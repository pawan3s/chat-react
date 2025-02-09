let baseURL =""
if (process.env.NODE_ENV === 'development'){
    baseURL = "http://localhost:8000/api/v1";
}
else{
    baseURL = "https://faith.zapto.org/api/v1";
}


export default baseURL;
