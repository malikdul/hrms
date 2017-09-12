
function register()
{
	var name = document.getElementById("name");
	var email = document.getElementById("email");
	var pass = document.getElementById("password");
	var pass2 = document.getElementById("passwd");
	console.log(name.value);
	console.log(email.value);
	console.log(pass.value);
	console.log(pass2.value);
	
	if(name.value == "")
	{
		alert("Please enter required name!");
		name.focus();
		name.style.border ="solid 1px red";
		return false;
	}
	else if(email.value == "")
	{
		alert("Please Enter required email!");
		email.focus();
		email.style.border ="solid 1px red";
		return false;
	}
	else if(pass.value == "" || pass.value.length<6 || pass.value.length>12)
	{
		alert("Please Enter required password! \n OR\nPlease Enter min 6 character & max 12!");
		pass.focus();
		pass.style.border ="solid 1px red";
		return false;
	}
	else if(pass2.value == "" || pass2.value.length<6 || pass2.value.length>12 )
	{
		alert("Please Enter required confirm password! \n OR\nPlease Enter min 6 character & max 12!");
		pass2.focus();
		pass2.style.border ="solid 1px red";
		return false;
	}
	else if(pass2.value != pass.value)
	{
		alert("Password doesn't match!");
		pass2.focus();
		pass2.style.border ="solid 1px red";
		return false;
	}
		
}