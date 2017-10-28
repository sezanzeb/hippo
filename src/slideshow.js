const controlHeight = 60 //px
const imgContainerHeight = 80 //% vh

window.addEventListener("load", function(e) {
	document.body.innerHTML = (document.body.innerHTML +
		'<div id="slides-lightbox-bg">'+
			'<div id="slides-loading" class="slides-noopacity">loading...<br/>click to close</div>'+
			'<div id="slides-centering">'+
				'<div id="slides-controls" style="height:'+controlHeight+'px">'+
					'<span id="slides-previousOff" class="slides-hidden" style="opacity:0.3;"></span>'+
					'<span id="slides-previous" class="slides-hidden"></span>'+
					'<span id="slides-next" class="slides-hidden"></span>'+
					'<span id="slides-nextOff" class="slides-hidden" style="opacity:0.3;"></span>'+
				'</div>'+
				'<div id="slides-caption"></div>'+
				'<div id="slides-img-container" style="max-height:'+imgContainerHeight+'vh; border-top-width:'+(controlHeight-1)+'px">'+
					'<div id="slides-img-height">'+
						'<img id="slides-img" src=""/>'+
						'<div id="slides-caption-responsive"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>')

	//zoom into picture listener
	var elems = document.querySelectorAll("img[zoom]")
	for(var i = 0;i < elems.length; i++)
	{
		elems[i].addEventListener("click",function() {
			zoomIn(this)
		})
	}
})


/**
 * going to be called onclick on a button. The event is created in activateButton
 *
 * @param event		the event object that the browser creates
 */
function load(event) {
	//to prevent the listener from closing the lightbox once it's opened.
	//The event will only stop once the function terminates, or when manually stopping it
	event.stopPropagation()
	//those params are stored inside the button (the event target) in activateButton
	dir = event.target.par1
	elem = event.target.par2
	//disable listeners. Listeners are going to be created from scratch
	getElemById("slides-lightbox-bg").removeEventListener("click",close)
	getElemById(dir).removeEventListener("click",load)

	zoomIn(elem)
}



/**
 * going to be called to take care of the Buttons. Called within handlegroup
 *
 * @param dir		string, either "slides-previous" or "slides-next"
 * @param elem	dom element of the next <img> tag inside the website-content
 * @param img		the img tag that was clicked on the website content
 */
function activateButton(dir,elem,img) {

	//adjust visibility
	addClass(getElemById(dir+"Off"),"slides-hidden")
	removeClass(getElemById(dir),"slides-hidden")

	var dirButton = getElemById(dir)
	//parameters need to be passed like this, because otherwise removeEventListener won't work
	dirButton.par1 = dir	//either "slides-previous" or "slides-next", to be stored inside the button as parameter
	dirButton.par2 = elem //so that the event on the dirbutton knows which image to load next

	dirButton.addEventListener("click",load)

}



/**
 * called on click on #slides-lightbox-bg
 */
function close() {
	addClass(getElemById("slides-loading"),"slides-noopacity")
	removeClass(getElemById("slides-lightbox-bg"),"loaded")
	removeClass(getElemById("slides-lightbox-bg"),"category")
	removeClass(getElemById("slides-lightbox-bg"),"open")
	removeClass(getElemById("slides-img-container"),"loaded")
	getElemById("slides-img-height").style = ""
	getElemById("slides-img").style = ""
}



/**
 * this will prepare some stuff that is needed to go to next/previous images
 * such as hiding/displaying buttons, creating event listeners for the buttons,
 * and get the img urls for next/previous pictures from "imagesList2", which are all img dom elements that have the zoom and same category tag.
 *
 * @param elem			the img tag that was clicked on the website content
 * @param category	the category tag value from elem
 */
function handlegroup(elem,category) {
	//if the button is Off, don't put an listener on it
	//prevent closing the slideshow onclick on Off buttons
	getElemById("slides-previousOff").addEventListener("click",function(e) {
		e.stopPropagation()
	})
	getElemById("slides-nextOff").addEventListener("click",function(e) {
		e.stopPropagation()
	})

	//get next, get previous
	var nextImg = false
	var previousImg = false

	var imagesList2 = document.querySelectorAll("img[zoom][category="+category+"]")

	//get next and prev from the 'images' array
	for(var i = 0;i < imagesList2.length;i++)
	{
		if(imagesList2[i].getAttribute("zoom").indexOf(elem.getAttribute("zoom")) != -1) { //when the current image is found...
			if(imagesList2.length-1 > i) {
				nextImg = imagesList2[i+1] //...get the next
			}
			if(0 < i) {
				previousImg = imagesList2[i-1] //...get the previous
			}
		}
	}
	//
	//create events to next/previous picture
	if(nextImg !== false && typeof nextImg !== typeof undefined) {
		activateButton("slides-next",nextImg,elem)
	}
	else {
		addClass(getElemById("slides-next"),"slides-hidden")
		removeClass(getElemById("slides-nextOff"),"slides-hidden")
	}
	if(previousImg !== false && typeof previousImg !== typeof undefined) {
		activateButton("slides-previous",previousImg,elem)
	}
	else {
		addClass(getElemById("slides-previous"),"slides-hidden")
		removeClass(getElemById("slides-previousOff"),"slides-hidden")
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
		if(!hasClass(getElemById("slides-img-container"),"loaded"))
		{
			removeClass(getElemById("slides-loading"),"slides-noopacity")
		}
		else {
		}
	},20)
}



