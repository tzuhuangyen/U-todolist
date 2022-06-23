"use strict";

var section = document.querySelector("section");
var add = document.querySelector("form button");
add.addEventListener("click", function (e) {
  // prevent form from being submit 因為我們是要新增至下面的section 代替遞交出去
  e.preventDefault(); //get the input values

  var form = e.target.parentElement; //這個 e代表button須找到父層範圍
  //console.log(e.target.parentElement)
  //找到父層後會顯示你需要的呈現的序號[]
  // value是用來取得當user輸入的值

  var toDoText = form.children[0].value;
  var todoMonth = form.children[1].value;
  var todoDate = form.children[2].value; //toDoText新增欄位是空白時 當按下新增按鈕 section不要出現空白 list

  if (toDoText === "") {
    alert("what chaos you have to do?");
    return; //必須使用return 否則一樣會在section新增一個空白list
  } //create a to do list


  var todo = document.createElement("div");
  todo.classList.add("todo");
  var text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = toDoText; //這個todoText是指 form.children[0].value;
  //以上是新增在section的list 文字

  var time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate; //在整個todo裡面加入text &time

  todo.appendChild(text);
  todo.appendChild(time); //create check & delete button

  var completeButton = document.createElement("button");
  completeButton.classList.add("Complete");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>'; //完成鈕關開設定

  completeButton.addEventListener("click", function (e) {
    var todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  }); //create a delete button

  var deleteButton = document.createElement("button");
  deleteButton.classList.add("Delete");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; //刪除紐開關設定

  deleteButton.addEventListener("click", function (e) {
    var todoItem = e.target.parentElement; //按下刪除鍵後會有原本的地方會有空格 因scrollDown還存在html so,
    //當scrollDown動畫結束時 再remove 所以可以使用callback

    todoItem.addEventListener("animationend", function () {
      //remove data from local storage
      var text = todoItem.children[0].innerText;
      var myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach(function (item, index) {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      todoItem.remove();
    }); //按下刪除按鈕後 下面的事項會逐漸縮小

    todoItem.style.animation = "scaleDown 0.3s forwards";
  });
  todo.appendChild(completeButton);
  todo.appendChild(deleteButton); //按下新增按鈕後 下面的事項會逐漸放大

  todo.style.animation = "scaleUp 0.5s forwards"; //建立資料庫 local storage
  //要先create an object

  var myTodo = {
    todoText: toDoText,
    todoMonth: todoMonth,
    todoDate: todoDate
  }; //all the todo lists are objects so store date into an array of objects

  var myList = localStorage.getItem("list");

  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    //如果之前有資料就顯示出來
    var myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }

  console.log(JSON.parse(localStorage.getItem("list"))); //新增玩list後 及清空list欄位

  form.children[0].value = ""; //然後在把整個todo新增到section裡

  section.appendChild(todo);
}); //新開網頁後 把舊資料loading 到頁面

var myList = localStorage.getItem("list");

if (myList !== null) {
  var myListArray = JSON.parse(myList);
  myListArray.forEach(function (item) {
    //create a todo
    var todo = document.createElement("div");
    todo.classList.add("todo");
    var text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = item.todoText;
    var time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = item.todoMonth + "/" + item.todoDate;
    todo.appendChild(text);
    todo.appendChild(time); //create check and bin

    var completeButton = document.createElement("button");
    completeButton.classList.add("Complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>'; //完成鈕關開設定

    completeButton.addEventListener("click", function (e) {
      var todoItem = e.target.parentElement;
      todoItem.classList.toggle("done");
    }); //create delete button

    var deleteButton = document.createElement("button");
    deleteButton.classList.add("Delete");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; //刪除紐開關設定

    deleteButton.addEventListener("click", function (e) {
      var todoItem = e.target.parentElement; //按下刪除鍵後會有原本的地方會有空格 因scrollDown還存在html so,
      //當scrollDown動畫結束時 再remove 所以可以使用callback

      todoItem.addEventListener("animationend", function () {
        //remove data from local storage
        var text = todoItem.children[0].innerText;
        var myListArray = JSON.parse(localStorage.getItem("list"));
        myListArray.forEach(function (item, index) {
          if (item.todoText == text) {
            myListArray.splice(index, 1);
            localStorage.setItem("list", JSON.stringify(myListArray));
          }
        }); //這個remove只是從html結構移除

        todoItem.remove();
      }); //按下刪除按鈕後 下面的事項會逐漸縮小

      todoItem.style.animation = "scaleDown 0.3s forwards";
    });
    todo.appendChild(completeButton);
    todo.appendChild(deleteButton);
    section.appendChild(todo);
  });
} //篩選合併演算法


function mergeTime(arr1, arr2) {
  var result = [];
  var i = 0;
  var j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i].todoMonth > arr2[j].todoMonth) {
      result.push(arr2[j]);
      j++;
    } else if (arr1[i].todoMonth < arr2[j].todoMonth) {
      result.push(arr1[i]);
      i++;
    } else if (arr1[i].todoMonth == arr2[j].todoMonth) {
      if (arr1[i].todoDate > arr2[j].todoDate) ;
      result.push(arr2[j]);
      j++;
    } else {
      result.push(arr1[i]);
      i++;
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSore(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    var middle = Math.floor(arr.length / 2);
    var right = arr.slice(0, middle);
    var left = arr.slice(middle, arr.length);
    return mergeTime(mergeSore(right), mergeSore(left));
  }
}

console.log(mergeSore(JSON.parse(localStorage.getItem("list"))));
//# sourceMappingURL=all.js.map
