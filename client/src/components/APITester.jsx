
import React, { useState , useEffect} from "react";
import axios from "axios"

function APITester() {

  const isLocal = false
  const hostname = isLocal ? `localhost` : `129.213.145.105` 
  const port = 8000

  const http = `http://${hostname}:${port}`

  const [request, setRequest] = useState("")
  const [response, setResponse] = useState("")
  const [hasError, setError] = useState("")
  const [form, setForm] = useState({
    id: "",
    type: "",
    template: "",
    json: "",
    name: "",
    tag: "",
    status: "",
    email: "",
    password: "",
    passwordVerify: "",
    verificationCode: "",
    code: "",
    loginToken: "",
    newUsername: "",
    newEmail: ""
    
  });
  const requests = [
    // "getUserMaps(id)",
    // "getAllMaps()",
    // "getMapJsonById(id)",
    // "createNewMap(type, template, json)",
    // "createDuplicateMapById(id)",
    // "createForkMapById(id)",
    // "deleteMapById(id)",
    // "updateMapNameById(id, name)",
    // "updateMapTag(id, tag)",
    // "updateMapPublishStatus(id, status)",
    // "updateMapJson(id, json)",
    "getLoggedIn()",
    "loginUser(email, password)",
    "logoutUser()",
    "registerUser(username, email, password, passwordVerify)",
    "requestReset(email)",
    "updatePasscode(email, password, passwordVerify, verificationCode)",
    "verifyCode(code)",
    "updateUsername(loginToken, newUsername)",
    "updateEmail(loginToken, newEmail)",
    "deleteAccount(loginToken)"
  ];

  useEffect(() => {
    // This code will execute whenever hasError changes
    // You can add any additional logic you want here
  }, [request, response, form, hasError ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("")
    setResponse("")
    try {
      let response;
      switch (request.request) {

        case `getMapById(id)`:
          response = await axios.get(`${http}/api/map${form.id}`);
          break;

        case `getUserMaps(userId)`:
          response = await axios.get(`${http}/api/user${form.userId}`);
          break;

        case `getAllMaps()`:
          response = await axios.get(`${http}/api/allmap`);
          break;

        case `getMapJsonbyId(id)`:
          response = await axios.get(`${http}/api/mapjson${form.id}`);
          break;

        case `createNewMap(type, template, json)`:
          response = await axios.post(`${http}/api/newmap`, {
            type: form.type,
            template: form.template,
            json: form.json
          });
          break;

        case `createDuplicateMapById(id)`:
          response = await axios.post(`${http}/api/duplicatemap`, {
            id: form.id
          });
          break;

        case `createForkMapById(id)`:
          response = await axios.post(`${http}/api/forkmap`, {
            id: form.id
          });
          break;

        case `deleteMapById(id)`:
          response = await axios.delete(`${http}/map/${form.id}`);
          break;

        case `updateMapNamebyId(id, name)`:
          response = await axios.put(`${http}/mapname/${form.id}`, {
            name: form.name
          });
          break;

        case `updateMapTag(id, tag)`:
          response = await axios.put(`${http}/maptag/${form.id}`, {
            tag: form.tag
          });
          break;

        case `updateMapPublishStatus(id, status)`:
          response = await axios.put(`${http}/mapstatus/${form.id}`, {
            status: form.status
          });
          break;

        case `updateMapJson(id,json)`:
          response = await axios.put(`${http}/mapjson/${form.id}`, {
            json: form.json
          });
          break;
        case `getLoggedIn()`:
          response = await axios.get(`${http}/auth/loggedIn`);
          console.log(response)
          break;

        case `loginUser(email, password)`:
          response = await axios.post(`${http}/auth/login`, {
            email: form.email,
            password: form.password
          });
          break;

        case `logoutUser()`:
          response = await axios.post(`${http}/auth/logout`);
          break;

        case `registerUser(username, email, password, passwordVerify)`:
          response = await axios.post(`${http}/auth/register`, {
            username: form.username,
            email: form.email,
            password: form.password,
            passwordVerify: form.passwordVerify
          });
          break;

        case `requestReset(email)`:
          response = await axios.post(`${http}/auth/reset`, {
            email: form.email
          });
          break;

        case `updatePasscode(email, password, passwordVerify, verificationCode)`:
          response = await axios.post(`${http}/auth/updatePass`, {
            email: form.email,
            password: form.password,
            passwordVerify: form.passwordVerify,
            verificationCode: form.verificationCode
          });
          break;

        case `verifyCode(code)`:
          response = await axios.post(`${http}/auth/verifyCode`, {
            code: form.code
          });
          break;

        case `updateUsername(loginToken, newUsername)`:
          response = await axios.post(`${http}/auth/updateUsername`, {
            loginToken: form.loginToken,
            newUsername: form.newUsername
          });
          break;

        case `updateEmail(loginToken, newEmail)`:
          response = await axios.post(`${http}/auth/updateEmail`, {
            loginToken: form.loginToken,
            newEmail: form.newEmail
          });
          break;

        case `deleteAccount(loginToken)`:
          response = await axios.post(`${http}/auth/deleteAccount`, {
            loginToken: form.loginToken
          });
          break;


        default:
          console.error(`Invalid request`);
          return;
      }
      
      const combinedData = {
        status: response.status,
        data: response.data
      };
      setResponse(combinedData)

      console.log(`Response:`, JSON.stringify(combinedData, null, 2));
    } catch (error) {
      setError(error.message)
      console.log(`Error:`, error.message);
    }

    setForm(prevState => {
      const newState = { ...prevState };
      for (const key in newState) {
        if (newState.hasOwnProperty(key) && key != "name") {
          newState[key] = "";
        }
      }
      return newState;
    });

  };
  const updateField = (e) => {
    if (e.target.name == "request") {
      setRequest({
        [e.target.name]: e.target.id
      });

    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    }

  };


  const renderTextInputFields = () => {
    if (request) {
      if (request.request.indexOf("()") == -1) {
        const params = request.request.match(/\(([^)]+)\)/)[1].split(", ");
        return params.map(param => (
          <div key={param}>
            <label htmlFor={param}>{param}</label>
            <input
              type="text"
              id={param}
              name={param}
              onChange={updateField}
            />
          </div>
        ));
      }
    }
    return null;
  };

  const radioInputs = requests.map((request, index) => (
    <div key={index}>
      <input
        style={{ height: "20px", width: "20px" }}
        type="radio"
        id={request}
        name="request"
        onChange={updateField}
      />
      <label htmlFor={`request${index}`}>{request}</label><br />
    </div>
  ));

  return (
    <>
      <h1>API Tester</h1>
      <form onSubmit={handleSubmit}>
        <p>Please select API Request:</p>
        {radioInputs}

        {renderTextInputFields()}
        <input type="submit" value="Submit" />
        <p style={{ whiteSpace: `pre-line` }}>{JSON.stringify(response, null, "\t")}</p>
        <p >{hasError}</p>
      </form>
    </>
  );

}

export default APITester;
