const urlBase = 'http://cop4331-team11.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp()
{
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("userName").value;
	let password = document.getElementById("password").value;
	
	document.getElementById("SignUpResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
   
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
		    document.getElementById("SignUpResult").innerHTML = "Registration succesful, Please Login";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("SignUpResult").innerHTML = err.message;
	}

}

function addContact()
{
	let name = document.getElementById("contactName").value;
 	let phone = document.getElementById("phone").value;
 	let email = document.getElementById("email").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {name:name,phone:phone,email:email,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Create.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
		  if (this.readyState == 3 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "readyState 3";
			}
      
			if (this.readyState == 4 && this.status == 200) 
			{
			  document.getElementById('contactName').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
    document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	let contactList = ""; // This should store the contact list

	let tmp = {search: srch, userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
 
				let jsonObject = JSON.parse(xhr.responseText);

				// Check for error in the response
				if (jsonObject.error && jsonObject.error !== "")
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
				}
				else
				{
					document.getElementById("contactSearchResult").innerHTML = "Contact(s) retrieved";

          for (let i = 0; i < jsonObject.results.length; i++)
          {
            let contact = jsonObject.results[i];
            
            //contactList += jsonObject.results[i]; 
            //works for colors because each object is just 1 value, we are dealing with multiple values and must break them apart
            
            //this is where the back ticks (`) instead of single/double (')(") qoutes come in. 
            //will have edit and delete buttons show up only when search results are called.
            //need to write edit and delete funtions still.
            //ill probably have buttons as icons to save horizontal space. need to find icons that match or make them in photoshop
            contactList += `Name: ${contact.Name} Phone: ${contact.Phone} Email: ${contact.Email} 
            <button onclick="editContact('${contact.ID}', '${contact.Name}', '${contact.Phone}', '${contact.Email}')">Edit</button>
            <button onclick="deleteContact('${contact.ID}', '${contact.Name}', '${contact.Phone}', '${contact.Email}')">Delete</button><hr>`;
            if (i < jsonObject.results.length - 1)
            {
              contactList += "<br />\r\n";
            }
          }

          document.getElementsByTagName("p")[0].innerHTML = contactList;
        }
      }
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}
