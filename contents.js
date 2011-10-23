function NoteManagerSingleton() {
	//private
	var notesArray;
	var items = [];
	var eventHandlers = {};
	var popupManager;
	var isVisibleNow = false;
	var settings = {};

	var restoreArray = function() {
		var stringifiedObject = localStorage[window.location.href] || "[]";
		try {
			notesArray = JSON.parse(stringifiedObject);
		} catch(ex) {
			notesArray = [];
		}
	}

	var rememberArray = function() {
		var forRemember = [];
		for (var i = 0; i < notesArray.length; i++) {
			if (notesArray[i]) {
				forRemember.push(notesArray[i]);
			}
		}
		localStorage[window.location.href] = JSON.stringify(forRemember);
	}

	var removeItem = function(id) {
		if (id == null)
			return;
		notesArray[id] = null;
		rememberArray();
	}

	var formNote = function(id) {
		var config = {};
		config.obj = notesArray[id];
		config.renderTo = SSN.consts.baseRenderTo;
		config.stopDraggable = function(event, ui) {
				config.obj.x = ui.offset.left;
				config.obj.y = ui.offset.top;
				rememberArray();
			};
		config.backgroundColor = settings.backgroundColor;

		var jNote = noteGenerator(config);
		addRemoveAction(function() {
			removeItem(id);
		}, jNote);

		return jNote;
	}

	var restoreAllNotes = function() {
		for (var i = 0; i < notesArray.length; i++) {
			try {
				formNote(i);
			} catch (ex) {
				console.log(ex.message);
			}
		}
	}

	eventHandlers.clickAction = function() {
		isVisibleNow = !isVisibleNow;
		if (!popupManager) {
			popupManager = popupGenerator({
				renderTo: document.body
			});
		}
		if (isVisibleNow) {
			popupManager.show();
		}
		else {
			popupManager.hide();
		}
		popupManager.find(SSN.consts.focusPopup).focus();
	}

	var initEvents = function() {
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
			if (eventHandlers[request.event]) {
				eventHandlers[request.event](request.obj, sender, sendResponse);
			}
		});
	}

	var init = function(bgSettings) {
		settings = bgSettings || {};
		restoreArray();
		restoreAllNotes();
		initEvents();
	}

	//public methods
	this.appendExistingNote = function(jNote) {
		var noteObj = {};
		noteObj.x = jNote.offset().left;
		noteObj.y = jNote.offset().top;
		noteObj.note = jNote.find("." + SSN.cls.noteContent).html();

		var id = notesArray.push(noteObj) - 1;
		addRemoveAction(function() {
			removeItem(id);
		}, jNote);

		jNote.bind(SSN.events.dragStop, function(event, ui) {
				noteObj.x = ui.offset.left;
				noteObj.y = ui.offset.top;
				rememberArray();
		});
		rememberArray();
		this.handleRemoveAction();
	}

	this.removeAll = function() {
		notesArray = [];
		$('['+SSN.specialAttributes.removeAll+'="' + SSN.consts.removeTrue + '"]').remove();
		rememberArray();
	}

	this.handleRemoveAction = function() {
		if (SSN.states.isRemoveVisible) {
			$("." + SSN.cls.managableActions).show();
		}
		else {
			$("." + SSN.cls.managableActions).hide();
		}
	}

	this.clickRemoveActions = function() {
		SSN.states.isRemoveVisible = !SSN.states.isRemoveVisible;
		this.handleRemoveAction();
	}

	this.getSettings = function() {
		return settings;
	}

	//
	chrome.extension.sendRequest({method: "getSettings"}, function(response) {
		init(response.settings);
	});
}

SSN = {};
try {
SSN.states = {}
SSN.states.zIndex = 1000;
SSN.states.isRemoveVisible = false;

SSN.events = {};
SSN.events.dragStop = "dragstop";
SSN.events.dragStart = "dragstart";

SSN.consts = {};
SSN.consts.baseRenderTo = "body";
SSN.consts.focusPopup = "textarea";
SSN.consts.removeTrue = "true";
SSN.consts.removeFalse = "false";

SSN.cls = {};
SSN.cls.text = "text36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.noteContent = "noteContent36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.dragMeLabel = "dragMeLabel36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.editableContent = "editableContent36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.note = "note36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.noteRemoveAction = "noteRemoveAction36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.forContentPopup = "forContentPopup36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.removeButton = "removeButton36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.contentPopupDiv = "contentPopupDiv36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.managableActions = "managableActions36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.noteActions = "noteActions36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.box = "box36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.cls.popupActions = "popupActions36e67545-d7d5-4ad9-be98-547b75db57e6";

SSN.clsSelectors = {};
SSN.clsSelectors.noteActions = "noteActions36e67545-d7d5-4ad9-be98-547b75db57e6";
SSN.clsSelectors.resizable = "resizable";
SSN.clsSelectors.widgetContent = "ui-widget-content";

SSN.specialAttributes = {};
SSN.specialAttributes.removeAll = "removeAll";
SSN.manager = new NoteManagerSingleton();
} catch (exception) {
	console.log(exception.message);
}