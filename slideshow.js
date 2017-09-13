window.addEventListener("load", function(e) {
	document.body.innerHTML = (document.body.innerHTML +
		'<div id="slides-lightbox-bg">'+
			'<div id="slides-loading" class="slides-noopacity">loading...<br/>click to close</div>'+
			'<div id="slides-centering">'+
				'<div id="slides-controls">'+
					'<span id="slides-previousOff" class="slides-hidden" style="opacity:0.3;"></span>'+
					'<span id="slides-previous" class="slides-hidden"></span>'+
					'<span id="slides-next" class="slides-hidden"></span>'+
					'<span id="slides-nextOff" class="slides-hidden" style="opacity:0.3;"></span>'+
				'</div>'+
				'<div id="slides-caption"></div>'+
				'<div id="slides-img-container">'+
					'<div id="slides-img-height">'+
						'<img id="slides-img" src=""/>'+
					'</div>'+
					'<div id="slides-caption-responsive"></div>'+
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

//going to be called onclick
function load(event) {
	//to prevent the listener from closing the lightbox once it's opened. The event will only stop once the function terminates, or when manually stopping it
	event.stopPropagation()

	dir = event.target.par1
	elem = event.target.par2

	getElemById("slides-img").style.opacity = "0"
	//e is the listeners event

	//disable listeners. Listeners are going to be created from scratch
	getElemById("slides-lightbox-bg").removeEventListener("click",close)
	getElemById(dir).removeEventListener("click",load)

	zoomIn(elem)
}

//going to be called if next or previous is active
function activateButton(dir,key,elem,img) {

	//adjust visibility
	addClass(getElemById(dir+"Off"),"slides-hidden")
	removeClass(getElemById(dir),"slides-hidden")

	var dirButton = getElemById(dir)
	//parameters need to be passed like this, because otherwise removeEventListener won't work
	dirButton.par1 = dir
	dirButton.par2 = elem

	dirButton.addEventListener("click",load)

}

function close() {
	addClass(getElemById("slides-loading"),"slides-noopacity")
	removeClass(getElemById("slides-lightbox-bg"),"loaded")
	removeClass(getElemById("slides-lightbox-bg"),"category")
	removeClass(getElemById("slides-lightbox-bg"),"open")
	removeClass(getElemById("slides-img-container"),"loaded")
	getElemById("slides-img-height").style = ""
	getElemById("slides-img").style = ""
}

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

	//create events to next/previous picture
	if(nextImg !== false && typeof nextImg !== typeof undefined) {
		activateButton("slides-next",39,nextImg,elem)
	}
	else {
		addClass(getElemById("slides-next"),"slides-hidden")
		removeClass(getElemById("slides-nextOff"),"slides-hidden")
	}
	if(previousImg !== false && typeof previousImg !== typeof undefined) {
		activateButton("slides-previous",37,previousImg,elem)
	}
	else {
		addClass(getElemById("slides-previous"),"slides-hidden")
		removeClass(getElemById("slides-previousOff"),"slides-hidden")
	}
}

//make the loading indicator asynchronously with delay, otherwise the transition will not work because of the none display
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

		img.onload = function() {
			//once the image is loaded:
			addClass(getElemById("slides-img-container"),"loaded")
			addClass(getElemById("slides-lightbox-bg"),"loaded")
			addClass(getElemById("slides-loading"),"slides-noopacity")

			img.style.opacity = "1"
			var imgHeight = getElemById("slides-img-height")
			imgHeight.style.height = img.offsetHeight + "px"
		}

		//start loading
		img.src = zoomedSrc

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
