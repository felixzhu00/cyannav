getMapById(req, res){
    method: GET
      route: /api/map${id}
    response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {}
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

getUserMaps(req, res){
    method: GET
      route: /api/user${userId}
    response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {}
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

getAllMaps(req, res){
    method: GET
      route: /api/allmap
    response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {}
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

getMapJsonbyId(req, res){
    method: GET
      route: /api/mapjson${id}
      response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {}
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

createNewMap(req, res){
    method : POST
    route : /api/newmap
    response: {
          // properly formatted legal request
          status: 201 (Created)
          data: { 
                type: String,
                template: String,
                json: [{ String  }]
          }
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

createDuplicateMapById(req, res){
    method : POST
    route : /api/duplicatemap
    response: {
          // properly formatted legal request
          status: 201 (Created)
          data: { 
                id:id
          }
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

createForkMapById(req, res){
  method : POST
    route : /api/forkmap
    response: {
          // properly formatted legal request
          status: 201 (Created)
          data: { 
          id:id
          }
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

deleteMapById(req, res){
      method: DELETE
      route: /map/${id}
    response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {}
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

updateMapNamebyId(req, res){
    method: PUT
      route: /mapname/${id}
    response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {
                name: name
          }
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

updateMapTag(req, res){
  method: PUT
      route: /maptag/${id}
    response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {
                tag:tag
          }
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

updateMapPublishStatus(req, res){
    method: PUT
      route: /mapstatus/${id}
    response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {
                status: status
          }
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}

updateMapJson(req, res){
    method: PUT
      route: /mapjson/${id}
    response: {
          // properly formatted legal request
          status: 200 (Ok)
          data: {
                json:json
          }
    }
    response: {
          // improperly formatted request
          status: 400 (Bad Request)
          data: {errorMessage: String}
    }
    response: {
          // properly formatted but incorrect credentials
          status: 401 (Unauthorized)
          data: {errorMessage: String}
    }
}