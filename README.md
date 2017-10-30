# Hippo Gallery

<img src="http://vanilla-js.com/assets/button.png">

latest stable that has IE9 support: https://github.com/sezanzeb/Hippo/releases/tag/1.0

- Besides displaying Images, it can also display regular HTML content 
- Responsive
- Flat Designed
- No Dependencies
- The tags that belong to the same category don't need to be in the same container.
- Supports IE9
- Link two files, add an attribute to your tag, done.

<br/>

## Live Example

http://hip70890b.de/web.php#Hippo

<br/>

## How To

You can find the css and js files here: https://github.com/sezanzeb/Hippo/tree/master/src

<br/>

### Minimal Working Example

    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script> 

    <img zoom="full.jpg" src="thumbnail.jpg"/>
    
Just take care of setting the href, zoom and src attributes according to your project

<br/>

### Open By Clicking on Text

will display "click here" on your website. Clicking it will open an image (when the zoom attribute was set correctly)

    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script> 

    <img zoom="full.jpg" alt="click here"/>


style it the way you like using the following css:

    img[zoom][alt]:not([src])
    {
        color: #ee3388;
        text-decoration: underline;
        cursor: pointer;
    }

<br/>

### Captions and Categories

Activates navigation using arrow keys or the buttons on the top left and top right of the lightbox

    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script>

    <img category="category1" zoom="pic1.jpg" src="preview1.jpeg" caption="caption1"/>
    <img category="category2" zoom="pic2.jpg" src="preview2.jpeg" caption="caption2"/>
    <img category="category2" caption="caption3" zoom="pic3.jpg" alt="click here"/>

<br/>

### Displaying HTML Content Inside the Lightbox 

Displays text, tables, anything that fits into the div "hippo-zoomContent-content" as shown below inside the lightbox.

<sub>IE9 support yet unclear</sub>

    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script>
    
    <div class="hippo-zoomContent" category="examplegroup" caption='"text"'/>

        <p>Click me</p>
        <div>foo</div>
        <span>bar</span>

        <div class="hippo-zoomContent-content">
            <p>
                Your content goes here, into the div with the class called .hippo-zoomContent-content,
                which is a child of .hippo-zoomContent
            </p>
        </div>

    </div>

<br/>

#### Click on a Div to Open an Image

Creates a clickable div that opens the lightbox and shows an image

<sub>IE9 support yet unclear</sub>

    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script>
    
    <div category="examplegroup" zoom="full.jpg" caption="Foo Bar"/>this is a div that will open an image</div>
