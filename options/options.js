function save_options() {
  var inputColor = $("#color");
  var color = inputColor.val();
  
  var settings = {};
  settings.backgroundColor = color;
  localStorage["settings"] = JSON.stringify(settings);
}

function restore_options() {
  var favorite = JSON.parse(localStorage["settings"]);
  if (!favorite) {
    return;
  }
  var inputColor = $("#color");
  inputColor.val(favorite.backgroundColor);
  inputColor.css("background-color", favorite.backgroundColor);
}