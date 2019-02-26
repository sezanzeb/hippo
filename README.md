# Hippo Gallery

<img src="http://vanilla-js.com/assets/button.png">

- Besides displaying Images, it can also display regular HTML content 
- Responsive
- Flat Designed
- No Dependencies
- The tags that belong to the same category don't need to be in the same container.
- Releases Support IE9 (master branch might not be tested on IE9)
- Link two files, add an attribute to your tag, done.

<br/>

## Live Example

http://hip70890b.de/web.php#Hippo

<br/>

## How To

You can find the css and js files here: https://github.com/sezanzeb/Hippo/tree/master/src

<br/>

### Minimal Working Example

```html
    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script> 

    <img zoom="full.jpg" src="thumbnail.jpg"/>
```
    
Just take care of setting the href, zoom and src attributes according to your project

will display "click here" on your website. Clicking it will open an image (when the zoom attribute was set correctly)

```html
    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script> 

    <span zoom="full.jpg">click here</span>
```

style it the way you like using the following css for example, to make it look like a clickable link:

```css
    span[zoom]
    {
        color: #ee3388;
        text-decoration: underline;
        cursor: pointer;
    }
```

<br/>

### Captions and Categories

Activates navigation using arrow keys or the buttons on the top left and top right of the lightbox

```html
    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script>

    <img category="category1" zoom="pic1.jpg" src="preview1.jpeg" caption="caption1"/>
    <img category="category2" zoom="pic2.jpg" src="preview2.jpeg" caption="caption2"/>
    <span category="category2" caption="caption3" zoom="pic3.jpg" zoom="full.jpg">click here</span>
```

<br/>

### Displaying HTML Content Inside the Lightbox 

Displays text, tables, anything that fits into the div "hippo-zoomContent-content" as shown below inside the lightbox.

```html
    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script>

    <div class="hippo-zoomContent" category="examplegroup" caption='"text"'/>

        <p>Click</p>
        <div>me</div>
        <span>foo</span>

        <div class="hippo-zoomContent-content">
            <h1>bar</h1>
            <p>
                Your content goes here, into the div with the class called .hippo-zoomContent-content,
                which is a child of .hippo-zoomContent
            </p>
        </div>

    </div>
```

### Click on a Div to Open an Image

Creates a clickable div that opens the lightbox and shows an image

```html
    <link rel="stylesheet" href="hippo-gallery.css" type="text/css">
    <script src="hippo-gallery.js"></script>

    <div category="examplegroup" zoom="full.jpg" caption="Foo Bar"/>this is a div that will open an image</div>
```
