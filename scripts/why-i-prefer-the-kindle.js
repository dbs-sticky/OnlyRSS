// var dt = new Date();
// document.getElementById("datetime").innerHTML =
//  ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2);



var currentPage = 0;
function goToPage(pageNumber) {
  const main = document.getElementById("main_place");
  const div = document.getElementById("section" + pageNumber);
  const clone = div.cloneNode(true);
  while (main.firstChild) main.firstChild.remove();
  main.appendChild(clone);
  currentPage = pageNumber;
}

function goNextPage() {
  goToPage(currentPage + 1);
}

function goPreviousPage() {
  goToPage(currentPage - 1);
}

function darkToggle() {
  var element = document.body;
  element.classList.toggle("dark-toggle");
}


