var aud = document.getElementById("myAudio");
var markersWrapper = document.getElementById("markers-wrapper");
var audioContainer = document.getElementById("audio-container");
var audioPlayer = document.getElementById("myAudio");
var audioPicker = document.getElementById("audio-picker");
var fileInput = document.getElementById("file-input");
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.  
} else {
  alert('The File APIs are not fully supported in this browser.');
}

// Function triggered when pressing keys
Mousetrap.bind('alt+a', startMarker);
Mousetrap.bind('alt+t', addAnnotation);
Mousetrap.bind(['alt+e', 'meta+s'], function(e) {
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    // internet explorer
    e.returnValue = false;
  }
  endMarker();
});

// Loads file in the browser
audioPicker.addEventListener("change", function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener("load", function() {
      console.log(this);
      aud.setAttribute("src", this.result);
    });
    reader.readAsDataURL(file);
    fileInput.setAttribute("class", "hide");
    audioContainer.removeAttribute("class", "hide");
  }
})

function addAnnotation() {
  // When 'T' is pressed, adds text input
  var annotationElements = document.getElementsByClassName("no-annotation");
  var firstAnnotationElement = annotationElements[0];
  var annotationText = prompt("Add annotation");
  if (annotationText != null) {
    firstAnnotationElement.classList.remove("no-annotation");
    firstAnnotationElement.classList.add("annotation");
    firstAnnotationElement.textContent = annotationText;
  }
}

function endMarker() {
  // When 'E' is pressed, adds end time marker
  var endElements = document.getElementsByClassName("no-end");
  var firstEndElement = endElements[0];
  firstEndElement.classList.remove("no-end");
  firstEndElement.classList.add("end");
  firstEndElement.textContent = addMarker();
}

function startMarker() {
  // Adds div for each marker group
  var markerGroup = document.createElement("ul");
  markerGroup.setAttribute("class", "marker-group");
  markerGroup.textContent = "This is a marker group";
  markerGroup.addEventListener("click", function(e) {
    e.preventDefault();
  });
  markersWrapper.appendChild(markerGroup);
  // Adds elements inside of each marker group
  var startLi = createMarkerElement("li", addMarker(), "class", "start", true);
  var endLi = createMarkerElement("li", addMarker(), "class", "no-end", true);
  var annotation = createMarkerElement("li", "Annotation", "class", "no-annotation", true);
  var markerElements = [
    startLi,
    endLi,
    annotation
  ];
  appendChildren(markerGroup, markerElements);
  markersWrapper.removeAttribute("class", "hide");
  var removeButton = createMarkerElement("button", "Delete", "class", "btn");
  removeButton.addEventListener(
    "click",
    function(e) {
      markerGroup.parentNode.removeChild(markerGroup);
    },
    false
  );
  markerGroup.appendChild(removeButton);
}

// Download markers as .txt
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// Start file download.
document.getElementById("dwn-btn").addEventListener("click", function() {
  // Generate download of hello.txt file with some content
  var text = document.getElementById("markers-wrapper").innerText;
  var filename = "markers-wrapper.txt";

  download(filename, text);
}, false);



// Helper functions

function formatNumber(n) {
  return n > 9 ? "" + n : "0" + n;
}

function addMarker() {
  aud.pause();
  var selectedTime = aud.currentTime;
  var selectedMinutes = formatNumber(parseInt(selectedTime / 60, 10));
  var selectedSeconds = formatNumber(parseInt(selectedTime % 60));
  var selectedFormatted = selectedMinutes + ":" + selectedSeconds;
  return selectedFormatted;
}

function createMarkerElement(tag, text, attr, attrVal, editable) {
  // ''' Adds markup to create and add elements with attributes to parent nodes '''
  // ''' tag is the desired HTML tag of element; text is the content inside element (leave "" for blank); attr is the attribute (such as "class", "id", "type", etc); editable is true or false to set element as editable.'''
  var tag = document.createElement(tag);
  tag.textContent = text;
  tag.setAttribute(attr, attrVal);
  tag.setAttribute("contenteditable", editable);
  console.log(tag);
  return tag;
}

function appendChildren(parent, children) {
  children.forEach(function(child) {
    parent.appendChild(child);
  });
}

// Testing editTask function (only works for annotation)
var editItem = function() {
  console.log("Edit Task...");
  console.log("Change 'edit' to 'save'");

  var listItem = this.parentNode;

  var editInput = listItem.querySelector("input[type=text]");
  var label = listItem.querySelector("li");
  var containsClass = listItem.classList.contains("editMode");
  var button = listItem.querySelector("button");
  //If class of the parent is .editmode
  if (containsClass) {
    //switch to .editmode
    //label becomes the inputs value.
    label.innerText = editInput.value;

  } else {
    editInput.value = label.innerText;
    //button becomes "Save"
    button.innerText = "Save";
  }

  //toggle .editmode on the parent.
  listItem.classList.toggle("editMode");
};


// Entire document is listening to key presses
// document.addEventListener("keydown", doKeyDown, true);