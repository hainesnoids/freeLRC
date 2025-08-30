const changeEvent = new Event("outsideChange");
const changeFromUserEvent = new Event("changedElsewhere");
const touchStartEvent = new Event("changeStarting");

function widthChangeEvent(inputNode, trackNode, rangeNode) {
    let value = Number(inputNode.value);
    let rangeWidth = Number(rangeNode.getAttribute('width'));
    let trackWidth = (value / inputNode.max) * rangeWidth;
    if (value >= inputNode.min && value <= inputNode.max) {
        trackNode.style.width = trackWidth + 'px';
    } else if (value > inputNode.max) {
        trackNode.style.width = rangeWidth + 'px';
    } else if (value < inputNode.min) {
        trackNode.style.width = '0px';
    }
}

function dragEvent(dragNode, trackNode, inputNode, initWidth, rangeNode) {
    let rangeWidth = Number(rangeNode.getAttribute('width'));
    let origin, start, offset, lastMouse;
    start = initWidth;
    function dragStart(e) {
        rangeWidth = Number(rangeNode.getAttribute('width'));
        start = ((Number(inputNode.value) - inputNode.min) / (inputNode.max - inputNode.min)) * rangeWidth;
        e.clientX = e.clientX || e.touches[0].clientX;
        origin = e.clientX;
        lastMouse = e.clientX;

        inputNode.dispatchEvent(touchStartEvent);

        document.addEventListener('mousemove', drag);
        dragNode.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }
    function drag(e) {
        e.clientX = e.clientX || e.touches[0].clientX;
        lastMouse = e.clientX;
        let offsetfake = origin - e.clientX;
        const simulatedValue = Number(inputNode.min + (((start - offsetfake) / rangeWidth) * (inputNode.max - inputNode.min)));
        if (simulatedValue >= inputNode.min && simulatedValue <= inputNode.max) {
            offset = origin - e.clientX;
            trackNode.style.width = (start - offset) + 'px';
            inputNode.value = simulatedValue;
        } else if (simulatedValue > inputNode.max) {
            trackNode.style.width = rangeWidth + 'px';
            inputNode.value = inputNode.max;
        } else if (simulatedValue < inputNode.min) {
            trackNode.style.width = '0px';
            inputNode.value = inputNode.min;
        }
    }
    function dragEnd() {
        if (origin !== lastMouse) {
            start = (start - offset);
        }
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', dragEnd);
        inputNode.dispatchEvent(changeFromUserEvent);
    }

    dragNode.addEventListener('mousedown', dragStart);
    dragNode.addEventListener('touchstart', dragStart);
}

function initializeSlider(range) {
    const inputNode = range.querySelector('input[type="range"]');
    const dragNode = range.querySelector('thumb');
    const trackNode = range.querySelector('rangetrack');
    const initWidth = ((Number(inputNode.value) - inputNode.min) / (inputNode.max - inputNode.min)) * Number(range.getAttribute('width'));
    console.log(initWidth);
    dragEvent(dragNode, trackNode, inputNode, initWidth, range);
    inputNode.addEventListener('outsideChange', () => {
        widthChangeEvent(inputNode,trackNode,range);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('range');
    for (const range of sliders) {
        initializeSlider(range);
    }
})