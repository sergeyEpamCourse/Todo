(function($, undefined) {
	$(function(){
	
		var show = {
			"all" : function() {
				$('[completed]').show();
			},
			"completed" : function() {
				$('[completed]').hide();
				$("[completed='yes']").show();
			},
			"notCompleted" : function() {
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
		
		function delTodo(storageName, index) {
			var todoArr = getStorageArr(storageName);
			
			todoArr.splice(index, 1);
			setStorageArr(storageName, todoArr);
		}
		
		function addTodoToStorage(inputTextArea, storageName) {
			var todoArr = getStorageArr(storageName);
			var text = $(inputTextArea).val();
			var newTodo = new Todo(text);
			
			todoArr.unshift(newTodo);
			setStorageArr(storageName, todoArr);
		}
		
		function changeCompleted(storageName, index) {
			var todoArr = getStorageArr(storageName);
			
			if (todoArr[index].completed === 'yes')
				todoArr[index].completed = 'no';
			else todoArr[index].completed = 'yes';
			setStorageArr(storageName, todoArr);
		}
		
		//on display
		function display(storageName) {
			displayTodoList("#todo_list", storageName);
			setCloseEvent(storageName, ".close");
			setCompletedButtonEvent(storageName, ".completedButton");
			show[nowDisplayTab]();
		}
		
		function getTodoIndex(elem) {
			return $(elem).parent()[0].getAttribute("todoIndex");
		}
		
		function displayTodoList(appendToElement, storageName) {
			var $appendElem = $(appendToElement).html("");

			$appendElem.append(createTodoHtmlList(storageName));
		}
		
		function createTodoHtmlList(storageName) {
			var todoArr = getStorageArr(storageName);
			
			//underscope create todos
			var closeButton = '<span class="close">Close</span>';
			var completedButton = '<span class="completedButton">Completed</span>';
			var todoText = '<div class="todo_text"><%=element.text %></div>';
			var templFunc = '<% _.each(arr, function(element, index) {%>';
			var templFuncEnd = '<% console.log(element.text); }); %>';
			var list = templFunc + '<li class="todos" todoIndex="<%=index %>" completed="<%=element.completed %>">' + todoText + closeButton + completedButton + '</li>' + templFuncEnd;
			var template = _.template(list);
			var html = template({arr : todoArr});
			
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
			$(elementGroup).click(function(event) {
				var that = event.currentTarget;
				var index = getTodoIndex(that);
				
				delTodo(storageName, +index);
				display(storageName);
				
				event.stopImmediatePropagation();
				return false;
			});
		}
		
		function setCompletedButtonEvent(storageName, elementGroup) {
			$(elementGroup).click(function(event) {
				var that = event.currentTarget;
				var index = getTodoIndex(that);
				
				changeCompleted(storageName, +index);
				display(storageName);
				
				event.stopImmediatePropagation();
				return false;
			});
		}
		
		function addTodo() {
			addTodoToStorage("#textEditor", 'todos');
			display('todos');
		}
		
		//on enter
		$("#enter").click(function(event) {
			addTodo();

			event.stopImmediatePropagation();
			return false;
		});
		
		//status buttons
		$("#allButton").click(function(event) {
			nowDisplayTab = "all";
			show[nowDisplayTab]();
			
			event.stopImmediatePropagation();
			return false;
		});
		
		$("#activeButton").click(function(event) {
			nowDisplayTab = "notCompleted";
			show[nowDisplayTab]();

			event.stopImmediatePropagation();
			return false;
		});
		
		$("#completedButton").click(function(event) {
			nowDisplayTab = "completed";
			show[nowDisplayTab]();

			event.stopImmediatePropagation();
			return false;
		});
		
		$('#textEditor').bind('keypress', function(e) {
			if (e.keyCode === 13) {
				addTodo();
			}
		});
		
		//display on load
		display('todos');
		
	});
})(jQuery);