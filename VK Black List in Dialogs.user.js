// ==UserScript==
// @name         VK Black List in Dialogs
// @namespace    http://tampermonkey.net/
// @version      1.2.2
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
var listOfIgnore = [];
var chat_container;
var lastChecked;
const observer = new MutationObserver(Mutated);
(function() {
    'use strict';
    do
    {
        chat_container = document.querySelector('[class="_im_peer_history im-page-chat-contain"]');
    }
    while(chat_container == null)

    listOfIgnore = JSON.parse(GM_getValue("listOfIgnore", '[]'));

    loadMessagesfromStart();
    if(GM_getValue('Enabled') == undefined)
    {
        console.log("First time?");
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
    createButtons();
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
    if(currentMessage.querySelector('[class="im-mess-stack--lnk"]') != null && listOfIgnore.indexOf(currentMessage.querySelector('[class="im-mess-stack--lnk"]').firstChild.textContent) != -1)
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
function createButtons()
{
    var menu = document.getElementById('ui_rmenu_all');
    var iconToggleActivity = document.createElement('div');
    iconToggleActivity.id = 'im_mark_stop_st';
    iconToggleActivity.addEventListener("click", toggleActivity);
    iconToggleActivity.style.cssFloat = "right";
    iconToggleActivity.style.margin = "4px 4px 0 0";
    iconToggleActivity.style.width = "24px";
    iconToggleActivity.style.height = "24px";
    iconToggleActivity.style.cursor = "pointer";
    iconToggleActivity.style.opacity = "0.75";
    iconToggleActivity.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAADsQAAA7EAZUrDhsAAATtaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA2LjAtYzAwMiA3OS4xNjQ0ODgsIDIwMjAvMDcvMTAtMjI6MDY6NTMgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDEtMjdUMDk6MDI6NTkrMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAxLTI3VDA5OjM3OjA5KzA1OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAxLTI3VDA5OjM3OjA5KzA1OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjMjhiMjAzZS04NWMzLTA0NDEtYjVjYS02ZTJmYWIyZjk5MjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YzI4YjIwM2UtODVjMy0wNDQxLWI1Y2EtNmUyZmFiMmY5OTI5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YzI4YjIwM2UtODVjMy0wNDQxLWI1Y2EtNmUyZmFiMmY5OTI5Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjMjhiMjAzZS04NWMzLTA0NDEtYjVjYS02ZTJmYWIyZjk5MjkiIHN0RXZ0OndoZW49IjIwMjItMDEtMjdUMDk6MDI6NTkrMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ste+bAAACmklEQVQ4ja1U30/TUBT+1nau69p1sM5BhaCRhMQnHhxKREEjGo3GxD/UmGiCRiIQUJSZoD4YMZJAgA5Yu67t7dZl6+bDnWXsl4R40odzT+/57ne/e84JNRoN/A/j+vyziGc7JG8UAKSSg3FJlEW+1+ZQJyOLeADer22QGhuTEkHcdYoi59+bmQLQidgOZBHv1eKaMDDch2mpkHs6P9OGdQroUC8uLGfllAqgVqv6rnEprUSjEQDlcmX/UOfEJMeFAVi69nhuKp2UuwBZxHvxZpWiuAXtzo3JMTXVxmUvpy+tb4pJlWI9f3g74NUEar3RiMxMjF/ppatFvK3tnf2iD6Bs5p7cb96RCXZQFLeg9UEBIIv8xNXLxNAARFukbDJ6+Xa1zg/WatXpayOjwwqAklf163WWOTmJLgU+DGBXy2/81FiWYyvmswczoHVkEc+pMjEevmuMDk8Gae+yv9vozGfGqTOmpj5kv7OJIbsSsognizwDwHYIrRf1YjLIaeXSNZhWEgBi8YTtkKZGtHYBCEJPaTpNEmPU0QtmEygUCp09v5cxAJTBAboolbyzZzrEpQ5NZwDEJZHYJoCDIyPY59frncmtwSPdBEBsMy6JoK8mi3z8QqMOcGJyL6fT52cZZj4z3vn81N/V8mEpBSDB41RB3r2VAcBx4aX1Tdr9Ah+WhIjAh4OPLgFYxFv59JVlOQCz09dPNGoKZOYAiEl1a3uHYnU1i3g/fm3TdiubuSDevWmJoc3e7NK0uwfHK5+/9Wtaaod6cWElKysqAN+vVR09rSRovdgOOTassKTQG1l57dFcZkhJdGEU8Hq9uBbtO9ham74nEP6O2uWPX+xKKBY/OdN1inKkQdX996htQyzajlEwcb7hfz77A4FdRaMt2QbfAAAAAElFTkSuQmCC')";

    var iconAddPerson = document.createElement('div');
    iconAddPerson.id = 'im_mark_plus_st';
    iconAddPerson.addEventListener("click", addNewPersone);
    iconAddPerson.style.cssFloat = "right";
    iconAddPerson.style.margin = "4px 4px 0 0";
    iconAddPerson.style.width = "24px";
    iconAddPerson.style.height = "24px";
    iconAddPerson.style.cursor = "pointer";
    iconAddPerson.style.opacity = "0.75";
    iconAddPerson.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAIuUExURQAAAOXs8avD1+zx9d/o7+Pq8O3x9czb5sXW493n7+Xs8evv9fP19+bt8qrD1/D097LI2v///qO+1P////////79/a/H2dTh6uzw9ajB1trl7Onv9NDd59Pg6fn6+6jB1vr7+6vE16jD16zF2Pr7/MbX5P39/d/o78rZ5N3n7rPJ2rTJ28va5cnY5LPJ2v7+/v39/uHq8LTJ2+Tr8cfY5L3P38rZ5Pn6+/39/b3Q4L7R4L3Q4Mza5a/F2PH198DS4NDd6PX3+dbh6tXg6bTK27bL3MHT4a7G2cHT4fj5+7XL3Njj6/r6+67G2bbM3Nrl7a7G2MPU4a7G2bDI2vX3+Mva5u7y9anC1tDe6KvE2KnE2K3G2uHq8MXX4urv9eTr8erv88PV4sTV4szb5sPU4sPV4cvZ5cTW4t/o7u3x9M3c5sza5sfY5LrP38XW47vO38XW47zP38PV4qjD18TW4uXs8bvO38TV483c587c59nj7MXX48PV4qbB1pe2z6nC16K+1KjB1qG905i3z6fC1pS1zp6806fC15y60qjD16TA1Za3z5q50ZKzzZGzzJm40Ji30KS/1JO0zZu60ZS0zZi2zpe2zqC805+906K+05W2zpa1zqG91Ju50Jy60ZS1zZ+70pq4z5660Zu50Zq40J270Zy70pGzzarC16XB1p2705KzzJ681J2806O+1KK+1Z270pa1z6C+1KjB16O/1ZS0zoOqxoKrxoWsx4Srx+O406YAAAB9dFJOUwBl+055ZEicsGxgUDZk6z7vCPsGARDfkU3+gVWPgiLxFuzz+g2nDVuwY+LhpKnlCA1l416hxZsUFsnHwprnKLWgIHZ81NKw570g2YEZ6NZ76rnv5yyfOv2X9vPwYKtIW0OdtJqdt6GwXECYmrDOrrGqsbX5rlLOsZaderW3sdZfvgAAAa5JREFUKM9jYIAAFXUza20tUxNNcwZkICyrOLW1f21bf+s0JRlRhDi/WO/kWjBorF3Wy8cME+de2trYAhTt6gLJtdT1MELEeRb11wMF6hvmzWvqBDEWN0uAxEUEWkHitQ3FGaXRTSBW/QRJA6CEVB/E+LpqBobK2WBme58DA4O+ck8jmNdcwMBQUQdR1DbRh8F42koIp7mcgYEdKrF5kj+DzhSQvc3d3TvKGBiKdnZ3N88BWrkxkMGqGWhvbU0JR2EVAwNnPkdeUnhTY22HH4PRqtquufHIwZDZ1FC7yZdBbw1QIg5ZIgQo0RDAYDmhtnZOZFo2eyInA0NMCntyaNB0oFFeDLqTams7m+rq6rbnMjCkbgMy2oDen+3BYDirFurcdIRzWyZ5M6it6IB6MJaBIQsqMX2dJwODeF8LmDMrh4EhYiskSJZrAB0hyFQHDsSmqISw4DZwIC6ZqAByHtvCyeBgn9E0E2RvbfuCKVwQh/NOndAOir0tDSDb2nvms8C8JC2/uq0F6p4ZvUKsCM9a2ExsretoWL+hrnWmqhxKOnF0cnN1t3Wxd7aDCgAAZxnBjWyiPhYAAAAASUVORK5CYII=')";
    menu.appendChild(iconToggleActivity);
    menu.appendChild(iconAddPerson);
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
function addNewPersone()
{
    var result = prompt("Введите Имя Фамилию как в диалоге!\\enter name and surname as in dialog!",'');
    if(result != null && result != '')
    {
        if(listOfIgnore.indexOf(result) == -1)
        {
            listOfIgnore.push(result);
            GM_setValue("listOfIgnore", JSON.stringify(listOfIgnore));
            console.log('Added new line');
        }
        else
        {
            console.log('Already in list at position ' + listOfIgnore.indexOf(result));
        }
    }
}
