var temp = [-1,0,0,0], fineoptions = [0], clickpoints = []

function updateimage() {
  var reader = new FileReader(), input = document.getElementById("upload"), main = document.getElementById("main")
  if (input.files) {
    reader.onload = function(e) {
      main.setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
  toggleoptions(true)
  togglefineoptions(false)
  while (clickpoints.length != 0) {clickpoint_delete()}
}

function toggleinterface(x) {
  document.getElementById("ui_wrapper").style.display = (x) ? "block":"none"
  document.getElementById("clickpoints").style["pointer-events"] = (x) ? "auto":"none"
}

function toggleoptions(x) {
  document.getElementById("options_wrapper").style.display = (x) ? "block":"none"
}

function togglefineoptions(x) {
  document.getElementById("fine_options_wrapper").style.display = (x) ? "block":"none"
}

function getMousePosition(image, event) {
  var p = image.getBoundingClientRect(), 
      x = event.clientX - p.left, 
      y = event.clientY - p.top
  
  if (temp[0] != -1) {
    temp.push(x)
    temp.push(y)
    temp[2]++
    if (temp[2] == temp[1]) {
      switch (temp[0]) {
        case 0:clickpoint_new(1)
      }
      temp[0] = -1
}}}

function clickpoint_new(x) {
  var p, r
  if (x == 0) {
    toggleinterface(false)
    temp = [0,2,0,0]
    return
  }
  p = validate_position(temp[4],temp[5],temp[6],temp[7])
  r = element_create(p)
  
  clickpoints.push({"position":p,"element":r,"is_clickpoint":true,"href":""})
  
  togglefineoptions(true)
  toggleinterface(true)
  updatefineoptions(clickpoints.length-1)
}

function clickpoint_delete() {
  console.log(`* Deleting element ${fineoptions[0]}`)
  var del = fineoptions[0], element = clickpoints[del].element
  clickpoints.splice(del,1)
  element.remove()
  switchfineoptions(-1)
  if (clickpoints.length == 0) {togglefineoptions(false)}
}

function update_element() {
  var pos1x = document.getElementById("pos1x").value,
      pos1y = document.getElementById("pos1y").value,
      pos2x = document.getElementById("pos2x").value,
      pos2y = document.getElementById("pos2y").value,
      p
  p = validate_position(pos1x,pos1y,pos2x,pos2y)
  clickpoints[fineoptions[0]].position = p
  clickpoints[fineoptions[0]].element.setAttribute("style",`left:${p[0]}px;top:${p[1]}px;width:${p[2] - p[0]}px;height:${p[3] - p[1]}px`);
  document.getElementById("pos1x").value = p[0]
  document.getElementById("pos1y").value = p[1]
  document.getElementById("pos2x").value = p[2]
  document.getElementById("pos2y").value = p[3]
}

function update_clickpoint(x) {
  clickpoints[fineoptions[0]].is_clickpoint = x
}

function update_reference(x) {
  clickpoints[fineoptions[0]].href = x
}

function element_create(x) {
  var div = document.getElementById("clickpoints").appendChild(document.createElement("div"));
  div.setAttribute("style",`left:${x[0]}px;top:${x[1]}px;width:${x[2] - x[0]}px;height:${x[3] - x[1]}px`);
  div.setAttribute("class",`clickpoint`);
  return div;
}

function validate_position(a,b,c,d) {
  var e, i = document.getElementById("main").getBoundingClientRect()
  console.log("# A ",a, b, c, d)
  //e = [a,b,c,d]
  a = parseInt(a)
  b = parseInt(b)
  c = parseInt(c)
  d = parseInt(d)
  //[a,b,c,d] = [a,b,c,d].map(x => parseInt(x))
  console.log("# A ",a, b, c, d)
  if (a > c) {[a,c] = [c,a]}
  if (b > d) {[b,d] = [d,b]}
  console.log("# A ",a, b, c, d)
  if (c - a < 15) {a = c - 15}
  if (c > i.width) {
    c = i.width
    if (c - a < 15) {a = i.width - 15}
  } else if (a < 0) {
    a = 0
    if (c - a < 15) {c = 15}
  }
  if (d - b < 15) {d = b + 15}
  if (d > i.height) {
    d = i.height
    if (d - b < 15) {b = i.height - 15}
  } else if (b < 0) {
    b = 0
    if (d - b < 15) {d = 15}
  }
  e = [a,b,c,d]
  e = e.map(x => Math.floor(x))
  console.log("# A ",a, b, c, d, e)
  return e
}

function switchfineoptions(x) {
  console.log(`* Modified by ${x} (${fineoptions[0]})`)
  x = fineoptions[0] + x
  if (x >= clickpoints.length) {x = 0}
  if (x <= -1) {x = clickpoints.length - 1}
  updatefineoptions(x)
}

function updatefineoptions(x) {
  console.log(`* Set to ${x}`)
  if (clickpoints[fineoptions[0]] != undefined) {clickpoints[fineoptions[0]].element.classList.remove("clickpoint_highlight")}
  clickpoints[x].element.classList.add("clickpoint_highlight")
  fineoptions = [x]
  
  document.getElementById("pos1x").value = clickpoints[fineoptions[0]].position[0]
  document.getElementById("pos1y").value = clickpoints[fineoptions[0]].position[1]
  document.getElementById("pos2x").value = clickpoints[fineoptions[0]].position[2]
  document.getElementById("pos2y").value = clickpoints[fineoptions[0]].position[3]
  document.getElementById("href").value = clickpoints[fineoptions[0]].href
  document.getElementById("is_clickpoint").checked = clickpoints[fineoptions[0]].is_clickpoint
}

function exportsite() {
  var e, a = ""
  clickpoints.forEach(function(v) {
    if (v.is_clickpoint) {
      a = a + `\n	<area shape="rect" coords="${v.position.join(",")}" class="hotZone">`
    } else {
      a = a + `\n	<area shape="rect" coords="${v.position.join(",")}" onMouseOver="LinkHover()" onMouseOut="LinkOut()" onclick="LinkClick('${v.href}')">`
    }
  })
  
  
/*
      <area shape="rect" coords="10,10,60,60" onMouseOver="LinkHover()" onMouseOut="LinkOut()" class="hotZone">
      <area shape="rect" coords="10,10,60,60" onMouseOver="LinkHover()" onMouseOut="LinkOut()" onclick="LinkClick('websitereference.html')">
*/
  
  
  e = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${document.getElementById("title").value}</title>
<script type="text/javascript" language="javascript" src="../jQuery.min.js"></script>
<script type="text/javascript" language="javascript" src="../basic.js"></script>
<link rel="stylesheet" type="text/css" href="../basic.css" />
<style>
	body{
		margin: 0px;
		padding: 0px;
		background-color: ${document.getElementById("color").value};
	}
	
	img{
		display: block;
		margin: 0em auto;
    user-select: none;
	}
	
	#keySpot{
		display: block;
		position: absolute;
		font-family:Arial, Helvetica;
		color: ${document.getElementById("color2").value};
		font-size: 14px;
		font-weight: bold;
	}
</style>
 
</head>
<body>

<img src="${document.getElementById("image").value}" width="1153" usemap="#template" >
<map name="template">${a}
</map>
</body>
</html>`
navigator.clipboard.writeText(e)
}

document.getElementById("main").addEventListener("mousedown", function(e) {getMousePosition(document.getElementById("main"),e);});

window.ondragstart = function() {return false;}