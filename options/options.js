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

$(function(){
    $('#noteColor_tmpl').tmpl({
        label: chrome.i18n.getMessage("noteColor"),
        remark: chrome.i18n.getMessage("noteColorRemark")
    }).appendTo('#colorSettings');

    document.title = chrome.i18n.getMessage("options");
    restore_options();
})