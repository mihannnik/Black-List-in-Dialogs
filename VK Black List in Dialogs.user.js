// ==UserScript==
// @name         VK Black List in Dialogs
// @namespace    http://tampermonkey.net/
// @version      1.3.1
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
var checkMessage;
const observer = new MutationObserver(Mutated);
(function() {
    'use strict';
    do
    {
        chat_container = document.querySelector('[class="_im_peer_history im-page-chat-contain"]');
    }
    while(chat_container == null)

    listOfIgnore = JSON.parse(GM_getValue("listOfIgnore", '[]'));

    if(GM_getValue('CheckType', false) == true)
    {
        checkMessage = function(currentMessage) { if(currentMessage.querySelector('[class="im-mess-stack--lnk"]') != null && listOfIgnore.indexOf(currentMessage.querySelector('[class="im-mess-stack--lnk"]').firstChild.textContent) != -1){currentMessage.innerText = "";console.log("find!");}};
    }
    else
    {
        checkMessage = function(currentMessage) {if(currentMessage.querySelector('[class="im-mess-stack--lnk"]') != null && listOfIgnore.indexOf(currentMessage.querySelector('[class="im-mess-stack--lnk"]').href) != -1){currentMessage.innerText = "";console.log("find!");}};
    }

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
// function checkMessage(currentMessage)
// {
//     if(currentMessage.querySelector('[class="im-mess-stack--lnk"]') != null && listOfIgnore.indexOf(currentMessage.querySelector('[class="im-mess-stack--lnk"]').href.textContent) != -1)
//     {
//         currentMessage.innerText = '';
//         console.log("find!");
//     }
// }

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
    if(GM_getValue('Enabled') == true)
    {
        iconToggleActivity.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAELUExURQAAAKbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1gJmyQoAAABYdFJOUwB6DAHyWOUG6Q1T3f6JBVxSId7cGg7klHYxY2duB9X7gdmD6uFHo+h//ammPeMDMO7rfDu2daxNrxLiM13tGNaTc+Bg82wokiYRuWWyF/bb0goIcEmenFoMaCZVAAAA9UlEQVQoz52S11bCQBRFCUIIRarSVRSx995BrAjYy/7/L3HukDHJWj5xHmbOOvuuk2QmodDYii4VVlP59cxEMM7O4yof9eeTsLiykcvtWwV4COQNU2FByeQtyHhTCUi4tsmCv7fMbdodWZYtpiWuy40Ga1hqTc86SsmwsnccaLBJRa0zKf2208res6sBTEmTI3kkruwp/A96LrDZFjD3V/XIpQZHHApIRpRseXiNp9HxUZQtHBfJAbzQ12Brhz3/B9Z5fh+5Y8h6+Sf8GN+BsvEf8OVNlaB9fX41rNRf4dvfe1E0F+VUg1cYq56cgT2ovY39c/wC4vouKteFZysAAAAASUVORK5CYII=')";
    }
    else
    {
        iconToggleActivity.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEvUExURQAAAKbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1pWakzwAAABkdFJOUwDw8v1YelINAlyJ1hoB3uXcUwoh5AgxknZnbt+qLzmfB3cgGeqDR4Gp4ynZ6O4DtnWsjocwTet8/js9f+GjEqaC7a5g8yjiBTJjM+BslBgbH5MGcyYRZbkXstL26dtJYlmcnnAqDx0RAAAA/klEQVQoz52S11YCMRRFQRh0LIB0sGBDQey9K3ZQbKBixbL//xtMQrKGWb5xH2afOecma5I7Hk/H5d8P+7aCh/aA2w4U0RX0t/u9sLe7E41uW2FIuvwZs4UFVeNPg+10DUJAyyly4jk5q19TnF7oljmJCd+4Tq44UcxjSYxBtkcZ1ywqFkhIdHuhb0SqMzZUAP0q6JLHWBWLDuB/sCKCRx2EWDNbDY1KVaekgmWWJOIwHFFGmufW9RGTuONIf+4HT4oL82wK3F5qP8NbvKXWnUsQ9QlfRichZfQv/Dhd9+JstcpNI5F5he/2gdgxM6j3pnuED+Xjcwi9pCMd/xx/YyA1UK0RS58AAAAASUVORK5CYII=')";
    }

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
        document.getElementById('im_mark_stop_st').style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEvUExURQAAAKbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1pWakzwAAABkdFJOUwDw8v1YelINAlyJ1hoB3uXcUwoh5AgxknZnbt+qLzmfB3cgGeqDR4Gp4ynZ6O4DtnWsjocwTet8/js9f+GjEqaC7a5g8yjiBTJjM+BslBgbH5MGcyYRZbkXstL26dtJYlmcnnAqDx0RAAAA/klEQVQoz52S11YCMRRFQRh0LIB0sGBDQey9K3ZQbKBixbL//xtMQrKGWb5xH2afOecma5I7Hk/H5d8P+7aCh/aA2w4U0RX0t/u9sLe7E41uW2FIuvwZs4UFVeNPg+10DUJAyyly4jk5q19TnF7oljmJCd+4Tq44UcxjSYxBtkcZ1ywqFkhIdHuhb0SqMzZUAP0q6JLHWBWLDuB/sCKCRx2EWDNbDY1KVaekgmWWJOIwHFFGmufW9RGTuONIf+4HT4oL82wK3F5qP8NbvKXWnUsQ9QlfRichZfQv/Dhd9+JstcpNI5F5he/2gdgxM6j3pnuED+Xjcwi9pCMd/xx/YyA1UK0RS58AAAAASUVORK5CYII=')";
    }
    else
    {
        GM_setValue('Enabled', true);
        observer.observe(chat_container, config);
        console.log("Observer is online!");
        document.getElementById('im_mark_stop_st').style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAELUExURQAAAKbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1qbB1gJmyQoAAABYdFJOUwB6DAHyWOUG6Q1T3f6JBVxSId7cGg7klHYxY2duB9X7gdmD6uFHo+h//ammPeMDMO7rfDu2daxNrxLiM13tGNaTc+Bg82wokiYRuWWyF/bb0goIcEmenFoMaCZVAAAA9UlEQVQoz52S11bCQBRFCUIIRarSVRSx995BrAjYy/7/L3HukDHJWj5xHmbOOvuuk2QmodDYii4VVlP59cxEMM7O4yof9eeTsLiykcvtWwV4COQNU2FByeQtyHhTCUi4tsmCv7fMbdodWZYtpiWuy40Ga1hqTc86SsmwsnccaLBJRa0zKf2208res6sBTEmTI3kkruwp/A96LrDZFjD3V/XIpQZHHApIRpRseXiNp9HxUZQtHBfJAbzQ12Brhz3/B9Z5fh+5Y8h6+Sf8GN+BsvEf8OVNlaB9fX41rNRf4dvfe1E0F+VUg1cYq56cgT2ovY39c/wC4vouKteFZysAAAAASUVORK5CYII=')";
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