/**
 * Either called by one of the buttons in load or by clicking on an image
 *
 * @param elem	the image dom element that is going to be displayed in the lightbox
 */
function zoomIn(elem) {

	//close preview. This has to be done at the beginning, otherwise the lightbox might not close on errors
	getElemById("slides-lightbox-bg").addEventListener("click",close)

	//show that the image is loading
	showLoadingIndicator()

	//display the lightbox bg
	addClass(getElemById("slides-lightbox-bg"),"open")

	//hide the current displayed picture, if there is one
	removeClass(getElemById("slides-img-container"),"loaded")

	//get address of the zoomedin picture from getAttributeibutes
	var zoomedSrc = elem.getAttribute("zoom")

	getElemById("slides-caption").innerHTML = elem.getAttribute("caption")
	getElemById("slides-caption-responsive").innerHTML = elem.getAttribute("caption")

	//if zoom getAttributeibute exists
	if(zoomedSrc !== false && zoomedSrc != "" && typeof zoomedSrc !== typeof undefined) {

		//the following onload listener will add classes once it's loaded.
		//loading starts in the line below the listener. In the meantime let's prepare other things
		var img = getElemById("slides-img")
		var preloadimg = new Image()

		preloadimg.onload = function() {
			window.setTimeout(function() {
				//once the image is loaded:
				img.src = zoomedSrc
				//the following controlls the scrollbar. fixes some issues compared to "auto" because
				//the scrollbar can be displayed even though the height is still transitioning
				//this needs to be the same number as in the .css file. search for 80 in there
				var height = img.offsetHeight + getElemById("slides-caption-responsive").offsetHeight
				console.log(img.offsetHeight,height,getElemById("slides-caption-responsive").offsetHeight)
				
				if(img.offsetHeight > (window.innerHeight * imgContainerHeight / 100.0 - controlHeight))
					addClass(getElemById("slides-img-container"),"tallImage")
				else
					removeClass(getElemById("slides-img-container"),"tallImage")

				addClass(getElemById("slides-img-container"),"loaded")
				addClass(getElemById("slides-lightbox-bg"),"loaded")
				addClass(getElemById("slides-loading"),"slides-noopacity")

				var imgHeightElement = getElemById("slides-img-height")
				imgHeightElement.style.height = height + "px"
				removeClass(getElemById("slides-img-height"),"opacity0")
			},100)
		}

		//first hide the img tag
		addClass(getElemById("slides-img-height"),"opacity0")
		//start loading
		preloadimg.src = zoomedSrc

		//if this is a slideshow (category getAttributeibute)
		var category = elem.getAttribute("category")
		if (category !== null && category !== "" && category !== false && typeof category !== typeof undefined) {
			handlegroup(elem,category)

		} else { //if no category available
			addClass(getElemById("slides-next"),"slides-hidden")
			addClass(getElemById("slides-previous"),"slides-hidden")
			addClass(getElemById("slides-nextOff"),"slides-hidden")
			addClass(getElemById("slides-previousOff"),"slides-hidden")
		}
	}
	else {
		throw new Error("zoom getAttributeibute missing or empty")
	}
}



function removeClass(elem,classString) {
  elem.className = elem.className.replace(new RegExp('(?:^|\\s)'+ classString + '(?:\\s|$)'), '')
}
function addClass(elem,classString) {
  if(!this.hasClass(elem,classString))
	elem.className += (" "+classString)
}
function hasClass(elem,classString) {
  if(elem.className.indexOf(classString) != -1)
  	return true
  return false
}
function toggleClass(elem,classString) {
  if(this.hasClass(elem,classString))
  	this.removeClass(elem,classString)
  else this.addClass(elem,classString)
}
function getElemById(selector) {
	return document.getElementById(selector)
}
