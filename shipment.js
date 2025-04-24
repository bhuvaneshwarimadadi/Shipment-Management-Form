var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var dbName = "DELIVERY-DB";
var relationName = "SHIPMENT-TABLE";
var connToken = "90932573|-31949281496746100|90948772";

$(document).ready(function() {
    $("#shipNo").focus();
    disableAllFieldsExceptPrimaryKey();
    disableAllButtons();
});

function disableAllFieldsExceptPrimaryKey() {
    $("#description, #source, #destination, #shippingDate, #deliveryDate").prop("disabled", true);
}

function enableAllFields() {
    $("#description, #source, #destination, #shippingDate, #deliveryDate").prop("disabled", false);
}

function disableAllButtons() {
    $("#save, #update, #reset").prop("disabled", true);
}

function disablePrimaryKeyField() {
    $("#shipNo").prop("disabled", true);
}

function resetForm() {
    $("#shipmentForm")[0].reset();
    disableAllFieldsExceptPrimaryKey();
    disableAllButtons();
    $("#shipNo").prop("disabled", false);
    $("#shipNo").focus();
}

$("#shipNo").on("change", function() {
    var shipNo = $("#shipNo").val();
    if (shipNo === "") return;

    var jsonStrObj = {
        id: shipNo
    };
    
    var getRequest = createGET_BY_KEYRequest(connToken, dbName, relationName, JSON.stringify(jsonStrObj));
    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    
    if (result.status === 400) {
        enableAllFields();
        $("#save, #reset").prop("disabled", false);
        $("#update").prop("disabled", true);
        $("#description").focus();
    } else if (result.status === 200) {
        disablePrimaryKeyField();
        fillData(result);
        enableAllFields();
        $("#update, #reset").prop("disabled", false);
        $("#save").prop("disabled", true);
        $("#description").focus();
    }
});

function fillData(jsonObj) {
    if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        $("#description").val(data.description);
        $("#source").val(data.source);
        $("#destination").val(data.destination);
        $("#shippingDate").val(data.shippingDate);
        $("#deliveryDate").val(data.deliveryDate);
    }
}

function validateData() {
    var shipNo = $("#shipNo").val();
    var description = $("#description").val();
    var source = $("#source").val();
    var destination = $("#destination").val();
    var shippingDate = $("#shippingDate").val();
    var deliveryDate = $("#deliveryDate").val();
    
    if (shipNo === "") {
        alert("Shipment No. missing");
        $("#shipNo").focus();
        return "";
    }
    
    if (description === "") {
        alert("Description missing");
        $("#description").focus();
        return "";
    }
    
    if (source === "") {
        alert("Source missing");
        $("#source").focus();
        return "";
    }
    
    if (destination === "") {
        alert("Destination missing");
        $("#destination").focus();
        return "";
    }
    
    if (shippingDate === "") {
        alert("Shipping Date missing");
        $("#shippingDate").focus();
        return "";
    }
    
    if (deliveryDate === "") {
        alert("Delivery Date missing");
        $("#deliveryDate").focus();
        return "";
    }
    
    var jsonStrObj = {
        id: shipNo,
        description: description,
        source: source,
        destination: destination,
        shippingDate: shippingDate,
        deliveryDate: deliveryDate
    };
    
    return JSON.stringify(jsonStrObj);
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;
    
    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    
    resetForm();
}

function updateData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;
    
    var updateRequest = createUPDATERecordRequest(connToken, jsonStrObj, dbName, relationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    
    resetForm();
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}
