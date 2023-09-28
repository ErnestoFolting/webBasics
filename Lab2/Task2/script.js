document.addEventListener("DOMContentLoaded", function () {
  var table = document.getElementById("myTable");
  var currentPaletteColor = "blue";

  var cellNumber = 5;

  var colorInput = document.getElementById("colorInput");
  var colorPickerButton = document.getElementById("colorPickerButton");

  colorPickerButton.addEventListener("click", function () {
    currentPaletteColor = colorInput.value;
  });

  for (var i = 1; i <= 6; i++) {
    var row = table.insertRow(i - 1);
    for (var j = 1; j <= 6; j++) {
      var cell = row.insertCell(j - 1);
      cell.textContent = (i - 1) * 6 + j;

      if (cell.textContent == cellNumber) {
        cell.addEventListener("mouseenter", function () {
          this.style.backgroundColor = getRandomColor();
        });

        cell.addEventListener("click", function () {
          this.style.backgroundColor = currentPaletteColor;
        });
      }

      cell.addEventListener("dblclick", function () {
        var cellsInRow = this.parentElement.cells;
        for (var k = 0; k < cellsInRow.length; k++) {
          if (k % 2 != cellNumber % 2) {
            cellsInRow[k].style.backgroundColor = currentPaletteColor;
          }
        }
      });
    }
  }

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});
