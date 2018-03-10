var App = (function(){

    var todos = null;

    /* Firebase Database Rule Read/Write must be true */

    // Initialize Firebase
    var config = {
        apiKey: "...",
        authDomain: "...",
        databaseURL: "...",
        projectId: "...",
        storageBucket: "...",
        messagingSenderId: "..."
    };

    /* 綁定事件 */
    function _bindEvent() {
        console.log("Event binding now...");
        $('#add').on('click', _handleAddEvent);
        // 綁定條件在 class='todolist'底下且擁有class='delete-icon'之元素
        $('#todolist').on('click', '.card-block .delete-icon', _handleDeleteEvent)
        $('#clear').on('click', _clear);
        console.log("Event binding sucessful!");
    }

    /* 新增TODO */
    function _handleAddEvent() {
        let content = $('#inputContent').val();
        let title = '快速便籤';
        todos.push({
            'title': title,
            'time': Date(),
            'content': content
        });
        $('#inputContent').val('');
    }

    /* 刪除TODO */
    function _handleDeleteEvent() {
        let key = $(this).parents('.card-block').attr('data-key');
        todos.child(key).remove();
    }

    /* TODOs 渲染 */
    function _renderTodo() {
        console.log("Rendering...");
        let list = $('#todolist');
        todos.on('value', function(snapshot){
            list.html('');
            $('.loading').css('display', 'block');
            $('.container-fluid').css('display', 'none');
            let data = snapshot.val();
            for(let key in data) {
                list.append(`
                <div class="card m-2">
                    <div class="card-block p-2" data-key="${key}">
                        <div class="d-flex mb-2 justify-content-between">
                            <span class="h4 mb-0 card-title">${data[key].title} <small class="h6 text-muted">${data[key].time}</small></span>
                            <i class="delete-icon mt-1 mr-1 justify-content-end fas fa-times"></i>
                        </div>
                        <p class="card-text">${data[key].content}</p>
                    </div>
                </div>
                `);
            }
            $('.loading').css('display', 'none');
            $('.container-fluid').css('display', 'block');
        });
        console.log("Render sucessful!");
    }

    function _clear() {
        todos.set({});
        console.log("Clear sucessful!");
    }

    function init() {
        console.log("Initialzating!");
        firebase.initializeApp(config);
        todos = firebase.database().ref('todos');
        _bindEvent();
        _renderTodo();
        console.log("Initialzation sucessful!");
    }

    return {
        init
    };
})();