function login() {
    let usr = localStorage.usr;
    let pwd = localStorage.pwd;

    if(usr!= null){
        console.log(`Utenti: ${usr}, Password ${pwd}`);
        window.parent.location = "form-ricerca.html";
    }else{
        alert("username o login errate");
    }

}



/*
function login() {
    //let url = "https://bkmapp.tssdev.it/resources/users/login";
    let url = "http://localhost:8080/users"
    let usr = document.querySelector("#usr").value;
    let pwd = document.querySelector("#pwd").value;
    let postdata = {
        "email": usr,
        "pwd": pwd
    };
    postdata = JSON.stringify(postdata);
    fetch(url, {
            method: "POST",
            body: postdata,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status == 401) {
                alert("username o login errate");
                //console.log = "username o login errate";
            //} else if (response.status == 400) {
            //    alert("username o login errate ");
            } else
                return response.json()
            console.log(response.json())
        })
        .then(jsonObj => {
            if (jsonObj != undefined) {
                sessionStorage.setItem("globaljwt", jsonObj.jwt);
                console.log("JWT: " + sessionStorage.getItem("globaljwt"))

                let decoded = jwt_decode(jsonObj.jwt);

                sessionStorage.setItem("myid", decoded.sub);
                sessionStorage.setItem("myusr", decoded.upn);

                document.querySelector("#loggeduser").innerHTML = sessionStorage.getItem("myusr");
            }
        })
        .catch(error => {
            console.log(error);
            //document.querySelector("#loggeduser").innerHTML = "nessun utente"
        })
}
*/