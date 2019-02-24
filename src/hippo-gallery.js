var controlHeight = 60 // px
var imgContainerHeight = 80 // % vh // the initival value of this is going to be the max-height of #hippo-img-container

var currentHeight = 0 // stores the height of #hippo-img-height
var currentScrollX = 0
var currentScrollY = 0

var hippo_active = false

window.addEventListener("load", function(e) {
	document.body.innerHTML = (document.body.innerHTML +
		'<div style="display:none" id="hippo-lightbox-bg">'+
			'<div id="hippo-close-lightbox-button">close</div>'+
			'<div id="hippo-loading" class="hippo-noopacity">loading...<br/>click to close</div>'+
			'<div id="hippo-centering">'+
				'<div id="hippo-controls" style="height:'+controlHeight+'px">'+
					'<span id="hippo-previousOff" class="hippo-hidden" style="opacity:0.3;"></span>'+
					'<span id="hippo-previous" class="hippo-hidden"></span>'+
					'<span id="hippo-responsive-close-button">close</span>'+
					'<span id="hippo-next" class="hippo-hidden"></span>'+
					'<span id="hippo-nextOff" class="hippo-hidden" style="opacity:0.3;"></span>'+
				'</div>'+
				'<div id="hippo-caption"></div>'+ // imgContainerHeight+2 to allow more room for captions that move to the bottom in responsive mode
				'<div id="hippo-img-container" style="max-height:'+(imgContainerHeight+2)+'vh; border-top-width:'+(controlHeight-1)+'px">'+
					'<div id="hippo-img-height">'+
						'<div id="hippo-div"></div>'+
						'<img id="hippo-img" src=""/>'+
						'<div id="hippo-caption-responsive"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>')

	// zoom into picture listener
	var elems = document.querySelectorAll("*[zoom], .hippo-zoomContent")
	for(var i = 0;i < elems.length; i++)
	{
		elems[i].addEventListener("click", function(e) {
			hippo_active = true
			getElemById("hippo-lightbox-bg").style.display = ""
			// some timeout so that the transition in opacity will be triggered.
			// because of the previous display:none it would be prevented by default.
			var target = this
			window.setTimeout(function() {
				zoomIn(target)
			}, 15)
		})
	}

	window.addEventListener("keydown", function(e) {
		var code = e.keyCode

		// esc key close listener
		if(code == 27) {
			close()
		}

		var event

		if(navigator.userAgent.match("Trident"))
		{
			// IE
			event = document.createEvent("Event")
			event.initEvent("click", false, true);
		}
		else
		{
			event = new window.Event("click")
		}

		// arrow key listener
		if(code == 37) {
			getElemById("hippo-previous").dispatchEvent(event)
		}
		if(code == 39) {
			getElemById("hippo-next").dispatchEvent(event)
		}
	})

	// if the button is Off, don't put a listener on it
	// prevent closing the slideshow onclick on Off buttons
	getElemById("hippo-previousOff").addEventListener("click", function(e) {
		e.stopPropagation()
	})
	getElemById("hippo-nextOff").addEventListener("click", function(e) {
		e.stopPropagation()
	})
	getElemById("hippo-div").addEventListener("click", function(e) {
		e.stopPropagation()
	})
	

	// scrolling on fixed divs on mobile is a pain. The following code is an attempt to make it more bearable
	window.addEventListener("scroll", function(e) {
		if(hippo_active)
		{
			e.preventDefault() // some people say this works to disable scrolling. Maybe it works in some rare browsers
			if(currentScrollY) // undefined on IE
				window.scrollTo(currentScrollX, currentScrollY)
		}
	})


	// onclick close listener
	getElemById("hippo-lightbox-bg").addEventListener("click", close)
})



/**
 * going to be called onclick on a button. The event is created in activateButton
 *
 * @param event		the event object that the browser creates
 */
function load(event) {
	// to prevent the listener from closing the lightbox once it's opened.
	// The event will only stop once the function terminates, or when manually stopping it
	event.stopPropagation()
	// those params are stored inside the button (the event target) in activateButton
	dir = event.target.dirString
	elem = event.target.nextImage
	// disable listeners. Listeners are going to be created from scratch
	getElemById(dir).removeEventListener("click", load)

	zoomIn(elem)
}



