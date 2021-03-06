﻿define(['browser', 'dom', 'layoutManager', 'css!./emby-button', 'registerElement'], function (browser, dom, layoutManager) {
    'use strict';

    var EmbyButtonPrototype = Object.create(HTMLButtonElement.prototype);

    function enableAnimation() {
        if (browser.tv) {
            // too slow
            return false;
        }
        return true;
    }

    function onTransitionEnd() {
        var div = this;
        var parentNode = div.parentNode;
        if (parentNode) {
            try {
                parentNode.removeChild(div);
            }
            catch (err) {
            }
        }
    }

    function animateButtonInternal(e, btn) {

        var div = document.createElement('div');

        for (var i = 0, length = btn.classList.length; i < length; i++) {
            div.classList.add(btn.classList[i] + '-ripple-effect');
        }

        var offsetX = e.offsetX || 0;
        var offsetY = e.offsetY || 0;

        if (offsetX > 0 && offsetY > 0) {
            div.style.left = offsetX + 'px';
            div.style.top = offsetY + 'px';
        }

        btn.appendChild(div);

        div.addEventListener(dom.whichAnimationEvent(), onTransitionEnd, false);
        div.addEventListener(dom.whichAnimationCancelEvent(), onTransitionEnd, false);
        setTimeout(onTransitionEnd.bind(div), 200);
    }

    function animateButton(e, btn) {

        requestAnimationFrame(function () {
            animateButtonInternal(e, btn);
        });
    }

    function onKeyDown(e) {

        if (e.keyCode === 13) {
            animateButton(e, this);
        }
    }

    function onClick(e) {

        animateButton(e, this);
    }

    EmbyButtonPrototype.createdCallback = function () {

        if (this.classList.contains('paper-icon-button-light')) {
            return;
        }

        this.classList.add('paper-icon-button-light');

        if (layoutManager.tv) {
            this.classList.add('icon-button-focusscale');
        }

        if (enableAnimation()) {
            dom.addEventListener(this, 'keydown', onKeyDown, {
                passive: true
            });
            dom.addEventListener(this, 'click', onClick, {
                passive: true
            });
        }
    };

    document.registerElement('paper-icon-button-light', {
        prototype: EmbyButtonPrototype,
        extends: 'button'
    });
});