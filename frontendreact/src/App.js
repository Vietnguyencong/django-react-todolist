import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      todolist:[
      ],
      activeItem:{
        id:null,
        title:'',
        completed:false,
      },
      editting:false,

      }
      this.fetchTasks = this.fetchTasks.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handdleSubmit = this.handdleSubmit.bind(this)
      this.getCookie = this.getCookie.bind(this)
      // this.deleteItem = this.deleteItem.bind(this)
      // this.startEdit = this.startEdit.bind(this)
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
  componentWillMount(){
    this.fetchTasks()
  } 

  fetchTasks(){
    console.log('fetching...')
    var url = 'http://127.0.0.1:8000/api/task-list/' 

    // var wrapper = document.getElementById('list-wrapper')
    // wrapper.innerHTML = ''
    fetch(url)
    .then((res)=>res.json())
    .then((data) => {
      console.log("data:", data)
      this.setState({
        todolist: data
      })
    })            
            
            
  }
  handleChange(e){
    // get the id 
    var name = e.target.name
    // get the value in the form 
    var value =  e.target.value
    console.log("naem:", name)
    console.log("value:", value)

    // update the active item when typing 
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handdleSubmit(e){
    e.preventDefault()
    console.log(
      "item", this.state.activeItem
    )
    
    var token = this.getCookie('csrftoken')
    var url ='http://127.0.0.1:8000/api/task-create/'
    if (this.state.editting === true){
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}`
      this.setState(
        {
        editting: false
        }
      )
    }
    fetch(url,{
      method:"POST",
      headers: {
        'Content-type' :'application/json',
        'X-CSRFToken': token
      },
      body:JSON.stringify(this.state.activeItem)

    })
    .then((res)=>{
      this.fetchTasks()
      this.setState({
        activeItem:{
          id:null,
          title:'',
          completed:false,
        },
      })
    })
    .catch((error)=>{
      console.log("ERROR:", error)
    })
  }

  startEdit(task){
    this.setState({
      activeItem:task,
      editting:true,
    })

  }
  deleteItem(task){
    var token = this.getCookie('csrftoken')
    console.log(token)
    var url = `http://127.0.0.1:8000/api/task-delete/${task.id}`
    fetch(url, {
      method:"DELETE",
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': token
      }
    })
    .then((res)=>{
      this.fetchTasks()
    })
    .catch((ERROR)=>{
      console.log("error:", ERROR)
    })
  }

  strikeUnstrike(task){
    var token = this.getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}`
    fetch(url, {
      method:"POST",
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': token
      },
      body:JSON.stringify({'title': task.title, 'completed': !task.completed})
    })
    .then((res)=>{
      this.fetchTasks()
    })
    .catch((ERROR)=>{
      console.log("error:", ERROR)
    })
  }
  render(){
    var tasks = this.state.todolist
    var self = this
    return (
    <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handdleSubmit} id="form">
                < div class="flex-wrapper">
                  <div style={{flex: 6}}>
                    <input onChange={this.handleChange} id="title" class="form-control" type="text" name="title" placeholder="Add task" value={this.state.activeItem.title}></input>
                  </div>
                  <div style={{flex: 1}}>
                    <input id="submit" class="btn" type="submit" ></input>
                  </div>
                </div>
            </form>
          </div>

          <div id="list-wrapper">
            {tasks.map((task, index) => {
              return (
                <div key={index} className="task-wrapper flex-wrapper" >
                  <div style={{flex:6}} className="trike-part" onClick={()=> self.strikeUnstrike(task)}>
                    {task.completed == false?(
                      <span>{task.title}</span>
                    ):(
                      <strike>{task.title}</strike>
                    )}
                  </div>
                  <div style={{flex:1}}>
                    <button className="btn btn-sm btn-outline-info" onClick={()=>self.startEdit(task)}>Edit</button>
                  </div>
                  <div style={{flex:1}}>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=> self.deleteItem(task)}>-</button>
                  </div>
                </div>
              )
            })}
          </div>	
        </div>

    </div>
    )
  }
}

export default App;
