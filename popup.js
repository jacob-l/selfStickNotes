function popupGenerator(config) {
//functions
	var generateNote = function(config){
		var note = noteGenerator({
			obj:{},
			renderTo: config.popup,
			editable: true,
			backgroundColor: SSN.manager.getSettings().backgroundColor,
			firstDragStop: function(event, ui) {
				var target = $(event.target);
				var offset = target.offset();
				target.appendTo(document.body);
				target.css("left", offset.left);
				target.css("top", offset.top);
				target.css("position", "absolute");
				clearActions(target);
				SSN.manager.appendExistingNote(ui.helper);
			},
			firstDragStart: function(event, ui) {
				generateNote(config);
			},
			onRemove: function(){}
		});
		
	}

//init

	var forContent = getJElement({
		cls: SSN.cls.forContentPopup
	});
	
	var boxRemove = getJElement({
		cls: SSN.cls.box
	});
	
	var buttonRemoveAll = getJElement({
		html: "button",
		cls: [SSN.cls.removeButton, SSN.cls.text, SSN.cls.managableActions].join(' '),
		items: [chrome.i18n.getMessage("removeAllButton")]
	});
	buttonRemoveAll.hide();
	boxRemove.click(function() {
		SSN.manager.clickRemoveActions();
	});
	
	var popupActions = getJElement({
		cls: SSN.cls.popupActions,
		items: [boxRemove, buttonRemoveAll]
	});
	
	buttonRemoveAll.click(function(){
		SSN.manager.removeAll();
	});
	
	var popup = getJElement({
		cls: SSN.cls.contentPopupDiv,
		items: [forContent, popupActions]
	});
	
	popup.appendTo($(config.renderTo));
	
	generateNote({
		popup: forContent
	});
	
	return popup;
}