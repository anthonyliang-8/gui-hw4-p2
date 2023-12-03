/*
  Name: Anthony Liang
  Course: GUI I
  Email: anthony_liang@student.uml.edu
*/

$(document).ready(function () {
  formValidate();
  initSliders();
  removeAllTabs();
});

/* sets slidersToggle to false so sliders can be built properly and then set to false
 afterwards so input fields won't be reinitialized and stuck at 0
 */
var slidersToggle = false;

// get html values to use in javascript
const tbody = document.getElementById("tbody");
const thead = document.getElementById("thead");
const formDiv = document.getElementById("form-div");
const err = document.getElementById("err");

function initSliders() {
  // check if sliders are not initialized
  if (!slidersToggle) {
    createSlider("min_col_val", "min_col_slider");
    createSlider("max_col_val", "max_col_slider");
    createSlider("min_row_val", "min_row_slider");
    createSlider("max_row_val", "max_row_slider");

    slidersToggle = true; // set to true after initializing
  }
}

// function to generate the table based on user input
function createTable() {
  var min_col_val = parseInt(document.getElementById("min_col_val").value);
  var max_col_val = parseInt(document.getElementById("max_col_val").value);
  var min_row_val = parseInt(document.getElementById("min_row_val").value);
  var max_row_val = parseInt(document.getElementById("max_row_val").value);

  // clears tbody and thead for empty table
  $("#table-div table tbody").empty();
  $("#table-div table thead").empty();

  $("#col-err").empty();
  $("#row-err").empty();

  // create a table row element specifically for the header
  const trHeader = document.createElement("tr");
  // append a table header to the table row
  trHeader.appendChild(document.createElement("th"));
  // iterate through columns and create table header cells
  for (var col = min_col_val; col <= max_col_val; col++) {
    const th = document.createElement("th");
    th.innerText = col;
    trHeader.appendChild(th);
  }
  $("#table-div table thead").append(trHeader);

  // iterate through rows to create table data rows
  for (var row = min_row_val; row <= max_row_val; row++) {
    // create a table row element for data
    const trData = document.createElement("tr");
    // create a table header cell for the row header
    const th = document.createElement("th");
    th.innerText = row;
    trData.appendChild(th);
    // iterate through columns and create table header cells
    for (var col = min_col_val; col <= max_col_val; col++) {
      const td = document.createElement("td");
      // calculate and display the result in the cell
      const result = row * col;
      td.innerText = result;
      // append the data cell to the data row
      trData.appendChild(td);
    }
    $("#table-div table tbody").append(trData); // append
  }
  if ($("#form").valid()) {
    $("#col-err").empty();
    $("#row-err").empty();
  }
}

function formValidate() {
  /* the following two methods are used to check whether or not the the minimum values are bigger than the maximum value */
  /* https://jqueryvalidation.org/jQuery.validator.addMethod/ */
  // create a new method to check the minimum column value
  $.validator.addMethod(
    "minColValCheck",
    // references element, then value of the element, and then parses as an int to make sure max val is bigger than min val
    function (e, val, params) {
      var minValInput = $("#" + params[0]);
      var maxValInput = $("#" + params[1]);
      return parseInt(minValInput.val()) <= parseInt(maxValInput.val());
    },
    "Min col value must be less than or equal to the max value."
  );
  /* https://jqueryvalidation.org/jQuery.validator.addMethod/ */
  // create a new method to check the minimum row value
  $.validator.addMethod(
    "minRowValCheck",
    // references element, then value of the element, and then parses as an int to make sure max val is bigger than min val
    function (e, val, params) {
      // create jquery
      var minField = $("#" + params[0]);
      var maxField = $("#" + params[1]);
      return parseInt(minField.val()) <= parseInt(maxField.val());
    },
    "Min row value must be less than or equal to the max value."
  );

  $("#form").validate({
    /* create rules for the form to validate */
    rules: {
      min_col_val: {
        required: true,
        number: true,
        min: -250,
        max: 250,
      },
      max_col_val: {
        required: true,
        number: true,
        min: -250,
        max: 250,
        minColValCheck: ["min_col_val", "max_col_val"], // use the jquery method created earlier to check between min and max col value
      },
      min_row_val: {
        required: true,
        number: true,
        min: -250,
        max: 250,
      },
      max_row_val: {
        required: true,
        number: true,
        min: -250,
        max: 250,
        minRowValCheck: ["min_row_val", "max_row_val"], // use the jquery method created earlier to check between min and max row value
      },
    },
    // error messages to direct user to finding/correcting them
    messages: {
      min_col_val: {
        required: "No number found for min col, please enter a number.",
      },
      max_col_val: {
        required: "No number found for max col, please enter a number.",
      },
      min_row_val: {
        required: "No number found for min row, please enter a number.",
      },
      max_row_val: {
        required: "No number found for max row, please enter a number.",
      },
    },
    // only run the following functions if the form passes validation successfully
    submitHandler: function (form) {
      if ($("#form").valid() == true) {
        createTable(); // generate table only if there are no errors
        createTabs(); // create the tabs once the form is successfully validated
        form.reset(); // clear form data after successful submission
      }
    },
    // create the error statement element as a div and put it after the input field
    errorElement: "div",
    errorPlacement: function (error, element) {
      element.after(error);
    },
  });
}

