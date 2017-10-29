var controlHeight = 60 // px
var imgContainerHeight = 80 // % vh

window.addEventListener("load", function(e) {
	document.body.innerHTML = (document.body.innerHTML +
		'<div style="display:none" id="hippo-lightbox-bg">'+
			'<div id="hippo-loading" class="hippo-noopacity">loading...<br/>click to close</div>'+
			'<div id="hippo-centering">'+
				'<div id="hippo-controls" style="height:'+controlHeight+'px">'+
					'<span id="hippo-previousOff" class="hippo-hidden" style="opacity:0.3;"></span>'+
					'<span id="hippo-previous" class="hippo-hidden"></span>'+
					'<span id="hippo-next" class="hippo-hidden"></span>'+
					'<span id="hippo-nextOff" class="hippo-hidden" style="opacity:0.3;"></span>'+
				'</div>'+
				'<div id="hippo-caption"></div>'+
				'<div id="hippo-img-container" style="max-height:'+imgContainerHeight+'vh; border-top-width:'+(controlHeight-1)+'px">'+
					'<div id="hippo-img-height">'+
						'<div id="hippo-div"></div>'+
						'<img id="hippo-img" src=""/>'+
						'<div id="hippo-caption-responsive"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>')

	// zoom into picture listener
	var elems = document.querySelectorAll("img[zoom], .hippo-zoomContent")
	for(var i = 0;i < elems.length; i++)
	{
		elems[i].addEventListener("click", function(e) {
			getElemById("hippo-lightbox-bg").style.display = ""
			// some timeout so that the transition will be triggered.
			// because of the previous display:none it would be prevented by default.
			var target = this
			window.setTimeout(function() {
				zoomIn(target)
			}, 15)
		})
	}

	// if the button is Off, don't put an listener on it
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
	dir = event.target.par1
	elem = event.target.par2
	// disable listeners. Listeners are going to be created from scratch
	getElemById("hippo-lightbox-bg").removeEventListener("click", close)
	getElemById(dir).removeEventListener("click", load)

	zoomIn(elem)
}



/**
 * going to be called to take care of the Buttons. Called within handlegroup
 *
 * @param dir		string, either "hippo-previous" or "hippo-next"
 * @param elem	dom element of the next <img> tag inside the website-content
 * @param img		the img tag that was clicked on the website content
 */
function activateButton(dir, elem, img) {

	// adjust visibility
	addClass(getElemById(dir+"Off"), "hippo-hidden")
	removeClass(getElemById(dir), "hippo-hidden")

	var dirButton = getElemById(dir)
	// parameters need to be passed like this, because otherwise removeEventListener won't work
	dirButton.par1 = dir	// either "hippo-previous" or "hippo-next", to be stored inside the button as parameter
	dirButton.par2 = elem // so that the event on the dirbutton knows which image to load next

	dirButton.addEventListener("click", load)

}



/**
 * called on click on #hippo-lightbox-bg
 */
function close() {
	addClass(getElemById("hippo-loading"), "hippo-noopacity")
	removeClass(getElemById("hippo-lightbox-bg"), "loaded")
	removeClass(getElemById("hippo-lightbox-bg"), "category")
	removeClass(getElemById("hippo-lightbox-bg"), "open")
	removeClass(getElemById("hippo-img-container"), "loaded")
	getElemById("hippo-img-height").style = ""
	getElemById("hippo-img").style = ""
	
	//  reset after smooth transition
	window.setTimeout(function() {
		getElemById("hippo-div").innerHTML = ""
		getElemById("hippo-lightbox-bg").style.display = "none"
		getElemById("hippo-img").src = ""
	}, 200) /* as much timeout as transition duration in the css */
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

	var imagesList2 = document.querySelectorAll("img[category="+category+"], .hippo-zoomContent[category="+category+"]")

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
 *
 * @param elem	the image dom element that is going to be displayed in the lightbox
 */
function zoomIn(elem) {

	// close preview. This has to be done at the beginning, otherwise the lightbox might not close on errors
	getElemById("hippo-lightbox-bg").addEventListener("click", close)

	// show that the image is loading
	showLoadingIndicator()

	// display the lightbox bg
	addClass(getElemById("hippo-lightbox-bg"), "open")

	// hide the current displayed picture, if there is one
	removeClass(getElemById("hippo-img-container"), "loaded")

	// get address of the zoomedin picture from getAttributes
	var zoomedSrc = elem.getAttribute("zoom")

	getElemById("hippo-caption").innerHTML = elem.getAttribute("caption")
	getElemById("hippo-caption-responsive").innerHTML = elem.getAttribute("caption")
	
	// first hide the old content, trigger transition
	addClass(getElemById("hippo-img-height"), "opacity0")
		
	// if zoom getAttribute exists
	if(elem.tagName == "IMG" && zoomedSrc !== false && zoomedSrc != "" && typeof zoomedSrc !== typeof undefined) {
		//  load image
	
		// the following onload listener will add classes once it's loaded.
		// loading starts in the line below the listener. In the meantime let's prepare other things
		var img = getElemById("hippo-img")
		var preloadimg = new Image()
		
		preloadimg.onload = function() {
			// timeout for css transitions
			window.setTimeout(function() {
				// once the image is loaded:
				img.src = zoomedSrc

				handleNewContents(img)
				
				// hide the div, now it's img's turn
				getElemById("hippo-div").innerHTML = ""
			}, 100)
		}
		
		// start loading
		preloadimg.src = zoomedSrc
	}
	else if(elem.tagName == "DIV") {
		// timeout for css transitions
		window.setTimeout(function() {
			//  load div content
			var div = getElemById("hippo-div")
			div.innerHTML = elem.querySelector(".hippo-zoomContent-content").innerHTML

			handleNewContents(div)
			
			// hide the img, now it's div's turn
			getElemById("hippo-img").src = ""
		}, 100)
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
		addClass(getElemById("hippo-img-container"), "tallImage")
	}
	else {
		removeClass(getElemById("hippo-img-container"), "tallImage")
	}

	// detect size here, as changing the class might have effect on the image height (it will if tallImage changes, because of the scrollbar)
	// so the height measured here will be less tall than before. But that's fine, because the worst case is that in some rare cases a
	// dead scrollbar is shown even though the image fits inside the box without scrolling

	// one could check again for the size and decide to remove tallImage, now that the scrollbar shows, but in that case the effect would be vice
	// versa: in some cases there would be the scrollbar missing. I could set it to "auto", but then the image would jump in width in some cases.

	var height = elem.offsetHeight + getElemById("hippo-caption-responsive").offsetHeight - 1 // -1 to prevent a leaking row of pixels

	// tell everything about the content being loaded
	addClass(getElemById("hippo-img-container"), "loaded")
	addClass(getElemById("hippo-lightbox-bg"), "loaded")

	// hide "loading" indicator
	addClass(getElemById("hippo-loading"), "hippo-noopacity")

	// this will trigger a transition
	var imgHeightElement = getElemById("hippo-img-height")
	imgHeightElement.style.height = height + "px"
	removeClass(getElemById("hippo-img-height"), "opacity0")
}




/*- Helper Functions -*/

/**
 * removes a class from an element
 * @param {object} elem element whose class has to be changed
 * @param {string} classString class to remove
 */
function removeClass(elem, classString) {
  elem.className = elem.className.replace(new RegExp('(?:^|\\s)'+ classString + '(?:\\s|$)'), '')
}

/**
 * adds a class to an element
 * @param {object} elem element whose class has to be changed
 * @param {string} classString class to remove
 */
function addClass(elem, classString) {
  if(!this.hasClass(elem, classString))
	elem.className += (" "+classString)
}

/**
 * checks if the element has a class
 * @param {object} elem element whose class has to be checked
 * @param {string} classString class to remove
 */
function hasClass(elem, classString) {
  if(elem.className.indexOf(classString) != -1)
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
