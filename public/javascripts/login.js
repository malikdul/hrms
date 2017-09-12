function login()
{
	var name = document.getElementById("uname");
	var pass = document.getElementById("password");
	
	if(name.value == "")
	{
		alert("Fill the required filed");
		return false;
	}
	else if(pass.value == "")
	{
		alert("Fill the required filed");
		return false;
	}
}