function createTabs() {
  var tab_num = $("#table-tabs ul li").length; // get the number of existing tabs

  // get table dimension values
  var min_col_val = parseInt(document.getElementById("min_col_val").value);
  var max_col_val = parseInt(document.getElementById("max_col_val").value);
  var min_row_val = parseInt(document.getElementById("min_row_val").value);
  var max_row_val = parseInt(document.getElementById("max_row_val").value);

  // initialize tabs
  $("#table-tabs").tabs();

  /* append html content so that the tab can have text
    representing the table dimensions 
  */
  $("#table-tabs ul").append(
    "<li class='tab' id='" +
      tab_num +
      "'><a href='#tab_" +
      tab_num +
      "'> (" +
      min_col_val +
      ", " +
      max_col_val +
      ") , (" +
      min_row_val +
      ", " +
      max_row_val +
      ")</a><button class='close-tab' data-index='" +
      tab_num +
      "'>x</button></li>"
  );

  // new div to hold table content
  var tableContentDiv = $("<div>").append(
    $("#table-div table").clone() // clone table
  );

  /* https://stackoverflow.com/questions/14702631/in-jquery-ui-1-9-how-do-you-create-new-tabs-dynamically */
  // append table generated to the tab content div
  //tab_content will be generated by jquery
  $("#table-tabs").append(
    '<div class="tab_content" id="tab_' + tab_num + '"></div>'
  );

  // Append the cloned table content div to the tab content div
  $("#tab_" + tab_num).append(tableContentDiv.html());

  /* https://stackoverflow.com/questions/1581751/removing-dynamic-jquery-ui-tabs */
  // remove a tab by clicking the close button
  $(".close-tab").on("click", function () {
    var tabId = $(this).data("index");
    $("#tab_" + tabId).remove(); // remove the content div associated with the tab
    $(this).parent().remove(); // remove tab
    $("#table-tabs").tabs("refresh");
  });

  // refresh the tab when adding to the DOM
  // https://www.geeksforgeeks.org/jquery-ui-tabs-refresh-method/
  $("#table-tabs").tabs("refresh");
  $("#table-tabs").tabs("option", "active", -1);
}

// function assigned for a button to remove all the tabs at once on click
/* https://stackoverflow.com/questions/1581751/removing-dynamic-jquery-ui-tabs */
function removeAllTabs() {
  $("#remove-all-tabs-btn").on("click", function () {
    // finds each tab
    $("#table-tabs ul li").each(function () {
      var tabId = $(this).attr("id");
      $("#tab_" + tabId).remove(); // remove the content div associated with the tab
      $(this).remove(); // remove tab
    });
    // https://www.geeksforgeeks.org/jquery-ui-tabs-refresh-method/
    // refresh tabs when removing it to update status in DOM
    $("#table-tabs").tabs("refresh");
  });
}

// function to build the slider, passes in id of inputs and id of the slider elements
function createSlider(inputId, sliderId) {
  // set the following min max values for the sliders
  $("#" + sliderId).slider({
    range: "min",
    min: -250,
    max: 250,
    slide: function (e, ui) {
      // use value of the specified id passed in
      $("#" + inputId).val(ui.value);
      createTable(); // generate table dynamically once the slider is moved
    },
  });
  $("#" + inputId).on("input", function () {
    $("#" + sliderId).slider("value", $(this).val());
    createTable(); // generate table dynamically once the slider is moved
  });
}

// create the sliders for each input field
createSlider("min_col_val", "min_col_slider");
createSlider("max_col_val", "max_col_slider");
createSlider("min_row_val", "min_row_slider");
createSlider("max_row_val", "max_row_slider");
