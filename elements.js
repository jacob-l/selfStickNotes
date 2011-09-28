function getJElement(config) {
	var type = config.html || 'div';
	var jElement = $('<' + type + '/>');
	jElement.attr('class', config.cls);
	if (config.items) {
		for (var i = 0; i < config.items.length; i++) {
			jElement.append(config.items[i]);
		}
	}
	if (config.attributes) {
		for (var i = 0; i < config.attributes.length; i++) {
			jElement.attr(config.attributes[i].name, config.attributes[i].value);
		}
	}
	return jElement;
}

function noteGenerator(config) {
	
	var dragMe = getJElement({
		cls: [SSN.cls.dragMeLabel, SSN.cls.text].join(' '),
		items: [chrome.i18n.getMessage("dragMe")]
	});
	
	var jActions = getJElement({
		cls: SSN.cls.noteActions,
		items: []
	});
	
	var jNoteEditableContent;
	if (config.editable) {
		jActions.append(dragMe);
		jNoteEditableContent = getJElement({
			items: [],
			html: "textArea",
			cls: [SSN.cls.editableContent, SSN.cls.text].join(' '),
			attributes: [{name: "placeHolder", value: chrome.i18n.getMessage("typeMe")}]
		});
	}
	
	var jNoteContent = getJElement({
		html: "pre",
		cls: [SSN.clsSelectors.resizable, SSN.cls.noteContent, SSN.cls.text].join(' '),
		items: [config.obj.note],
		attributes: config.contentAttributes
	});
	
	var jNoteItems = [jActions];
	
	if (config.editable) {
		jNoteItems.push(jNoteEditableContent);
	} else {
		jNoteItems.push(jNoteContent);
	}
	
	var jNote = getJElement({
		cls: [SSN.cls.note, SSN.clsSelectors.widgetContent].join(' '),
		items: jNoteItems
	});
	
	jNote.css('left', Number(config.obj.x)).css('top', Number(config.obj.y));
	if (config.editable) {
		jNote.attr(SSN.specialAttributes.removeAll, SSN.consts.removeFalse);
	} else {
		jNote.attr(SSN.specialAttributes.removeAll, SSN.consts.removeTrue);
	}
	
	if (config.renderTo)
		jNote.appendTo($(config.renderTo));
	
	jNote.draggable({ 
		containment: document.body, 
		zIndex: 10000
	});
	
	var dragStop = function(){};
	var dragStart = function(){};
	if (config.firstDragStart)
		dragStart = config.firstDragStart;
	if (config.firstDragStop)
		dragStop = config.firstDragStop;
		
	jNote.bind(SSN.events.dragStop, function(event, ui) {
		if (config.editable && jNoteEditableContent) {
			var val = jNoteEditableContent.val();
			jNoteEditableContent.remove();
			jNoteContent.append(val);
			jNote.append(jNoteContent);
			jNoteEditableContent = null;
		}
		SSN.states.zIndex++;
		jNote.css("zIndex", SSN.states.zIndex);
		dragStop(event, ui);
		if (config.stopDraggable)
			config.stopDraggable(event, ui);
		dragStop = function(){};
		
		jNote.attr(SSN.specialAttributes.removeAll, SSN.consts.removeTrue);
	});
	jNote.bind(SSN.events.dragStart, function(event, ui) {
		dragStart(event, ui);
		dragStart = function(){};
		if (config.startDraggable)
			config.startDraggable(event, ui);
	});
	
	return jNote;
}

function addRemoveAction(onRemove, target) {
	var jRemoveAction = getJElement({
		cls: [SSN.cls.noteRemoveAction, SSN.cls.managableActions].join(' ')
	});
	jRemoveAction.click(function(){
		target.remove();
		onRemove();
	});
	target.find("." + SSN.cls.noteActions).append(jRemoveAction);
}

function clearActions(target) {
	target.find("." + SSN.cls.noteActions).empty();
}