function getValidColor(color, defaultColor) {
	var veryDefaultColor = "#ffff00";
	var resultColor = color || defaultColor || veryDefaultColor;
	var resultColor = resultColor.toString();
	
	if (resultColor.indexOf(0) != "#") {
		resultColor = "#" + resultColor;
	}
	
	var re = new RegExp("#(\d | [abcdef])*");
	if (re.test(resultColor) && (resultColor.length == 4 || resultColor.length == 7))
	{
		return resultColor;
	}
	
	return veryDefaultColor;
}
