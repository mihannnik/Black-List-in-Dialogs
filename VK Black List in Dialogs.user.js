// ==UserScript==
// @name         VK Black List in Dialogs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Why VK does not make this?
// @author       mihannnik
// @match        https://vk.com/im?*
// @icon         https://vk.com/images/icons/favicons/fav_logo.ico?6
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// ==/UserScript==

const config = {
    attributes: false,
    childList: true,
    subtree: false
};
var chat_container;
var lastChecked;
const observer = new MutationObserver(Mutated);
var observerMenu = new MutationObserver(createButton);
(function() {
    'use strict';
    do
    {
        chat_container = document.querySelector('[class="_im_peer_history im-page-chat-contain"]');
    }
    while(chat_container == null)

    loadMessagesfromStart();
    if(GM_getValue('Enabled') != true || GM_getValue('Enabled') != false)
    {
        GM_setValue('Enabled', true);
    }
    
    console.log("Enabled? " + GM_getValue('Enabled'));
    if(GM_getValue('Enabled') == true)
    {
        observer.observe(chat_container, config);
    }
    else
    {
        observer.disconnect() ;
    }
    observerMenu.observe(document.getElementById('ui_rmenu_all'), config)
})();
function loadMessagesfromStart()
{
    var messages = chat_container.getElementsByClassName('im-mess-stack _im_mess_stack');
    for(var it = 0; it < messages.length; it++)
    {
        if(messages[it] == lastChecked)
        {
            lastChecked = messages[0];
            return;
        }
        checkMessage(messages[it]);
    }
    lastChecked = messages[0];
}
function checkMessage(currentMessage)
{
    if(currentMessage.querySelector('[class="im-mess-stack--lnk"]') != null && currentMessage.querySelector('[class="im-mess-stack--lnk"]').innerText.includes('Семён Литвинов'))
    {
        currentMessage.innerText = '';
        console.log("find!");
    }
}
function Mutated(mutationsList, observer) {
    var messages = chat_container.getElementsByClassName('im-mess-stack _im_mess_stack');
    for (let mutation of mutationsList) {
        if(messages[0] != lastChecked)
        {
            console.log('Mutated from start');
            loadMessagesfromStart();
        }
        else
        {
            console.log('Mutated from end');
            checkMessage(messages[messages.length-1]);
        }
    }
}
function createButton()
{
    observerMenu.disconnect();
    var menu = document.getElementById('ui_rmenu_all');
    var icon_read = document.getElementById('im_mark_read_st');
    var icon = icon_read.cloneNode();
    icon.id = 'im_mark_stop_st';
    icon.addEventListener("click", toggleActivity);
    icon.removeAttribute('onclick');
    icon.removeAttribute('onmouseover');
    icon.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAADsQAAA7EAZUrDhsAAATtaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA2LjAtYzAwMiA3OS4xNjQ0ODgsIDIwMjAvMDcvMTAtMjI6MDY6NTMgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDEtMjdUMDk6MDI6NTkrMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAxLTI3VDA5OjM3OjA5KzA1OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAxLTI3VDA5OjM3OjA5KzA1OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjMjhiMjAzZS04NWMzLTA0NDEtYjVjYS02ZTJmYWIyZjk5MjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YzI4YjIwM2UtODVjMy0wNDQxLWI1Y2EtNmUyZmFiMmY5OTI5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YzI4YjIwM2UtODVjMy0wNDQxLWI1Y2EtNmUyZmFiMmY5OTI5Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjMjhiMjAzZS04NWMzLTA0NDEtYjVjYS02ZTJmYWIyZjk5MjkiIHN0RXZ0OndoZW49IjIwMjItMDEtMjdUMDk6MDI6NTkrMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ste+bAAACmklEQVQ4ja1U30/TUBT+1nau69p1sM5BhaCRhMQnHhxKREEjGo3GxD/UmGiCRiIQUJSZoD4YMZJAgA5Yu67t7dZl6+bDnWXsl4R40odzT+/57ne/e84JNRoN/A/j+vyziGc7JG8UAKSSg3FJlEW+1+ZQJyOLeADer22QGhuTEkHcdYoi59+bmQLQidgOZBHv1eKaMDDch2mpkHs6P9OGdQroUC8uLGfllAqgVqv6rnEprUSjEQDlcmX/UOfEJMeFAVi69nhuKp2UuwBZxHvxZpWiuAXtzo3JMTXVxmUvpy+tb4pJlWI9f3g74NUEar3RiMxMjF/ppatFvK3tnf2iD6Bs5p7cb96RCXZQFLeg9UEBIIv8xNXLxNAARFukbDJ6+Xa1zg/WatXpayOjwwqAklf163WWOTmJLgU+DGBXy2/81FiWYyvmswczoHVkEc+pMjEevmuMDk8Gae+yv9vozGfGqTOmpj5kv7OJIbsSsognizwDwHYIrRf1YjLIaeXSNZhWEgBi8YTtkKZGtHYBCEJPaTpNEmPU0QtmEygUCp09v5cxAJTBAboolbyzZzrEpQ5NZwDEJZHYJoCDIyPY59frncmtwSPdBEBsMy6JoK8mi3z8QqMOcGJyL6fT52cZZj4z3vn81N/V8mEpBSDB41RB3r2VAcBx4aX1Tdr9Ah+WhIjAh4OPLgFYxFv59JVlOQCz09dPNGoKZOYAiEl1a3uHYnU1i3g/fm3TdiubuSDevWmJoc3e7NK0uwfHK5+/9Wtaaod6cWElKysqAN+vVR09rSRovdgOOTassKTQG1l57dFcZkhJdGEU8Hq9uBbtO9ham74nEP6O2uWPX+xKKBY/OdN1inKkQdX996htQyzajlEwcb7hfz77A4FdRaMt2QbfAAAAAElFTkSuQmCC')";
    menu.appendChild(icon);
}
function toggleActivity()
{
    if(GM_getValue('Enabled') == true)
    {
        GM_setValue('Enabled', false);
        observer.disconnect();
        console.log("Observer is offline!");
    }
    else
    {
        GM_setValue('Enabled', true);
        observer.observe(chat_container, config);
        console.log("Observer is online!");
    }
}