/**
 * going to be called to take care of the Buttons. Called within handlegroup
 *
 * @param dir		string, either "hippo-previous" or "hippo-next"
 * @param elem		dom element of the next <img> tag inside the website-content
 * @param img		the img tag that was clicked on the website content
 */
function activateButton(dir, elem, img) {

	// adjust visibility
	addClass(getElemById(dir+"Off"), "hippo-hidden")
	removeClass(getElemById(dir), "hippo-hidden")

	var dirButton = getElemById(dir)
	// parameters need to be passed like this, because otherwise removeEventListener won't work
	dirButton.dirString = dir	// either "hippo-previous" or "hippo-next", to be stored inside the button as parameter
	dirButton.nextImage = elem // so that the event on the dirbutton knows which image to load next

	dirButton.addEventListener("click", load)

}



/**
 * called on click on #hippo-lightbox-bg
 */
function close() {

	hippo_active = false

	addClass(getElemById("hippo-loading"), "hippo-noopacity")

	getElemById("hippo-lightbox-bg").removeAttribute("class")

	// reset so that next time the opening box will not transition in height
	// without this line, after e.g. closing a tall whitebox and opening a small one
	// the height would transition from the previous (closed by now) lightbox
	// to the current one. The first opening transition should only transition in opacity though
	currentHeight = 0
	
	// reset after smooth closing-transition
	window.setTimeout(function() {
		// if during the timeout the state changed because
		// of user input
		if(hippo_active)
			return
		getElemById("hippo-img-height").style = ""
		getElemById("hippo-img").style = ""
		getElemById("hippo-img-container").removeAttribute("class")
		getElemById("hippo-div").innerHTML = ""
		getElemById("hippo-lightbox-bg").style.display = "none"
		getElemById("hippo-img").src = ""
	}, 200) /* as much timeout as transition duration in the css of #hippo-lightbox-bg */

	// remove the event listeners, they point to images that are not opened anymore
	getElemById("hippo-next").removeEventListener("click", load)
	getElemById("hippo-previous").removeEventListener("click", load)

	removeClass(document.body, "hippo-scrollingDisabled")
}



/**
 * this will prepare some stuff that is needed to go to next/previous images
 * such as hiding/displaying buttons, creating event listeners for the buttons,
 * and get the img urls for next/previous pictures from "imagesList2", which are all img dom elements that have the zoom and same category tag.
 *
 * @param elem			the img tag that was clicked on the website content
 * @param category	the category tag value from elem
 */
function handlegroup(elem, category) {

	// get next, get previous
	var nextImg = false
	var previousImg = false

	var imagesList2 = document.querySelectorAll("*[category="+category+"], .hippo-zoomContent[category="+category+"]")

	// get next and prev from the 'images' array
	for(var i = 0;i < imagesList2.length;i++)
	{
		// check if the item from the list is the element that is displayed at the moment
		if(imagesList2[i] == elem) { // when the current image is found...
			if(imagesList2.length-1 > i) {
				nextImg = imagesList2[i+1] // ...get the next
			}
			if(0 < i) {
				previousImg = imagesList2[i-1] // ...get the previous
			}
		}
	}
	// 
	// create events to next/previous picture
	if(nextImg !== false && typeof nextImg !== typeof undefined) {
		activateButton("hippo-next", nextImg, elem)
	}
	else {
		addClass(getElemById("hippo-next"), "hippo-hidden")
		removeClass(getElemById("hippo-nextOff"), "hippo-hidden")
	}
	if(previousImg !== false && typeof previousImg !== typeof undefined) {
		activateButton("hippo-previous", previousImg, elem)
	}
	else {
		addClass(getElemById("hippo-previous"), "hippo-hidden")
		removeClass(getElemById("hippo-previousOff"), "hippo-hidden")
	}
}



/**
 * make the loading indicator asynchronously with delay,
 * otherwise the transition will not work because of the none display
 *
 * (i think this is deprecated, nothing is display:none anymore but rather
 *  opacity:0 and pointer-events:none so that things can fade in and out)
 */
