$(function() {
	$(document).add("p").bind("touchstart", function( e ){
		e.preventDefault();
		getTouchListToString('#start', e);
	});
	
	$(document).add("p").bind("touchmove", function( e ){
		getTouchListToString('#move', e);
	});
	
	$(document).add("p").bind("touchend", function( e ){
		getTouchListToString('#end', e);
	});
});

function getNativeEvent(event) {
	while ( event && typeof event.originalEvent !== "undefined" ) {
		event = event.originalEvent;
	}
	return event;
}

function getTouchListToString(id, e) {
	var i, j;

	if ( e.type.search(/^touch/) !== -1 ) {
		var ne = getNativeEvent(e);
		var names = ['touches', 'targetTouches', 'changedTouches'];
		var touchInfoList = [ne.touches, ne.targetTouches, ne.changedTouches];
		var touchList;

		// 아래 코드로 인해 remove되는 element에 대해서는 touchmove가 오지 않는다.
		// 그러므로, 테스트 시에 이 곳을 피해서 touch해야 한다.
		if(ne.type === 'touchstart') {
			$(".list").children().remove();
		}

		if(ne.type === 'touchmove') {
			$("#move").children().remove();
		}
		
		for(i = 0; i < touchInfoList.length; i++) {
			touchList = touchInfoList[i];
			for(j = 0; j < touchList.length; j++) {
				$(id).append("<div>" + names[i] + '[' + j + '] : ' + getTouchItemToString( touchList.item(j)) + "</div>");
			}
		}
	}

}

function getTouchItemToString(touch) {
	var str = "", j, len, prop;
	
//	var touchEventProps = "identifier clientX clientY pageX pageY screenX screenY radiusX radiusY rotationAngle force".split( " " );
	var touchEventProps = "pageX pageY".split( " " );
	
	if ( touch ) {
		str = ("(" + touch["pageX"] + ", " + touch["pageY"] + ")");
	}
	return str;
}

/*
interface TouchList {
    readonly attribute unsigned long length;
    getter Touch item (unsigned long index);
    Touch        identifiedTouch (long identifier);
};
*/

/*
interface Touch {
    readonly attribute long        identifier;
    readonly attribute EventTarget target;
    readonly attribute long        screenX;
    readonly attribute long        screenY;
    readonly attribute long        clientX;
    readonly attribute long        clientY;
    readonly attribute long        pageX;
    readonly attribute long        pageY;
    readonly attribute long        radiusX;
    readonly attribute long        radiusY;
    readonly attribute float       rotationAngle;
    readonly attribute float       force;
};
*/