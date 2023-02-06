import axios from "axios";


const BASE_URL = 'http://localhost:8081/rest/user';




class fetchUserData {

    // GET ALL USER DATA





getAllUser(token){
    return axios.get(BASE_URL+"/data" ,{
        headers:{'Authorization': token,         	dataType: "json",
            contentType: "application/json"}}
    )
}


    // UPDATE USER DATA (         "generalNickname": null,
    //         "gameNickname": null,
    //         "rating": null,
    //         "teamName": null,
    //         "rank": null,
    //         "games)


     updateUserName (name){
        return axios.put(BASE_URL + "/update/name/" + name)
    }

     updateUserEmail (email){
        return axios.put(BASE_URL + "/update/email/" + email)
    }


 /*    getIdByEmail = async (token) => {
        try {
            const config = {headers : {'Authorization' : token}};
            console.log(token)
            const response = await axios.get(BASE_URL+ '/getId/a@a.com', config);
            if (response.status === 200) { // response - object, eg { status: 200, message: 'OK' }
                console.log('success stuff');
                return true;
            }
            return false;
        } catch (err) {
            console.error(err)
            return false;
        }
    }*/






    getIdByEmail(email, token){
        return axios.get(BASE_URL + '/getId/' + email, {
            headers: {

                'Content-Type': 'application/json'
            }})
    .then(res => {
            return res.data;
        })
            .catch(error => console.log(error))
    }



    getUserById(userId,token){
        return axios.get(BASE_URL + '/dataUser/' + userId, {
            headers:{'Authorization': token,         	dataType: "json",
                contentType: "application/json"}}
        )
    }






/*
    upUsr(id, gameNickname, generalNickname,rank,token){
        return axios.put(BASE_URL + '/update/'+id,
            gameNickname,generalNickname, rank
            + {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json;charset=utf-8'
            }})
            .then(res => {
                console.log('profile is:', res.data);
            })
            .catch(error => console.log(error))
    }*/

     deleteEmployee (customerId){
        return axios.delete(BASE_URL + '/' + customerId);
    }

    /*    signup(name,email,password){
            return axios.get(BASE_URL + '/signup/' + name, email, password);

        }*/


}

export default new fetchUserData();
