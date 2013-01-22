var value = "";
var processid = "";
var transactionid = "";
var tabid = "";
var companyname = "";
// Display all visible links.
function showLinks() {
    //console.log(window.location.href);
    returnvalue = value.split("$$");
    document.getElementById('transaction').value = returnvalue[0];
    chrome.tabs.get(tabid, function (tab) {
        var tabUrl = tab.url;
        var contentToLookFor = "https://";
        var pos1 = tabUrl.indexOf(contentToLookFor);
        var posEnd = pos1 + contentToLookFor.length + 45; //random number.
        var strExtract = tabUrl.substring(pos1, posEnd);
        //console.log(strExtract);
        var newPos1 = contentToLookFor.length;
        var newPosEnd = strExtract.indexOf(".big");
        companyname = strExtract.substring(newPos1, newPosEnd);
        //console.log(companyname);
    });
    if (returnvalue[0].indexOf("Not") != -1) {
        document.getElementById('xmlview').disabled = "disabled";
    }
    transactionid = returnvalue[0];
    processid = returnvalue[1];
}




// Add links to allLinks and visibleLinks, sort and show them.  send_links.js is
// injected into all frames of the active tab, so this listener may be called
// multiple times.
chrome.extension.onRequest.addListener(function (links) {
    //alert(links[0].value);
    value = links;
    showLinks();
});

function showxml() {



    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                //console.log(xhr.responseText);
                var contentToLookFor = "edit_xslt.jsp?id=";
                var pos1 = xhr.responseText.indexOf(contentToLookFor);
                var posEnd = pos1 + contentToLookFor.length + 45; //random number.
                var strExtract = xhr.responseText.substring(pos1, posEnd);
                var newPos1 = contentToLookFor.length;
                var newPosEnd = strExtract.indexOf("\"");
                var xsl_id = strExtract.substring(newPos1, newPosEnd);
                //console.log(xsl_id);
                //callback(data);
                if (isNaN(xsl_id)) {
                    alert("You are not an Administrator to view the Document XML");
                } else {
                    //console.log(companyname);
                    url = "https://" + companyname + ".bigmachines.com/admin/commerce/views/preview_xml.jsp?bs_id=" + transactionid + "&xslt_id=" + xsl_id + "&view_type=document";
                    window.open(url);
                }
            } else {
                //callback(null);
            }
        }
    }

    // Note that any URL fetched here must be matched by a permission in
    // the manifest.json file!
    var url = 'https://' + companyname + '.bigmachines.com/admin/commerce/views/list_xslt.jsp?process_id=' + processid;
    //console.log(url);
    xhr.open('GET', url, true);
    xhr.send();
    //window.open("http://www.w3schools.com");
}

// Set up event handlers and inject send_links.js into all frames in the active
// tab.
window.onload = function () {
    document.getElementById('xmlview').onclick = showxml;
    chrome.windows.getCurrent(function (currentWindow) {

        chrome.tabs.query({
            active: true,
            windowId: currentWindow.id
        },

        function (activeTabs) {
            tabid = activeTabs[0].id;
            chrome.tabs.executeScript(
            activeTabs[0].id, {
                file: 'fetchvalue.js',
                allFrames: true
            });
        });
    });
};
