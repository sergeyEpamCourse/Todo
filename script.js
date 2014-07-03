(function ($, undefined) {
	$(function () {

		function isLocalStorageAvailable() {
			try {
				return 'localStorage' in window && window['localStorage'] !== null;
			} catch (e) {
				return false;
			}
		}

		var show = {
			"all" : function () {
				$('[completed]').show();
			},
			"completed" : function () {
				$('[completed]').hide();
				$("[completed='yes']").show();
			},
			"notCompleted" : function () {
				$('[completed]').hide();
				$("[completed='no']").show();
			}
		};

		var nowDisplayTab = "all";

		//ToDo object
		function Todo(text) {
			this.text = text;
			this.completed = 'no';
		}

		//storage operation
		function getStorageArr(storageName) {
			var todoArr = JSON.parse(localStorage.getItem(storageName));

			return todoArr || [];
		}

		function setStorageArr(storageName, arr) {
			localStorage.setItem(storageName, JSON.stringify(arr));
		}

		function clearAll(storageName) {
			setStorageArr(storageName, []);
		}

		function delTodo(storageName, index) {
			var todoArr = getStorageArr(storageName);

			todoArr.splice(index, 1);
			setStorageArr(storageName, todoArr);
		}

		function addTodoToStorage(inputTextArea, storageName) {
			var todoArr = getStorageArr(storageName);
			var todoText = $(inputTextArea).val();
			var newTodo = new Todo(todoText);

			todoArr.unshift(newTodo);
			setStorageArr(storageName, todoArr);
		}

		function addEditedTodoToStorage(inputTextArea, storageName) {
			var todoArr = getStorageArr(storageName);
			var newText = $(inputTextArea).val();
			var index = getTodoIndex(inputTextArea);
			todoArr[index].text = newText;
			setStorageArr(storageName, todoArr);
		}

		function changeCompleted(storageName, index) {
			var todoArr = getStorageArr(storageName);

			if (todoArr[index].completed === 'yes')
				todoArr[index].completed = 'no';
			else
				todoArr[index].completed = 'yes';
			setStorageArr(storageName, todoArr);
		}

		var editTodo = function (textEditor) {
			addEditedTodoToStorage(textEditor, 'todos');
			display('todos');
		}

		//on display
		function display(storageName) {
			displayTodoList("#todo_list", storageName);
			setCloseEvent(storageName, ".close");
			setCompletedButtonEvent(storageName, ".completedButton");
			setEditButtonEvent(storageName, ".editButton");
			show[nowDisplayTab]();
		}

		function getTodoIndex(elem) {
			return $(elem).parent()[0].getAttribute("todoIndex");
		}

		function displayTodoList(appendToElement, storageName) {
			var $appendElem = $(appendToElement).html("");

			$appendElem.append(createTodoHtmlList(storageName));
		}

		function editTodoForm(index) {
			var $todoElem = $('li[todoIndex="' + index + '"] > .todo_text');
			var todoText = $todoElem.text();

			var $todoEdit = $("<input type=\"text\" />").val(todoText);

			var $enterButton = $("<div class=\"enter\"><span class=\"enterName\">Enter</span></div>");

			$todoEdit.addClass("textEditor");
			
			$todoEdit.css({
				'width' : '100%',
				'display' : 'block'
			});

			$todoEdit = $todoEdit.add($enterButton);
			$todoElem.replaceWith($todoEdit);
			setEnterEvent(".enter", '.textEditor', editTodo);
		}

		function getTodoText(index) {
			return getStorageArr(storageName)[index].text;
		}

		function createTodoHtmlList(storageName) {
			var todoArr = getStorageArr(storageName);

			//underscope create todos
			var closeButton = '<span class="close">Close</span>';
			var completedButton = '<span class="completedButton">Completed</span>';
			var editButton = '<span class="editButton">Edit</span>';
			var todoText = '<div class="todo_text"><%=element.text %></div>';
			var templFunc = '<% _.each(arr, function(element, index) {%>';
			var templFuncEnd = '<% }); %>';
			var list = templFunc + '<li class="todos" todoIndex="<%=index %>" completed="<%=element.completed %>">' + todoText + closeButton + editButton + completedButton + '</li>' + templFuncEnd;
			var template = _.template(list);
			var html = template({
					arr : todoArr
				});

			/*
			//jQuery create todos
			var $todo = $([]);

			for (var i = 0; i < todoArr.length; i++) {
			var text = todoArr[i].text;
			if (text === "")
			text = "Empty todo.";
			var $todoText = $("<div />", {
			'class' : "todo_text",
			}).text(text);
			var $closeButton = $("<span />", {
			'class' : "close",
			}).text("Close");
			var $completedButton = $("<span />", {
			'class' : "completedButton",
			}).text("Completed");
			var $tmpTodo = $("<li />", {
			'class' : "todos",
			'todoIndex' : i,
			'completed' : todoArr[i].completed
			});

			$tmpTodo.append($todoText);
			$tmpTodo.append($closeButton);
			$tmpTodo.append($completedButton);
			$todo = $todo.add($tmpTodo);
			}

			return $todo;
			 */

			return html;
		}

		//on close
		function setCloseEvent(storageName, elementGroup) {
			$(elementGroup).click(function (event) {
				var that = event.currentTarget;
				var index = getTodoIndex(that);

				delTodo(storageName, +index);
				display(storageName);

				event.stopImmediatePropagation();
				return false;
			});
		}

		function setCompletedButtonEvent(storageName, elementGroup) {
			$(elementGroup).click(function (event) {
				var that = event.currentTarget;
				var index = getTodoIndex(that);

				changeCompleted(storageName, +index);
				display(storageName);

				event.stopImmediatePropagation();
				return false;
			});
		}

		function setEditButtonEvent(storageName, elementGroup) {
			$(elementGroup).click(function (event) {
				var that = event.currentTarget;
				var index = getTodoIndex(that);

				display('todos');
				editTodoForm(index);
				$(".textEditor")[0].focus();

				event.stopImmediatePropagation();
				return false;
			});
		}

		var addTodo = function (textEditor) {
			addTodoToStorage(textEditor, 'todos');
			display('todos');
		}

		//on enter
		function setEnterEvent(enterButton, enterField, func) {
			$(enterButton).click(function (event) {
				func(enterField);

				event.stopImmediatePropagation();
				return false;
			});

			$(enterField).bind('keypress', function (e) {
				if (e.keyCode === 13) {
					func(enterField);
				}
			});
		}

		//status buttons
		function activeButtonStyle(elem) {
			$('.navButton').removeClass('activeTab');
			$(elem).addClass('activeTab');
		}

		$("#allButton").click(function (event) {
			activeButtonStyle(event.currentTarget);

			nowDisplayTab = "all";
			show[nowDisplayTab]();

			event.stopImmediatePropagation();
			return false;
		});

		$("#activeButton").click(function (event) {
			activeButtonStyle(event.currentTarget);

			nowDisplayTab = "notCompleted";
			show[nowDisplayTab]();

			event.stopImmediatePropagation();
			return false;
		});

		$("#completedButton").click(function (event) {
			activeButtonStyle(event.currentTarget);

			nowDisplayTab = "completed";
			show[nowDisplayTab]();

			event.stopImmediatePropagation();
			return false;
		});

		$("#clearAllButton").click(function (event) {
			clearAll('todos');
			display('todos');
			nowDisplayTab = "all";
			show[nowDisplayTab]();

			event.stopImmediatePropagation();
			return false;
		});

		//on load
		if (!isLocalStorageAvailable()) {
			alert('localStorage no support!');
		}
		setEnterEvent("#enter", '.mainTextEditor', addTodo);
		display('todos');
		$("#allButton").click();

	});
})(jQuery);
