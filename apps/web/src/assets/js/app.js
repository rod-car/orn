'use strict';

window.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(() => {
        const sidePanelToggler = document.getElementById('sidepanel-toggler');
        const sidePanel = document.getElementById('app-sidepanel');
        const sidePanelDrop = document.getElementById('sidepanel-drop');
        const sidePanelClose = document.getElementById('sidepanel-close');

        function responsiveSidePanel() {
    
            if (!sidePanel) return;
    
            let w = window.innerWidth;
            if (w >= 1400) {
                sidePanel.classList.remove('sidepanel-hidden');
                sidePanel.classList.add('sidepanel-visible');
            } else {
                sidePanel.classList.remove('sidepanel-visible');
                sidePanel.classList.add('sidepanel-hidden');
            }
        };

        if (sidePanelToggler && sidePanel) sidePanelToggler.addEventListener('click', () => {
            if (sidePanel.classList.contains('sidepanel-visible')) {
                sidePanel.classList.remove('sidepanel-visible');
                sidePanel.classList.add('sidepanel-hidden');
            } else {
                sidePanel.classList.remove('sidepanel-hidden');
                sidePanel.classList.add('sidepanel-visible');
            }
        });
    
        if (sidePanelToggler && sidePanelClose) sidePanelClose.addEventListener('click', (e) => {
            e.preventDefault();
            sidePanelToggler.click();
        });
    
        if (sidePanelToggler && sidePanelDrop) sidePanelDrop.addEventListener('click', (e) => {
            sidePanelToggler.click();
        });
    
        responsiveSidePanel();
    
        window.addEventListener('resize', function () {
            responsiveSidePanel();
        });
    }, 1000)
});