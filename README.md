Overview
A simple tool to allow teams to track which of their project's stakeholders they should focus on. Allows export of the completed stakeholder map to a .png file with the project name and number as the filename.
Works in Chrome and Firefox only, due to Canvas and download dependencies.

Technical highlights
Uses HTML5 Canvas with drag and drop functionality.
Uses layered canvases to provide an efficient static background. This is merged with the drag and drop layer for export.
Combines use of the download attribute and the Canvas.toDataURL method to allow downloading of the canvas as an image.
Swatch colour picker with custom styles.


References
The tool on Openshift: http://stakeholdermanagement-atosdpu.rhcloud.com/
The colour picker: https://github.com/tkrotoff/jquery-simplecolorpicker
Rounded rectangle on Canvas: http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas

The OpenShift `jbossews` cartridge documentation can be found at:

http://openshift.github.io/documentation/oo_cartridge_guide.html#tomcat