function showLoadingIndicator() {
	setTimeout(function() {
		if(!hasClass(getElemById("hippo-img-container"), "loaded"))
		{
			removeClass(getElemById("hippo-loading"), "hippo-noopacity")
		}
		else {
		}
	}, 20)
}



/**
 * Either called by one of the buttons in load or by clicking on an image
 * @param elem	the DOM element that is going to be displayed in the lightbox
 */
function zoomIn(elem) {

	currentScrollX = window.scrollX
	currentScrollY = window.scrollY

	addClass(document.body, "hippo-scrollingDisabled")

	// restore the current height. It is replaced by "auto" once the transition if over, so that resizing the browser window will not break the lightbox
	if(currentHeight != 0)
		getElemById("hippo-img-height").style.height = currentHeight + "px"

	// height transition will start from scratch
	removeClass(getElemById("hippo-img-container"), "hippo-heightTransitionHasFinished")

	// show that the image is loading
	showLoadingIndicator()

	// display the lightbox bg
	addClass(getElemById("hippo-lightbox-bg"), "open")

	// hide the current displayed picture, if there is one
	removeClass(getElemById("hippo-img-container"), "loaded")

	// get address of the zoomedin picture from getAttributes
	var zoomedSrc = elem.getAttribute("zoom")

	// show the caption
	getElemById("hippo-caption").innerHTML = elem.getAttribute("caption")
	getElemById("hippo-caption-responsive").innerHTML = elem.getAttribute("caption")
	
	// first hide the old content, trigger transition of opacity down to 0
	addClass(getElemById("hippo-img-height"), "hippo-opacity0")
	
	// the duration of the transition of #hippo-img-height for the opacity
	var hippoImgHeightOpacityTransitionDuration = 100
		
	// detect mode
	var type
	if(elem.getAttribute("zoom")) {
		type = "IMG" // zooms in on an image
	}
	else {
		type = "DIV" // displays DOM content
		if(!elem.querySelector(".hippo-zoomContent-content"))
			return console.error("The element",elem,"does not contain content to display and it does not have a zoom attribute. Take a look at the examples at https://github.com/sezanzeb/Hippo")
	}

	if(type == "IMG" && zoomedSrc !== false && zoomedSrc != "" && typeof zoomedSrc !== typeof undefined) {
		//  load image
	
		// the following onload listener will add classes once it's loaded.
		// loading starts in the line below the listener. In the meantime let's prepare other things
		var img = getElemById("hippo-img")
		var preloadimg = new Image()
		
		preloadimg.onload = function() {
			// timeout for css transitions
			window.setTimeout(function() {
				if(!hippo_active)
					return close()
				// once the image is loaded:
				img.src = zoomedSrc

				handleNewContents(img)
				
				// hide the div, now it's img's turn
				getElemById("hippo-div").innerHTML = ""
			}, hippoImgHeightOpacityTransitionDuration)
		}
		
		// start loading
		preloadimg.src = zoomedSrc
	}
	else if(type == "DIV") {
		// timeout for css transitions
		window.setTimeout(function() {
			if(!hippo_active)
				return close()
			//  load div content
			var div = getElemById("hippo-div")
			div.innerHTML = elem.querySelector(".hippo-zoomContent-content").innerHTML

			handleNewContents(div)
			
			// hide the img, now it's div's turn
			getElemById("hippo-img").src = ""
		}, hippoImgHeightOpacityTransitionDuration)
	}
	else {
		throw new Error("zoom getAttribute missing or empty")
		return
	}
	

	// if this is a slideshow (category getAttribute)
	var category = elem.getAttribute("category")
	if (category !== null && category !== "" && category !== false && typeof category !== typeof undefined) {
		handlegroup(elem, category)

	} else { // if no category available
		addClass(getElemById("hippo-next"), "hippo-hidden")
		addClass(getElemById("hippo-previous"), "hippo-hidden")
		addClass(getElemById("hippo-nextOff"), "hippo-hidden")
		addClass(getElemById("hippo-previousOff"), "hippo-hidden")
	}
}



/** 
 * Applying the content to the lightbox already happened depending on the tagName of elem.
 * (either img.src or div.innerHTML) before. Now a few classes have to be added to the
 * dom to finish loading and to display the results. Scrollbars are handled here aswell
 * @param {object} elem an image tag or a div. either #hippo-img or #hippo-div
 */
