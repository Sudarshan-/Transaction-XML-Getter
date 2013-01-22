  var links = document.getElementsByName('id');
  var processid = document.getElementsByName('bm_cm_process_id');
  var retValue = string[];
  var param = string[];
  if (links[0] == undefined || links[0] == "undefined") {
      append(param, "transactionid");
      append(retValue, "Not a Quote Page");
  } else {
      append(param, "transactionid");
      append(retValue, links[0].value);
  }

  if (processid[0] == undefined || processid[0] == "undefined") {
      append(param, "processid");
      append(retValue, "Not a Quote Page");
  } else {
      append(param, "processid");
      append(retValue, processid[0].value);
  }

  chrome.extension.sendRequest(param, retValue);
