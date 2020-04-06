var socket = io();
socket.on("connected", function(data) {
    console.log(data.msg);
});
socket.on("logs", function(data) {
});
function demoKnob() {
    // Create knob element, 300 x 300 px in size.
    const knob = pureknob.createKnob(300, 300);

    // Set properties.
    knob.setProperty('angleStart', -0.75 * Math.PI);
    knob.setProperty('angleEnd', 0.75 * Math.PI);
    knob.setProperty('colorFG', '#88ff88');
    knob.setProperty('trackWidth', 0.4);
    knob.setProperty('valMin', 0);
    knob.setProperty('valMax', 100);

    // Set initial value.
    knob.setValue(0);
    const listener = function(knob, value) {
        console.log(value);
        socket.emit("control", {"value": value});
    };

    knob.addListener(listener);

    // Create element node.
    const node = knob.node();

    // Add it to the DOM.
    const elem = document.getElementById('some_element');
    elem.appendChild(node);
    return knob
}
$(document).ready(function() {
    demoKnob()
});