function handleNewContents(elem) {

	// the following controlls the scrollbar. fixes some issues compared to "auto" because
	// the scrollbar can be displayed even though the height is still transitioning
	// this needs to be the same number as in the .css file. search for 80 in there

	// though adding classes and changing heights based on javascript measurements is very unflexible
	// compared to a pure css solution, which is not available in this case.
	if(elem.offsetHeight > (window.innerHeight * imgContainerHeight / 100.0 - controlHeight)) {
		addClass(getElemById("hippo-img-container"), "hippo-tallImage")
	}
	else {
		removeClass(getElemById("hippo-img-container"), "hippo-tallImage")
	}

	// detect size here, as changing the class might have effect on the image height (it will if hippo-tallImage changes, because of the scrollbar)
	// so the height measured here will be less tall than before. But that's fine, because the worst case is that in some rare cases a
	// dead scrollbar is shown even though the image fits inside the box without scrolling

	// one could check again for the size and decide to remove hippo-tallImage, now that the scrollbar shows, but in that case the effect would be vice
	// versa: in some cases there would be the scrollbar missing. I could set it to "auto", but then the image would jump in width in some cases.

	currentHeight = elem.offsetHeight + getElemById("hippo-caption-responsive").offsetHeight - 1 // -1 to prevent a leaking row of pixels

	// tell everything about the content being loaded
	addClass(getElemById("hippo-img-container"), "loaded")
	addClass(getElemById("hippo-lightbox-bg"), "loaded")

	// hide "loading" indicator
	addClass(getElemById("hippo-loading"), "hippo-noopacity")

	// this will trigger a transition for the height
	var imgHeightElement = getElemById("hippo-img-height")
	imgHeightElement.style.height = currentHeight + "px"
	// this will trigger a transition for the opacity from 0 to 1
	removeClass(getElemById("hippo-img-height"), "hippo-opacity0")

	
	// after the transition of #hippo-img-height use overflow-y auto, now it is safe to use
	window.setTimeout(function() {
		// the following class adds overflow-y: auto
		addClass(getElemById("hippo-img-container"), "hippo-heightTransitionHasFinished")
		// the height attribute was only there to support transitions. Now to support resizing the browser window replace it with "auto".
		getElemById("hippo-img-height").style.height = "auto"
	}, 200)
}



/*- Helper Functions -*/

/**
 * removes a class from an element
 * @param {object} elem element whose class has to be changed
 * @param {string} classString class to remove
 */
function removeClass(elem, classString) {
	elem.className = elem.className.replace(new RegExp(" " + classString + " "), " ")
	elem.className = elem.className.replace(new RegExp("^" + classString + " "), " ")
	elem.className = elem.className.replace(new RegExp("^" + classString + "$"), " ")
	elem.className = elem.className.replace(new RegExp(" " + classString + "$"), " ")
	elem.className = elem.className.replace("  ", " ")
	elem.className = elem.className.trim()
	if(elem.className === "")
		elem.removeAttribute("class")
}

/**
 * adds a class to an element
 * @param {object} elem element whose class has to be changed
 * @param {string} classString class to remove
 */
function addClass(elem, classString) {
	if(!this.hasClass(elem, classString)) {
		elem.className += (" "+classString)
		elem.className = elem.className.trim()
	}
}

/**
 * checks if the element has a class
 * @param {object} elem element whose class has to be checked
 * @param {string} classString class to remove
 */
function hasClass(elem, classString) {
	if(elem.className.match(new RegExp("(^|[^a-zA-Z0-9\\_\\-]|\\s)" + classString + "($|[^a-zA-Z0-9\\_\\-]|\\s)")))
		return true
	return false
}

/**
 * removes a class from an element if it has the class. adds the class if not
 * @param {object} elem element whose class has to be changed
 * @param {string} classString class to toggle
 */
function toggleClass(elem, classString) {
	if(this.hasClass(elem, classString))
		this.removeClass(elem, classString)
	else this.addClass(elem, classString)
}

/**
 * shortcut for document.getElementById(selector)
 * @param {string} selector e.g. "#hippo-div"
 */
function getElemById(selector) {
	return document.getElementById(selector)
}
