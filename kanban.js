export default class Kanban{

    static getTasks(columnId){
        const data = read().find(column => {
            return column.columnId == columnId;
        });
        
        return data.tasks;
    }

    static insertTask(columnId, content){
        const data = read();
        const column = data.find(column => {
            return column.columnId == columnId;
        });
        const task = {
            taskId: Math.floor(Math.random() * 100000),
            content: content
        };

        column.tasks.push(task);
        //console.log(data);
        save(data);

        return task;
    }


    static updateTask(taskId, updatedInformation){
        const data = read(); // read the data from our local storage

        function findColumnTask(){
            for(const column of data){
                const task = column.tasks.find(item => {
                    return item.taskId == taskId; //if there is a match - break
                });
    
                if(task){
                    return [task, column]; // return task and the corresponding column
                }
            }
        }

        const [task, currentColumn] = findColumnTask();

        const targetColumn = data.find(column => {
            return column.columnId == updatedInformation.columnId;
        });

        task.content = updatedInformation.content;  
        currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1); // remove old content from task element
        targetColumn.tasks.push(task);  // update task element with the new content

        save(data);
    }

    // delete the task with specific ID
    static deleteTask(taskId){
        const data = read();

        for(const column of data){
            const task = column.tasks.find(item => {
                return item.taskId == taskId;
            });

            if(task){
                column.tasks.splice(column.tasks.indexOf(task), 1);
            }            
        }

        save(data);
    }

    // load all the tasks
    static getAllTasks(){
        const data = read();
        columnCount();
        return [data[0].tasks, data[1].tasks, data[2].tasks];
    }
}

// this functions reads and returns our data from local storage in JSON format and returns
function read(){
    const data = localStorage.getItem("data");

    if(!data){
        return [
            {columnId: 0, tasks: []}, 
            {columnId: 1, tasks: []}, 
            {columnId: 2, tasks: []}
        ];
    }

    return JSON.parse(data);
}

function save(data){
    localStorage.setItem("data", JSON.stringify(data));
    columnCount();
}

function columnCount(){
    const data = read();

    const todo = document.querySelector("span.todo");
    todo.textContent = data[0].tasks.length;

    const pending = document.querySelector("span.pending");
    pending.textContent = data[1].tasks.length;

    const completed = document.querySelector("span.completed");
    completed.textContent = data[2].tasks.length;
}

