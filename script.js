let BottleCount = 0;
const PortionCount = 4;

const ColorPalette = [
    "#00FF00", "#1877F2", "#e41c38", "#FFFF00", "#8B4513", "#808080",
    "#FFA500", "#00FFFF", "#FF00FF", "#663399", "#808000", "#008080"
];
const ColorCount = ColorPalette.length;

let Initial_State;

function update_color_preview(){
    let color = parseInt(document.getElementById("portion-color").value);
    document.getElementById("color-preview").style.backgroundColor = ColorPalette[color-1];
}
update_color_preview();
document.getElementById("portion-color").addEventListener("change", update_color_preview);

function create_row_bottles(row, count) {
    row.innerHTML = "";
    for (let index = 0; index < count; index++) {
        let str = "<div class='bottle'>";
        for(let i = 0; i < PortionCount-1; i++) {
            str += "<div class='portion'></div>";
        }
        str += "<div class='portion' style='border-radius: 0px 0px 10px 10px;'></div>";
        str += "</div>";
        row.innerHTML += str;
    }
}

function create_bottles() {
    let row1_bottles = Math.ceil(BottleCount/2);
    create_row_bottles(document.getElementById("row1"), row1_bottles)
    let row2_bottles = BottleCount - row1_bottles;
    create_row_bottles(document.getElementById("row2"), row2_bottles)
    Initial_State = new State(BottleCount);
    for(let i = 0; i < BottleCount; i++) {
        Initial_State[i] = new Bottle(PortionCount);
        for(let j = 0; j < PortionCount; j++)
            Initial_State[i][j] = 0;
    }
}

document.getElementById("submit1").addEventListener("click", function(){
    let count = document.getElementById("bottle-count").value;
    if(count < 2 || 20 < count) {
        document.getElementById("submit1-result").innerText = "out of range!";
        return;
    }
    BottleCount = parseInt(count)
    document.getElementById("bottle-select").max = BottleCount;
    create_bottles();
    document.getElementById("process-field").style.visibility = "visible";
    document.getElementById("submit1-result").innerText = "";
    document.getElementById("submit2-result").innerText = "";
    document.getElementById("submit3-result").innerText = "";
    document.getElementById("result").innerText = "";
});

function find_bottle(number) {
    let row;
    if(number <= Math.ceil(BottleCount/2)) {
        row = document.getElementById("row1");
    }
    else {
        row = document.getElementById("row2");
        number = number - Math.ceil(BottleCount/2);
    }
    return row.children[number-1];
}

document.getElementById("submit2").addEventListener("click", function(){
    if(BottleCount == 0) {
        document.getElementById("submit2-result").innerText = "first create the bottles!";
        return;
    }
    let bottle_selector = document.getElementById("bottle-select");
    let bottle = parseInt(bottle_selector.value);
    if(bottle > BottleCount || bottle < 1) {
        document.getElementById("submit2-result").innerText = "selected bottle is out of range!";
        return;
    }
    let portion_selector = document.getElementById("portion-select");
    let portion = parseInt(portion_selector.value);
    let color = parseInt(document.getElementById("portion-color").value);
    find_bottle(bottle).children[PortionCount-portion].style.backgroundColor = ColorPalette[color-1];
    Initial_State[bottle-1][portion-1] = color;
    if(portion < PortionCount) {
        portion_selector.selectedIndex -= 1;
    }
    else if (portion == PortionCount && bottle < BottleCount) {
        portion_selector.selectedIndex = PortionCount - 1;
        bottle_selector.value = bottle + 1;
    }
    document.getElementById("submit2-result").innerText = "";
    document.getElementById("submit3-result").innerText = "";
    document.getElementById("result").innerText = "";
});

document.getElementById("submit3").addEventListener("click", function(){
    document.getElementById("submit3-result").style.color = "red";
    document.getElementById("result").innerText = "";

    if(!is_valid(Initial_State, ColorCount)) {
        document.getElementById("submit3-result").innerText = "input state is not valid!";
        return;
    }
    Solution = [];
    if(solve(Initial_State)) {
        document.getElementById("submit3-result").innerText = "Solution Found!";
        document.getElementById("submit3-result").style.color = "green";
        let text = "";
        for(let i = Solution.length-1; i > 0; i--) {
            text += (Solution[i].loc+1) + " -> " + (Solution[i].dst+1) + " | ";
        }
        text += (Solution[0].loc+1) + " -> " + (Solution[0].dst+1);
        document.getElementById("result").innerText = text;
    }
    else {
        document.getElementById("submit3-result").innerText = "couldn't solve the problem!";        
    }
});